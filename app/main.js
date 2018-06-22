var d3 = require("d3")

// var d3 = Object.assign({}, require("d3-scale"), require("d3-axis") ,require("d3-selection"))

var width = 400;
var height = 400;

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

var padding = { left: 30, right: 30, top: 20, bottom: 20 }

var dataset = [10, 20, 30, 40, 33, 24, 12, 5];
var xScale = d3.scaleBand()
    .domain(dataset)
    .range([0, width - padding.left - padding.right]);
var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([height - padding.top - padding.bottom, 0])

var xAxis = d3.axisBottom().scale(xScale)
var yAxis = d3.axisLeft().scale(yScale)

var rectPadding = 4;

var rects = svg.selectAll(".MyRect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "MyRect")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
    .attr("x", function (d, i) {
        return xScale(d) + rectPadding / 2
    })
    .attr("y", function (d) {
        return yScale(d)
    })
    .attr("width", xScale.bandwidth() - rectPadding)
    .attr("height", function (d) {
        return height - padding.top - padding.bottom - yScale(d)
    })
    .attr("fill", "steelblue")
    .on("mouseover", function (d, i) {
        d3.select(this)
            .attr("fill", "yellow")
    })
    .on("mouseout", function (d, i) {
        d3.select(this)
            .transition()
            .duration(500)
            .attr("fill", "steelblue")
    })

svg.append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(" + padding.left + "," + (height - padding.bottom) + ")")
    .call(xAxis)

svg.append("g")
    .attr("class", "yaxis")
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
    .call(yAxis)
