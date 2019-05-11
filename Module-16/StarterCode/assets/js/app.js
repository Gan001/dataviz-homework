var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcareLow";

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
      d3.max(healthData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating x-scale var upon click on axis label
function yScale(healthData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(healthData, d => d[chosenYAxis])])
  .range([height, 0]);
  
  return yLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderAxesY(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newScale,chosenAxis, axis) {

  circlesGroup.transition()
    .duration(1000)
    .attr(axis, d => newScale(d[chosenAxis]));

  return circlesGroup;
}

//update text in circle
function updateText(text, newScale,chosenAxis, axis, num=0) {

  text.transition()
    .duration(1000)
    .attr(axis, d => newScale(d[chosenAxis])+ num);

  return text;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  //x-axis
  if (chosenXAxis === "poverty") {
    var xlabel = "Poverty";
  }
  else if (chosenXAxis === "age") {
    var xlabel = "Age";
  }else {
    var xlabel = "Income";
  }

  //y-axis
  if (chosenYAxis === "healthcareLow") {
    var ylabel = "Healthcare";
  }
  else if (chosenYAxis === "smokes") {
    var ylabel = "Smokes";
  }else{
    var ylabel = "Obesity";
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel}: ${d[chosenXAxis]}<br>${ylabel}: ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv", function(err, healthData) {
  if (err) throw err;

  // parse data
  healthData.forEach(function(data) {
    data.healthcareLow = +data.healthcareLow;
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.smokes = +data.smokes;
    data.income = +data.income;
    data.obesity = +data.obesity;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(healthData, chosenXAxis);

  var yLinearScale = yScale(healthData, chosenYAxis);
  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x-axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  //append y-axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "cornflowerblue")
    .attr("opacity", ".5");
  
  // append initial text
  var texts = chartGroup.selectAll('.stateText')
    .data(healthData)
    .enter()
    .append('text')
    .classed('stateText', true)
    .text(d => d.abbr)
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis])+ 5);
    

  // Create group for  2 x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  //create group for y-axis labels
  var labelsYGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

  //create x-axis labels
  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  //create y-axis labels
  var healthcareLowLabel = labelsYGroup.append("text")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("value", "healthcareLow")
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  var smokesLabel = labelsYGroup.append("text")
    .attr("y", 0 - margin.left + 20)
    .attr("x", 0 - (height/2))
    .attr("dy", "1em")
    .attr("value", "smokes")
    .classed("inactive", true)
    .text("Smokes (%)");

  var obesityLabel = labelsYGroup.append("text")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height/2))
    .attr("dy", "1em")
    .attr("value", "obesity")
    .classed("inactive", true)
    .text("Obesity (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
  // x-axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);
        
        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);
        
        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, 'cx');
        
        //update text location
        texts = updateText(texts, xLinearScale,chosenXAxis, 'x');

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis,chosenYAxis, circlesGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);

        }else if(chosenXAxis === "poverty") {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
          
        }else{
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
      
    });

    // y-axis labels event listener
    labelsYGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = value;

        // console.log(chosenYAxis)

        // functions here found above csv import
        // updates y scale for new data
        yLinearScale = yScale(healthData, chosenYAxis);

        // updates y axis with transition
        yAxis = renderAxesY(yLinearScale, yAxis);

        // updates circles with new y values
        circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis, 'cy');
        
        //update text location
        texts = updateText(texts, yLinearScale,chosenYAxis, 'y', 5);
        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
        
        // changes classes to change bold text
        if (chosenYAxis === "smokes") {
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          healthcareLowLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);

        }
        else if(chosenYAxis === "healthcareLow") {
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLowLabel
            .classed("active", true)
            .classed("inactive", false);
          obesityLabel
            .classed("active", false)
            .classed("inactive", true);

        }else{
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          healthcareLowLabel
            .classed("active", false)
            .classed("inactive", true);
          obesityLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
});
