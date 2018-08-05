// mock data
var now = Date.now();
var data1 = new Array(200).fill().map(function(_, idx) {
  return {
    date: new Date(now - idx * 15000),
    value: Math.random()
  };
});
var data2 = new Array(200).fill().map(function(_, idx) {
  return {
    date: new Date(now - idx * 15000),
    value: Math.random()
  };
});

// presets

var svg = d3.select("svg");
var canvas = document.querySelector("canvas"),
  context = canvas.getContext("2d");
var margin = { top: 20, right: 20, bottom: 30, left: 50 },
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom;

var parseTime = d3.timeParse("%d-%b-%y");

var x = d3.scaleTime().rangeRound([0, width]);

var y = d3.scaleLinear().rangeRound([height, 0]);

// render chart in svg

function renderSvg() {
  performance.mark("svg-1");
  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var area = d3
    .area()
    .x(function(d) {
      return x(d.date);
    })
    .y1(function(d) {
      return y(d.value);
    });

  x.domain(
    d3.extent(data1, function(d) {
      return d.date;
    })
  );
  y.domain([
    0,
    d3.max(data1, function(d) {
      return d.value;
    })
  ]);
  area.y0(y(0));
  performance.mark("svg-2");

  var path = g.append("path");
  performance.mark("svg-2-1");

  path.datum(data1);
  performance.mark("svg-2-2");

  path.attr("fill", "#efa35c");
  performance.mark("svg-2-3");

  path.attr("d", area);

  performance.mark("svg-3");

  var xAxis = g.append("g").attr("transform", "translate(0," + height + ")");

  performance.mark("svg-3-1");
  xAxis.call(d3.axisBottom(x));

  performance.mark("svg-4");

  var yAxis = g.append("g").call(d3.axisLeft(y));
  performance.mark("svg-4-1");
  yAxis
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em");
  performance.mark("svg-5");

  performance.measure("render-svg", "svg-1", "svg-5");
  performance.measure("preset-svg", "svg-1", "svg-2");
  performance.measure("append-path", "svg-2", "svg-2-1");
  performance.measure("datum-path", "svg-2-1", "svg-2-2");
  performance.measure("set-fill-attr", "svg-2-2", "svg-2-3");
  performance.measure("set-d-attr", "svg-2-3", "svg-3");
  performance.measure("render-path", "svg-2", "svg-3");
  performance.measure("render-axis", "svg-3", "svg-5");
  performance.measure("call-axisBottom", "svg-3-1", "svg-4");
  performance.measure("render-x-axis", "svg-3", "svg-4");
  performance.measure("call-axisLeft", "svg-4", "svg-4-1");
  performance.measure("render-y-axis", "svg-4", "svg-5");
}

// render chart in canvas

function xAxis() {
  var tickCount = 10,
    tickSize = 6,
    ticks = x.ticks(tickCount),
    tickFormat = x.tickFormat();

  performance.mark('canvas-3-1');

  context.beginPath();
  ticks.forEach(function(d) {
    context.moveTo(x(d), height);
    context.lineTo(x(d), height + tickSize);
  });
  context.strokeStyle = "black";
  context.stroke();

  performance.mark('canvas-3-2');

  context.textAlign = "center";
  context.textBaseline = "top";
  ticks.forEach(function(d) {
    context.fillText(tickFormat(d), x(d), height + tickSize);
  });
}

function yAxis() {
  var tickCount = 10,
    tickSize = 6,
    tickPadding = 3,
    ticks = y.ticks(tickCount),
    tickFormat = y.tickFormat(tickCount);

  performance.mark('canvas-4-1');

  context.beginPath();
  ticks.forEach(function(d) {
    context.moveTo(0, y(d));
    context.lineTo(-6, y(d));
  });
  context.strokeStyle = "black";
  context.stroke();

  context.beginPath();
  context.moveTo(-tickSize, 0);
  context.lineTo(0.5, 0);
  context.lineTo(0.5, height);
  context.lineTo(-tickSize, height);
  context.strokeStyle = "black";
  context.stroke();

  performance.mark('canvas-4-2');

  context.textAlign = "right";
  context.textBaseline = "middle";
  ticks.forEach(function(d) {
    context.fillText(tickFormat(d), -tickSize - tickPadding, y(d));
  });

  context.save();
  context.rotate(-Math.PI / 2);
  context.textAlign = "right";
  context.textBaseline = "top";
  context.fillText("Price (US$)", -10, 10);
  context.restore();
}

function renderCanvas() {
  performance.mark("canvas-1");

  var area = d3
    .area()
    .x(function(d) {
      return x(d.date);
    })
    .y0(height)
    .y1(function(d) {
      return y(d.value);
    })
    .context(context);

  context.translate(margin.left, margin.top);

  x.domain(
    d3.extent(data2, function(d) {
      return d.date;
    })
  );
  y.domain(
    d3.extent(data2, function(d) {
      return d.value;
    })
  );

  performance.mark("canvas-2");
  context.beginPath();
  area(data2);

  performance.mark("canvas-2-1");

  context.fillStyle = "#4ab8b8";
  context.strokeStyle = "#4ab8b8";
  context.fill();

  performance.mark("canvas-3");
  xAxis();

  performance.mark("canvas-4");
  yAxis();

  performance.mark("canvas-5");

  performance.measure("render-canvas", "canvas-1", "canvas-5");
  performance.measure("preset-canvas", "canvas-1", "canvas-2");
  performance.measure("datum-path", "canvas-2", "canvas-2-1");
  performance.measure("fill-path", "canvas-2-1", "canvas-3");
  performance.measure("render-path", "canvas-2", "canvas-3");
  performance.measure("render-axis", "canvas-3", "canvas-5");
  performance.measure("call-tickFormat", "canvas-3", "canvas-3-1");
  performance.measure('render-stroke', 'canvas-3-1', 'canvas-3-2');
  performance.measure('render-text', 'canvas-3-2', 'canvas-4');
  performance.measure("render-x-axis", "canvas-3", "canvas-4");
  performance.measure("call-tickFormat", "canvas-4", "canvas-4-1");
  performance.measure('render-stroke', 'canvas-4-1', 'canvas-4-2');
  performance.measure('render-text', 'canvas-4-2', 'canvas-5');
  performance.measure("render-y-axis", "canvas-4", "canvas-5");
}
