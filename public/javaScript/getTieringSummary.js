
var summarizeObject = function(myObject, whereToSave) {
    var resultObject = {};

    if(myObject === null){
        if(typeof whereToSave[thisKey] == "undefined") {
            whereToSave[thisKey] = {values: [null], children: {}};
        }
    }
    else {
        for (var i = 0; i < Object.keys(myObject).length; i++) {
            var thisKey = Object.keys(myObject)[i];
            var thisValue = myObject[thisKey];
            if (typeof whereToSave[thisKey] == "undefined") {
                whereToSave[thisKey] = {values: [], children: {}};
            }
            if (isAtomic(thisValue)) {
                whereToSave[thisKey].values.push(thisValue)
            }
            else {
                if (isArray(thisValue)) {
                    for (var t = 0; t < thisValue.length; t++) {
                        summarizeObject(thisValue[t], whereToSave[thisKey].children)
                    }
                }
                else {
                    summarizeObject(thisValue, whereToSave[thisKey].children)
                }
            }
        }
    }
};


var isAtomic = function(a){
    return !(typeof a == "object")
};

var isArray =function (a) {
    return (a instanceof Array);
};