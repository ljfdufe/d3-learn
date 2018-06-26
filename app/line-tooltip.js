var d3 = require("d3");
import "./line-tooltip.css"

var dataset = {
    country: "china",
    gdp: [
        [2000, 11920],
        [2001, 13171],
        [2002, 14550],
        [2003, 16500],
        [2004, 19440],
        [2005, 22870],
        [2006, 27930],
        [2007, 35040],
        [2008, 45470],
        [2009, 51050],
        [2010, 59490],
        [2011, 73140],
        [2012, 83860],
        [2013, 103550]
    ]
};

var width = 800,
    height = 600;
var padding = {
    top: 30,
    bottom: 30,
    right: 30,
    left: 50
};
var gdpmax = d3.max(dataset.gdp, function (d) {
    return d[1];
});

var svg = d3.select("div")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var xScale = d3.scaleLinear()
    .domain([2000, 2013])
    .range([10, width - padding.left - padding.right]);

var yScale = d3.scaleLinear()
    .domain([0, gdpmax * 1.1])
    .range([height - padding.top - padding.bottom, 0]);

var linePath = d3.line()
    .x(function (d) {
        return xScale(d[0])
    })
    .y(function (d) {
        return yScale(d[1])
    });

// svg.selectAll("path")
//     .datum(dataset)
// .enter()
svg.append("path")
    .datum(dataset)
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
    .attr("d", function (d) {
        return linePath(d.gdp);
    })
    .attr("fill", "none")
    .attr("stroke-width", 3)
    .attr("stroke", d3.rgb(10, 125, 30))


var xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(5)
    .tickFormat(d3.format("d"));
var yAxis = d3.axisLeft()
    .scale(yScale);

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
    .call(xAxis)

svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
    .call(yAxis)

// 焦点元素
// display none 初始不显示，只添加元素，需要的时候，
// 将display 设置为null， 显示出来
var focusCircle = svg.append("g")
    .attr("class", "forcusCircle")
    .style("display", "none");
focusCircle.append("circle")
    .attr("r", 10);
focusCircle.append("text")
    .attr("dx", 10)
    .attr("dy", "1em");

// 对齐线元素
var focusLine = svg.append("g")
    .attr("class", "focusLine")
    .style("display", "none");
var vLine = focusLine.append("line").attr("stroke", "blue");
var hLine = focusLine.append("line").attr("stroke", "blue");

svg.append("rect")
    .attr("class", "overlay")
    .attr("x", padding.left)
    .attr("y", padding.top)
    .attr("width", width - padding.left - padding.right)
    .attr("height", height - padding.top - padding.bottom)
    .on("mouseover", function () {
        focusCircle.style("display", null).style("fill", d3.rgb(20, 100, 40));
        focusLine.style("display", null);
    })
    .on("mouseout", function () {
        focusCircle.style("display", "none");
        focusLine.style("display", "none");
    })
    // 主要的显示逻辑 在mousemove时体现
    .on("mousemove", mousemove);

function mousemove() {
    // 折线的原数组
    var data = dataset.gdp;

    // 获取鼠标相对于透明矩形框左上角的坐标，左上角坐标系为(0,0)
    // 然而好像并不是 ……， 还需要减去top，left
    var mouseX = d3.mouse(this)[0] - padding.left;
    var mouseY = d3.mouse(this)[1] - padding.top;
    // console.log(mouseX,mouseY)

    // 通过反比例尺计算远数据中的值
    var x0 = xScale.invert(mouseX);
    var y0 = yScale.invert(mouseY);
    // 通过四舍五入获取年份
    x0 = Math.round(x0);

    // 获取年份x0在原数据中的索引
    var bisect = d3.bisector(function (d) {
        return d[0];
    }).left;
    var index = bisect(data, x0);

    // 根据索引取出年份和GDP的值
    var x1 = data[index][0];
    var y1 = data[index][1];

    //再计算出焦点的位置
    var focusX = xScale(x1) + padding.left;
    var focusY = yScale(y1) + padding.top;

    //焦点平移到指定位置
    focusCircle.attr("transform",
        "translate(" + focusX + "," + focusY + ")");
    focusCircle.select("text").text(
        x1 + "年的GDP：" + y1 + "亿美元"
    );

    vLine.attr("x1", focusX)
        .attr("y1", focusY)
        .attr("x2", focusX)
        .attr("y2", height - padding.bottom);

    hLine.attr("x1", focusX)
        .attr("y1", focusY)
        .attr("x2", padding.left)
        .attr("y2", focusY);

}