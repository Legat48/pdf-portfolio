//staticfiles
const green = '#36C733';
const blue = '#383E9B';
const light_blue = '#0C8DEA';
const greyTransparent = "#CFD9E67D";
const text_primary = '#080C42';

async function getArhive() {
    const head = {
        method: "get",
    };
    return fetch('archive/', head);
}

//для добавления отступов левее и правее графиков
function prettyArrays(array) {
    return rounding([null, ...array, null])
}
// объект максимальных и минимальных значений
function minAndMaxValue(arrArr) {// передать нужно [[]] массив с массивами
    //выставление в ручную максимального значения графика
    function maxValue(array, array1) {
        if (array1) {array.push(...array1)}
        const max = Math.max.apply(null, array)
        let value = (Math.round(Math.round((max * 1.1) * 100)) * 100) / 10000
        if (value < 0.5 && value > 0.1) {
            value = 1
        } else if (value < 0.1 && value > -1) {
            value = 0.4
        } else if (value > 0.5 && value < 1.2) {
            value = 1.5
        } else if (value > 1.2 && value < 2) {
            value = 3
        } else if (value > 2 && value < 5) {
            value = 6
        } else if (value > 5 && value < 7) {
            value = 9
        } else if (value > 5 && value < 10) {
            value = 10.5
        } else if (value > 10 || value < -10) {
            value = Math.ceil(value / 10) * 10
        }
        else if (value > 10 || value < -10) {
            value = Math.ceil(value / 10) * 10
        }
        return value
    }
    //выставление в ручную минимального значения графика
    function minValue(array, array1) {
        if (array1) {
            array.push(...array1)
        }
        const min = Math.min.apply(null, array)
        let value = (Math.round(Math.round((min * 0.92) * 100)) * 100) / 10000
        if (value < 19 && value > 0.5) {
            value = value / 1.4
        } else if (value < 0.5 && value > 0) {
            value = 0
        } else if (value > -0.5 && value < 0) {
            value = -1
        } else if (value < -0.5 && value > -20) {
            value = value * 1.7
        } else if (value < -19) {
            value = value * 1.2
        }
        if (value > 10 || value < -10) {
            value = Math.floor(value / 10) * 10
        }
        return value
    }
    const valueObg = {
        max: 1,
        min: 0
    }
    let newArr = []
    for (const arr of arrArr) {
        if (Array.isArray(arr)) {
            newArr = newArr.concat(arr)
        }
    }
    valueObg.max = maxValue(newArr)
    valueObg.min = minValue(newArr)
    if (valueObg.min < -10 && valueObg.min > -100 && valueObg.max > -10 && valueObg.max < 13) {
        valueObg.max = 15
    } else if (valueObg.min < -100 && valueObg.min > -1000 && valueObg.max > -20 && valueObg.max < 13) {
        valueObg.max = 50
    } else if (valueObg.min < -1000 && valueObg.max < 150) {
        valueObg.max = 160
    }

    return valueObg
}
// функция для округления значений
function rounding(arr) {
    if (Array.isArray(arr)) {
        return arr.map((e) => {
            let value = e
            if (Number(value) > 99 || Number(value) < -99) {
                value = Math.round(value)
            } else if (Number(value) > 10 || Number(value) < -10) {
                value = Math.round(value * 10) / 10
            } else if (String(value).length > 4) {
                value = Math.round(value * 1000) / 1000
            }
            return value
        })
    } else {
        return arr
    }
}
// 1 график
function draw_prices_graps(chart_id, datesArr, prices) {
    const dates = []
    datesArr.forEach((e) => {
        dates.push(new Date(e).getFullYear())
    })
    const elem = document.getElementById(chart_id);
    if (!elem) {
        console.error('Graphs with id: ' + chart_id + ' not found!')
        return;
    }
    // убираем некрасивые пробелы в графике
    for (let index = 0; index < prices.length; index++) {
        if (index > 0 && Number(prices[index]) === 0) {
            prices[index] = prices[index - 1]
        }
    }
    const ctx = elem.getContext("2d");
    const gradientFill = ctx.createLinearGradient(300, 0, 300, 500);
    gradientFill.addColorStop(0, "rgba(44, 58, 255, 0.9)");
    gradientFill.addColorStop(1, "rgba(2, 62, 155, 0.2)");

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            fill: true,
            labels: dates,
            datasets: [{
                label: "Price",
                borderColor: 'rgba(44, 58, 255, 0.9)',
                pointBorderColor: blue,
                pointBackgroundColor: blue,
                pointHoverBackgroundColor: blue,
                pointHoverBorderColor: blue,
                pointRadius: 0,
                fill: true,
                backgroundColor: gradientFill,
                borderWidth: 1,
                data: rounding(prices)
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
            },
            legend: {
                position: "bottom"
            },
            scales: {
                y: {
                    ticks: {
                        color: text_primary,
                        beginAtZero: true,
                    },
                    grid: {
                        display: false
                    },

                },
                x: {
                    ticks: {
                        color: text_primary,
                        beginAtZero: true,
                        maxRotation: 0,
                        maxTicksLimit: 5 //кол-во меток максимум

                    },
                    grid: {
                        display: false,
                    },
                },
            },
        },
    });
}

