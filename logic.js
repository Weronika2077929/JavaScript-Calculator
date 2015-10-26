var box = document.getElementById('display1');
var operators =['+','-','*','/','^','÷'];
var dotAdded = false;
var coordinates = new Array();
var distnaces = new Array();
var idTable = new Array();
var colors = {design1: "red", design2:"blue", design3:"purple"};
var color = colors.design1;
var errorDict = {design1: 0, design2: 0, design3: 0};
var currentDesign;
var clickDict = {design1: 0, design2: 0, design3: 0};


$(document).ready(function(e){
    //start with two calcs hidden
    $("#calculator2").hide();
    $("#calculator3").hide();
    color = colors.design1;
    box.value = "";
    currentDesign = "design1";
});
$("#btn1").click(function () {
        $("#calculator1").show();
        $("#calculator2").hide();
        $("#calculator3").hide();
    box = document.getElementById('display1');
    color = colors.design1;
    dotAdded = false;
    box.value = "";
    currentDesign = "design1";
});
$("#btn2").click(function () {
        $("#calculator1").hide();
        $("#calculator2").show();
        $("#calculator3").hide();
    box = document.getElementById('display2');
    color = colors.design2;
    dotAdded = false;
    box.value = "";
    currentDesign = "design2";
});
$("#btn3").click(function () {
        $("#calculator1").hide();
        $("#calculator2").hide();
        $("#calculator3").show();
    box = document.getElementById('display3');
    color = colors.design3;
    dotAdded = false;
    box.value = "";
    currentDesign = "design3";
});

$(".calculator").click(function (i) {
   printMousePos(i);
});



function printMousePos(e) {
    var cursorX = e.clientX;
    var cursorY = e.clientY;
    var time = new Date();
    time = time.getTime();

    var button = document.elementFromPoint(cursorX,cursorY);
    clickCount();
    if(button.value === undefined){
        errorCount();
    }
    else {
        var clickData = {x: cursorX, y: cursorY, time: time, buttonWidth: button.offsetWidth};
        coordinates.push(clickData);
        if (button.value == '=') {
            d3.select('svg').remove();
            d3.select('svg').remove();
            fittsLaw();
            //var errorList = [{name: "design 1", counter: errorDict.design1 , color:"red"},
            //    {name: "design 2", counter: errorDict.design2, color: "blue"},
            //    {name: "design 3", counter: errorDict.design3, color: "purple"} ];
            //console.log(errorList[0].counter + " " + errorList[1].counter + " " + errorList[2].counter);
            //barChart(errorList);
            var errorList = [errorDict.design1, errorDict.design2, errorDict.design3];
            var clickList = [clickDict.design1, clickDict.design2, clickDict.design3];
            multiBar(errorList, clickList);
        }
        else if(button.value == '<--'){
            errorCount();
        }
    }
}

//document.addEventListener("click", printMousePos);

function addtoscreen(x){
    //console.log(x);
    //checking if there are no two consecutive operators or operator is not on the begining
    if(operators.indexOf(x)> -1){
        var lastChar = box.value[box.value.length - 1];
        if(box.value != '' && operators.indexOf(lastChar) == -1){
            box.value +=x;
        }
        //allow - on the beginning of the expression
        else if(x == '-' && box.value == ''){
            box.value += x;
        }
        // replace the last operator with the new one
        else if( box.value != '' && operators.indexOf(lastChar) != -1){
            box.value = box.value.replace(/.$/,x);
        }
        dotAdded = false;
    }
    // only one dot might be added to represent a decimal number
    else if(x == '.'){
        if(!dotAdded){
            box.value += x;
            dotAdded = true;
        }
    }
    else {
        box.value += x;
    }
    if(x== 'c') {
        box.value = '';
    }

}

function answer(){

    x=box.value;
    var lastChar = x[x.length - 1];

    // deleting the last operator if there is no value following it
    if(operators.indexOf(lastChar) > -1 || lastChar == '.') {
        x = x.replace(/.$/, '');
    }
    if(x.indexOf('ln')>-1){
        x = x.replace(/ln/g, 'log');
    }
    if(x.indexOf('log')>-1){
        x = x.replace(/log/g, 'log10');
    }
    if(x.indexOf('π')>-1){
        x = x.replace(/π/g,'PI');
    }
    if(x.indexOf('÷')>-1){
        x = x.replace(/÷/g,'/');
    }
    x = math.eval(x);
    box.value=x;
    if (box.value.indexOf('.')>-1){
        dotAdded = true;
    }
    else {
        dotAdded = false;
    }
}

function backspace(){
    x=box.value;
    box.value = x.substr(0, x.length-1);
}

