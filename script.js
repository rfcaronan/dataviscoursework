// MAIN SOURCES
// Source: https://www.oreilly.com/content/making-a-scatterplot-with-d3-js/
// Source: https://www.d3-graph-gallery.com/graph/scatter_basic.html
// Source: https://www.d3-graph-gallery.com/bubblemap

// Set dimensions and margins of the graph
var padding = -40;

var margin = {top: 120, right: 30, bottom: 50, left: 40},
    width = 700 - margin.left - margin.right,
    height = 580 - margin.top - margin.bottom;

var margin2 = {top: 40, right: 30, bottom: 50, left: 40},
    width2 = 700 - margin2.left - margin2.right,
    height2 = 500 - margin2.top - margin2.bottom;

var margin3 = {top: 20, right: 120, bottom: 0, left: 0},
    width3 = 1000 - margin3.left - margin3.right,
    height3 = 580 - margin3.top - margin3.bottom;


// Append svg to the body of html
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svg2 = d3.select("#histogram")
    .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

// Create tooltip div
var tooltipTextDiv = d3.select("#scatter")
    .append("div")
    .attr("class", "tooltip-text-div")
    .style("opacity", 0);

// Scale color of dots
//https://observablehq.com/@d3/d3-scaleordinal
var color = d3.scaleOrdinal()
    .domain(["High", "Upper-middle", "Lower-middle", "Low"])
    .range(["#00a1ab", "#00263b","#f9b384","#ff5200"]);

// Scale size of dots
var linearSize = d3.scaleSqrt()
        .domain([1,100])
        .range([2,15]);

