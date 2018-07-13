var d3 = require("d3");

// console.log(d3.schemeCategory10)
// console.log(d3.schemeBlues[10])

var m = 10,
    r = 100,
    color = d3.scaleOrdinal().range(d3.schemeCategory10);

var pie = d3.pie()
    .value(function (d) {
        return +d.count;
    })
    .sortValues(function (a, b) {
        return b - a;
    });

var arc = d3.arc()
    .innerRadius(r / 2)
    .outerRadius(r);

d3.csv("./data/flights.csv").then(function (flights) {
    // console.log(flights);
    var airports = d3.nest()
        .key(function (d) {
            return d.origin;
        })
        .entries(flights);
    // console.log(airports);
    var svg = d3.select("div")
        .selectAll("div")
        .data(airports)
        .enter()
        .append("div")
        .attr("class", "airport")
        .style("display", "inline-block")
        .style("width", (r + m) * 2 + "px")
        .style("height", (r + m) * 2 + "px")
        .append("svg")
        .attr("width", (r + m) * 2)
        .attr("height", (r + m) * 2)
        .append("g")
        .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");
    // console.log(svg.selectAll(".airport"))
    // 可以发现airport并没有分别绑定在div.airport上，分别向下绑定在g上
    // console.log(svg);
    // 会发现svg是四个g，四个airports绑定在四个g上
    svg.append("text")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function (d) {
            return d.key;
        });
    // 之前airports绑定在了svg（其实是g）身上
    // 所以再绑定给g部分数据是，用的是function
    var g = svg.selectAll("g")
        .data(function (d) {
            return pie(d.values);
        })
        .enter()
        .append("g");

    // console.log(g);
    // g这时是4个pie中每个小扇形了
    // Add a colored arc path, with a mouseover title showing the count.
    g.append("path")
        .attr("d", arc) //不用显示写为 arc(d)
        .style("fill", function (d) {
            // 通过pie计算出layout数据时，原数据也保留在data中
            // 故用d.data.carrier 取得对于的carrier字段
            return color(d.data.carrier);
        })
        //  a mouseover title showing the count
        .append("title")
        .text(function (d) {
            return d.data.carrier + ": " + d.data.count;
        })

    // Add a label to the larger arcs, translated to the arc centroid and rotated.
    g.filter(function (d) {
            return d.endAngle - d.startAngle > .2;
        })
        .append("text")
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("transform", function (d) {
            return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")";
        })
        .text(function (d) {
            return d.data.carrier;
        });

    function angle(d) {
        // d的startAngle  endAngle是已弧度为单位的，
        // 列个方程就知道咋回事了
        var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
        // 上式是由该下式简化而来， 为啥要减去90，因为文字是水平的，本来就有个90度
        // var a = ((d.startAngle+d.endAngle)/2) * (360/(2*Math.PI)) - 90
        // 如果旋转大于90度，则减去180，否则文字就倒了
        return a > 90 ? a - 180 : a;
    }
})