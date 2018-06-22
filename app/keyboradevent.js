var d3 = require("d3")

var characters = ["A", "S", "D", "F"];

var svg = d3.select("div")
    .append("svg")
    .attr("width", 500)
    .attr("heigth", 800)

var rects = svg.selectAll("rect")
    .data(characters)
    .enter()
    .append("rect")
    .attr("x", function (d, i) { return 10 + i * 60; })
    .attr("y", 150)
    .attr("width", 55)
    .attr("height", 55)
    .attr("rx", 5)
    .attr("ry", 5)
    .attr("fill", "black");

var texts = svg.selectAll("text")
    .data(characters)
    .enter()
    .append("text")
    .attr("x", function (d, i) { return 10 + i * 60; })
    .attr("y", 150)
    .attr("dx", 10)
    .attr("dy", 25)
    .attr("fill", "white")
    .attr("font-size", 24)
    .text(function (d, i) { return d; })

d3.select("body")
.on("keydown", function(){
    rects.attr("fill", function(d){
        if( d == String.fromCharCode(d3.event.keyCode)){
            return "yellow"
        }else{
            return "black"
        }
    })
    .on("keyup", function(){
        rects.attr("fill", "black");
    })
})