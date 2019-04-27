// from data.js
var tableData = data;

// YOUR CODE HERE!
/*
var table = d3.select("#ufo-table");
  var tbody = table.select("tbody");
  var trow;
  for (var i = 0; i < tableData.length; i++) {
    trow = tbody.append("tr");
    trow.append("td").text(tableData[i].datetime);
    trow.append("td").text(tableData[i].city);
    trow.append("td").text(tableData[i].state);
    trow.append("td").text(tableData[i].country);
    trow.append("td").text(tableData[i].shape);
    trow.append("td").text(tableData[i].durationMinutes);
    trow.append("td").text(tableData[i].comments);
  }*/

function buildTable(tables){
    var table = d3.select("#ufo-table");
  var tbody = table.select("tbody");
  var trow;
    for (var i = 0; i < tables.length; i++) {
        trow = tbody.append("tr");
        trow.append("td").text(tables[i].datetime);
        trow.append("td").text(tables[i].city);
        trow.append("td").text(tables[i].state);
        trow.append("td").text(tables[i].country);
        trow.append("td").text(tables[i].shape);
        trow.append("td").text(tables[i].durationMinutes);
        trow.append("td").text(tables[i].comments);
      }

}

var submit = d3.select("#filter-btn");

submit.on("click",function(){
    // Prevent the page from refreshing
    d3.event.preventDefault();
    // Select the input element and get the raw HTML node
  var inputElement = d3.select("#datetime");

  // Get the value property of the input element
  var inputValue = inputElement.property("value");

  var filteredData = tableData.filter(tableData => tableData.datetime === inputValue);
  console.log(filteredData);
  buildTable(filteredData);
});

buildTable(tableData);