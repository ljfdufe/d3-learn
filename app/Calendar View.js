var d3 = require("d3");

var width = 960,
    height = 136,
    cellSize = 17;

var formatPercent = d3.format(".1%");
var color = d3.scaleQuantize()
    .domain([-0.05, 0.05])
    // .range(["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"]);
    .range(["green", "red"])

var svg = d3.select("#root")
    .selectAll("svg")
    .data(d3.range(1990, 2011))
    .enter().append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    // width-cellSize*53 剩余的空间，除以2
    // height-cellSize*7 同理
    .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

svg.append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "middle")
    .text(function (d) {
        return d;
    });

// 底图的rect 每天
var rect = svg.append("g")
    // 否则下面的rect会填充为黑色
    .attr("fill", "none")
    .attr("stroke", "#ccc")
    .selectAll("rect")
    .data(function (d) {
        return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1));
    })
    .enter().append("rect")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function (d) {
        // 
        return d3.timeWeek.count(d3.timeYear(d), d) * cellSize;
    })
    // getDay() 返回值是 0（周日） 到 6（周六） 之间的一个整数
    .attr("y", function (d) {
        return d.getDay() * cellSize;
    })
    // 格式化rect所绑定的数据，由之前的Date format为string
    .datum(d3.timeFormat("%Y-%m-%d"));

// 每个月的 path
svg.append("g")
    .attr("fill", "none")
    .attr("stroke", "#000")
    .selectAll("path")
    .data(function (d) {
        return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1))
    })
    .enter().append("path")
    .attr("d", pathMonth);

// 根据数据着色
d3.csv("./data/Calendar View.csv").then(function (csv) {

    var data = d3.nest()
        // Date是不重复的，所以每个values就一个object
        .key(function (d) {
            return d.Date;
        })
        // 对每个 values进行操作，以其结果替换values
        .rollup(function (d) {
            return (d[0].Close - d[0].Open) / d[0].Open;
        })
        // entries以key:1991-11-02,value:1.25 的形式返回
        // object 以 1991-11-02:1.25 的object形式返回
        .object(csv);

    // var dataT = d3.nest()
    //     .key(function (d) {
    //         return d.Date;
    //     })
    //     .entries(csv);
    console.log(data);
    // console.log(dataT)

    rect.filter(function (d) {
            return d in data;
        })
        .attr("fill", function (d) {
            return color(data[d]);
        })
        // 添加title
        .append("title")
        .text(function (d) {
            return d + ": " + formatPercent(data[d]);
        });

});



function pathMonth(t0) {
    var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
        d0 = t0.getDay(),
        w0 = d3.timeWeek.count(d3.timeYear(t0), t0),
        d1 = t1.getDay(),
        w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
    return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize +
        "H" + w0 * cellSize + "V" + 7 * cellSize +
        "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize +
        "H" + (w1 + 1) * cellSize + "V" + 0 +
        "H" + (w0 + 1) * cellSize + "Z";
}