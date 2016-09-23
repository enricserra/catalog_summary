var logToCatalog = function () {
    jQuery.ajax({
        dataType: "json",
        url: "http://10.0.32.140:8080/opencga2/webservices/rest/v1/users/gel/login?password=GBc69mY9m86mSxv",
        data: "data",
        success: function (response) {
            catalogSessionId = response.response[0].result[0].sessionId;
        },
        error: ajaxError
    });
};

logToCatalog();

var makeAjaxRequest = function ( url, onSuccess, onError) {
    jQuery.ajax({
        dataType: "json",
        url: url,
        success: onSuccess,
        error: onError
    });
};

var ajaxError = function (errorInfo, responseObj) {
    if (errorInfo && errorInfo.exception)
        alert("Error: ERRINFO " + errorInfo.exception);
    else
        alert("Error: RESPONSEOBJ " + JSON.stringify(responseObj));
};


numberOfQueries = [];

plotSelected = function () {
    return unidimensionalQuery(document.getElementById("DropDownToPlot1D").value)
}

z= []

var getStuff = function (tieringId, nameToParse) {
    makeAjaxRequest("http://10.0.32.140:8080/opencga2/webservices/rest/v1/files/" + tieringId + "/content/?sid=" + catalogSessionId +"&"
        , (function (response) {
            z.push(response)
            numberOfQueries.push(getWhatIWant2(response, tieringObject[nameToParse].tieringRoute))
        })
        , ajaxError);
};

var functionsToApply = function (nameToParse){
    if (tieringObject[nameToParse].type == "string" ){
        return plotStringArray
    } else if (tieringObject[nameToParse].type == "number"){
        return plotNumeric
    }

}

var hasArrayElement = function(a){
    for (var i= 0; i < a.length; i++){
        if(a[i] instanceof Array){
            return true
        }
    }
    return false
};

var concatF = function(total, plotType, myF) {
    if (numberOfQueries.length == total) {
        if(hasArrayElement(myF)){
            return concatF(total,plotType, [].concat.apply([],myF))
        } else {
            return plotType(myF)
        }
    } else {
        setTimeout(function () {
            concatF(total, plotType, myF)
        }, 300)
    }
}

var unidimensionalQuery = function ( nameToParse ) {
    numberOfQueries = [];
    if(typeof catalogSessionId == "undefined") {
        setTimeout(function () { makeAnotherquery() }, 200);
    }
    else {
        jQuery.ajax({
            dataType: "json",
            url: "http://10.0.32.140:8080/opencga2/webservices/rest/v1/files/search/?sid=" +
            catalogSessionId +"&attributes.AnalysisType=Tiering&studyId=2&limit=10&",
            success: function (response) {
                for(var i = 0 ;i < response.response[0].result.length; i++) {
                    getStuff(response.response[0].result[i].id, nameToParse);
                }
                concatF(10, functionsToApply(nameToParse), numberOfQueries)

                //concatF(response.response[0].numTotalResults, functionsToApply(nameToParse))
            }
        });
    }
};
/*
var getStuff2D = function (tieringId, nameToParse1, nameToParse2) {
    makeAjaxRequest("http://10.0.32.140:8080/opencga2/webservices/rest/v1/files/" + tieringId + "/content/?sid=" + catalogSessionId +"&"
        , (function (response) {
            z.push(response)
            Results2D1.push(getWhatIWant2(response, tieringObject[nameToParse1].tieringRoute))
            Results2D2.push(getWhatIWant2(response, tieringObject[nameToParse2].tieringRoute))
        })
        , ajaxError);
};
*/

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
    console.log(listOfFilters)
    objs = myObj;
    if (expected === myObj.length) {
        document.getElementById("twoDimensionPlot").innerHTML ="";
        if ( hasArrayElement(myF)) {
            generalConcat(expected, myObj, [].concat.apply([],myF), listOfFilters)
        } else {
            if(RESULTSX == ""){
                RESULTSX = myF;
                FILTERINGX =   filtermyF(myF, listOfFilters);
            }
            else {
                RESULTSY= myF;
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
                    plotStringArray(RESULTSX2.map(function (e, i) {
                        return RESULTSX2[i] + "-" + RESULTSY2[i];
                    }))

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
    console.log("LINE 200")
    console.log(filter1)
    Results2D1  = [];
    Results2D2  = [];
    RESULTSX= ""
    if(typeof catalogSessionId == "undefined") {
        setTimeout(function () { bidimensionalQuery(nameToParse1, nameToParse2, filter1, filter2) }, 200);
    }
    else {
        jQuery.ajax({
            dataType: "json",
            url: "http://10.0.32.140:8080/opencga2/webservices/rest/v1/files/search/?sid=" +
            catalogSessionId +"&attributes.AnalysisType=Tiering&studyId=2&limit=10&",
            success: function (response) {

                for(var i = 0; i < response.response[0].result.length; i++) {

                    getStuff2D(response.response[0].result[i].id, nameToParse1, nameToParse2);

                }

                console.log("LINE 216");
                console.log(filter1);
                generalConcat(10, Results2D1, Results2D1, filter1);
                generalConcat(10, Results2D2, Results2D2, filter2);
                //concatF(response.response[0].numTotalResults, functionsToApply(nameToParse))
            }
        });
    }
};

var filter1 = [];
var filter2 = [];
bidimensionalQuery("position", "chromosome",filter2, filter1);

var isAtomic = function(a) {
    return !(typeof a == "object")
};

var isArray =function(a) {
    return (a instanceof Array);
};

var isAnObject = function (a) {
    return (a instanceof Object)
}


var getWhatIWant2 = function (a, b) {
    if ( isArray(a) ) {
        return (a.map(function (x) {
            return getWhatIWant2(x, b)
        }))
    }
    else if ( isAnObject(a) ) {
        return getWhatIWant2(a[b[0]], b.slice(1, b.length))
    } else {
        return a
    }
};

