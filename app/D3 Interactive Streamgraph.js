var d3 = require("d3");
import "./D3 Interactive Streamgraph.css"

chart("./data/D3 Interactive Streamgraph.csv", "orange");

var colorrange = [];
var datearray = [];

function chart(csvpath, color) {
    if (color == "blue") {
        colorrange = ["#045A8D", "#2B8CBE", "#74A9CF", "#A6BDDB", "#D0D1E6", "#F1EEF6"];
    } else if (color == "pink") {
        colorrange = ["#980043", "#DD1C77", "#DF65B0", "#C994C7", "#D4B9DA", "#F1EEF6"];
    } else if (color == "orange") {
        colorrange = ["#B30000", "#E34A33", "#FC8D59", "#FDBB84", "#FDD49E", "#FEF0D9"];
    }
    var strokecolor = colorrange[0];

    var parseD = d3.timeParse("%m/%d/%y");

    var margin = {
        top: 20,
        right: 40,
        bottom: 30,
        left: 30
    };
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var xScale = d3.scaleTime()
        .range([0, width]),
        yScale = d3.scaleLinear()
        .range([height, 0]),
        cScale = d3.scaleOrdinal()
        .range(colorrange);

    var xAxis = d3.axisBottom()
        .scale(xScale),
        yAxisl = d3.axisLeft()
        .scale(yScale),
        yAxisr = d3.axisRight()
        .scale(yScale);

    var nest = d3.nest()
        .key(function (d) {
            return d.date;
        });

    var stack = d3.stack().order(d3.stackOrderNone)
    // .offset(d3.stackOffsetSilhouette);

    var area = d3.area()
        .curve(d3.curveCardinal)
        .x(function (d) {
            return xScale(d.data.date);
        })
        .y0(function (d) {
            return yScale(d[0]);
        })
        .y1(function (d) {
            return yScale(d[1]);
        });

    var svg = d3.select("#root")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tooltip = d3.select("#root")
        .append("div")
        .attr("class", "remove")
        .style("position", "absolute")
        .style("z-index", "20")
        .style("visibility", "hidden")
        .style("top", "30px")
        .style("left", "55px");

    d3.csv(csvpath, type).then(function (data) {

        // console.log(nest.entries(data));
        var nested = nest.entries(data);

        // 变换维度，为stack作准备
        var dataforstack = [];

        nested.map(function (d) {
            var stack = {};
            var total = 0;
            // 不用new Date，就变成string对象了，为什么
            stack["date"] = new Date(d.key);
            d.values.map(function (d) {
                stack[d.key] = +d.value
                total += +d.value;
            });
            stack["total"] = +total;
            dataforstack.push(stack);
        });

        console.log(dataforstack)

        // 对转换后的数据stack
        var stackeddata = stack.keys(Object.keys(dataforstack[0]).slice(1, -1))(dataforstack);
        console.log(stackeddata)

        yScale.domain([0, d3.max(dataforstack, function (d) {
            return d.total;
        })]);

        // yScale.domain(d3.extent(dataforstack, function(d){
        //     return d.total;
        // }))

        xScale.domain(d3.extent(dataforstack, function (d) {
            return d.date;
        }));

        // console.log(d3.extent(dataforstack, function (d) {
        //     return d.date;
        // }))

        // console.log(area(stackeddata[0]))

        cScale.domain(d3.range(stackeddata.length));

        svg.selectAll(".layer")
            .data(stackeddata)
            .enter().append("path")
            .attr("class", "layer")
            .attr("d", function (d) {
                return area(d);
            })
            .style("fill", function (d, i) {
                return cScale(i);
            })

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(" + width + ", 0)")
            .call(yAxisr);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxisl);

        // 为了在area之后append，以便在area上面，如果不这样，设置z-index都没用，为啥
        var vertical = svg.append("line")
            .attr("stroke", "white")
            .attr("stroke-width", "1px")
            .style("z-index", "20")

        d3.select("#root").on("mouseover", function () {
                vertical.attr("display", null);
            })
            .on("mouseout", function () {
                vertical.attr("display", "none");
            })
            .on("mousemove", function () {
                var x = d3.mouse(this)[0] - margin.left +10;
                vertical
                    .attr("x1", x)
                    .attr("y1", 0)
                    .attr("x2", x)
                    .attr("y2", height);
            })

        // tooltip、layers交互
        svg.selectAll(".layer")
            .attr("opacity", 1)
            .on("mouseover", function (d, i) {
                svg.selectAll(".layer")
                    .transition()
                    .duration(200)
                    .attr("opacity", function (d, j) {
                        return j != i ? 0.6 : 1;
                    })
            })
            .on("mouseout",function(d,i){

                svg.selectAll(".layer")
                .transition()
                .duration(200)
                .attr("opacity", 1);
                d3.select(this)
                .attr("stroke-width", "0px");
                
                tooltip.html("").style("visibility", "hidden");
            
            })
            .on("mousemove",function(d,i){

                d3.select(this)
                .classed("hover", true)
                .attr("stroke", strokecolor)
                .attr("stroke-width", "0.5px");

                

            })

    })








    function type(d) {
        d.date = parseD(d.date);
        d.value = +d.value;
        return d;
    }
}