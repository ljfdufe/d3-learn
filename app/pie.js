var d3 = require("d3")

var dataset = [30, 10, 43, 55, 13];
var width = 400;
var height = 400;

var piedata = d3.pie()(dataset);

var outerRadius = 150;
var innerRadius = 0;

var colors = d3.scaleOrdinal()
    .domain(dataset)
    .range(d3.schemeCategory10)
var arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

var arcs = svg.selectAll("g")
    .data(piedata)
    .enter()
    .append("g")
    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")

arcs.append("path")
    .attr("fill", function (d, i) {
        return colors(d.value);
    })
    .attr("d", function (d) {
        return arc(d);
    })