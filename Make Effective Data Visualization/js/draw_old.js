function draw(geo_data) {
    "use strict";
    var margin = 75,
        width = 1280 - margin,
        height = 720 - margin;

    d3.select("body")
        .append("h2")
        .text("Mean Delay Time per Flight at US Airports with 25+ Flights per Day (2006-2016)");

    var svg = d3.select("body")
        .append("div")
        .attr("class", "row")
        .append("div")
        .attr("class", "col-md-offset-2 col-md-8")
        .append("svg")
        .style("width", "100%")
        .style("height", "100vh")
        .append('g')
        .attr('class', 'map');


    var projection = d3.geo.albersUsa()
        .scale(1000);
    var path = d3.geo.path().projection(projection);

    var map = svg.selectAll('path')
        .data(geo_data.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('fill', 'lightBlue')
        .style('stroke', 'black')
        .style('stroke-width', 0.5);


    var delay_types = ["Total Delays","Carrier","Weather","National Airspace System","Security",
        "Late Arrival of the Same Aircraft at a Previous Airport"];
    var size_types = ["Area", "Squared", "Cubed"];
    var toread = "Total Delays";
    var size_type = "Area";
    var type_buttons_div = d3.select("body")
        .select("div.row")
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

    var size_buttons_div = d3.select("body")
        .select("div.row")
        .select("div.col-md-2")
        .append("div")
        .attr("class", "size-buttons");
    size_buttons_div
        .append("b")
        .text("Scale");
    var size_buttons = size_buttons_div.selectAll("div")
        .data(size_types)
        .enter()
        .append("div")
        .text(function(d) {
            return d;
        });

    size_buttons.on("click", function(d) {
        d3.select(".size-buttons")
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
        size_type = d;
        update();

    });

    var global_data;
    d3.csv("data/airport_summary.csv", function(d) {
        for (var value in delay_types){
            d[delay_types[value]] = +d[delay_types[value]];
        }
        return d;
    }, plot_points);




    function plot_points(data) {
        global_data = data;
        var extent = d3.extent(data, function(d) {
            return d[toread];
        });
        var radius = d3.scale.sqrt()
            .domain(extent)
            .range([0, 15]);
        var color = d3.scale.linear()
            .domain(extent)
            .range(["yellow", "blue"]);
        function key_func(d) {
            return d['airport'];
        }


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
            .on("click", function(d) {
                d3.select("p")
                    .html("<b>" + d["airport"] + "</b> <br> Average minutes of " + toread + " delays per flight: " + d[toread]);
            });
    }



    function update()
    {
        var extent = d3.extent(global_data, function(d) {
            return d[toread];
        });
        var radius;
        var color;
        switch(size_type){
            case "Area":
                radius = d3.scale.sqrt();
                break;
            case "Squared":
                radius = d3.scale.pow();
                break;
            case "Cubed":
                radius = d3.scale.pow().exponent(3);
                break;
        }
        color = d3.scale.linear();
        radius = radius
            .domain(extent)
            .range([0, 15]);
        color = color
            .domain(extent)
            .range(["yellow", "blue"]);
        svg.selectAll("circle")
            .attr("r", function(d) {
                return radius(d[toread]);
            })
            .attr("fill", function(d){
                return color(d[toread])
            })
    }

}