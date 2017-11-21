
function parseCSV(files) {

    document.getElementById("input").value = ""; //clearing the textarea
    document.getElementById("output").value = ""; //clearing the textarea
    //checking FileReader support from the browser
    if (window.FileReader) {
        var reader = new FileReader();
        reader.readAsText(files[0]); // Read the file to memory 
        reader.onload = successHandler;
        reader.onerror = errorHandler; // Handling the file load error
    } else {
        alert('The browser does not support FileReader!!');
    }

}

function successHandler(event) {

    var csv = event.target.result;
    var allLinesInCSV = csv.split(/\n/);
    //checking if the input is comma based or space based CSV
    var isCommaCSV = (allLinesInCSV[0].search(",") === -1) ? false : true;
    var matrixForDisplay = []; //This will be used for displaying the data
    var matrixForProcessing = []; // THis will be used for replacing 0 values
    for (var i = 0; i < allLinesInCSV.length; i++) {
        var data = allLinesInCSV[i].split(/,| /);
        matrixForDisplay.push(data);
        matrixForProcessing.push(data);
    }

    displayData(isCommaCSV, matrixForDisplay, "input");
    interpolateZeroValues(isCommaCSV, matrixForProcessing);
}

function interpolateZeroValues(isCommaCSV, matrixToProcess) {
    //getting the info whether the no. of columns is higher than rows or vise versa and get the maximum
    //this will bes used for region growing (for searching neighbors) if the present neighbors are 0 
    var maxLengthOfInputMatrix = Math.max(matrixToProcess.length, matrixToProcess[1].length);
    loop1:
            for (var i = 0; i < matrixToProcess.length; i++) {
        loop2:
                for (var j = 0; j < matrixToProcess[i].length; j++) {
            var cell = matrixToProcess[i][j].trim(); //triming for any special characters
            if (cell === "0") {
                loop3:
                        for (var k = 1; k < maxLengthOfInputMatrix - 1; k++) { //grow regions for defining the neighbors if all the neighbors are 0.
                    var neighborObj = neighborsForijk(matrixToProcess, i, j, k);
                    var sorroundingValues = neighborObj.allNeighbors; //array of all neighbors
                    var topAndBottomSurroundings = neighborObj.topBottomNeighbors;// array of only top and bottom neighbors
                    var correctValue;
                    if (sorroundingValues.length > 0 && topAndBottomSurroundings.length > 0) {// if both the arrays got vaules
                        if (standardDeviation(sorroundingValues) > 15) { // in case of high standart deviation the correct value will the average of top and bottom value only
                            correctValue = Math.round(average(topAndBottomSurroundings));
                        } else { //in case of low standart deviation the correct value will be the average of sorrounding values
                            correctValue = Math.round(average(sorroundingValues));
                        }
                        //catching the cell at the end of the array
                        matrixToProcess[i][j] = (j === matrixToProcess[i].length - 1) ? correctValue + "\n" : correctValue;
                        break loop3;
                    } else if (sorroundingValues.length > 0 && topAndBottomSurroundings.length === 0) {
                        correctValue = Math.round(average(sorroundingValues));
                        //catching the cell at the end of the array
                        matrixToProcess[i][j] = (j === matrixToProcess[i].length - 1) ? correctValue + "\n" : correctValue;
                        break loop3;
                    }
                }
            }
        }
    }
    displayData(isCommaCSV, matrixToProcess, "output"); //displaying the corrected output
}

function neighborsForijk(matrix, row, column, distance) { //finds neighbors of a given cell
    var allNbrs = []; //all immidiate neighbors
    var topBottomNbrs = [];// only top and bottom immidiate neighbors
    for (var i = row - distance; i < row + distance + 1; i++) {
        for (var j = column - distance; j < column + distance + 1; j++) {
            if (getCellValue(matrix, i, j) !== -1) {//all valid immidiate neighbors
                allNbrs.push(getCellValue(matrix, i, j));
                if (j === column) {// only top and bottom valid immidiate neighbors
                    topBottomNbrs.push(getCellValue(matrix, i, j));
                }
            }
        }
    }
    return {// returning an object with two arrays
        allNeighbors: allNbrs,
        topBottomNeighbors: topBottomNbrs
    };
}

function getCellValue(matrix, i, j) {
    if (i < 0 || j < 0) { //catching out of bound index
        return -1;
    } else if (i > matrix.length - 1 || j > matrix[0].length - 1) {//catching out of bound index
        return -1;
    } else if (isNaN(Number(matrix[i][j]))) {//catching strings
        return -1;
    } else if (Number(matrix[i][j]) === 0) {//catching 0 values
        return -1;
    } else {
        return Number(matrix[i][j]);
    }
}

function standardDeviation(array) {// to calculate the standard deviation of the immidiate neighbors
    var avg = average(array);
    var squareDiffs = array.map(function (value) {
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
    });
    var avgSquareDiff = average(squareDiffs);
    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
}

function average(data) {
    var sum = data.reduce(function (sum, value) {
        return sum + value;
    }, 0);
    var avg = sum / data.length;
    return avg;
}

function displayData(isCommaCSV, matrixToDisplay, placeToDisplay) {
    //Replacing inner array comma with "_"
    for (var k = 0; k < matrixToDisplay.length; k++) {
        matrixToDisplay[k] = matrixToDisplay[k].toString().replace(/,/g, "_");
    }
    var matrix2DWithoutComma = matrixToDisplay.toString().replace(/,/g, "");// replacing outer array comma 
    if (isCommaCSV) {
        document.getElementById(placeToDisplay).value = matrix2DWithoutComma.toString().replace(/_/g, ",");//repacing inner array separator with ","
    } else {
        document.getElementById(placeToDisplay).value = matrix2DWithoutComma.toString().replace(/_/g, " ");//repacing inner array separator with space
    }
}

function errorHandler(evt) {
    if (evt.target.error.name === "NotReadableError") {
        alert("Canno't read file !");
    }
}
