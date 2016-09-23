
var objectParser = function(results, whereToPlaceResults, levelOfNesting) {


    for(var i = 0; i < Object.keys(results).length; i++) {
        if(Object.keys(results)[i] !== "undefined") {
            /*            var newA = document.createElement("a");
             newA.SecretValue = results[Object.keys(results)[i]]
             newA.onclick = plotAA;//event.stopPropagation();}
             var blankspaces = pasteBlankSpaces(levelOfNesting * 3, "&nbsp");
             newA.innerHTML = blankspaces + Object.keys(results)[i] + "<br><br>";
             newA.id = Object.keys(results)[i] + "##" + levelOfNesting;
             var fatherA = document.getElementById(whereToPlaceResults);
             bbb.push(newA);*/
            var newB = document.createElement("a");
            newB.SecretValue = results[Object.keys(results)[i]]
            newB.onclick = plotAA;//event.stopPropagation();}
            newB.innerHTML = Object.keys(results)[i];
            newB.id = Object.keys(results)[i] + "##" + levelOfNesting;

            /* var fatherA = document.getElementById(whereToPlaceResults);

             fatherA.appendChild(newA);*/
            myRow.insertCell()
            myCell = myRow.cells[myRow.cells.length-1]
            myCell.appendChild(newB)
            if (Object.keys(results[Object.keys(results)[i]].children).length > 0) {
                objectParser(results[Object.keys(results)[i]].children, Object.keys(results)[i] + "##" + levelOfNesting, levelOfNesting + 1)
            }
            subcounter ++;
            if (subcounter == 4) {
                myTable.insertRow();
                myRow = myTable.rows[myTable.rows.length -1];
                subcounter = 1;
            }
        }

    }
};
var plotAA = function () {
    if(this.SecretValue.values.length > 0){
        plotStringArray(this.SecretValue.values);}
};

var pasteBlankSpaces = function (n, a){
    var stringToReturn = "";
    for(var i = 0; i< n;i++){
        stringToReturn += a
    }
    return stringToReturn
};

