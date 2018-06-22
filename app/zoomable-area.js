import {
    select,
    timeParse,
    timeFormat,
    scaleTime,
    scaleLinear,
    axisBottom,
    axisLeft,
    area,
    curveStepAfter,
    zoom,
    csv as d3csv,
    extent,
    max,
    zoomIdentity,event as event_
} from "d3"

var svg = select("#zoomable-area"),
    margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 60
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

var parseDate = timeParse("%Y-%m-%d"),
    formateDate = timeFormat("%Y");

var xScale = scaleTime()
    .domain([new Date(1999, 0, 1), new Date(2003, 0, 0)])
    .range([0, width]);

var yScale = scaleLinear()
    .range(height, 0);

var xAxis = axisBottom(xScale);
var yAxis = axisLeft(yScale);

var area_ = area()
    .curve(curveStepAfter)
    .y0(yScale(0))
    .y1(function (d) {
        return yScale(d.value);
    });

var areaPath = g.append("path")
    .attr("clip-path", "url(#clip)") //clip-path svg中的裁剪路径，zoom时裁剪好放入视图内
    .attr("fill", "steelblue");

var yGroup = g.append("g"),
    xGroup = g.append("g");

var zoom_ = zoom()
    .scaleExtent([1 / 4, 8])
    .translateExtent([
        [-width, -Infinity],
        [2 * width, Infinity] //infinity 的作用应该是使y方向不translate
    ])
    .on("zoom", zoomed);

var zoomRect = svg.append("rect") //相应zoom事件的遮罩
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "none")
    .attr("pointer-events", "all") //这个属性是什么意思
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom_);

g.append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

d3csv("zoomable-area.csv", function (d) {
    d.date = parseDate(d.date);
    d.value = +d.value;
    return d;
}, function (error, data) {
    if (error) throw error;
    var xExtent = extent(data, function (d) {
        return d.date;
    })
    zoom_.translateExtent([xScale(xExtent[0]), -Infinity], [xScale(xExtent[1]), Infinity]);
    // 读取数据之后才能根据比例尺转化后的数据限制translate
    yScale.domain([0, max(data, function (d) {
        d.value
    })]);
    yGroup.call(yAxis).select(".domain").remove();
    //读取数据之后才能设置domain
    areaPath.datum(data);
    zoomRect.call(zoom_.transform, zoomIdentity)
    //以上者两个是什么意思
})
// 还有就是 初始化的时候，也没见到areaPath 画到svg上啊
function zoomed() {
    var xz = event_.transform.rescaleX(xScale);
    xGroup.call(xAxis.scale(xz));
    areaPath.attr("d", area_.x(function(d) { return xz(d.date); }));
}
