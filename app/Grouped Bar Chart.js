var d3 = require("d3");
import {
    downloadable
} from "d3-downloadable";

var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
};
var svgWidth = 960,
    svgHeight = 500,
    width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom,
    svgH = d3.select("#root")
    .append("svg")

    .attr("width", svgWidth)
    .attr("height", svgHeight),
    svg = svgH
    .attr("style", "fill:white;")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1)
    .align(1);

var x1 = d3.scaleBand()
    .padding(0.05);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

d3.csv("./data/Grouped Bar Chart.csv", type).then(function (data) {
    console.log(data);
    var keys = data.columns.slice(1);

    x0.domain(data.map(function (d) {
        return d.State;
    }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    // 如何处理二维数据的最大值
    y.domain([0, d3.max(data, function (d) {
        // 这里是keys  注意用法和理解
        return d3.max(keys, function (key) {
            return d[key];
        })
    })]).nice()

    svg.append("g").selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", function (d) {
            return "translate(" + x0(d.State) + ",0)";
        })
        .selectAll("rect")
        // 把对象处理为array 以绑定数据
        .data(function (d) {
            return keys.map(function (key) {
                return {
                    key: key,
                    value: d[key]
                };
            });
        })
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return x1(d.key);
        })
        .attr("y", function (d) {
            return y(d.value);
        })
        .attr("height", function (d) {
            return height - y(d.value);
        })
        .attr("width", x1.bandwidth)
        .style("fill", function (d) {
            return z(d.key);
        });

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom().scale(x0));

    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Population");

    var legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice(1).reverse())
        .enter().append("g")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", width - 35)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("fill", "#000")
        .attr("x", width - 40)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function (d) {
            return d;
        });

});

// 这个方法需应用到 svg 元素上
svgH.call(downloadable());

// 注意type是处理每一行的数据，并不是所有数据一起传过来
// 将整行数据都处理为  数值
function type(d, i, columns) {
    for (var i = 1, n = columns.length; i < n; ++i)
        d[columns[i]] = +d[columns[i]];
    return d;
}