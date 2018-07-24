var d3 = require("d3");

var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2 - 10;

// random(n) 和random() 没啥区别，这样写是为了产生10个随机数
var data = d3.range(10).map(Math.random).sort(d3.descending);

var color = d3.scaleOrdinal(d3.schemeCategory10);
var arc = d3.arc()
    .outerRadius(radius)
    // .innerRadius(radius * 0.6);

var pie = d3.pie();
var svg = d3.select("#root")
    .append("svg")
    .datum(data)
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var arcs = svg.selectAll("g.arc")
    .data(pie) // pie(data)
    .enter().append("g")
    .attr("class", "arc");
console.log(arcs);
arcs.append("path")
    .attr("fill", function (d, i) {
        return color(i);
    })
    // .attr("d", function (d) {
    //     return arc(d);
    // })
    .transition()
    .ease(d3.easeBounce)
    .duration(2000)
    .attrTween("d", tweenPie)
    // 重新开始议论动画
    .transition()
    .ease(d3.easeElastic)
    // 这个delay是相对于本轮动画开始时的延迟
    .delay(function(d, i) { return i * 50; })
    .duration(750)
    .attrTween("d", tweenDonut);

// piedata先输入tweenPie
function tweenPie(b){
    console.log(b)
    // innerRadius写在arc上，或写到pie产生的数据里应该是都行的
    b.innerRadius = 0;
    // 插值器就两个object相同的部分进行插值
    var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
    return function(t){return arc(i(t))};
}

function tweenDonut(b) {
    b.innerRadius = radius * .6;
    var i = d3.interpolate({innerRadius: 0}, b);
    return function(t) { return arc(i(t)); };
  }