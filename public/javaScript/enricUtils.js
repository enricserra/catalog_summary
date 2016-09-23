var enricUtils = (function (){
    return {
        sort: {
            quickmiddleSort: (function () {
                "use strict";

                /**
                 * Quicksort algorithm. It's with complexity O(n log(n)).
                 * In this version of quicksort I use the middle element of the
                 * array for pivot.
                 */


                /**
                 * Quicksort algorithm
                 *
                 * @public
                 * @param {array} array Array which should be sorted.
                 * @return {array} Sorted array.
                 */

                /**
                 * Partitions the array in two parts by the middle elements.
                 * All elemnts which are less than the chosen one goes left from it
                 * all which are greater goes right from it.
                 *
                 * @param {array} array Array which should be partitioned
                 * @param {number} left Left part of the array
                 * @param {number} right Right part of the array
                 * @return {number}
                 */
                function partition(array, left, right) {
                    var pivot = array[(left + right) >>> 1];
                    while (left <= right) {
                        while (array[left] < pivot) {
                            left++;
                        }
                        while (array[right] > pivot) {
                            right--;
                        }
                        if (left <= right) {
                            var temp = array[left];
                            array[left++] = array[right];
                            array[right--] = temp;
                        }
                    }
                    return left;
                }

                /**
                 * Recursively calls itself with different values for
                 * left/right part of the array which should be processed
                 *
                 * @private
                 * @param {array} array Array which should be processed
                 * @param {number} left Left part of the array which should be processed
                 * @param {number} right Right part of the array which should be processed
                 */
                function quicksort(array, left, right) {
                    var mid = partition(array, left, right);
                    if (left < mid - 1) {
                        quicksort(array, left, mid - 1);
                    }
                    if (right > mid) {
                        quicksort(array, mid, right);
                    }
                }

                /**
                 * Quicksort's initial point
                 * @public
                 */
                return function (items) {
                    quicksort(items, 0, items.length - 1);
                    return items;
                };

            }()),

            arrayUnique: function (arr) {
                var result = [];
                for (var i = 0; i < arr.length; i++) {
                    if (result.indexOf(arr[i]) == -1) {
                        result.push(arr[i]);
                    }
                }
                return result
            },

            sortTable: function (tableId, columnNumber, ascending) {
                var rowStore = {};
                var columnValuesList = [];
                var myTable = document.getElementById(tableId);
                var tableRows = document.getElementById(tableId).rows;
                var isNumeric = (tableRows[0].cells[columnNumber].className.indexOf("non-numeric") == -1);
                while (tableRows.length > 1) {
                    if (isNumeric) {
                        var thisValue = Number(tableRows[1].cells[columnNumber].textContent);
                    }
                    else {
                        var thisValue = tableRows[1].cells[columnNumber].textContent;
                    }
                    if (rowStore[thisValue] == undefined) {

                        rowStore[thisValue] = [];
                        rowStore[thisValue].push(tableRows[1]);
                    }
                    else {
                        rowStore[thisValue].push(tableRows[1]);
                    }
                    myTable.deleteRow(1);
                    columnValuesList.push(thisValue);
                }

                sortedValues = enricUtils.sort.arrayUnique(enricUtils.sort.quickmiddleSort(columnValuesList));

                for (var i = 0; i < sortedValues.length; i++) {

                    if (ascending) {
                        for (var t = 0; t < rowStore[sortedValues[i]].length; t++) {
                            myTable.tBodies[0].insertRow(myTable.tBodies[0].rows.length);
                            myTable.tBodies[0].rows[myTable.tBodies[0].rows.length - 1].innerHTML = rowStore[sortedValues[i]][t].innerHTML;
                            myTable.tBodies[0].rows[myTable.tBodies[0].rows.length - 1].hidden = rowStore[sortedValues[i]][t].hidden;

                        }
                    }

                    else {
                        for (var t = 0; t < rowStore[sortedValues[sortedValues.length - 1 - i]].length; t++) {
                            myTable.tBodies[0].insertRow(myTable.tBodies[0].rows.length);

                            myTable.tBodies[0].rows[myTable.tBodies[0].rows.length - 1].innerHTML = rowStore[sortedValues[sortedValues.length - 1 - i]][t].innerHTML;
                            myTable.tBodies[0].rows[myTable.tBodies[0].rows.length - 1].hidden = rowStore[sortedValues[sortedValues.length - 1 - i]][t].hidden;
                        }

                    }
                }
            }
        },

        filter: {
            /*
             Set of utils for filtering tables
             */


            /**
             * hide/show an element based on its id
             *
             * @public
             *  add the onclick events to the any element of class filterButton
             *
             */
            addOnClickEvent: function () {
                jQuery('.filterButton').on('click', function () {
                    var _this = this;
                    showDialog({
                        title: 'Filters:',
                        text: enricUtils.filter._filterDialogText,
                        negative: {
                            title: 'Cancel'
                        },
                        positive: {
                            title: 'Filter',
                            onClick: function (e) {
                                var column = enricUtils.filter.getColumnId(_this);
                                var filtersToApply = enricUtils.filter.getFilters();
                                enricUtils.filter.filterTable(column.split("_")[0], column.split("_")[1], filtersToApply);
                                document.getElementById(column.split("_")[0] + "_clearFilters").hidden = false;
                            }
                        }
                    })
                });
            },

            /**
             * Html content for the filter dialog
             *
             * @public
             *
             */
            _filterDialogText : '<br><br>&nbsp&nbsp&nbspGT (>) <input type="text" style="z-index:10000" id="filterGT">' +
            '<br><br>&nbsp&nbsp&nbspLT (<)<input type="text" style="z-index:10000" id="filterLT"><br><br>' +
            '&nbsp&nbsp&nbspEQ (=)<input type="text" style="z-index:10000" id="filterEQ"><br><br>' +
            '&nbsp&nbsp&nbspContains <input type="text" style="z-index:10000" id="filterContains"><br><br>' +
            '&nbsp&nbsp&nbspNOT Contain <input type="text" style="z-index:10000" id="filterNotContains"><br><br>' +
            '&nbsp&nbsp&nbspGT|EQ (>=)<input type="text" style="z-index:10000" id="filterGTEQ"><br><br>' +
            '&nbsp&nbsp&nbspLT|EQ (<=)<input type="text" style="z-index:10000" id="filterLTEQ"><br><br>',

            /**
             * clears the filters applied to a table (makes all elements hidden = false)
             * does not have a map because html object array does not work with map, so for loop is used
             * @public
             *
             */
            clearFilters: function (tableId) {
                enricUtils.filter.makeAllRowsVisible(tableId);
                enricUtils.filter.makeClearFiltersButtonInvisible(tableId);
            },

            /**
             * Makes CLEAR FILTERS button invisible after filters have been cleared
             * @public
             *
             */
            makeClearFiltersButtonInvisible: function (tableId) {
                document.getElementById(enricUtils.filter.constructFilterButtonId(tableId)).hidden = true;
            },


            constructFilterButtonId: function (tableId) {
                return tableId + "_clearFilters"
            },


            /**
             * Makes all rows in a given table visible (actually clears the filters applied)
             * @public
             *
             * @param {string} t id of the table as is in the DOM
             */
            makeAllRowsVisible: function (t) {
                var myTable = document.getElementById(t);
                var i;
                var d;
                d = myTable.rows.length;
                for (i = 0; i < d; i += 1) {
                    myTable.rows[i].hidden = false;
                }
            },


            /**
             * returns Id of a column using for
             * @public
             *
             * @param {object} b html object column
             */
            getColumnId: function (b) {
                return b.parentNode.attributes.for.value;
            },


            getFilters: function () {
                return [document.getElementById("filterGT").value, document.getElementById("filterLT").value,
                    document.getElementById("filterEQ").value, document.getElementById("filterContains").value,
                    document.getElementById("filterNotContains").value, document.getElementById("filterGTEQ").value,
                    document.getElementById("filterLTEQ").value]
            },

            filterTable: function (tableId, tableColumn, filtersToApply) {
                var mytable = document.getElementById(tableId);
                var filtersFilled = enricUtils.filter.discardEmpty(filtersToApply);
                var filterFunctions = filtersFilled[0];
                filterValues = filtersFilled[1];
                for (var i = 1; i < mytable.rows.length; i++) {
                    var tableValue = mytable.rows[i].cells[tableColumn].textContent;
                    for (var t = 0; t < filterFunctions.length; t++) {
                        formattedValues = enricUtils.filter.formatValues(tableValue, filterValues[t]);
                        tableValue = formattedValues[0];
                        filterValue = formattedValues[1];
                        if (!(filterFunctions[t](tableValue, filterValue))) {
                            mytable.rows[i].hidden = true;
                        }
                    }
                }
            },
            formatValues: function (value1, value2) {
                if (!isNaN(Number(value1)) && !isNaN(Number(value2))) {
                    return [Number(value1), Number(value2)];
                }
                return [value1.toLowerCase(), value2.toLowerCase()];
            },
            /**
             * Functions available for filtering
             *
             * @public
             *
             */
            filteringFunctions: [
                function (a, b) {
                    return a > b
                },
                function (a, b) {
                    return a < b
                },
                function (a, b) {
                    return a === b
                },
                function (a, b) {
                    return String(a).indexOf(b) > -1
                },
                function (a, b) {
                    return String(a).indexOf(b) === -1
                },
                function (a, b) {
                    return a >= b
                },
                function (a, b) {
                    return a <= b
                }],

            /**
             * Discard empty filters
             *
             * @public
             * @param {array} arr array of filters
             *
             */
            discardEmpty: function (arr) {
                var ops = enricUtils.filter.filteringFunctions.filter(function (a, i) {
                    return arr[i]  !== ""});
                var vals = arr.filter(function (a) {
                    return a !== ""});
                return [ops, vals]
            },
            countElementsInRow: function (tableId, rowNumber) {
                return jQuery("#" + tableId + " >tbody >tr")[rowNumber].cells.length
            }

        },

        dom: {
            //TODO move to jQuery patterns
            getLastRow: function (table) {
                return table.rows[table.rows.length - 1];
            },

            getLastCell: function (row) {
                return row.cells[row.cells.length - 1];
            },

            appendRowToTable: function (table, row) {
                table.tBodies[0].insertRow();
                if (row.tagName == "TR") {
                    var rowToInsert = row;
                }
                else {
                    var rowToInsert = enricUtils.dom.createElement("tr", {innerHTML : row});
                }
                enricUtils.dom.getLastRow(table.tBodies[0]).innerHTML = rowToInsert.innerHTML;
            },

            appendCellToRow: function (row, cell) {
                if (cell.tagName == "TD") {
                    var cellToInsert = cell;
                }
                else {
                    var cellToInsert = document.createElement("td");
                    cellToInsert.innerHTML = cell;
                }
                row.appendChild(cellToInsert);
            },

            createElement: function (n, o) {
                var i, k, v, d, a;
                a = document.createElement(n);
                d = Object.keys(o).length;
                for (i = 0; i < d; i++) {
                    k = Object.keys(o)[i];
                    v = o[Object.keys(o)[i]];
                    a[k] = v;
                }
                return a;
            },

            hideShowElement: function (a) {
                //hideShows an element byID
                return jQuery("#" + a).attr("hidden", !jQuery("#" + a).attr("hidden"));
            }

        },

        array: {

            concat: function(a,b) {
                return a + b;
            },

            getSpecific: function(b) {
                return function(a) {
                    return a[b]
                }
            }
        },

        dict:{

        },
        login: {

            getLoginData: function () {
                return {
                    "username": jQuery("#username").val(),
                    "password": jQuery("#userpass").val()
                }
            },

            logIntoInterpretationDispatchLDAP: function (callback) {
                jQuery.ajax({
                    dataType: "json",
                    url: variables.interpretationTokenUrl,
                    data: enricUtils.login.getLoginData(),
                    method: "POST",
                    success: function (response) {
                        // Store
                        localStorage.setItem("dispatchAPIToken", response.token);
                        return callback();
                    },
                    error: function (err) {
                        enricUtils.login.showLogin(callback, JSON.stringify(err.responseJSON.non_field_errors[0]).replace("\"","","g"))
                    }
                });
            },

            showLogin: function(callback, text) {
                jQuery(document).ready(function() {
                    window.addEventListener("keypress", function(e){

                        if (e.key == "Enter") {
                            document.getElementById("positive").click();
                        }
                    }, false);
                });
                showDialog({
                    title: 'Please log in ' + text,
                    cancelable: false,
                    text: enricUtils.login.dialogText,
                    positive: {
                        title: 'Login',
                        onClick: function () {
                            enricUtils.login.logIntoInterpretationDispatchLDAP(callback)
                        }
                    }
                });
            },

            /**
             * Dialog html for the Login dialog
             * @public
             *
             */
            dialogText: ( function () {
                return '<div class="mdl-card mdl-shadow--6dp">' +
                    '<div class="mdl-card__title mdl-color--primary mdl-color-text--white">' +
                    '<h2 class="mdl-card__title-text" title="LDAP Credentials"> Log in </h2>' +
                    '</div>' +
                    '<div class="mdl-card__supporting-text">' +
                    '<form action="#">' +
                    '<div class="mdl-textfield mdl-js-textfield">' +
                    '<input class="mdl-textfield__input" type="text" style="text-align:center" id="username" />' +
                    '<label class="mdl-textfield__label" for="username"> Username </label>' +
                    '</div>' +
                    '<div class="mdl-textfield mdl-js-textfield">' +
                    '<input class="mdl-textfield__input" type="password" style="text-align:center"  id="userpass" />' +
                    '<label class="mdl-textfield__label" for="userpass"> Password </label>' +
                    '</div>' +
                    '</form>' +
                    '</div>' +
                    '</div><br><br><p> Use your LDAP credentials to log in. </p>'

            }())
        }
    }

})();