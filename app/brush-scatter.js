var d3 = require("d3");

var padding = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50
};
var width = 700,
    height = 700;

var svg = d3.select("div")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + padding.left + "," + padding.top + ")");

var xScale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, width - padding.left - padding.right]);

var yScale = d3.scaleLinear()
    .domain([0, 10])
    .range([height - padding.top - padding.bottom, 0]);

var xAxis = d3.axisBottom()
    .scale(xScale);
var yAxis = d3.axisLeft()
    .scale(yScale);

var dataset = [];

for (var i = 0; i < 150; i++) {
    dataset.push([Math.random() * 10, Math.random() * 10])
}

var circles = svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function (d, i) {
        return xScale(d[0]);
    })
    .attr("cy", function (d, i) {
        return yScale(d[1])
    })
    .attr("r", 5)
    .attr("transform", "translate(" + padding.left + "," +
        padding.top + ")")
    .style("fill", "black");

var brush = d3.brush()
    // .extent([padding.left, padding.top], [width - padding.left, height - padding.bottom])
    .on("end", brushed);

svg.append("g")
    .call(xAxis)
    .attr("transform", "translate(" + padding.left + "," +
        (height - padding.bottom) + ")")

svg.append("g")
    .call(yAxis)
    .attr("transform", "translate(" + padding.left + "," +
        padding.top + ")")

svg.append("g")
    .call(brush)
    .call(brush.move, [
        [0, 400],
        [0, 400]
    ])
    .selectAll("rect")
    .style("fill-opacity", 0.2);

function brushed() {
    var s = d3.event.selection || [
        [0, 0],
        [0, 0]
    ];
    console.log(s);
    var xmin = s[0][0] - padding.left,
        xmax = s[1][0] - padding.left,
        ymin = s[0][1] - padding.top,
        ymax = s[1][1] - padding.top;

    circles.style("fill", function (d, i) {

        // xScale(d[0]) >= xmin && xScale(d[0]) <= xmax &&
        // yScale(d[1]) <= ymin && yScale(d[1]) <= ymax

        if (xScale(d[0]) >= xmin && xScale(d[0]) <= xmax &&
            yScale(d[1]) >= ymin && yScale(d[1]) <= ymax) {
            console.log(xScale(d[0]), yScale(d[1]));
            return "red";
        } else {
            return "black";
        }
    })
}