//Load data
d3.csv("data/datavis.csv", function(data) {

    var data_group = []
    var partyvote = []
    var scores = []
    data.forEach(function(d) {
        d.womenRights = {score: [+d.V14]};
        d.populistSaliency = +d.V6_Scale;
        d.gdp = +d.GDP;
        data_group.push(d.incomegroup2)
        d.partyvote = +d.PartyPerVote
        partyvote.push(d.partyvote)
        scores.push(d.womenRights)
    });


// DRAW SCATTERPLOT

    // Add X axis
    var xValue = function(d) {return d.V14}
        xScale = d3.scaleLinear()
            .domain([0, 10])
            .range([ 0, width ])
        xMap = function(d) { return xScale(xValue(d));}
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

    // Add Y axis
    var yValue = function(d) {return d.V6_Scale}
        yScale = d3.scaleLinear()
            .domain([0, 10])
            .range([ height, 0])
        yMap = function(d) { return yScale(yValue(d));}
        svg.append("g")
            .call(d3.axisLeft(yScale));

    /*
    // Add line on x axis
    svg.append("line")
        // Extend to the left
        .attr("x1", -30)
        .attr("y1", 510)
        // Extend to the right
        .attr("x2", 645)
        .attr("y2", 510)          
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .attr("marker-end", "url(#arrowHead)");

    // Add line on y axis
    svg.append("line")
        .attr("x1", -30)
        // Extend down
        .attr("y1", 510)
        .attr("x2", -30)
        // Extend down
        .attr("y2", -1)          
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .attr("marker-end", "url(#arrowHead)");

    // Add arrow
    svg.append("svg:defs").append("svg:marker")
        .attr("id", "arrowHead")
        .attr("refX", 6)
        .attr("refY", 6)
        .attr("markerWidth", 12)
        .attr("markerHeight", 12)
        .attr("markerUnits", "strokeWidth")
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M2,2 L10,6 L2,10 L6,6 L2,2")
        .style("fill", "black");

    */

    // Add title to y axis
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (padding+10) +","+(height/2.1)+")rotate(-90)")
        .attr("class", "graph-text")
        .text("Liberal << Social Values >> Conservative");

      // Add title to x axis
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (width/2) +","+(height-(padding))+")")
        .attr("class", "graph-text")
        .text("Favors << Position on Women's Rights >> Opposes")

    var mouseover = function(d) {
        tooltipTextDiv.transition()
            .duration(300)
            .style("opacity", .85)
        tooltipTextDiv.html("<span class='bold-text'>" + d.Country + "</span>: "+ d.Partyname + "<br> (" +  d3.format(".1f")(d.V14) + ", " + d3.format(".1f")(d.V6_Scale) + ")" + "<br> The party was elected in " + d.Elec_year + " and has a vote share of " + "<span class='bold-text'>" + d3.format(".0f")(d.PartyPerVote) + "%</span> in legislative elections.")
            .style("left", (d3.event.pageX + 30) + "px")
            .style("top", (d3.event.pageY - 90) + "px")
        }
    var mouseout = function(d) {
        tooltipTextDiv.transition()
            .duration(300)
            .style("opacity", 0)
     }

    // Add dots
    svg.append("g")
        .selectAll("dots")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", xMap)
        .attr("cy", yMap)
        .attr("r", function (d) {
            // Remove cells without entries on selected variables
            if (d.V14==="" || d.V6_Scale==="" || d.incomegroup2==="" || d.PartyPerVote === 0 || d.PartyPerVote === "") {
                return 0;
            } else {
            // Scale dots according vote share in legislative elections
            return linearSize(d.PartyPerVote);
            }
        })
        .attr("class", "dots")
        .style("fill", function (d) { return color(d.incomegroup2);})
        .style("opacity", .8)

        .on("mouseover", mouseover)
        .on("mouseout", mouseout)

    // Add labels
    /*svg.selectAll("text")
       .data(data)
       .enter()
       .append("text")
       .attr("class", "countryLabel")
       .attr("x",xMap)
       .attr("y",yMap)
       .text(function(d){return d.Country})*/


    // Create legend source: https://d3-legend.susielu.com/
    var clicked = ""

    svg.append("g")
        .attr("class", "legendOrdinal graph-text")
        .attr("transform", "translate(-40,-110)");

    // Legend for  color scaling of countries by income classification
    var legendOrdinal = d3.legendColor()
        .orient("horizontal")
        //.shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
        .shape("circle")
        .shapeRadius(8)
        .shapePadding(40)
        .labels(["High","Upper middle","Lower middle","Low"])
        // Set label width
        .labelWrap(30)
        .title("Countries are grouped based on their national income. Click to filter countries within an income group. Click again to show all.")
        .titleWidth(400)
        //use cellFilter to hide the "e" cell
        .cellFilter(function(d){ return d.label !== "" })
        .scale(color)
        .classPrefix("legend")
        // Source: http://bl.ocks.org/Ctuauden/52d057254665400f561ef73cb6e5841a
        .on("cellclick", function(d) {
            // Select all dots and show
            d3.selectAll(".dots")
                .transition()
                .duration(400)
                .style("opacity", .8)
            if (clicked !== d){
                d3.selectAll(".dots")
                    .transition()
                    .duration(400)
                    .style("opacity", .8)
                    .filter(function(e){
                    return e.incomegroup2 !== d;
                })
                    .style("opacity",0.05)
                    clicked = d
                } else {
                  clicked = ""
                }
        })

    svg.select(".legendOrdinal")
        .call(legendOrdinal);

    // Create legend for scaling of dots
    svg.append("g")
        .attr("class", "legendSize graph-text")
        .attr("transform", "translate(380, -110)");

    var legendSize = d3.legendSize()
        .scale(linearSize)
        .shape("circle")
        .shapeWidth(1)
        .cellFilter(function(d){ return d.PartyPerVote !== 0 })
        .shapePadding(22)
        .labelOffset(15)
        .orient("horizontal")
        .title("Party's vote share in legislative elections (%)")
        .labelFormat(d3.format(".0f"))

    svg.select(".legendSize")
        .call(legendSize);

})


// DRAW MAP

// Create svg
var svg3 = d3.select("#map")
    .append("svg")
    .attr("width", width3)
    .attr("height", height3)
    .attr("class", "map-class");

// Map and projection
var projection2 = d3.geoNaturalEarth()
    .scale(width3 / 1.6/ Math.PI)
    .translate([width3 / 2.2, height3 / 2.1])

var path2 = d3.geoPath()
    .projection(projection2);

// Load data
d3.queue()
  // World shape
  .defer(d3.json, "data/world.json")
  // Long, lat, and V14 scores
  .defer(d3.csv, "data/datavis_map.csv") 
  .await(createVis);


