var d3 = require("d3");
var topojson = require("topojson");
import './clicktozoomviatransform.css';

var width = 960,
    height = 500,
    centered;

var projection = d3.geoAlbersUsa()
    .scale(1070)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select("div")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", clicked);

var g = svg.append("g");

d3.json("./data/usa.topo.json", type).then(function (us) {

    g.append("g")
        .attr("id", "states")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.states).features)
        .enter()
        .append("path")
        .attr("d", path)
        //可以用如下两行来描边界，还可用专门用于产生边界
        //的topojson.mesh，根据文档描述，应该利用topojson
        //效率更高
        // .attr("stroke","rgba(255,255,255,1)")
        // .attr("stroke-width", 1)
        .on("click", clicked);

    g.append("path")
        .datum(topojson.mesh(us, us.objects.states, function (a, b) {
            return a !== b;
        }))
        .attr("id", "state-borders")
        .attr("d", path);


})

function clicked(d) {
    //d就是每个 元素绑定的数据， 当点击background的时，没绑定数据
    // console.log(d);
    var x, y, k;

    if (d && centered !== d) {
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        k = 4;
        centered = d;
    } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
    }

    g.selectAll("path")
        .classed("active", centered && function (d) {
            return d == centered;
        })

    g.transition()
        .duration(700)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1.5 / k + "px")
}

function type(d) {
    return d;
}