function fittsLaw(){
    for (i = 1; i < coordinates.length; i++ ){

        data1 = coordinates[i-1];
        data2 = coordinates[i];
        console.log(data1);
        console.log(data2);

        x1 = data1.x;
        y1 = data1.y;
        t1 = data1.time;
        x2 = data2.x;
        y2 = data2.y;
        t2 = data2.time;
        time = (t2 - t1)/1000.0;

        var distnace = math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
        distnaces.push({distance: distnace, time: time, buttonWidth: data1.buttonWidth});
    }
    console.log(distnaces[0].distance);
    for( i=0; i < distnaces.length; i++){
        d = distnaces[i].distance;
        width = distnaces[i].buttonWidth;
        ID = Math.log2(d/width + 1);
        time = distnaces[i].time;
        console.log("time "+ time + " id "+ ID);
        console.log(color);
        idTable.push({"x": ID, "y": time, "color": color});
    }
    console.log(idTable);
    coordinates = [];
    distnaces = [];


    var margin = {top: 20, right: 15, bottom: 60, left: 60}
        , width = 960 - margin.left - margin.right
        , height = 500 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .domain([0,d3.max(idTable, function(d) {return d.x;})])
        .range([0,width]);

    var y = d3.scale.linear()
        .domain([0,d3.max(idTable, function(d) {return d.y;})])
        .range([height,0]);

    var chart = d3.select('#graph')
        .append('svg:svg')
        .attr('width', width + margin.right + margin.left)
        .attr('height', height + margin.top + margin.bottom)
        .attr('class', 'chart')

    var main = chart.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'main')

    // draw the x axis
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient('bottom')
        .innerTickSize(-height)
        .outerTickSize(0)
        .tickPadding(10);

    main.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'main axis date')
        .call(xAxis);

    // draw the y axis
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .innerTickSize(-width)
        .outerTickSize(0)
        .tickPadding(10);

    main.append('g')
        .attr('transform', 'translate(0,0)')
        .attr('class', 'main axis date')
        .call(yAxis);

    var g = main.append("svg:g");

    g.selectAll("scatter-dots")
        .data(idTable)
        .enter().append("svg:circle")
        .attr("cx", function (d,i) { return x(d.x); } )
        .attr("cy", function (d) { return y(d.y); } )
        .style("fill", function (d) { return d.color; } )
        .attr("r", 8);

 }

function errorCount(){
    if(currentDesign == "design1"){
        errorDict.design1++;
    }
    else if(currentDesign == "design2"){
        errorDict.design2++;
    }
    else{
        errorDict.design3++;
    }
    console.log(errorDict);
}

function clickCount(){
    if(currentDesign == "design1"){
        clickDict.design1++;
    }
    else if(currentDesign == "design2"){
        clickDict.design2++;
    }
    else{
        clickDict.design3++;
    }
    console.log(errorDict);
}


//// BAR CHART

function barChart(data) {
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .innerTickSize(-width)
        .tickFormat(d3.format("d"));

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        x.domain(data.map(function(d) { return d.name; }));
        y.domain([0, d3.max(data, function(d) { return d.counter; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Errors");


        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.name); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.counter); })
            .attr("height", function(d) { return height - y(d.counter); })
            .style("fill" , function(d) {return d.color});

}




/// multiple bar

function multiBar(errorList, clickList){
console.log(clickList);
    var data = {
    labels: [
        'design 1', 'design 2', 'design 3'
    ],
    series: [
        {
            label: 'errors',
            values: errorList
        },
        {
            label: 'all clicks',
            values: clickList
        }]
};

    var chartWidth       = 600,
        barHeight        = 50,
        groupHeight      = barHeight * data.series.length,
        gapBetweenGroups = 10,
        spaceForLabels   = 150,
        spaceForLegend   = 150;

// Zip the series data together (first values, second values, etc.)
    var zippedData = [];
    for (var i=0; i<data.labels.length; i++) {
        for (var j=0; j<data.series.length; j++) {
            zippedData.push(data.series[j].values[i]);
        }
    }

// Color scale
    var color = d3.scale.category20();
    var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

    var x = d3.scale.linear()
        .domain([0, d3.max(zippedData)])
        .range([0, chartWidth]);

    var y = d3.scale.linear()
        .range([chartHeight + gapBetweenGroups, 0]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .tickFormat('')
        .tickSize(0)
        .orient("left");

// Specify the chart area and dimensions
    var chart = d3.select("#graph3")
        .append('svg:svg')
        .attr("width", spaceForLabels + chartWidth + spaceForLegend)
        .attr("height", chartHeight);

// Create bars
    var bar = chart.selectAll("g")
        .data(zippedData)
        .enter().append("g")
        .attr("transform", function(d, i) {
            return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i/data.series.length))) + ")";
        });

// Create rectangles of the correct width
    bar.append("rect")
        .attr("fill", function(d,i) { return color(i % data.series.length); })
        .attr("class", "bar")
        .attr("width", x)
        .attr("height", barHeight - 1);

// Add text label in bar
    bar.append("text")
        .attr("x", function(d) { return x(d); })
        .attr("y", barHeight / 2)
        .attr("fill", "red")
        .attr("dy", ".35em")
        .text(function(d) { return d; });

// Draw labels
    bar.append("text")
        .attr("class", "label")
        .attr("x", function(d) { return - 80; })
        .attr("y", groupHeight / 2)
        .attr("dy", ".35em")
        .text(function(d,i) {
            if (i % data.series.length === 0)
                return data.labels[Math.floor(i/data.series.length)];
            else
                return ""});

    chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups/2 + ")")
        .call(yAxis);

// Draw legend
    var legendRectSize = 18,
        legendSpacing  = 4;

    var legend = chart.selectAll('.legend')
        .data(data.series)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
            var height = legendRectSize + legendSpacing;
            var offset = -gapBetweenGroups/2;
            var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
            var vert = i * height - offset;
            return 'translate(' + horz + ',' + vert + ')';
        });

    legend.append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', function (d, i) { return color(i); })
        .style('stroke', function (d, i) { return color(i); });

    legend.append('text')
        .attr('class', 'legend')
        .attr('x', legendRectSize + legendSpacing)
        .attr('y', legendRectSize - legendSpacing)
        .text(function (d) { return d.label; });
}
