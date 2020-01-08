var cpu = [];
var options2 = {
    chart: {type: 'bar', height: '235px', toolbar: {show: false}},
    colors: ['#78BAEE', '#0380E1', '#2B485F'],
    plotOptions: {
        bar: {columnWidth: '45%', distributed: true}
    },
    dataLabels: {enabled: false},
    series: [{
        data: cpu
    }],
    xaxis: {
        categories: ['5mins', '10mins', '15mins'],
        labels: {
            show: false,
            style: {colors: ['#78BAEE', '#0380E1', '#2B485F'], fontSize: '14px'}
        }
    }
}
var chart_cpu = new ApexCharts(document.querySelector('#cpu-usage'), options2);
chart_cpu.render();

var ram = 0;
var options1 = {
    chart: {type: 'donut', height: '250px'},
    series: [ram, 100 - ram],
    labels: ['Ram in use', 'Ram free'],
    fill: {colors: ['#ff0054', '#009764']},
    colors: ['#ff0054', '#009764'],
    legend: {show: false},
}
var chart_ram = new ApexCharts(document.querySelector('#ram-usage'), options1);
chart_ram.render();

var dataArray = [];
var dataLabel = [];
var options3 = {
    chart: {type: 'bar', height: '235px', toolbar: {show: false}},
    plotOptions: {
        bar: {columnWidth: '45%', distributed: true}
    },
    dataLabels: {enabled: false},
    series: [{
        data: dataArray
    }],
    xaxis: {
        categories: dataLabel,
        labels: {
            show: false,
            style: {
                fontSize: '14px'
            }
        }
    }
}
var chart_fileSystem = new ApexCharts(document.querySelector('#file-system'), options3);
chart_fileSystem.render();

const ws = new WebSocket("wss://voip.buludtech.com/ws");

ws.onopen = function() {
    ws.send('{"command":"AdminPage","token":"sdsdsds"}');
};

ws.onclose = function() {console.log("Socket connection has been lost")};

ws.onmessage = function (event) {
    var jsonString = JSON.parse(event.data);
    if(jsonString.status == "ok") {
        console.log(event);

        document.getElementById("total-groups").innerHTML = '<h3>' + jsonString.data.TOTAL_GROUPS + '</h3>';
        document.getElementById("busy-agents").innerHTML = '<h3>' + jsonString.data.BUSY_AGENTS + '</h3>';
        document.getElementById("free-agents").innerHTML = '<h3>' + jsonString.data.FREE_AGENTS + '</h3>';
        document.getElementById("total-agents").innerHTML = '<h3>' + jsonString.data.TOTAL_AGENTS + '</h3>';
        document.getElementById("online-agents").innerHTML = '<h3>' + jsonString.data.ONLINE_AGENTS + '</h3>';
        document.getElementById("in-call-agents").innerHTML = '<h3>' + jsonString.data.IN_CALL_AGENTS + '</h3>';
        document.getElementById("acalls").innerHTML = '<h3>' + jsonString.data.answCall + '</h3>';
        document.getElementById("rcalls").innerHTML = '<h3>' + jsonString.data.rjctCall + '</h3>';

        ram = Math.round(jsonString.data.RAM[0]);
        chart_ram.updateSeries([ram, 100 - ram]);

        cpu = jsonString.data.CPU;
        chart_cpu.updateSeries([{data: cpu}]);

        dataArray = jsonString.data.FILESYSTEMVALUE;
        dataLabel = jsonString.data.FILESYSTEMNAME;
        chart_fileSystem.updateSeries([{data: dataArray}]);
        chart_fileSystem.updateOptions({xaxis: {categories: dataLabel}});
    }
};
