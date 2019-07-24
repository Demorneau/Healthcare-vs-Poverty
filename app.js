//svg area dimensions
var svgWidth = 1400;
var svgHeight = 1000;

//Define chart's margins:
var margin = {
    top: 50,
    right: 50,
    left: 50,
    bottom: 0
};

//Defining chart's dimensions:
var chartWidth = svgWidth - margin.right - margin.left;
var chartHeight = svgHeight - margin.top - margin.bottom;

//Select body, append SVG area on it, and set pad dimensions
var svg = d3
    .select("body")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

//Append a group area, and its margins 
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Load data from data source:
d3.csv("/assets/data/data.csv").get(function(censusData) {

    censusData.forEach(function(data){
        data.healthcare = +data.healthcare;
        data.radius = +data.radius;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
        data.obesity = +data.obesity;
        data.age = +data.age;
        data.income = +data.income;
        data.state = data.state;
        data.abbr = data.abbr;
    });

    //Creating the maximum for the domain:
    var maxhealthcare = d3.max(censusData, function(d) { return d.healthcare; });
    var maxpoverty = d3.max(censusData, function(d) { return d.poverty; });
    var minpoverty = d3.min(censusData, function(d) { return d.poverty; });


    //Creating chart's scales:
    var xScale = d3.scaleLinear()
        .domain([minpoverty, maxpoverty])
        .range([0, chartWidth]);

    var yScale = d3.scaleLinear()
        .domain([0, maxhealthcare])
        .range([chartHeight, 0]);

    //Creating chart's axes
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    var chartGroup = svg.append("g")
        .attr("transform", `translate(50, ${chartHeight})`)
        .attr("stroke", "blue")
        .call(bottomAxis);
    
    var chartGroup = svg.append("g")
        .attr("transform", `translate(50, 0)`)
        .attr("stroke", "red")
        .call(leftAxis);

    // Create code to built the circle chart using the censusData.
    var circleGroup = chartGroup.selectAll("circle")
                        .data(censusData)
                        .enter()
                        .append("circle")
                        .classed("circle", true)
                        .attr("cx", d => xScale(d.poverty))
                        .attr("cy", d => yScale(d.healthcare))
                        .attr("r", function(d) {return Math.sqrt((15*(d.healthcare)))})
                        .attr("opacity", 0.6)
                        .attr("fill", "pink");


    //Initialize the tool tip:
    var toolTip = d3.tip()
        .attr("class", "toolTip")
        .offset([80,-60])
        .html(function (d) {
            return (`${d.abbr}<br> Poverty of: ${d.poverty} %<br>Healthcare of: ${d.healthcare} %`)
        //svg.call(toolTip);
        });

    //Create tooltip in chart
    chartGroup.call(toolTip);

    //Create event listeners to display and hide the toolTip
    circleGroup.on("click", function(data) {
        toolTip.show(data, this);
    })

    // onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 13)
        .attr("x", 0 - (chartHeight / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("font-family","sans-serif")
        .attr("stroke", "red")
        .attr("font-size","16px")
        .text("Healthcare(%)");

    chartGroup.append("text")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top -2})`)
        .attr("class", "axisText")
        .attr("font-family", "sans-serif")
        .attr("stroke", "blue")
        .attr("font-size","16px")
        .text("Poverty Index (%)");
});

