function draw(geo_data) {
    "use strict";
    //Adding the major parts of the page
    d3.select("body")
        .append("h1")
        .text("Flights Originating in the East Are More Delayed");
    d3.select("body")
        .append("h4")
        .text("Mean Delay Time per Flight for Selected Categories at US Airports with 25+ Flights per Day (2006-2016)");

    var row = d3.select("body")
        .append("div")
        .attr("class", "row main");
    row.append("div")
        .attr("class", "col-md-3");

    var svg = row.append("div")
        .attr("class", "col-md-7")
        .append("svg")
        .style("width", "100%")
        .style("height", "80vh")
        .append('g')
        .attr('class', 'map');

    //Tooltip
    var tip = d3.tip().attr('class', 'd3-tip').html(function(d) {
        return "<b>" + d["airport"] + "</b> <br> Average minutes of " + toread + " delays per flight: " + d[toread];});
    svg.call(tip);


    //Adding the map
    var projection = d3.geo.albersUsa() // Special Projection for the USA
        .scale(975)
        .translate([761/2, 444/2]);
    var path = d3.geo.path().projection(projection);

    var map = svg.selectAll('path')
        .data(geo_data.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('fill', 'rgb(255, 255, 255)')
        .style('stroke', 'black')
        .style('stroke-width', 0.5);



    //Adding buttons
    var delay_types = ["Total Delays","Carrier","Weather",
        "Late Arrival of the Same Aircraft at a Previous Airport"];
    var toread = "Total Delays";
    var size_type = "Area";
    //Buttons to control the types of delay shown
    var type_buttons_div = d3.select("body")
        .select("div.row.main")
        .append("div")
        .attr("class", "col-md-2")
        .append("div")
        .attr("class", "type-buttons");
    type_buttons_div
        .append("b")
        .text("Types of Delay");
    var type_buttons = type_buttons_div.selectAll("div")
        .data(delay_types)
        .enter()
        .append("div")
        .text(function(d) {
            return d;
        });

    type_buttons.on("click", function(d) {
        d3.select(".type-buttons")
            .selectAll("div")
            .transition()
            .duration(500)
            .style("color", "black")
            .style("background", "rgb(251, 201, 127)");

        d3.select(this)
            .transition()
            .duration(500)
            .style("background", "lightBlue")
            .style("color", "white");
        toread = d;
        update();
    });

    //Used in the update function.
    var global_data;
    d3.csv("data/airport_summary.csv", function(d) {
        for (var value in delay_types){
            d[delay_types[value]] = +d[delay_types[value]];
        }
        return d;
    }, plot_points);




    function plot_points(data) {
        global_data = data;
        var max = d3.max(data, function(d) {
            return d[toread];
        });
        var extent = d3.extent(data, function(d) {
            return d[toread];
        });
        var radius = d3.scale.sqrt()
            .domain([0, max])
            .range([0, 15]);
        var color = d3.scale.linear()
            .domain(extent)
            .range(["yellow", "red"]);
        function key_func(d) {
            return d['airport'];
        }
        //Draw legend
        var values = [];
        for (var i = extent[0]; i <= extent[1]; i+=(extent[1]-extent[0])/5) {
            values.push(i);
        }
        console.log(values);
        var legend_div = d3.select("div.col-md-3")
            .append("div")
            .attr("class", "legend");
        var legend_divs = legend_div
            .selectAll("div")
            .data(values)
            .enter()
            .append("div")
            .attr("class", "legend-section");
        legend_divs.append("svg")
            .attr("width", "75")
            .attr("height", "75")
            .append("circle")
            .attr("r", function(d) {
                return radius(d)
            })
            .attr("fill", function(d) {
                return color(d)
            })
            .attr("cx", "50")
            .attr("cy", "50");
        legend_divs.append("div")
            .style("display", "inline-block")
            .style("position", "relative")
            .style("top", "-25px")
            .text(function(d) {
                return Math.round(d * 100)/100 + " minutes/flight";
            });

        //initial drawing of circles
        svg.append('g')
            .attr("class", "bubble")
            .selectAll("circle")
            .data(data.sort(function(a, b) {
                return b[toread] - a[toread];
            }), key_func)
            .enter()
            .append("circle")
            .attr('cx', function(d) { return projection([+d["lon"], +d["lat"]])[0]; })
            .attr('cy', function(d) { return projection([+d["lon"], +d["lat"]])[1]; })
            .attr('r', function(d) {
                return radius(d[toread]);
            })
            .attr("fill", function(d) {
                return color(d[toread]);
            })
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);
        d3.select("body")
            .append("div")
            .attr("class", "row")
            .append("div")
            .attr("class", "col-md-offset-2 col-md-2")
            .html("Source: <a href='http://www.transtats.bts.gov/OT_Delay/OT_DelayCause1.asp'>Bureau of Transportation Statistics</a>")
    }



    function update()
    {
        //A new max should be created as delay type might have changed
        var max = d3.max(global_data, function(d) {
            return d[toread];
        });
        var extent = d3.extent(global_data, function(d) {
            return d[toread];
        });
        var color = d3.scale.linear()
            .domain(extent)
            .range(["yellow", "red"]);
        var radius = d3.scale.sqrt()
            .domain([0, max])
            .range([0, 15]);
        svg.selectAll("circle")
            .attr("r", function(d) {
                return radius(d[toread]);
            })
            .attr("fill", function(d){
                return color(d[toread])
            });
        var values = [];
        for (var i = extent[0]; i <= extent[1] + 0.001; i+=(extent[1]-extent[0])/5) {
            values.push(i);
        }
        var divs = d3.selectAll("div.legend-section")
            .data(values);
        divs.exit();
        divs.enter();
        d3.selectAll("div.legend-section div")
            .text(function(d) {
                return Math.round(d3.select(this.parentNode).datum() * 100)/100 + " minutes/flight";
            });
    }

}