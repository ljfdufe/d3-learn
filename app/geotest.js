var d3 = require("d3");
var topojson = require("topojson")

var width = 800,
    height = 800;
var svg = d3.select("div")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var projection = d3.geoMercator()
    .center([107, 31])
    .scale(600)
    .translate([width / 2, height / 2]);

var path = d3.geoPath()
    .projection(projection);

// var geojson="https://raw.githubusercontent.com/waylau/svg-china-map/master/china-map/china.geo.json"

d3.json("data/china.geo.json").then( function (toporoot) {
    // if (e)
    //     return console.error(e);
    // console.error(toporoot);

    // var georoot = topojson.feature(toporoot, toporoot.objects.china);

    console.log("georoot");

    var colors = d3.scaleOrdinal(d3.schemeCategory10);

    // var groups = svg.append("g");
    svg.selectAll("path")
        .data(toporoot.features)
        .enter()
        .append("path")
        .attr("class", "province")
        .style("fill", function (d, i) {
            return colors(i);
        })
        .attr("d", path)
        .attr("stroke","rgba(255,255,255,1)")
        .attr("stroke-width", 1);

})