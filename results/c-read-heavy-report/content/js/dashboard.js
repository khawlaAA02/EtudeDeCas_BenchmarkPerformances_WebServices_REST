/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 0.0, "KoPercent": 100.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "GET /items/28"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/29"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/26"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/27"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/24"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/25"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/22"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/23"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/20"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/21"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/60"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/19"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/17"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/18"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/15"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/59"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/16"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/13"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/57"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/14"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/58"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/11"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/55"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/12"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/56"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/53"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/10"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/54"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/51"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/52"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/50"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/2"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/3"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/1"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/48"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/49"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/6"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/46"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/7"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/47"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/4"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/44"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/5"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/45"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/42"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/43"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/8"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/40"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/9"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/41"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/39"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/37"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/38"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/35"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/36"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/33"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/34"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/31"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/32"], "isController": false}, {"data": [0.0, 500, 1500, "GET /items/30"], "isController": false}, {"data": [0.0, 500, 1500, "HTTP Request"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 140, 140, 100.0, 2.6928571428571435, 0, 134, 1.0, 3.0, 4.0, 83.98000000000042, 7.519604683639489, 19.31304718551939, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["GET /items/28", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 1284.1796875, 0.0], "isController": false}, {"data": ["GET /items/29", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 1284.1796875, 0.0], "isController": false}, {"data": ["GET /items/26", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/27", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/24", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/25", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 856.1197916666666, 0.0], "isController": false}, {"data": ["GET /items/22", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/23", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/20", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/21", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 1284.1796875, 0.0], "isController": false}, {"data": ["GET /items/60", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/19", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/17", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/18", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/15", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 1284.1796875, 0.0], "isController": false}, {"data": ["GET /items/59", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/16", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/13", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 856.1197916666666, 0.0], "isController": false}, {"data": ["GET /items/57", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/14", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/58", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 1284.1796875, 0.0], "isController": false}, {"data": ["GET /items/11", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 1284.1796875, 0.0], "isController": false}, {"data": ["GET /items/55", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 1284.1796875, 0.0], "isController": false}, {"data": ["GET /items/12", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 1284.1796875, 0.0], "isController": false}, {"data": ["GET /items/56", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/53", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/10", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/54", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 1284.1796875, 0.0], "isController": false}, {"data": ["GET /items/51", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 1284.1796875, 0.0], "isController": false}, {"data": ["GET /items/52", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/50", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/2", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/3", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 856.1197916666666, 0.0], "isController": false}, {"data": ["GET /items/1", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 1284.1796875, 0.0], "isController": false}, {"data": ["GET /items/48", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/49", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 856.1197916666666, 0.0], "isController": false}, {"data": ["GET /items/6", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 1284.1796875, 0.0], "isController": false}, {"data": ["GET /items/46", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/7", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/47", 1, 1, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["GET /items/4", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/44", 1, 1, 100.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, Infinity, Infinity, NaN], "isController": false}, {"data": ["GET /items/5", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 1284.1796875, 0.0], "isController": false}, {"data": ["GET /items/45", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/42", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 856.1197916666666, 0.0], "isController": false}, {"data": ["GET /items/43", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 1284.1796875, 0.0], "isController": false}, {"data": ["GET /items/8", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 1284.1796875, 0.0], "isController": false}, {"data": ["GET /items/40", 1, 1, 100.0, 12.0, 12, 12, 12.0, 12.0, 12.0, 12.0, 83.33333333333333, 214.02994791666666, 0.0], "isController": false}, {"data": ["GET /items/9", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 856.1197916666666, 0.0], "isController": false}, {"data": ["GET /items/41", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 1284.1796875, 0.0], "isController": false}, {"data": ["GET /items/39", 1, 1, 100.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 642.08984375, 0.0], "isController": false}, {"data": ["GET /items/37", 1, 1, 100.0, 4.0, 4, 4, 4.0, 4.0, 4.0, 4.0, 250.0, 642.08984375, 0.0], "isController": false}, {"data": ["GET /items/38", 1, 1, 100.0, 5.0, 5, 5, 5.0, 5.0, 5.0, 5.0, 200.0, 513.671875, 0.0], "isController": false}, {"data": ["GET /items/35", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/36", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/33", 1, 1, 100.0, 1.0, 1, 1, 1.0, 1.0, 1.0, 1.0, 1000.0, 2568.359375, 0.0], "isController": false}, {"data": ["GET /items/34", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 1284.1796875, 0.0], "isController": false}, {"data": ["GET /items/31", 1, 1, 100.0, 3.0, 3, 3, 3.0, 3.0, 3.0, 3.0, 333.3333333333333, 856.1197916666666, 0.0], "isController": false}, {"data": ["GET /items/32", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 1284.1796875, 0.0], "isController": false}, {"data": ["GET /items/30", 1, 1, 100.0, 2.0, 2, 2, 2.0, 2.0, 2.0, 2.0, 500.0, 1284.1796875, 0.0], "isController": false}, {"data": ["HTTP Request", 80, 80, 100.0, 3.3125000000000004, 0, 134, 1.0, 2.9000000000000057, 3.950000000000003, 134.0, 4.296916962079708, 11.036026963153938, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 140, 100.0, 100.0], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 140, 140, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 140, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["GET /items/28", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/29", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/26", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/27", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/24", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/25", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/22", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/23", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/20", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/21", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/60", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/19", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/17", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/18", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/15", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/59", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/16", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/13", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/57", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/14", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/58", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/11", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/55", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/12", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/56", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/53", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/10", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/54", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/51", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/52", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/50", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/2", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/3", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/1", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/48", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/49", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/6", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/46", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/7", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/47", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/4", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/44", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/5", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/45", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/42", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/43", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/8", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/40", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/9", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/41", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/39", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/37", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/38", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/35", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/36", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/33", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/34", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/31", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/32", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["GET /items/30", 1, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HTTP Request", 80, 80, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to localhost:8080 [localhost/127.0.0.1, localhost/0:0:0:0:0:0:0:1] failed: Connection refused: connect", 80, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
