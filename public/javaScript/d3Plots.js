var d3Plots = (function () {
    return {
        scatterPlot: function (myData, chartDivId) {
            document.getElementById("twoDimensionPlot").innerHTML = "";
            var data = myData || [[5, 3], [10, 17], [15, 4], [2, 8], [1.3, 1.4]];
            var margin = {top: 20, right: 15, bottom: 60, left: 60}
                , width = 960 - margin.left - margin.right
                , height = 500 - margin.top - margin.bottom;

            var x = d3.scale.linear()
                .domain([0, d3.max(data, function (d) {
                    return d[0] * 1.1;
                })])
                .range([0, width]);

            var y = d3.scale.linear()
                .domain([0, d3.max(data, function (d) {
                    return d[1] * 1.1;
                })])
                .range([height, 0]);

            var chart = d3.select('#twoDimensionPlot')
                .append('svg:svg')
                .attr('width', width + margin.right + margin.left)
                .attr('height', height + margin.top + margin.bottom)
                .attr('class', 'chart')
                .attr('transform', 'translate(10,10)');

            var main = chart.append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
                .attr('width', width)
                .attr('height', height)
                .attr('class', 'main');

            // draw the x axis
            var xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom');

            main.append('g')
                .attr('transform', 'translate(0,' + height + ')')
                .attr('class', 'main axis date')
                .call(xAxis);

            // draw the y axis
            var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left');

            main.append('g')
                .attr('transform', 'translate(0,0)')
                .attr('class', 'main axis date')
                .call(yAxis);

            var g = main.append("svg:g");

            g.selectAll("scatter-dots")
                .data(data)
                .enter().append("svg:circle")
                .attr("cx", function (d, i) {
                    return x(d[0]);
                })
                .attr("color", function(d) {
                    return d3.scale.linear().domain([]);
                })
                .attr("cy", function (d) {
                    return y(d[1]);
                })
                .attr("r", 3);
        },


        plotStringArray: function(dataList, addTheElementId) {
            if( document.getElementById(addTheElementId).innerHTML == "" ) {
                var data = d3Plots.dataMethods.getThirtyMostCommon(dataList);
                // See D3 margin convention: http://bl.ocks.org/mbostock/3019563
                var margin = {top: 20, right: 40, bottom: 100, left: 50},
                    width = 1300 - margin.right - margin.left,
                    height = 800 - margin.top - margin.bottom;

                /*------------------------------------------------------------------------------
                 define SVG
                 Still confused about SVG? see Chapter 3.
                 The "g" element is used as a container for grouping objects. The SVG will be
                 in "lightgrey" background to help you visualize it.
                 See https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g for more info
                 ------------------------------------------------------------------------------*/
                var svg = d3.select("#" + addTheElementId)
                    .append("svg")
                    .attr({
                        "width": width + margin.right + margin.left,
                        "height": height + margin.top + margin.bottom
                    })
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.right + ")");


                /* -----------------------------------------------------------------------------
                 SCALE and AXIS are two different methods of D3. See D3 API Refrence for info on
                 AXIS and SCALES. See D3 API Refrence to understand the difference between
                 Ordinal vs Linear scale.
                 ------------------------------------------------------------------------------*/
                // define x and y scales
                var xScale = d3.scale.ordinal()
                    .rangeRoundBands([0, width], 0.2, 0.2);

                var yScale = d3.scale.linear()
                    .range([height, 0]);

                // define x axis and y axis
                var xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient("left");
                data.forEach(function (d) {
                    d.tag = d.tag;
                    d.gdp = +d.gdp;       // try removing the + and see what the console prints
                });

                // sort the gdp values
                data.sort(function (a, b) {
                    return b.gdp - a.gdp;
                });

                // Specify the domains of the x and y scales
                xScale.domain(data.map(function (d) {
                    return d.tag;
                }));
                yScale.domain([0, d3.max(data, function (d) {
                    return d.gdp;
                })]);

                svg.selectAll('rect')
                    .data(data)
                    .enter()
                    .append('rect')
                    .attr("height", 0)
                    .attr("y", height)
                    .transition().duration(700)
                    .delay(function (d, i) {
                        return i * 100;
                    })

                    .attr({

                        "x": function (d) {
                            return xScale(d.tag);
                        },
                        "y": function (d) {
                            return yScale(d.gdp);
                        },
                        "width": xScale.rangeBand(),
                        "height": function (d) {
                            return height - yScale(d.gdp);
                        }
                    })
                    .style("fill", function (d, i) {
                        return 'rgb(20, 20, ' + ((i * 30) + 100) + ')'
                    });


                svg.selectAll('text')
                    .data(data)
                    .enter()
                    .append('text')


                    .text(function (d) {
                        return d.gdp;
                    })
                    .attr({
                        "x": function (d) {
                            return xScale(d.tag) + xScale.rangeBand() / 2;
                        },
                        "y": function (d) {
                            return yScale(d.gdp) -15;
                        },
                        "font-family": 'sans-serif',
                        "font-size": '8px',
                        "font-weight": 'bold',
                        "fill": 'black',
                        "text-anchor": 'middle'
                    });

                // Draw xAxis and position the label
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .selectAll("text")
                    .attr("dx", "-.8em")
                    .attr("dy", ".25em")
                    .attr("transform", "rotate(-60)")
                    .style("text-anchor", "end")
                    .attr("font-size", "10px");

                // Draw yAxis and postion the label
                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("x", -height / 2)
                    .attr("dy", "-3em")
                    .style("text-anchor", "middle")

            }
            else {
                document.getElementById("oneDimensionPlot").innerHTML = "";
                setTimeout(function(){ return d3Plots.plotStringArray(dataList)}, 100);
            }
        },

        dataMethods: {
            getThirtyMostCommon: function (l) {
                var returnDict = {};
                var listToReturn = [];
                for (var i = 0; i < l.length; i++) {
                    if (returnDict[l[i]] == undefined) {
                        returnDict[l[i]] = {tag: l[i], gdp: 1};
                    }
                    else {
                        returnDict[l[i]].gdp++;
                    }
                }
                for (var i = 0; i < Object.keys(returnDict).length; i++) {
                    listToReturn.push(returnDict[Object.keys(returnDict)[i]]);

                }
                if (listToReturn.length > 30) {
                    maxList = [];
                    indexesToIgnore = [];
                    for (var i = 0; i < 30; i++) {
                        indexesToIgnore.push(d3Plots.dataMethods.getMaxBetter(listToReturn, indexesToIgnore));
                        maxList.push(listToReturn[i]);
                    }
                    var rest = d3Plots.dataMethods.sumListGDP(listToReturn, indexesToIgnore);
                    maxList.push({tag: "Rest N = " + rest, gdp: 0});
                }
                else {
                    maxList = listToReturn;
                }
                return maxList;
            },

            sumListGDP: function (listOfDict, indexesToIgnore) {
                var toReturn = 0;
                for (var i = 0; i < listOfDict.length; i++) {
                    if (d3Plots.dataMethods.isNotInIgnore(i, indexesToIgnore)) {
                        toReturn = toReturn + listOfDict[i].gdp;
                    }
                }
                return toReturn
            },

            getMaxBetter: function (numList, ignore) {
                var myMax = 0;
                for (var i = 0; i < numList.length; i++) {
                    if (d3Plots.dataMethods.isNotInIgnore(i, ignore)) {
                        if (numList[i].gdp > myMax) {
                            myIndex = i;
                        }
                    }
                }
                return myIndex;
            },

            isNotInIgnore: function (index, indexList) {
                for (var i = 0; i < indexList.length; i++) {
                    if (indexList[i] == index) {
                        return false;
                    }
                }
                return true;
            }
        }

    }
})();
