import {
    select,
    zoomTransform,
    zoom,
    event
} from "d3";

import {
    downloadable
} from "d3-downloadable"


var circles = [{
        cx: 150,
        cy: 200,
        r: 30
    },
    {
        cx: 220,
        cy: 200,
        r: 30
    },
    {
        cx: 150,
        cy: 270,
        r: 30
    },
    {
        cx: 220,
        cy: 270,
        r: 30
    },
]

var zooming = zoom()
    .scaleExtent([1, 10])
    .on("zoom", zoomed);

function zoomed() {
    console.log(event.transform);
    console.log(zoomTransform(this));
    select(this)
        .attr("transform", event.transform)
    // .attr("transform", "scale(" + event.transform.k + ")")
};


var svg = select("div").append("svg")
    .attr("width", 500)
    .attr("height", 500)

var g = svg
    .append("g")
    .call(zooming);

g.selectAll("circle")
    .data(circles)
    .enter()
    .append("circle")
    .attr("cx", function (d, i) {
        return d.cx;
    })
    .attr("cy", function (d, i) {
        return d.cy;
    })
    .attr("r", function (d, i) {
        return d.r;
    })
    .attr("fill", "black")

svg.call(downloadable())