function createVis(error, countries, data) {

    // Convert values
    var dataset = []
        party_scores = []
        data.forEach(function(e) {
        source_data = [+e.longitude, +e.latitude, +e.V14, e.Country, e.Partyname, e.Group, e.Group_region]
        e.womenRights = {score: [+e.V14]};
        party_scores.push(e.womenRights)
        dataset.push(source_data);
    })

    // DRAW HISTOGRAM

    // Add X axis
    var x = d3.scaleLinear()
            .domain([0, 10])
            .range([ 0, width2])
        svg2.append("g")
            .attr("transform", "translate(0," + height2 + ")")
            .call(d3.axisBottom(x));

    // set the parameters for the histogram
    var histogram = d3.histogram()
        // Vector of values
        .value(function(e) { return e.score; })
        // Domain of graphic
        .domain(x.domain())
        // Number of bins calculated as roundup(sqrt((N))
        .thresholds(x.ticks(31));

    // Apply this function to data to get the bins
    var bins = histogram(party_scores);
    console.log(party_scores)
    console.log(bins)

    // Add y axis
    var y = d3.scaleLinear()
        .range([height2, 0]);
        y.domain([0, d3.max(bins, function(e) { return e.length; })]);
    svg2.append("g")
      .call(d3.axisLeft(y));

    // Append rectangles to the svg element
    var bar = svg2.selectAll("bar")
        .data(bins)
        .enter()
        .append("g")
        .attr("transform", function(e) { return "translate(" + x(e.x0) + "," + y(e.length) + ")"; })
    bar.append("rect")
        .data(bins)
        .attr("x", 1)
        .attr("width", function(e) { return x(e.x1) - x(e.x0) -1 ; })
        .attr("height", function(e) { return height2 - y(e.length); })
        .style("fill", "#00263b")
        .style("opacity", .8)

    // Add class attributes corresponding to Region    
    bar.data(dataset)
        .attr("class", function(c){ return c[5] + " " + c[6] + " bar"})

    bar.append("text")
        .data(bins)
        .attr("class", "legend_text white-text")
        .attr("dy", ".75em")
        .attr("y", 6)
        .attr("x", function(e) { return (x(e.x1) - x(e.x0))/2; })
        .attr("text-anchor", "middle")
        .text(function(e) { return d3.format(",.0f")(e.length); });

    // Add title to y axis
    svg2.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (padding+10) +","+(height/2.1)+")rotate(-90)")
        .attr("class", "graph-text")
        .text("Number of parties");

    // Add title to x axis
    svg2.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (width/2) +","+(height-(padding))+")")
        .attr("class", "graph-text")
        .text("Favors << Position on Women's Rights >> Opposes")

    // Add text on the map
    svg2.append("text")
        .attr("text-anchor", "middle")
        .attr("class", "graph-text")
        .attr("transform", "translate(450, 80)")
        .text("Mean score = 3.94±0.15")


