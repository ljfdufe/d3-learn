var d3 = require("d3");
import "./Sortable Bar Chart.css"


var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
var formatPercent = d3.format(".0%");
var x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.05);

var y = d3.scaleLinear()
    .range([height, 0]);
var xAxis = d3.axisBottom()
    .scale(x);
var yAxis = d3.axisLeft()
    .scale(y)
    .tickFormat(formatPercent);

var svg = d3.select("#root")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("./data/Sortable Bar Chart.csv", type).then(function (data) {
    x.domain(data.map(function (d) {
        return d.letter;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.frequency;
    })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .text("Frequency");

    svg.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.letter);
        })
        .attr("y", function (d) {
            return y(d.frequency);
        })
        .attr("width", x.bandwidth)
        .attr("height", function (d) {
            return height - y(d.frequency);
        })
        .style("fill", "steelblue");

    d3.select("#root").select("input").on("change", change);

    var sortTimeout = setTimeout(function () {
        d3.select("#root").select("input")
            .property("checked", true).each(change);
    }, 2000);

    function change() {
        clearTimeout(sortTimeout);

        var x0 = x.domain(data.sort(this.checked ?
                    function (a, b) {
                        return b.frequency - a.frequency;
                    } :
                    function (a, b) {
                        return d3.ascending(a.letter, b.letter);
                    })
                .map(function (d) {
                    return d.letter;
                }))
            .copy();

        // 仅仅是对选择集里的节点进行排序，并未渲染到图上
        svg.selectAll(".bar")
            .sort(function (a, b) {
                return x0(a.letter) - x0(b.letter);
            });

        // 对svg创建动画，但对那部分定义什么动画，还没定，
        // 之后就可以通过transition选择到相关元素，并对其
        // 设定动画。
        var transition = svg.transition().duration(1000),
            delay = function (d, i) {
                return i * 50
            };

        transition.selectAll(".bar") // 表示对.bar进行如下动画
            .delay(delay)
            .attr("x", function (d) {
                return x0(d.letter);
            });

        transition.select(".x.axis")
            .call(xAxis)
            // 如果不selectAll g, 则会产生坐标轴与bar动画不同步
            // .selectAll("g")
            .delay(delay);

    }
});

function type(d) {
    d.frequency = +d.frequency;
    return d;
}