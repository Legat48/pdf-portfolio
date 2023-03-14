
function polarArea (chartId, valueArr, labelArr, position = 'bottom') {
  const options = {
    series: valueArr,
    labels: labelArr,
    chart: {
      type: 'donut',
    },
    responsive: [
      {
        options: {
          chart: {
            // width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ]
  };
  document.getElementById(chartId)
  var chart = new ApexCharts(document.getElementById(chartId), options);
  chart.render();
}

function polarArea (chartId, valueArr, labelArr, position = 'bottom') {
  const options = {
    series: valueArr,
    labels: labelArr,
    chart: {
      type: 'donut',
    },
    dataLabels: {

      style: {
        fontSize: '20px',
        fontFamily: 'Inter, Arial, sans-serif',
        fontWeight: 500,
        colors: ['#1D1D1D'],
      },
      dropShadow: {
        enabled: false,
      }
    },

    plotOptions: {
      pie: {
        startAngle: 310,
        endAngle: 670,
        offsetY: 35,
        customScale: 0.8,
        dataLabels: {
          offset: 74,
          dropShadow: {
            enabled: false,
          }
        },
        donut: {
          size: '45%',
        },
      }
    },
    legend: {
      position: position,
      horizontalAlign: 'left',
      fontSize: '12px',
      fontFamily: 'Inter, Arial, sans-serif',
      fontWeight: 500,
    },
  }

  document.getElementById(chartId)
  var chart = new ApexCharts(document.getElementById(chartId), options);
  chart.render();
}