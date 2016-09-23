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
            catalogSessionId +"&attributes.AnalysisType=Tiering&studyId=2&",
            success: function (response) {
                for(var i = 0 ;i < response.response[0].result.length; i++) {
                    getStuff(response.response[0].result[i].id, nameToParse);
                }
                concatF(response.response[0].result.length, functionsToApply(nameToParse), numberOfQueries, "1DPlot")

                //concatF(response.response[0].numTotalResults, functionsToApply(nameToParse))
            }
        });
    }
};




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

