//displaying chart of aAVG



function renderAvg(maData, isDarkMode) {
    if (avg) {
        avg.destroy().then(() => {
            // Clear the chart container
            document.querySelector("#avg").innerHTML = "";
        });
    }


    // Clear the chart container
    document.querySelector("#avg").innerHTML = "";

    // Define color schemes for light and dark modes
    const lightColors = ['#cb0c9f', 'rgb(242, 186, 90)', '#20c997'];
    const darkColors = ['#ff1493', 'rgb(242, 186, 90)', '#00ff7f'];
    const lastElementOfMa200 = maData.ma_200[maData.ma_200.length - 1];
    const lastElementOfMa50 = maData.ma_50[maData.ma_50.length-1] ;
    const lastElementOfMa15 = maData.ma_15[maData.ma_15.length-1] ;
    // Use the appropriate colors based on the mode
    const colors = isDarkMode ? darkColors : lightColors;

    var options = {
    series: [
        {
            name: '200-Day Moving Average',
            data: maData.ma_200,
            type: 'area', // Specify the type as 'area' for this series
            area: {
                fillTo: 'none', // Set the fill property to 'none'
            },
        },
        {
            name: '50-Day Moving Average',
            data: maData.ma_50,
            type: 'area',
            area: {
                fillTo: 'none',
            },
        },
        {
            name: '15-Day Moving Average',
            data: maData.ma_15,
            type: 'area',
            area: {
                fillTo: 'none',
            },
        },
    ],
    chart: {
        height: 350,
        type: 'area', // Set the default chart type to 'area'
        theme: isDarkMode ? 'dark' : 'light',
        zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true
          },

    },
        markers: {
          size: 0,
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            inverseColors: false,
            opacityFrom: 0.1,
            opacityTo: 0,
            stops: [0, 90, 100]
          },
        },
    xaxis: {
        type: 'datetime',
        categories: maData.dates,
        labels: {
            style: {
                colors: '#b4b4b4'
            },
        },
    },
    colors: colors,
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: 1.5,
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        },
    },
    title: {
        align: 'center',
        margin: 10,
        style: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: isDarkMode ? '#fff' : '#333',
        },
    },
    yaxis: {
        decimalsInFloat: 3,
        labels: {
            formatter: function (val) {
              return (val).toFixed(3);
            },
            style:{
                colors : '#b0b0b0' ,
            },
          },

    },
    legend: {
        labels: {
            colors: '#f1efef'
        },
    },
        grid: {
    show: true,
    borderColor: '#ababab', // Change this color to your desired color for the grid lines
    row: {
      colors: ['#989696'], // Change this color to your desired grid line color
      opacity: 0, // Adjust the opacity
      width: 0.1, // Adjust the width of the row grid lines
    },

  }
};

    var avg = new ApexCharts(document.querySelector("#avg"), options);
    avg.render();
    renderAvgBar(lastElementOfMa200 , lastElementOfMa50 , lastElementOfMa15) ;



    var resetCssClasses = function (activeEl) {
        var els = document.querySelectorAll('button')
        Array.prototype.forEach.call(els, function (el) {
            el.classList.remove('active')
        })
        activeEl.target.classList.add('active')
    }

    document.querySelector('#one_month').addEventListener('click', function (e) {
        resetCssClasses(e);

        // Calculate the date for one month ago
        const currentDate = new Date();
        const oneMonthAgo = new Date(currentDate);
        oneMonthAgo.setMonth(currentDate.getMonth() - 1);

        // Use the calculated dates for zooming
        avg.zoomX(oneMonthAgo.getTime(), currentDate.getTime());
    });

    document.querySelector('#six_months').addEventListener('click', function (e) {
        resetCssClasses(e);

        // Get the current date
        const currentDate = new Date();

        // Calculate the date six months ago
        const sixMonthsAgo = new Date(currentDate);
        sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

        // Use these dates for your avg.zoomX() function
        avg.zoomX(sixMonthsAgo.getTime(), currentDate.getTime());
    });

    document.querySelector('#one_year').addEventListener('click', function (e) {
        resetCssClasses(e);
        var currentDate = new Date(); // Get the current date
        var oneYearAgo = new Date(currentDate);
        oneYearAgo.setFullYear(currentDate.getFullYear() - 1);
        avg.zoomX(oneYearAgo.getTime(), currentDate.getTime());
    });

    document.querySelector('#ytd').addEventListener('click', function (e) {
        resetCssClasses(e);

        // Set the date range to "Year to Date" (January 1 of the current year to the current date)
        const currentDate = new Date();
        const yearStartDate = new Date(currentDate.getFullYear(), 0, 1); // January is 0
        avg.zoomX(yearStartDate.getTime(), currentDate.getTime());
    });

    document.querySelector('#all').addEventListener('click', function (e) {
        resetCssClasses(e);
        // Show all data
        avg.zoomX(maData.dates[0], maData.dates[maData.dates.length - 1]);
    });
    document.querySelector('#one_year').click();

}


function renderAvgBar(ma_200 , ma_50 , ma_15){
    const colors = ['#e5d635' , "#ea75ea" , "#fff"] ;
    var options = {
          series: [{
          name: 'Index',
          data: [ma_200]
        },{
          name: 'Index',
          data: [ma_50]
        },{
          name: 'Index',
          data: [ma_15]
        },],
          chart: {
          height: 200,
          type: 'bar',
        },
        colors: colors,
        plotOptions: {
          bar: {
              columnWidth: '45%',
              borderTopLeftRadius:10 ,
              borderTopRightRadius:10 ,
            dataLabels: {
              position: 'top', // top, center, bottom
            },
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return (val).toFixed(3);
          },
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ["#cdf3f8"]
          }
        },

        xaxis: {
          categories: ["Ma_200" ,"Ma_50" , "Ma_15"],
          position: 'top',
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false
          },
          crosshairs: {
            fill: {
              type: 'gradient',
              gradient: {
                  borderColor: '#e18a8a' ,
                colorFrom: '#D8E3F0',
                colorTo: '#BED1E6',
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.2,
              }
            }
          },
          tooltip: {
            enabled: true,
          },
            labels: {
            style: {
                colors: '#b4b4b4'
            },
        },
        },
        yaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            formatter: function (val) {
              return (val).toFixed(3);
            },
              style:{
                colors: '#b4b4b4'
              }
          }

        },
        title: {
          text: 'Monthly Inflation in Argentina, 2002',
          floating: true,
          offsetY: 330,
          align: 'center',
          style: {
            color: '#444'
          }
        }
        };

        var chart = new ApexCharts(document.querySelector("#myAvgBar"), options);
        chart.render();
}
