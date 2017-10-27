var app = angular.module('myApp', []);
 
app.service('DataService', ['$http', '$q', function($http, $q){
  this.getData = function(){
    return $http.get("https://api.coinmarketcap.com/v1/ticker/?limit=10")
  };
}]);

app.controller('myCtrl',['DataService', '$scope', '$http', '$interval', function(DataService, $scope, $http, $interval){
  $scope.refreshChart = function() {

    $scope.labelArr = [];
    $scope.valueArr = []; 
    DataService.getData().then(function(resp) {
      $scope.result = resp.data;
      $scope.lastUpdatedAt = $scope.result[0].last_updated;
      var timestamp = moment.unix($scope.lastUpdatedAt);
      var convertedStamp = timestamp.format("HH/mm/ss");
      console.log(timestamp.format("HH/mm/ss"));
      $scope.lastUpdatedAt = convertedStamp;
      console.log("Last updated at : " + $scope.lastUpdatedAt);
      angular.forEach($scope.result, function(value, key) {
        $scope.labelArr.push(value.name);
        $scope.valueArr.push(value.price_usd);
      });
    }, function(err) {
      $scope.result = "Error";
    }).finally(function() {
      var ctx = document.getElementById("dvCanvas").getContext('2d');

      var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: $scope.labelArr,
          datasets: [{
            data: $scope.valueArr,
            label: 'Value of currency',
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)'
            ],

            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)'
            ],

            borderWidth: 1
          }]

        },
        options: {
          "hover": {
            "animationDuration": 0
          },
          "animation": {
            "duration": 1,
            "onComplete": function() {
              var chartInstance = this.chart,
                ctx = chartInstance.ctx;

              ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';

              this.data.datasets.forEach(function(dataset, i) {
                var meta = chartInstance.controller.getDatasetMeta(i);
                meta.data.forEach(function(bar, index) {
                  var data = dataset.data[index];
                  ctx.fillText(data, bar._model.x, bar._model.y - 5);
                });
              });
            }
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });
    });
  };

  $scope.Repeat = function() {
    intervalPromise = $interval(function() {
      $scope.refreshChart();
    }, 300000);
  }

  $scope.refreshChart();

  $scope.Repeat();

}]);