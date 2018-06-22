var d3 = require("d3");
import {
    downloadable
} from "d3-downloadable"
import './pie-tooltip.css'

var data = [
    ["小米", 60.8],
    ["三星", 58.4],
    ["联想", 47.3],
    ["苹果", 46.6],
    ["华为", 41.3],
    ["酷派", 40.1],
    ["其他", 111.5]
];

var width = 500,
    height = 500;

var svg = d3.select("div")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var pie = d3.pie().value(function (d) {
    return d[1];
}) //value 为值访问器, 将每个[]放入到 piedata 的data 属性中
// .startAngle(Math.PI * -0.5)
// .endAngle(Math.PI * 0.5);
var piedata = pie(data);

var outerRadius = width / 3,
    innerRadius = 0;

var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

var colors = d3.scaleOrdinal()
    .range(d3.schemeCategory10)
    .domain([0, piedata.length]);

var arcs = svg.selectAll("g")
    .data(piedata)
    .enter()
    .append("g")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")

arcs.append("path")
    .attr("d", function (d, i) {
        return arc(d);
    })
    .attr("fill", function (d, i) {
        return colors(i);
    })

arcs.append("text")
    .attr("transform", function (d, i) {
        var x = arc.centroid(d)[0] * 1.4; // 注意取得的坐标不是相对已svg的，而是pie的中心
        var y = arc.centroid(d)[1] * 1.4;
        return "translate(" + x + "," + y + ")";
    })
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .text(function (d) {
        var percent = Number(d.value) /
            d3.sum(data, function (d) {
                return d[1]
            }) * 100;
        return percent.toFixed(1) + "%";
    })

arcs.append("line")
    .attr("stroke", "black")
    .attr("x1", function (d) {
        return arc.centroid(d)[0] * 2;
    })
    .attr("y1", function (d) {
        return arc.centroid(d)[1] * 2;
    })
    .attr("x2", function (d) {
        return arc.centroid(d)[0] * 2.2;
    })
    .attr("y2", function (d) {
        return arc.centroid(d)[1] * 2.2;
    })

arcs.append("text")
    .attr("transform", function (d, i) {
        var x = arc.centroid(d)[0] * 2.4;
        var y = arc.centroid(d)[1] * 2.4;
        return "translate(" + x + "," + y + ")";
    })
    .attr("text-anchor", "middle")
    .text(function (d) {
        return d.data[0];
    })

var tooltip = d3.select("div")
    .append("div")
    .attr("class", "tooltip")
    .attr("opacity", 0.0)

arcs.on("mouseover", function (d) {
        tooltip.html(d.data[0] + "的出货量为" +
                d.data[1] + "百万台")
            .style("left", d3.event.pageX + "px")
            .style("top", (d3.event.pageY + 20) + "px")
            .style("opacity", 1.0);
    })
    .on("mousemove", function (d) {
        tooltip.style("left", d3.event.pageX + "px")
            .style("top", (d3.event.pageY + 20) + "px");
    })
    .on("mouseout", function (d) {
        tooltip.style("opacity", 0.0);
    })

svg.call(downloadable());