// DRAW MAP
    // Scale size of dots
    var scaleRadius = d3.scaleSqrt()
                .domain([6, 8, 10])
                .range([3,15]);

    // Draw the map
    svg3.append("g")
        .selectAll("path")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("fill", "white")
        .attr("d", path2)
        .attr("vector-effect", "non-scaling-stroke")
        .style("stroke", "#333333")
        .style("stroke-width", .7)
        .style("stroke-opacity", .7);

    // Draw a box for country labels
    // This will make country labels visible on top of map lines
    svg3.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("class", "rectangle")
        .attr("x", function(e){ if (e[2] >= 10) {
                return projection2([e[0], e[1]])[0] - 48
            } else {
                return -100
            }
        })
        .attr("y", function(e){ if (e[2] >= 10) {
                return projection2([e[0], e[1]])[1] + 12
            } else {
                return -100
            }
        })
        .attr("width", function(e) {
            if (e[3]==="Papua New Guinea") {
                return 140
            } else {
                return 85
            }
        })
        .attr("height", 15)
        .style("fill", "white")
        .attr("fill-opacity", 1)


    // Add circles:
    svg3.selectAll("circles")
        .data(dataset)
        .enter()
        .append("circle")
        // Create class names equivalent to their group and region for filtering
        .attr("class" , function(e){ return e[5] + " " + e[6] })
        .attr("cx", function(e){ return projection2([e[0], e[1]])[0] })
        .attr("cy", function(e){ return projection2([e[0], e[1]])[1] })
        // Add circles for scores equal to 6 and above
        .attr("r", function(e) {
            if(e[2] >= 8) {
                return 8
            } else {
                return 0
            }
        })
        // Highlight scores of 10 with red
        .style("fill", function(e) {
            if(e[2] === 10) {
                return "red"
            } else {
                return "#888888"
            }
        })
        .attr("stroke-width", 1)
        .attr("fill-opacity", 1)
        .on("mouseover", function(e) {
            tooltipTextDiv.transition()
                .duration(300)
                .style("opacity", .85)
            tooltipTextDiv.html("The " + e[4] + " in " + e[3] + " has a score of <span class='bold-text'>" + d3.format(".1f")(e[2]) + "</span>")
            .style("left", (d3.event.pageX + 20) + "px")
            .style("top", (d3.event.pageY - 70) + "px")
        })
        .on("mouseout", function(d) {
        tooltipTextDiv.transition()
            .duration(300)
            .style("opacity", 0)
        })

    // Add country label for those with a score of 10
    svg3.selectAll(".country-label")
        .data(dataset)
        .enter().append("text")
        .attr("class", "country-label")
        .attr("x", function(e){ return projection2([e[0], e[1]])[0] - 45})
        .attr("y", function(e){ return projection2([e[0], e[1]])[1] + 24})
        .text(function(e) { 
            if(e[2] === 10) {
                return e[3] + ": 10"
            } else {
                return " "
            }; 
        })
        

    function update2(){

        // For each check box:
        d3.selectAll(".checkbox2").each(function(e){
            cb = d3.select(this);
            class_name = cb.property("value")

        // Show countries if checkbox is checked
        // Hid them if uchecked
        if (cb.property("checked") && (class_name !== "E")){
            svg3.selectAll("." + class_name)
                .transition()
                .duration(1000)
                .style("opacity", 1)
                .attr("r", function(e) {
                    if(e[2] >= 8) {
                        return 8
                    } else {
                        return 0
                    }
                })
            svg3.selectAll(".rectangle")
                .transition()
                .duration(1000)
                .style("opacity", 0)
            svg3.selectAll(".country-label")
                .transition()
                .duration(1000)
                .style("opacity", 0)
            } else if ((cb.property("checked")) || (cb.property("checked") && (class_name === "E"))) {
                svg3.selectAll("." + class_name)
                .transition()
                .duration(1000)
                .style("opacity", 1)
                .attr("r", function(e) {
                    if(e[2] >= 8) {
                        return 8
                    } else {
                        return 0
                    }
                })
                svg3.selectAll(".rectangle")
                    .transition()
                    .duration(1000)
                    .style("opacity", 1)
                svg3.selectAll(".country-label")
                    .transition()
                    .duration(1000)
                    .style("opacity", 1)
            } else if ((d3.select(this).node().checked == false)) {
                svg3.selectAll("." + class_name)
                    .transition()
                    .duration(1000)
                    .style("opacity", 0)
                    .attr("r", 0)
                svg3.selectAll(".rectangle")
                    .transition()
                    .duration(1000)
                    .style("opacity", 0)
                svg3.selectAll(".country-label")
                    .transition()
                    .duration(1000)
                    .style("opacity", 0)

            }
        })
    }

    // When checkbox changes, run the update function
    d3.selectAll(".checkbox2").on("change",update2);

    // Initialize it at the beginning
    update2()

    //Source https://www.d3-graph-gallery.com/graph/bubble_legend.html
    // Add legend: circles
    /*var valuesToShow = [6,8,10]
    var xCircle = 50
    var xLabel = 90
    var yCircle = 380
    svg3.selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function(e){ return yCircle - scaleRadius(e) } )
        .attr("r", function(e){ return scaleRadius(e) })
        .style("fill", "none")
        .attr("stroke", "black")

    // Add legend: segments
    svg3.selectAll("legend_circle")
        .data(valuesToShow)
        .enter()
        .append("line")
        .attr("x1", function(e){ return xCircle + scaleRadius(e)} )
        .attr("x2", xLabel)
        .attr("y1", function(e){ return yCircle - scaleRadius(e) - 3} )
        .attr("y2", function(e){ return yCircle - scaleRadius(e) - 3} )
        .attr("stroke", "black")
        .style("stroke-dasharray", ("1,1"))

    // Add legend: labels
    svg3.selectAll(".legend_text")
        .data(valuesToShow)
        .enter()
        .append("text")
        .attr("x", xLabel)
        .attr("y", function(e){ return yCircle - scaleRadius(e) } )
        .text(function(e){ return e } )
        .attr("class", "legend_text")
        .attr("alignment-baseline", "middle")*/

}
