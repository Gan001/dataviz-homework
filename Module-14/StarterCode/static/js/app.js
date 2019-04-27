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
// function isEmpty(input){
//     var value = input.property("value");
//     return value;
// }
// function checkFilter(){
//     var inputDate = d3.select("#datetime");
//     var inputCity = d3.select("#city");
//     var dateBool = true;
//     var cityBool = true;
    
//   // Get the value property of the input element
//   var dateValue = inputDate.property("value");

//   var cityValue = inputCity.property("value");
//   if (cityValue === ""&& dateValue === ""){
//     dateBool = false;
//     cityBool = false;
// }
// return cityBool && dateBool;

// }
var submit = d3.select("#filter-btn");

submit.on("click",function(){
    // Prevent the page from refreshing
    d3.event.preventDefault();
    // Select the input element and get the raw HTML node
  //var inputElement = d3.select("#datetime");
  var inputDate = d3.select("#datetime");
  var inputCity = d3.select("#city");
  var inputState = d3.select("#state");
  var inputCountry = d3.select("#country");
  var inputShape = d3.select("#shape");
  // Get the value property of the input element
  //var inputValue = inputElement.property("value");
//var filteredData;
  var dateValue = inputDate.property("value");
    var cityValue = inputCity.property("value");
    var stateValue = inputState.property("value");
    var countryValue = inputCountry.property("value");
    var shapeValue = inputShape.property("value");
  //var filteredData = tableData.filter(tableData => tableData.datetime === inputValue);
//   if (dateValue && cityValue ){
//      filteredData = tableData.filter(tableData => tableData.datetime === dateValue && tableData.city === cityValue);
//   }
//   else if (dateValue){
//     filteredData = tableData.filter(tableData => tableData.datetime === dateValue);
//   }
//   else if (cityValue){
//     filteredData = tableData.filter(tableData => tableData.city === cityValue);
//   }
    
  var filteredData = tableData.filter(tableData => {
    var cityBool = false;
    var dateBool = false;
    var stateBool = false;
    var countryBool = false;
    var shapeBool = false;
    if( tableData.city === cityValue){
         cityBool = true;
    } else if(!cityValue){
        cityBool = true;
    }

    if( tableData.datetime === dateValue){
        dateBool = true;
   } else if (!dateValue){
        dateBool = true;
   }

   if( tableData.state === stateValue){
    stateBool = true;
} else if(!stateValue){
   stateBool = true;
}

if( tableData.country === countryValue){
    countryBool = true;
} else if(!countryValue){
   countryBool = true;
}

if( tableData.shape === shapeValue){
    shapeBool = true;
} else if(!shapeValue){
   shapeBool = true;
}

    return(cityBool && dateBool && stateBool && countryBool && shapeBool);
  });
//   inputElement = d3.select("#city");
//   inputValue = inputElement.property("value");
//   filteredData = filteredData.filter(filteredData => filteredData.city === inputValue);
    //return(dateBool && cityBool && )
  console.log(filteredData);
  //clear previous table
  d3.select('#ufo-table tbody').html(' ')
  buildTable(filteredData);
});

buildTable(tableData);