var d3 = require("d3");
import "./brush-zoom.css"

var svg = d3.select("div")
    .append("svg")
    .attr("width", 960)
    .attr("height", 500);

var margin = {
        top: 20,
        right: 20,
        bottom: 110,
        left: 40
    },
    margin2 = {
        top: 430,
        right: 20,
        bottom: 30,
        left: 40
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    height2 = +svg.attr("height") - margin2.top - margin2.bottom;

var parseDate = d3.timeParse("%b %Y");

var x = d3.scaleTime().range([0, width]),
    x2 = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y);

var brush = d3.brushX()
    .extent([
        [0, 0],
        [width, height2]
    ])
    .on("brush end", brushed);

var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    //这个应该是相对于所在容器g 的坐标
    //下面这两个extent 有啥区别呢
    .translateExtent([
        [0, 0],
        [width, height]
    ])
    .extent([
        [0, 0],
        [width, height]
    ])
    .on("zoom", zoomed);

var area = d3.area()
    .curve(d3.curveMonotoneX)
    //结合文档看，data为啥是这种组织形式，应该同数据绑定有关
    .x(function (d) {
        return x(d.date); //一个accessor，需为函数
    })
    .y0(height)
    .y1(function (d) {
        return y(d.price);
    });
var area2 = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function (d) {
        return x2(d.date);
    })
    .y0(height2)
    .y1(function (d) {
        return y2(d.price);
    });

svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left +
        "," + margin.top + ")")

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left +
        "," + margin2.top + ")")

//哈哈 parse函数可以放到这里 例如下面的 type     
d3.csv("data/sp500.csv", type).then(function (data) {

    x.domain(d3.extent(data, function (d) {
        return d.date;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.price;
    })]);
    x2.domain(x.domain());
    y2.domain(y.domain());

    //上半部分
    focus.append("path")
        .datum(data)
        .attr("class", "area")
        // 这里可以直接写成
        //.attr("d", area)
        .attr("d", function (d) {
            // console.log(area(d));
            return area(d);
        });

    focus.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    focus.append("g")
        .attr("class", "axis axis--y")
        .call(yAxis);

    //下半部分
    context.append("path")
        .datum(data)
        .attr("class", "area")
        .attr("d", function (d, i) {
            return area2(d);
        });

    context.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);

    context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, x.range());

    svg.append("rect")
        .attr("class", "zoom")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left +
            "," + margin.top + ")")
        .call(zoom);
})

function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;
    var s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    focus.select(".area").attr("d", area);
    focus.select(".axis--x").call(xAxis);
    //通过上面几行代码，就可以实现forcus联动了啊……下面这几行是干啥的
    // svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
    //     .scale(width / (s[1] - s[0]))
    //     .translate(-s[0], 0));
}

function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return;
    var t = d3.event.transform;
    //重新利用t计算x2，并取得domain
    x.domain(t.rescaleX(x2).domain());
    focus.select(".area").attr("d", area);
    focus.select(".axis--x").call(xAxis);
    context.select(".brush").call(brush.move,
        x.range().map(t.invertX, t));
}

function type(d) {
    d.date = parseDate(d.date);
    d.price = +d.price;
    return d;
}