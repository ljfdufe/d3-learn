var d3 = require("d3");

//UI configuration
//itemSize图例方块的大小,包括间距
//用cellsize取得实际大小
var itemSize = 18,
    cellSize = itemSize - 1,
    width = 800,
    height = 800,
    margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 25
    };
//formats
var hourFormat = d3.timeFormat("%H"),
    dayFormat = d3.timeFormat("%j"),
    timeFormat2 = d3.timeFormat("%Y-%m-%dT%X"),
    monthDayFormat = d3.timeFormat("%m.%d");

//data vars for rendering
//colorCalibration定义颜色
var colorCalibration = ['#f6faaa', '#FEE08B', '#FDAE61', '#F46D43', '#D53E4F', '#9E0142'];

//axises and scales
var axisWidth = 0,
    axisHeight = itemSize * 24,
    xAxisScale = d3.scaleTime(),
    xAxis = d3.axisTop()
    //ticks及d3-time模块的用法
    .ticks(d3.timeDays, 3)
    //tickFormat配合time-format模块的使用
    .tickFormat(monthDayFormat),
    yAxisScale = d3.scaleLinear()
    .domain([0, 24])
    .range([0, axisHeight]),
    yAxis = d3.axisLeft()
    .ticks(5)
    .tickFormat(d3.format('02d'))
    .scale(yAxisScale);

initCalibration();

d3.json("./data/days-hours-heatmap.json").then(function (data) {
    data = data.data;
    data.forEach(function (valueObj) {
        // {
        //     "timestamp": "2014-09-25T01:00:00",
        //     "value": {
        //         "PM2.5": 41.61
        //     }
        valueObj["date"] = timeFormat2.parse(valueObj["timestamp"]);
        var day = valueObj["day"] = monthDayFormat(valueObj["date"]);

    })
})

//初始化图例
function initCalibration() {
    d3.select('[role="calibration"]').select("svg")
        .selectAll("rect")
        .data(colorCalibration)
        .enter()
        .append("rect")
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("x", function (d, i) {
            return i * itemSize;
        })
        .attr("fill", function (d) {
            return d;
        });

    // 绑定方法，在点击之前并未执行
    d3.selectAll('[role="calibration"] [name="displayType"]')
        .on("click", function () {
            renderColor();
        });
};

function renderColor() {

}