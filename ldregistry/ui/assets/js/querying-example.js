/**
 * Querying Example JavaScript used by the /ui/querying page.
 */
let endpoint = "/system/query";
let query = "prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> \
            prefix reg: <http://purl.org/linked-data/registry#> \
            prefix version: <http://purl.org/linked-data/version#> \
            select ?regdef ?label where { \
            ?item reg:register <http://codes.wmo.int/wmdr/DataFormat> ; \
                  version:currentVersion/reg:definition/reg:entity ?regdef ; \
                  version:currentVersion ?itemVer. \
            ?regdef rdfs:label ?label . }";
let divResults = document.getElementById("results");

function sparqlQueryJson(queryStr, endpoint, callback) {
    // Build the request URI
    let requestUri = endpoint + "?query=" + escape(queryStr) + "&output=json";

    // Get our HTTP request object.
    if (window.XMLHttpRequest) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', requestUri, true);

        // Set up callback to get the response asynchronously.
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Do something with the results
                    callback(xhr.responseText);
                } else {
                    // Some kind of error occurred.
                    alert("Sparql query error: " + xhr.status + " " + xhr.responseText);
                }
            }
        };

        // Send the query to the endpoint.
        xhr.send();
    } else {
        alert("Your browser does not support XMLHttpRequest");
    }
}

// Define a callback function to receive the SPARQL JSON result.
function myCallback(str) {
    // Convert result to JSON
    let jsonObj = eval('(' + str + ')');

    // Build up a table of results.
    let table = document.createElement("table");
    table.className = "table table-striped table-bordered datatable dataTable";

    // Create column headers
    let tableHeader = document.createElement("tr");

    for (let dataColumn of jsonObj.head.vars) {
        let th = document.createElement("th");
        th.appendChild(document.createTextNode(dataColumn));
        tableHeader.appendChild(th);
    }

    table.appendChild(tableHeader);

    // Create result rows
    for (let dataRow of jsonObj.results.bindings) {
        let tableRow = document.createElement("tr");

        // Create columns in row
        for (let column of jsonObj.head.vars) {
            let td = document.createElement("td");
            td.appendChild(document.createTextNode(dataRow[column].value));
            tableRow.appendChild(td);
        }

        table.appendChild(tableRow);
    }

    // Append the table to the results HTML container
    divResults.textContent = "";
    divResults.appendChild(table);
}

// Make the query.
sparqlQueryJson(query, endpoint, myCallback);