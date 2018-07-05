var d3 = require("d3");
var hexbin = require("d3-hexbin");
// import hexbin from "d3-hexbin";
var topojson = require("topojson");
import "./Bivariate-Hexbin-Map.css"

var width = 960,
    height = 600;

var svg = d3.select("div")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var parseDate = d3.timeParse("%x");
//将time映射为颜色，注意插值的使用
var color = d3.scaleTime()
    .domain([new Date(1962, 0, 1), new Date(2006, 0, 1)])
    .range(["black", "steelbule"])
    .interpolate(d3.interpolateLab);
var myHexbin = hexbin.hexbin()
    //定义产生hexbin 的范围
    .extent([
        [0, 0],
        [width, height]
    ])
    .radius(10);

//这个定制projection好像固定是960*600，设置scale等都没效果
var projection = d3.geoAlbersUsa()
    .scale(1280)
    .translate([width / 2, height / 2])
    // .fitExtent([
    //     [0, 0],
    //     [width / 2, height / 2]
    // ]);
var path = d3.geoPath();

var geojsonPromise = d3.json("https://d3js.org/us-10m.v1.json");
var marketPromise = d3.tsv("./data/walmart.tsv", typeWalmart);

//读取多个数据源数据
//不能用var p = Promise.all

Promise.all([geojsonPromise, marketPromise])
    .then(function (results) {
        var us = results[0];
        var walmarts = results[1];
        console.log(walmarts);
        //将整个geojson传给path，也会产生地图，只不过各州之间没有边界线
        //不想data每个features 产生的图，所以class是nation，
        //而边界靠topojson.mesh产生， 应该是效率更高些。
        //但注意path是不设置projection的，否则会出错，还需进一步了解projection
        svg.append("path")
            .datum(topojson.feature(us, us.objects.nation))
            .attr("class", "nation")
            .attr("d", path);

        svg.append("path")
            .datum(topojson.mesh(us, us.objects.states, function (a, b) {
                return a !== b;
            }))
            .attr("class", "states")
            .attr("d", path);

    });

function typeWalmart(d) {
    var la = +d.la;
    var lo = +d.lo;
    console.log(la, lo)
    var p = projection([la,lo]);
    console.log(p)
    // d[0]=p[0], d[1]=p[1];
    // d.date=parseDate(d.date);
    return d;
}