function draw_doughnut(chart_id, value) {
    const elem = document.getElementById(chart_id);
    if (!elem) {
        console.error('Graphs with id: ' + chart_id + ' not found!')
        return;
    }

    return new Chart(document.getElementById(chart_id), {
        type: 'doughnut',
        data: {
            datasets: [{
                backgroundColor: [green, greyTransparent],
                data: [value, 100 - value,]
            }]
        },
        options: {
            cutout: '83%',
            borderWidth: 0,
            responsive: true,
            maintainAspectRatio: false,
            rotation: 7
        }
    });
}
// 15 график
function draw_one_line_graps(chart_id, label, value) {
    const minMaxObg = minAndMaxValue([value])
    // обнуление значений минимального, если не сильно отрицительно
    if (minMaxObg.min > -1) {
        minMaxObg.min = 0
    }
    const elem = document.getElementById(chart_id);
    if (!elem) {
        console.error('Graphs with id: ' + chart_id + ' not found!')
        return;
    }
    const ctx = elem.getContext("2d");
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: prettyArrays(label),
            datasets: [{
                label: "Data",
                borderColor: blue,
                pointBorderColor: blue,
                pointBackgroundColor: blue,
                pointHoverBackgroundColor: blue,
                pointHoverBorderColor: blue,
                borderWidth: 2,
                data: prettyArrays(value),
                datalabels: {
                    borderRadius: 5,
                    backgroundColor: blue,
                    color: '#fff'
                }
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
            },

            scales: {
                y: {
                    min: minMaxObg.min,
                    max: minMaxObg.max,
                    ticks: { color: text_primary, beginAtZero: false },
                    grid: {
                        display: false
                    }
                },
                x: {
                    ticks: { color: text_primary, beginAtZero: false },
                    grid: {
                        display: false
                    }
                },

            }
        },
        plugins: [
            ChartDataLabels,
        ]
    });
    return chart
}
//3 график 4 график 7 график 8 график 9 график 11 график 14 график 18 график
function draw_two_line_graph(chart_id, label1, value1, label2, value2, labels) {
    const elem = document.getElementById(chart_id);
    const minMaxObg = minAndMaxValue([value1, value2])
    const ctx = elem.getContext("2d");
    const datasets = []
    let useLine1 = true;
    let useLine2 = true;
    if (value1.find((e) => e === 0) === 0) {
        useLine1 = false
    }
    if (value2.find((e) => e === 0) === 0) {
        useLine2 = false
    }
    if(value1 && value1.length > 0) {
        datasets.push({
            id: 'chart-one',
            type: 'line',
            label: label1,
            data: prettyArrays(value1),
            borderColor: useLine1 ? blue : 'transparent',
            datalabels: {
                borderRadius: 5,
                backgroundColor: blue,
                color: '#fff'
            }
        })
    }
    if(value2 && value2.length > 0 && (value1.find((e) => e === 0) === 0 && value1.find((e) => e !== 0) > 0)) {
        datasets.push({
            type: 'line',
            label: label2 || '',
            data: prettyArrays(value2),
            borderColor: useLine2 ? green : 'transparent',
            datalabels: {
                borderRadius: 5,
                backgroundColor: green,
                color: '#fff'
            }
        })
    }
    const chart = new Chart(ctx,{
            data: {
                datasets: datasets,
                labels: prettyArrays(labels)
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: "bottom",
                        align: "center",
                    },
                },
                legend: {
                    position: "bottom"
                },
                scales: {
                    y: {
                        min: minMaxObg.min,
                        max: minMaxObg.max,
                        ticks: {
                            color: text_primary, beginAtZero: true
                        },
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        ticks: {
                            color: text_primary, beginAtZero: true
                        },
                        grid: {
                            display: false
                        }
                    },
                }
            },
            plugins: [
                ChartDataLabels,
            ]
        })
    return chart
}
// 5 график
function draw_three_columns_in_year(chart_id, labels, label1, value1, label2, value2, label3, value3) {
    var elem = document.getElementById(chart_id);
    if (!elem) {
        console.error('Graphs with id: ' + chart_id + ' not found!')
        return;
    }
    const dataLabels = {
        align: "top", // выравнивание
        anchor: 'start', // выравнивание
        offset: 0, // смещение
        color: '#fff',
        textStrokeWidth: 2,
        textStrokeColor: 'rgba(0,0,0,0.4)'
    }
    // дата настройки собираем в зависимости от того, что пришло
    const dataSets = []
    const arrArr = []
    if (value1 && value1.length > 0) {
        dataSets.push({
            label: label1,
            backgroundColor: blue,
            data: rounding(value1),
            datalabels: dataLabels
        })
        arrArr.push(value1)
    }
    if (value2 && value2.length > 0) {
        dataSets.push({
            label: label2,
            backgroundColor: green,
            data: rounding(value2),
            datalabels: dataLabels
        })
        arrArr.push(value2)

    }
    if (value3 && value3.length > 0) {
        dataSets.push({
            label: label3,
            backgroundColor: light_blue,
            data: rounding(value3),
            datalabels: dataLabels
        })
        arrArr.push(value3)
    }
    if (dataSets.length === 0) { return }

    const minMaxObg = minAndMaxValue(arrArr)
    // обнуление значений минимального, если не сильно отрицительно
    if (minMaxObg.min > -1) {
        minMaxObg.min = 0
    }
    const ctx = elem.getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: dataSets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: "bottom",
                    align: "center",
                },
            },
            elements: {
                bar: {
                    borderWidth: 0,
                    borderRadius: 5,
                }
            },
            tooltips: {
                displayColors: true,
                callbacks: {
                    mode: 'x',
                },
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    min: minMaxObg.min,
                    max: minMaxObg.max,
                    ticks: {
                        color: text_primary, beginAtZero: true
                    },
                    grid: {
                        display: false
                    }
                },
            },
        },
        plugins: [
            ChartDataLabels, // плагин надписи на столбе
        ]
    });
    return chart
}
// 6 график
function draw_paired_horizontal_columns(chart_id, labels, label1, value1, label2, value2) {
    const elem = document.getElementById(chart_id);
    if (!elem) {
        console.error('Graphs with id: ' + chart_id + ' not found!')
        return;
    }
    const ctx = elem.getContext('2d');
    const datasets = []
    if (value1 && value1.length > 0) {
        datasets.push({
            label: label1,
            backgroundColor: blue,
            data: value1,
        })
    }
    if (value2 && value2.length > 0) {
        datasets.push({
            label: label2,
            backgroundColor: green,
            data: value2,
        })
    }
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            elements: {
                bar: {
                    borderWidth: 0,
                    borderRadius: 100,
                }
            },
            scales: {
                x: {
                    grid: {
                        drawTicks: false, // выступающие за ось отростки
                    }
                },
                y: {
                    grid: {
                        // drawOnChartArea: true, // скрыть непосредственно на графике
                        drawTicks: false, // выступающие за ось отростки
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                },
            }
        },
    });
    return chart
}
// 10 график 16 график
function draw_columns_and_one_lines(chart_id, labels, labelLine, valueLine, labelColumns, valueColumns) {
    var ctx = document.getElementById(chart_id);
    if (!ctx) {
        console.error('Graphs with id: ' + chart_id + ' not found!')
        return;
    }

    const dataLabels = {
        color: '#FFFFFF',
        align: "top", // выравнивание
        anchor: 'start', // выравнивание
        offset: 5, // смещение
        textStrokeWidth: 2,
        textStrokeColor: 'rgba(0,0,0,0.4)'
    }

    const minMaxObg = minAndMaxValue([valueLine, valueColumns])
    // обнуление значений минимального, если не сильно отрицительно
    if (minMaxObg.min > -1) {
        minMaxObg.min = 0
    }

    const datasets = []
    if(valueLine && valueLine.length > 0) {
        datasets.push({
            label: labelLine,
            type: "line",
            backgroundColor: green,
            borderColor: green,
            borderWidth: 3,
            fill: false,
            data: valueLine,
            datalabels: {
                borderRadius: 5,
                backgroundColor: green,
                color: '#fff'
            }
        })
    }
    if(valueColumns && valueColumns.length > 0) {
        datasets.push({
            label: labelColumns,
            type: "bar",
            backgroundColor: blue,
            borderColor: blue,
            borderWidth: 1,
            fill: true,
            data: valueColumns,
            datalabels: dataLabels
        })
    }

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: "bottom",
                    align: "center",
                },
            },
            elements: {
                bar: {
                    borderWidth: 0,
                    borderRadius: 5,
                }
            },
            scales: {
                y: {
                    min: minMaxObg.min,
                    max: minMaxObg.max,
                    ticks: {
                        color: text_primary,
                        beginAtZero: true
                    },
                    grid: {
                        display: false
                    }
                },
                x: {
                    ticks: {
                        color: text_primary,
                        beginAtZero: true
                    },
                    grid: {
                        display: false
                    }
                },
            },
        },
        plugins: [
            ChartDataLabels, // плагин надписи на столбе
        ],

    });
    return chart
}
// 12 график
function draw_two_colums_one_after_another(chart_id, labels, label1, value1, label2, value2) {
    var elem = document.getElementById(chart_id);
    if (!elem) {
        console.error('Graphs with id: ' + chart_id + ' not found!')
        return;
    }

    const dataLabels = {
        color:'#FFFFFF',
        align: "top", // выравнивание
        anchor: 'start', // выравнивание
        offset: 15, // смещение
        textStrokeWidth: 2,
        textStrokeColor: 'rgba(0,0,0,0.4)'
    }

    const sumArr = [];
    for (let index = 0; index < value1.length; index++) {
        sumArr.push(value1[index] + value2[index])
    }

    const minMaxObg = minAndMaxValue([sumArr])
    // обнуление значений минимального, если не сильно отрицительно
    if (minMaxObg.min > -1) {
        minMaxObg.min = 0
    }

    const datasets = []
    if(value1 && value1.length > 0) {
        datasets.push({
            label: label1,
            backgroundColor: blue,
            data: value1,
            datalabels: dataLabels
        })
    }
    if(value2 && value2.length > 0) {
        datasets.push({
            label: label2,
            backgroundColor: green,
            data: value2,
            datalabels: dataLabels
        })
    }
    if(datasets.length === 0) {
        return
    }
    const ctx = elem.getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets,
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: "bottom",
                    align: "center",
                },
            },
            elements: {
                bar: {
                    borderWidth: 0,
                    borderRadius: 5,
                }
            },
            tooltips: {
                displayColors: true,
                callbacks: {
                    mode: 'x',
                },
            },
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        display: false
                    }
                },
                y: {
                    min: minMaxObg.min,
                    max: minMaxObg.max,
                    stacked: true,
                    grid: {
                        display: false
                    }
                }
            },
            maintainAspectRatio: false,
        },
        plugins: [
            ChartDataLabels,
        ]
    });
    return chart
}
// 13 график
function draw_colums_line_on_different_scales(chart_id, labels, label1, value1, label2, value2) {
    const ctx = document.getElementById(chart_id);
    if (!ctx) {
        console.error('Graphs with id: ' + chart_id + ' not found!')
        return;
    }

    const dataLabels = {
        color: '#FFFFFF',
        align: "top", // выравнивание
        anchor: 'start', // выравнивание
        offset: 5, // смещение
        textStrokeWidth: 2,
        textStrokeColor: 'rgba(0,0,0,0.2)'
    }
    const dataSets = []
    if (value1 && value1.length > 0) {
        dataSets.push({
            label: label1,
            yAxisID: 'right-y-axis',
            type: "line",
            backgroundColor: green,
            borderColor: green,
            borderWidth: 3,
            fill: false,
            data: rounding(value1),
            datalabels: {
                borderRadius: 5,
                backgroundColor: green,
                color: '#fff'
            }
        })
    }
    if (value1 && value2.length > 0) {
        dataSets.push({
            label: label2,
            type: "bar",
            backgroundColor: blue,
            borderColor: blue,
            borderWidth: 1,
            fill: true,
            data: rounding(value2),
            datalabels: dataLabels
        })
    }
    if (dataSets.length === 0) { return }
    const minMaxObg2 = minAndMaxValue([value2])
    const minMaxObg1 = minAndMaxValue([value1])

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: dataSets,
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            borderRadius: 5,
            plugins: {
                legend: {
                    display: true,
                    position: "bottom",
                    align: "center",
                },
            },
            scales: {
                y: {
                    min: 0,
                    max: minMaxObg2.max,
                    ticks: {
                        color: text_primary,
                        beginAtZero: true
                    },
                    grid: {
                        display: false
                    }
                },
                'right-y-axis': {
                    type: 'linear',
                    position: 'right',
                    min: minMaxObg1.min,
                    max: minMaxObg1.max,
                    ticks: {
                        color: text_primary,
                        beginAtZero: true
                    },
                    grid: {
                        display: false
                    }
                },
                x: {
                    ticks: {
                        color: text_primary,
                        beginAtZero: true
                    },
                    grid: {
                        display: false
                    }
                },
            },
        },
        plugins: [
            ChartDataLabels, // плагин надписи на столбе
        ],

    });
    return chart
}
// 19 график
function draw_one_colum(chart_id, labels, label, value) {
    const ctx = document.getElementById(chart_id);
    if (!ctx) {
        console.error('Graphs with id: ' + chart_id + ' not found!')
        return;
    }
    const minMaxObg = minAndMaxValue([value])

    const dataLabels = {
        align: "top", // выравнивание
        anchor: 'start', // выравнивание
        offset: 10, // смещение
        color: '#fff',
        textStrokeWidth: 2,
        textStrokeColor: 'rgba(0,0,0,0.4)'
    }

    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: label,
                type: "bar",
                backgroundColor: blue,
                borderColor: blue,
                borderWidth: 1,
                fill: true,
                data: value,
                datalabels: dataLabels
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
            },
            elements: {
                bar: {
                    borderWidth: 0,
                    borderRadius: 5,
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: minMaxObg.max,
                    ticks: {
                        color: text_primary,
                        beginAtZero: true
                    },
                    grid: {
                        display: false
                    }
                },
                x: {
                    ticks: {
                        color: text_primary,
                        beginAtZero: true
                    },
                    grid: {
                        display: false
                    }
                },
            },
        },
        plugins: [
            ChartDataLabels, // плагин надписи на столбе
        ],

    });
    return chart
}

