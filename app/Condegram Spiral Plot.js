var d3 = require("d3");
import "./Condegram Spiral Plot.css"

var width = 500,
    height = 500,
    start = 0,
    end = 2.25,
    numSpirals = 3,
    margin = {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
    };
// 这个怎么理解
var theta = function (r) {
    return numSpirals * Math.PI * r;
}

var color = d3.scaleOrdinal(d3.schemeCategory10);
// -40是为了在margin 的基础上给柱子留出空间
var r = d3.min([width, height]) / 2 - 40;
// 根据start end生产1000个点，start end自然为最值
// 再根据最值，写生成器 映射到svg上 半径
var radius = d3.scaleLinear()
    .domain([start, end])
    .range([40, r]);
var svg = d3.select("#root")
    .append("svg")
    .attr("width", width + margin.left + margin.top)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
var points = d3.range(start, end + 0.001, (end - start) / 1000);

var spiral = d3.radialLine()
    .curve(d3.curveCardinal)
    .angle(theta) // fucthon(d){ return theta(d); }
    .radius(radius);

var path = svg.append("path")
    .datum(points)
    .attr("id", "spiral")
    .attr("d", spiral)
    .style("fill", "none")
    .style("stroke", "steelblue");

var spiralLength = path.node().getTotalLength();
// The SVGPathElement.getTotalLength() method returns the user agent's computed value for the total length of the path in user units.
// console.log(spiralLength) // 打印出来的是 <path d=…… />
var N = 365,
    barWidth = spiralLength / N - 1;

var someDate = [];
for (var i = 0; 1 < N; i++) {
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + i);
    someDate.push({
        date: currentDate,
        value: Math.random(),
        group: currentDate.getMonth()
    });
}

var timeScale = d3.scaleTime()
    .domain(d3.extent(someDate, function (d) {
        return d.date;
    }))
    .range([0, spiralLength]);

var yScale = d3.scaleLinear()
    .domain([0, d3.max(someDate, function (d) {
        return d.value;
    })])
    .range([0, (r / numSpirals) - 30]);

svg.selectAll("rect")
    .data(someDate)
    .enter()
    .append("rect")
    .attr("x", function (d, i) {
        var linePer = timeScale(d.date),
            // 根据线上的长度，获取对应的点坐标
            poOnLine = path.node().getPointAtLength(linePer),
            angleOnLine = path.node().getPointAtLength(linePer - barWidth);
        // 还可以 继续修改绑定的数据，后续继续使用
        d.linePer = linePer;
        d.x = poOnLine.x;
        d.y = poOnLine.y;
        //angle at the spiral position
        // 还需要理解
        d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90;

        return d.x;
    })
    .attr("y", function (d) {
        return d.y;
    })
    .attr("width", function (d) {
        return barWidth;
    })
    .attr("height", function (d) {
        return yScale(d.value);
    })
    .style("fill", function (d) {
        return color(d.group);
    })
    .style("stroke", "none")
    .attr("transform", function(d){
      return "rotate(" + d.a + "," + d.x  + "," + d.y + ")"; // rotate the bar
    });