var tieringObject = {

    reference: {type : "string", tieringRoute: ["reference"]},
    alternate: {type : "string", tieringRoute: ["alternate"]},
    comments: {type : "string", tieringRoute: ["comments"]},
    position: {type : "number", tieringRoute: ["position"]},
    additionalNumericVariantAnnotation: {type : "number", tieringRoute: ["additionalNumericVariantAnnotation"]},
    chromosome: {type : "string", tieringRoute: ["chromosome"]},
    dbSNPId: {type : "string", tieringRoute: ["dbSNPId"]},

    copyNumber: {type : "string", tieringRoute: ["calledGenotypes", "copyNumber"]},
    depthAlternate: {type : "number", tieringRoute: ["calledGenotypes", "depthAlternate"]},
    depthReference: {type : "number", tieringRoute: ["calledGenotypes", "depthReference"]},
    gelId: {type : "string", tieringRoute: ["calledGenotypes", "gelId"]},
    genotype: {type : "string", tieringRoute: ["calledGenotypes", "genotype"]},
    phaseSet: {type : "string", tieringRoute: ["calledGenotypes", "phaseSet"]},
    sampleId: {type : "string", tieringRoute: ["calledGenotypes", "sampleId"]},

    OLD_VARIANT: {type: "string", tieringRoute: ["additionalTextualVariantAnnotation", "OLD_VARIANT"]},


    eventJustification: {type : "string", tieringRoute: ["reportEvents", "eventJustification"]},
    fullyExplainsPhenotype: {type : "string", tieringRoute: ["reportEvents", "fullyExplainsPhenotype"]},
    groupOfVariants: {type : "string", tieringRoute: ["reportEvents", "groupOfVariants"]},
    modeOfInheritance: {type : "string", tieringRoute: ["reportEvents", "modeOfInheritance"]},
    panelName: {type : "string", tieringRoute: ["reportEvents", "panelName"]},
    panelVersion: {type : "string", tieringRoute: ["reportEvents", "panelVersion"]},
    penetrance: {type : "string", tieringRoute: ["reportEvents", "penetrance"]},
    phenotype: {type : "string", tieringRoute: ["reportEvents", "phenotype"]},
    reportEventId: {type : "string", tieringRoute: ["reportEvents", "reportEventId"]},
    score: {type : "number", tieringRoute: ["reportEvents", "score"]},
    tier: {type : "string", tieringRoute: ["reportEvents", "tier"]},
    variantClassification: {type : "string", tieringRoute: ["reportEvents", "variantClassification"]},
    vendorSpecificScores: {type : "string", tieringRoute: ["reportEvents", "vendorSpecificScores"]},

        ensemblId: {type : "string", tieringRoute: ["reportEvents", "genomicFeature", "ensemblId"]},
        featureType: {type : "string", tieringRoute: ["reportEvents", "genomicFeature", "featureType"]},

            HGNC: {type : "string", tieringRoute: ["reportEvents", "genomicFeature", "ids", "HGNC"]},

    GitVersionControl: {type : "string", tieringRoute: ["versionControl", "GitVersionControl"]}

};


accessObject = function (objectRoute, object) {
    b = object;
    for(var i = 0;i < objectRoute.length; i++) {
        b =  b[objectRoute[i]];
    }
    return b
}