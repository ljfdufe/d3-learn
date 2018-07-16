var d3 = require("d3");

var margin = {
        top: 20,
        right: 90,
        bottom: 30,
        left: 50
    },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.timeParse("%Y-%m-%d"),
    formatDate = d3.timeFormat("%b %d");

var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleLinear().range(["white", "steelblue"])
    .interpolate(d3.interpolateLab);

var xStep = 864e5,
    // 应该是原数据里面是以100为阶梯的，所以这里为100
    yStep = 100;

var svg = d3.select("div")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transfome", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("./data/Heatmap (2D Histogram, CSV).csv", type).then(function (buckets) {
    // console.log(buckets)
    // Compute the scale domains.
    x.domain(d3.extent(buckets, function (d) {
        return d.date;
    }));
    y.domain(d3.extent(buckets, function (d) {
        return d.bucket;
    }));
    z.domain([0, d3.max(buckets, function (d) {
        return d.count;
    })]);

    // Extend the x- and y-domain to fit the last bucket.
    // For example, the y-bucket 3200 corresponds to values [3200, 3300].
    // 为x y方向上的最后一个矩形，留出空间
    x.domain([x.domain()[0], +x.domain()[1] + xStep]);
    y.domain([y.domain()[0], +y.domain()[1] + yStep]);

    // Display the tiles for each non-zero bucket.
    // See http://bl.ocks.org/3074470 for an alternative implementation.
    svg.selectAll(".tile")
        .data(buckets)
        .enter()
        .append("rect")
        .attr("class", "tile")
        .attr("x", function (d) {
            return x(d.date);
        })
        .attr("y", function (d) {
            return y(d.bucket + yStep);
        })
        .attr("width", x(xStep) - x(0))
        .attr("height", y(0) - y(yStep))
        .style("fill", function (d) {
            return z(d.count);
        });

    var legend = svg.selectAll(".legend")
        .data(z.ticks(6).slice(1).reverse())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(" + (width + 20) + "," + (20 + i * 20) + ")";
        });

    legend.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", z);

    legend.append("text")
        .attr("x", 26)
        .attr("y", 10)
        .attr("dy", ".30em")
        .text(String);

    svg.append("text")
        .attr("class", "label")
        .attr("x", width + 20)
        .attr("y", 10)
        .attr("dy", ".35em")
        .text("Count");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        // ticks自定义刻度都展示什么粒度的数据，format进行格式化
        .call(d3.axisBottom(x).ticks(d3.timeDay).tickFormat(formatDate))
        .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .attr("text-anchor", "end")
        .text("Date");
        
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("class", "label")
        .attr("y", 6)
        .attr("dy", ".71em")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .text("Value");
});

function type(d) {
    d.date = parseDate(d.date);
    d.bucket = +d.bucket;
    d.count = +d.count;
    return d;
}