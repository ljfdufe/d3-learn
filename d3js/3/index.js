var d3 = require("d3");

var p = d3.select("body").selectAll("p").text("中学生");
p.style("color", "red")
    .style("font-size", "80px");