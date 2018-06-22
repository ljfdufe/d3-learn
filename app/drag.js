var d3 = require("d3");

var svg = d3.select("div")
    .append("svg")
    .attr("width", 500)
    .attr("height", 500);

var circles = [{
        cx: 150,
        cy: 200,
        r: 30
    },
    {
        cx: 250,
        cy: 200,
        r: 30
    }
];

var drag = d3.drag()
    .on("start", function (d) {
        console.log("拖拽开始");
    })
    .on("end", function (d) {
        console.log("拖拽结束");
    })
    .on("drag", function (d) {
        d3.select(this)
            .attr("cx", d.cx = d3.event.x)
            .attr("cy", d.cy = d3.event.y)
    })

svg.selectAll("circle")
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
    .call(drag)