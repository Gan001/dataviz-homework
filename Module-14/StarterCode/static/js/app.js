// from data.js
var tableData = data;

// YOUR CODE HERE!
//build table from data
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
//select submit button
var submit = d3.select("#filter-btn");

//action to be performed when submit button is  clicked
submit.on("click",function(){
    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Select the input element and get the raw HTML node
    var inputDate = d3.select("#datetime");
    var inputCity = d3.select("#city");
    var inputState = d3.select("#state");
    var inputCountry = d3.select("#country");
    var inputShape = d3.select("#shape");

    // Get the value property of the input element
    var dateValue = inputDate.property("value");
    var cityValue = inputCity.property("value");
    var stateValue = inputState.property("value");
    var countryValue = inputCountry.property("value");
    var shapeValue = inputShape.property("value");
 
    //filter by category
    var filteredData = tableData.filter(tableData => {
        var dateBool = false;
        var cityBool = false;
        var stateBool = false;
        var countryBool = false;
        var shapeBool = false;

        if( tableData.datetime === dateValue){
            dateBool = true;
        } else if (!dateValue){
            dateBool = true;
        }

        if( tableData.city === cityValue){
            cityBool = true;
        } else if(!cityValue){
            cityBool = true;
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

        return(dateBool && cityBool && stateBool && countryBool && shapeBool);
    });
    //display in console
    console.log(filteredData);

    //clear previous table
    d3.select('#ufo-table tbody').html(' ');
    
    //build filtered table
    buildTable(filteredData);
});
//build unfiltered table
buildTable(tableData);