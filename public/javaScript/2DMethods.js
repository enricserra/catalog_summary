
var getStuff2D = function (tieringId, nameToParse1, nameToParse2) {
    makeAjaxRequest("http://10.0.32.140:8080/opencga2/webservices/rest/v1/files/" + tieringId + "/content/?sid=" + catalogSessionId +"&"
        , (function (response) {
            z.push(response)
            Results2D1.push(getWhatIWant2(response, tieringObject[nameToParse1].tieringRoute))
            Results2D2.push(getWhatIWant2(response, tieringObject[nameToParse2].tieringRoute))
        })
        , ajaxError);
};


function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


var canBeCoercedToNumeric = function ( myArray) {
    for(var i = 0; i < myArray.length ; i++){
        if(isNumber(myArray[i])){
            return true
        }
    }
    return false
}

var filtermyF = function(myArray, listOfFilters){
    var returnArray = [];

    if(listOfFilters == undefined){
        console.log("LISTOFFILTUNDEF")
        for(var i = 0 ; i< myArray.length; i++){
            returnArray.push(true)
        }
        return returnArray
    } else if(listOfFilters.length == 0) {
        console.log("LISTOFFILT LENGTH > 0 ")

        for(var i = 0 ; i< myArray.length; i++) {
            returnArray.push(true)
        }
        return returnArray
    }
    for (var i = 0; i< myArray.length;i++){
        for(var t = 0; t< listOfFilters.length;t++){
            if( ! listOfFilters[t](myArray[i])){
                returnArray[i] = false;
            }
        }
        if(returnArray[i] == undefined){
            returnArray[i] = true;
        }
    }
    return returnArray
}

var filterGivenBoolean = function (a, b) {
    returnArray = [];
    for(var i= 0;i< a.length;i++){
        if(b[i]){
            returnArray.push(a[i])
        }
    }
    return returnArray
}

var generalConcat = function(expected, myObj, myF, listOfFilters) {
    objs = myObj;
    if (expected === myObj.length) {
        if ( hasArrayElement(myF)) {
                    console.log("IAM ARRAY")

            generalConcat(expected, myObj, [].concat.apply([],myF), listOfFilters)
        } else {
            if(RESULTSX == ""){
                RESULTSX = myF;
                FILTERINGX =   filtermyF(myF, listOfFilters);
            }
            else {
                RESULTSY= myF
                FILTERINGY = filtermyF(myF, listOfFilters);
                FILTERSXY = FILTERINGX.map(function(x,i){return FILTERINGX[i] && FILTERINGY[i]});
                RESULTSX2 = filterGivenBoolean(RESULTSX,FILTERSXY);
                RESULTSY2 = filterGivenBoolean(RESULTSY, FILTERSXY);
                if(RESULTSX2.length !== RESULTSY2.length) {
                    alert("Variables have different length, plot probably makes no sense!!!")
                }
                if( canBeCoercedToNumeric(RESULTSX2) && canBeCoercedToNumeric(RESULTSY2)) {


                    d3Plots.scatterPlot(RESULTSX2.map(function (e, i) {
                        return [RESULTSX2[i], RESULTSY2[i]];
                    }));
                }
                else{
                    d3Plots.plotStringArray(RESULTSX2.map(function (e, i) {
                        return RESULTSX2[i] + "-" + RESULTSY2[i];
                    }), "twoDimensionPlot")

                }
            }
        }
    } else {
        setTimeout( function () {
            generalConcat(expected, myObj, myF, listOfFilters)
        }, 300)
    }
}

var bidimensionalQuery = function ( nameToParse1, nameToParse2 , filter1, filter2) {
    Results2D1  = [];
    Results2D2  = [];
    RESULTSX= "";
    if(typeof catalogSessionId == "undefined") {
        setTimeout(function () {
            bidimensionalQuery(nameToParse1, nameToParse2, filter1, filter2)
        }, 200);
    }
    else {
        jQuery.ajax({
            dataType: "json",
            url: "http://10.0.32.140:8080/opencga2/webservices/rest/v1/files/search/?sid=" +
            catalogSessionId +"&attributes.AnalysisType=Tiering&studyId=2&limit=10&",
            success: function (response) {
                SUCC = true;
                for(var i = 0; i < response.response[0].result.length; i++) {

                    getStuff2D(response.response[0].result[i].id, nameToParse1, nameToParse2);

                }

                generalConcat(10, Results2D1, Results2D1, filter1);
                generalConcat(10, Results2D2, Results2D2, filter2);

            }
        });
    }
};

var filterStuff = function (objectNameToPlot, objectToFilterName, object, filter) {
    var routeToPlot = tieringObject[objectNameToPlot].tieringRoute;
    var routeToFilter = tieringObject[objectToFilterName].tieringRoute;
    var myArray = getWhatIWant2(object, routeToFilter);
    var filteredArray = myArray.map(filter);
    if(inTheSameLevel(routeToPlot, routeToFilter)) {
        return filteredArray;
    } else {
        return collapseBooleanArray(filteredArray)
    }


};
var inTheSameLevel = function (routeA, routeB) {
    for(var i = 0 ; i < (routeA.length - 1); i++) {
        if(routeA[i] !== routeB[i]) {
            return false
        }
    }
    return true
};

var filter1 = [function(x){return x =="A"}];
var filter2 = [];
