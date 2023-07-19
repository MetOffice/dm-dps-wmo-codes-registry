/**
 * Querying Example JavaScript used by the /ui/querying page.
 */
let endpoint = "/system/query";
let query = "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\
                PREFIX reg: <http://purl.org/linked-data/registry#>\
                PREFIX version: <http://purl.org/linked-data/version#>\
                SELECT ?regdef ?label WHERE {\
                ?item reg:register <http://codes.wmo.int/49-2/AerodromeRecentWeather> ;\
                    version:currentVersion/reg:definition/reg:entity ?regdef ;\
                    version:currentVersion ?itemVer .\
                ?regdef rdfs:label ?label . } LIMIT 10";
let divResults = document.getElementById("results");

function sparqlQueryJson(queryStr, endpoint, callback) {
    // Build the request URI
    let requestUri = endpoint + "?query=" + escape(queryStr) + "&output=json";

    // Get our HTTP request object
    if (window.XMLHttpRequest) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', requestUri, true);

        // Set up callback to get the response asynchronously
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Do something with the results
                    callback(xhr.responseText);
                } else {
                    // Some kind of error occurred
                    alert("Sparql query error: " + xhr.status + " " + xhr.responseText);
                }
            }
        };

        // Send the query to the endpoint
        xhr.send();
    } else {
        alert("Your browser does not support XMLHttpRequest");
    }
}

// Define a callback function to receive the SPARQL JSON result
function myCallback(str) {
    // Convert result to JSON
    let jsonObj = eval('(' + str + ')');

    // Build up a table of results
    let table = document.createElement("table");
    table.className = "table table-striped table-bordered datatable dataTable";

    // Create table head
    let tableHead = document.createElement("thead");
    table.appendChild(tableHead);

    // Create column headers
    let tableHeadRow = document.createElement("tr");

    for (let dataColumn of jsonObj.head.vars) {
        let th = document.createElement("th");
        th.appendChild(document.createTextNode(dataColumn));
        tableHeadRow.appendChild(th);
    }

    tableHead.appendChild(tableHeadRow);

    // Create table body
    let tableBody = document.createElement("tbody");
    table.appendChild(tableBody);

    // Create result rows
    for (let dataRow of jsonObj.results.bindings) {
        let tableRow = document.createElement("tr");

        // Create columns in row
        for (let column of jsonObj.head.vars) {
            let td = document.createElement("td");
            td.appendChild(document.createTextNode(dataRow[column].value));
            tableRow.appendChild(td);
        }

        tableBody.appendChild(tableRow);
    }

    // Append the table to the results HTML container
    divResults.textContent = "";
    divResults.appendChild(table);
}

// Make the query
sparqlQueryJson(query, endpoint, myCallback);
