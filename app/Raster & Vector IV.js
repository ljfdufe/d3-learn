var d3 = require("d3");
var d3_tile = require("d3-tile");

var pi = Math.PI,
    tau = 2 * pi;

var width = Math.max(960, window.innerWidth),
    height = Math.max(500, window.innerHeight);

var projection = d3.geoMercator()
    .scale(1 / tau)
    .translate([0, 0]);

var path = d3.geoPath()
    .projection(projection);

var tile = d3_tile.tile()
    .size([width, height]);

var zoom = d3.zoom()
    .scaleExtent([1 << 11, 1 << 14])
    .on("zoom", zoomed);

var svg = d3.select("div")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var raster = svg.append("g");
var vector = svg.append("path");

d3.csv("./data/us-state-capitals.csv", type)
    .then(function (capitals) {
        vector.datum({
            type: "FeatureCollection",
            features: capitals
        });
        //计算
        var center = projection([-98.5, 39.5]);
        console.log(center);
        console.log([width / 2, height / 2]);
        //理解为设置初始缩放平移位置？
        svg.call(zoom)
            .call(zoom.transform, d3.zoomIdentity
                .translate(width / 2, height / 2)
                .scale(1 << 12)
                .translate(-center[0], -center[1]));
    })

function zoomed() {
    var transform = d3.event.transform;
    var tiles = tile.scale(transform.k)
        .translate([transform.x, transform.y])();

}

function type(d) {
    return {
        type: "Feature",
        properties: {
            name: d.description,
            state: d.name
        },
        geometry: {
            type: "Point",
            coordinates: [+d.longitude, +d.latitude]
        }
    }
}