
function addRow(tableId, rowElements = [], beforeThis) {

    let table = document.getElementById(tableId);

    let row = document.createElement("tr");

    rowElements.forEach(e => {
        addColumn(row, e)
    })
    
    let body = table.getElementsByTagName("tbody")[0];
    
    if (beforeThis) {
        body.insertBefore(row, beforeThis)
    } else {
        body.appendChild(row)
    }
}

function addColumn(row, element) {
    let column = document.createElement("td");

    if (typeof element === 'string') {
        column.innerHTML = element
    } else {
        column.appendChild(element)
    }

    row.appendChild(column);
}

