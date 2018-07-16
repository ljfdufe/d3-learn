var d3 = require("d3");
import "./Stacked Bar Chart.css"

var widthSvg = 960,
    heightSvg = 500;

var svg = d3.select("div").append("svg")
    .attr("width", widthSvg)
    .attr("height", heightSvg),
    margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 40
    },
    width = widthSvg - margin.left - margin.right,
    height = heightSvg - margin.top - margin.bottom,
    g = svg.append("g").attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1);

var yScale = d3.scaleLinear()
    .rangeRound([height, 0]);

var color = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

d3.csv("./data/Stacked Bar Chart.csv", type).then(function (data) {
    console.log(data)
    var keys = data.columns.slice(1);
    console.log(keys)
    data.sort(function (a, b) {
        return b.total - a.total;
    });
    xScale.domain(data.map(function (d) {
        return d.State;
    }));
    yScale.domain([0, d3.max(data, function (d) {
        return d.total
    })]).nice();
    color.domain(keys);
    console.log(d3.stack().keys(keys)(data))
    g.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(data))
        .enter()
        .append("g")
        .attr("fill", function (d) {
            return color(d.key);
        })
        .selectAll("rect")
        .data(function (d) {
            return d;
        })
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return xScale(d.data.State);
        })
        .attr("y", function (d) {
            return yScale(d[1]);
        })
        .attr("height", function (d) {
            return yScale(d[0]) - yScale(d[1]);
        })
        .attr("width", xScale.bandwidth());

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale).ticks(null, "s"))
        .append("text")
        .attr("x", 2)
        .attr("y", yScale(yScale.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Population");
    // console.log(yScale.ticks().pop())

    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function (d) {
            return d;
        });
})

// d每行数据，i每行索引，columns字段名称
function type(d, i, columns) {
    // console.log(d)
    // console.log(i)
    // console.log(columns)
    // 计算没一行的和
    for (var i = 1, t = 0; i < columns.length; ++i)
        t += d[columns[i]] = +d[columns[i]];
    d.total = t;
    return d;
}