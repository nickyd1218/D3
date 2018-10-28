d3.select(window).on("resize", makeResponsive);

makeResponsive();

function makeResponsive() {

  var svgArea = d3.select("body").select("svg");

  // clear svg is not empty
  if (!svgArea.empty()) {
    svgArea.remove();
  }

  var svgWidth = window.innerWidth;
  var svgHeight = window.innerHeight;

  var margin = {
    top: 60,
    bottom: 60,
    right: 60,
    left: 10
  };
  var height = svgHeight - margin.top - margin.bottom;
  var width = svgWidth - margin.left - margin.right;
// Append SVG element

  var svg = d3
    .select(".chart")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);
// Append group element
var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.csv("data.csv", function(error, newsData){
  if (error) throw error;
  var states = [];
  newsData.forEach(function(data){
    
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.abbr = String(data.abbr);
  
    states.push(data.abbr);
    });
    
    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(newsData, d => d.healthcare)])
    .range([height, 0]);

    var xLinearScale = d3.scaleLinear() 
    .domain([8, d3.max(newsData, d => d.poverty)])
    .range([0, width]);
      
    // create axes
    var xAxis = d3.axisBottom(xLinearScale);
    var yAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    chartGroup.append("g")
      .call(yAxis);

     chartGroup.append("circle")
    //append circles
    var circlesGroup = chartGroup.selectAll(".node")
      .data(newsData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "16") //changes the radius of the circle
      .attr("fill", "purple")
      .attr("stroke-width", "1")
      .attr("stroke", "black")
      .attr("opacity", ".3");
  
    //Initialize Tooltip
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`Poverty: ${d.poverty}%<hr>Lacks Healthcare: ${d.healthcare}%`);
      });
    //Create the tooltip in chartGroup and attach to the chartgroup
    chartGroup.call(toolTip);  

    //Create "click" event listener to display tooltip
    circlesGroup.on("click", function(d) {
      toolTip.show(d);
    })
      .on("mouseout", function(d) {
        toolTip.hide(d);
      });

var text = chartGroup;
var text = chartGroup.selectAll("null"); 
text.data(newsData)
.enter()
.append('text')
.text(d => d.abbr)
.attr('color', 'black')
.attr('font-size', 12)
.attr("x", d => xLinearScale(d.poverty)-9)
.attr("y", d => yLinearScale(d.healthcare)+4);
            
chartGroup.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left + 9)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.attr("class", "axisText")
.text("Lacks Healthcare %");

chartGroup.append("text")
.attr("transform", `translate(${width / 2}, ${height + 30})`)
.attr("class", "axisText")
.text("Poverty %");

});
}