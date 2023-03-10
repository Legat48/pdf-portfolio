//staticfiles
const green = '#36C733';
const blue = '#383E9B';
const light_blue = '#0C8DEA';
const greyTransparent = "#CFD9E67D";
const text_primary = '#080C42';

function draw_doughnut(chart_id, valueArr, colorArr) {
    const elem = document.getElementById(chart_id);
    if (!elem) {
        console.error('Graphs with id: ' + chart_id + ' not found!')
        return;
    }

    return new Chart(document.getElementById(chart_id), {
        type: 'doughnut',
        data: {
            datasets: [{
                backgroundColor: colorArr,
                data: valueArr
            }]
        },
        options: {
            // cutout: '83%',
            borderWidth: 0,
            responsive: true,
            maintainAspectRatio: false,
            rotation: 7
        }
    });
}