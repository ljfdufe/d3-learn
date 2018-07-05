var d3 = require("d3");
var d3_hexbin = require("d3-hexbin");

var width = 960,
    height = 500,
    margin = {
        top: 40,
        right: 20,
        bottom: 20,
        left: 40
    };

var svg = d3.select("div")
    .append("svg")
    .attr("width", width)
    .attr("height", height),
    g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var randomX = d3.randomNormal(width / 2, 80),
    randomY = d3.randomNormal(height / 2, 80),
    points = d3.range(10000).map(function (d) {
        return [randomX(), randomY()];
    });

var myHexbin = d3_hexbin.hexbin()
    //这里的x0 y0 x1 y1是针对于他所在的父节点所的，
    //所以针对在svg中，就是负的
    .extent([
        // [-margin.left, -margin.top],
        [0,0],
        [width + margin.right, height + margin.bottom]
    ])
    .radius(10);

var bins = myHexbin(points);
//bins=[[length, x, y],[]....], 其中的length 加和为10000
// var s = d3.sum(bins, function(d){return d.length});

var color = d3.scaleSequential()
    .domain([d3.max(bins, function (d) {
        return d.length;
    }), 0]).interpolator(d3.interpolateMagma);

g.append("g")
    // .attr("fill", "none")
    .attr("stroke", "#fff")
    .attr("stroke-opacity", 0.5)
    .selectAll("path")
    .data(bins)
    .enter().append("path")
    .attr("transform", function (d) {
        return "translate(" + d.x + "," + d.y + ")";
    })
    .attr("fill", function (d) {
        return color(d.length);
    })
    .attr("d", myHexbin.hexagon());

g.append("g")
    .call(d3.axisTop(d3.scaleIdentity().domain([0, width])));

g.append("g")
    .call(d3.axisLeft(d3.scaleIdentity().domain([0, height])));

