"use strict";
angular.module("TwitterTrendingApp",[])
    .controller("TrendsCtrl",function($http,$scope,trendsAPI,$timeout){
        var dropdown1Value,dropdown2Value;
        $http.get('/countries/').then(function(response){
             $scope.countryList=response.data.countries;
             $timeout(function(){
                dropdown1Value=$('.dropdown1').val();
                dropdown2Value=$('.dropdown2').val();
             });                 
       });
       
        function intersect_arrays(a,b){
            var sorted_a = a.sort();
            var sorted_b = b.sort();
            var common = [];
            var a_i = 0;
            var b_i = 0;
            while (a_i < a.length && b_i < b.length)
            {
                if (sorted_a[a_i] === sorted_b[b_i]) {
                    common.push(sorted_a[a_i]);
                    a_i++;
                    b_i++;
                }
                else if(sorted_a[a_i] < sorted_b[b_i]) {
                    a_i++;
                }
                else {
                    b_i++;
                }
            }
            return common;
        }
        
      var country1Trends,country2Trends,CommonTrends;
      google.charts.load('current', { packages: ["corechart"] });  
        
      $('.dropdown1,.dropdown2').change(function(){
          if($('.dropdown1').val() != 'select_country' && $('.dropdown2').val() != 'select_country'){
          dropdown1Value=$('.dropdown1').val();
          dropdown2Value=$('.dropdown2').val();
          
          country1Trends=trendsAPI.getData(dropdown1Value);
          country2Trends=trendsAPI.getData(dropdown2Value); 
          CommonTrends=intersect_arrays(country1Trends,country2Trends);
          
          //$scope.trends=CommonTrends;-->this was not working so witched to for loop
          var ele;$('#trends').html("");      
          for(var i=0;i<CommonTrends.length;i++){
              ele=document.createElement('span');
              ele.innerHTML=CommonTrends[i];
              $('#trends').append(ele);
          }
          
          var TotalTrendsWeight=0;  
          for(var i=0;i<CommonTrends.length;i++){
              TotalTrendsWeight+=CommonTrends[i].length;
          }
          var TrendWeightContribution=[];
          for(var i=0;i<CommonTrends.length;i++){
              TrendWeightContribution[i]=(CommonTrends[i].length/TotalTrendsWeight)*100;
          }
         google.charts.setOnLoadCallback(drawChart);
         $(window).on("throttledresize", function (event) {
              drawChart();
         });
         function drawChart() {
             var data = new google.visualization.DataTable();
             data.addColumn('string', 'trends');
             data.addColumn('number', 'weight');
             for (var i = 0; i < CommonTrends.length; i++) {
               data.addRow([CommonTrends[i], TrendWeightContribution[i]]);
             }
             var options = {
               title: 'Trends Weight Contribution'
              };
             var chart = new google.visualization.PieChart(document.getElementById('piechart'));
             chart.draw(data, options);
         }
      }
      });
    
    })
    .factory('trendsAPI',function($http){
        var ergastAPI={};
        ergastAPI.getData=function(data){
            /*return $http({
                method:'GET',
                    url:'/countries/'+data+'/trends/'
            });*/
                //console.log(response);
                /*var ress_d1=response.data.trends;
                   var res=[];
                   for(var i=0;i<ress_d1.length;i++)
                       res[i]=ress_d1[i].name;
                  console.log(res);*/
            var temp;   
            $.ajax({
                async:false,
                type:'GET',
                url:'/countries/'+data+'/trends/',
                success:function(response){
                            var ress_d1=response.trends;
                            var res=[];
                            for(var i=0;i<ress_d1.length;i++)
                            res[i]=ress_d1[i].name;
                            temp=res;
                        }
                         
            });
            return temp;
        };
    return ergastAPI;
        
    });