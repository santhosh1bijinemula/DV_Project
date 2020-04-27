//var myChart;

function radar_function(radardata,d)
{
    var len = radardata[d.name].length;
    var avg_rat=0, avg_eff=0, avg_sideeffects=0;
    for(var i = 0; i<len; i++)
    {
        avg_rat += radardata[d.name][i]["rating"];
        avg_eff += radardata[d.name][i]["effectiveness"];
        avg_sideeffects += radardata[d.name][i]["sideEffects"];
    }
    avg_rat = (avg_rat / len).toFixed(2);
    avg_eff = (avg_eff /len).toFixed(2);
    avg_sideeffects = (avg_sideeffects/len).toFixed(2);
    var ctx = document.getElementById('radchart').getContext('2d');
    ctx.canvas.width = 300;
    ctx.canvas.height = 150;

    if(myChart)
        myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Rating', 'Effectiveness', 'SideEffects'],
            datasets: [{
                label: 'Reviews for ' + d.name,
                data: [avg_rat, avg_eff, avg_sideeffects],
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }],
        },
        options: {
            responsive: false
        }

    });

}