function postProcessingLinksDownload(text){
    document.querySelectorAll('.download').forEach(link => {
        link.addEventListener('click', () => {
            link.disabled = true
            let saveText = link.textContent
            link.style.opacity = 0.7
            link.style.pointerEvents = 'none'
            link.textContent = text + '...'
            setTimeout(() => {
                link.disabled = false
                link.style.opacity = 1
                link.style.pointerEvents = 'auto'
                link.textContent = saveText
            }, 15000)
        })
    })
}

// все прогресс бары на странице
function draw_all_bars(barsValues) {
    function draw_bar(progressBar) {
        if (!progressBar) {
            console.error('Progress bar not found!')
            return;
        }
        const bar = document.getElementById(progressBar.id)
        if (!bar) {
            console.error('Progress bar with id: ' + progressBar.id + ' not found!')
            return;
        }
        const progress_bar_element = bar.children[0]
        if (!progress_bar_element) {
            console.error('Error read value progress bar with id: ' + progressBar.id + '!')
            return;
        }
        const value_element = bar.children[1]
        if (!value_element) {
            console.error('Error read title progress bar with id: ' + progressBar.id + '!')
            return;
        }
        const value = progressBar.value
        if (value == 0){
            const boxBar = progress_bar_element.closest(".statistics__progress");
            if (boxBar) {
                boxBar.style.display = "none";
            }
        }
        progress_bar_element.value = value
        progress_bar_element.style.cssText = 'border-radius:5px; overflow: hidden;'
        if (value >= 50)
            progress_bar_element.classList.add("progress__progress_green")
        value_element.textContent = value + '%'
    }
    for (let i = 0; i < barsValues.length; i++) {
        draw_bar(barsValues[i])
    }
}

