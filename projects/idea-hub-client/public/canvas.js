document.addEventListener("DOMContentLoaded", function() {
  // CANVAS SET UP ****************************************
  var output = d3.select("#vis");
  var width = window.innerWidth;
  var height = window.innerHeight;

  output.attr("width", width).attr("height", height);
  var context = output.node().getContext("2d");

  function getMousePos(event) {
    var rect = output.node().getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }
  output.node().addEventListener(
    "mousemove",
    function(event) {
      mousePos = getMousePos(event);
    },
    false
  );
  var mousePos = { x: -1000, y: -1000 };

  // STEP SET UP ****************************************
  var stepNum = 2;

  // DOT SET UP ****************************************

  var dots = [];
  var numDots = height / 2.5;
  radius = 4;

  var lineDistance = 65;

  var xScale = d3
    .scaleLinear()
    .domain([0, numDots])
    .range([0, width]);
  var yScale = d3
    .scaleLinear()
    .domain([0, numDots])
    .range([0, height]);

  var colorRampNumDots = d3
    .scaleLinear()
    .domain([
      0,
      (numDots / 13) * 1,
      (numDots / 13) * 2,
      (numDots / 13) * 3,
      (numDots / 13) * 4,
      (numDots / 13) * 5,
      (numDots / 13) * 6,
      (numDots / 13) * 7,
      (numDots / 13) * 8,
      (numDots / 13) * 9,
      (numDots / 13) * 10,
      (numDots / 13) * 11,
      numDots
    ])
    .range([
      "#d7df23",
      "#8dc63f",
      "#009444",
      "#00a79d",
      "#27aae1",
      "#1c75bc",
      "#27aae1",
      "#fbb040",
      "#f7941e",
      "#f15a29",
      "#ef4136",
      "#be1e2d",
      "#ec008c"
    ]);
  var colorRampWidth = d3
    .scaleLinear()
    .domain([
      0,
      (width / 13) * 1,
      (width / 13) * 2,
      (width / 13) * 3,
      (width / 13) * 4,
      (width / 13) * 5,
      (width / 13) * 6,
      (width / 13) * 7,
      (width / 13) * 8,
      (width / 13) * 9,
      (width / 13) * 10,
      (width / 13) * 11,
      width
    ])
    .range([
      "#d7df23",
      "#8dc63f",
      "#009444",
      "#00a79d",
      "#27aae1",
      "#1c75bc",
      "#27aae1",
      "#fbb040",
      "#f7941e",
      "#f15a29",
      "#ef4136",
      "#be1e2d",
      "#ec008c"
    ]);

  var colorRampLines = d3
    .scaleLinear()
    .domain([0, lineDistance])
    .range(["rgba(51,51,51,0.5)", "rgba(51,51,51,0)"]);

  var colorRampLinesV2 = d3
    .scaleLinear()
    .domain([0, lineDistance])
    .range([0.5, 0]);

  for (var i = 0; i < numDots; i++) {
    //dots.push({x: (Math.random() * width) - radius, y: (Math.random() * height) - radius, direction: (Math.random() * (Math.PI * 2))});
    var randRadius = Math.random() * radius;
    dots.push({
      x: xScale(i),
      y: Math.random() * height,
      radius: randRadius,
      direction: Math.random() * (Math.PI * 2),
      speed: randRadius * 0.5
    });
  }

  var styles = [
    {
      radiusScale: 1
    },
    {
      radiusScale: 2
    },
    {
      radiusScale: 0
    }
  ];

  // DRAWING ****************************************

  function step(time) {
    context.clearRect(0, 0, width, height); // Clear canvas

    dots.forEach(function(d, i) {
      if (stepNum === 1) {
        d.direction = d.direction + (Math.random() * 0.1 - 0.05);
        d.x = d.x + Math.cos(d.direction) * d.speed;
        d.y = d.y + Math.sin(d.direction) * d.speed;
      } else if (stepNum === 2) {
        d.x = xScale(i);
        d.y =
          height / 2 +
          (d.radius * 50 - 25) -
          Math.sin(time * 0.0001 + d.x * 0.01) * (height / 6);
        //d.y = (height / 2) + ((d.radius * 50) - 25) - Math.cos((Math.cos((time * 0.0001) + d.x * 0.01) * (height / 6)));
      } else if (stepNum === 3) {
        d.x = width / 2;
        d.y = height / 2;
      }

      if (d.x > width + d.radius) {
        d.x = 0 - d.radius;
      }
      if (d.x < 0 - d.radius) {
        d.x = width + d.radius;
      }
      if (d.y > height + d.radius) {
        d.y = 0 - d.radius;
      }
      if (d.y < 0 - d.radius) {
        d.y = height + d.radius;
      }

      context.beginPath();
      context.arc(
        d.x,
        d.y,
        d.radius * styles[stepNum - 1].radiusScale,
        0,
        2 * Math.PI,
        false
      );
      context.fillStyle = "#8ff442";

      if (stepNum === 2) {
        context.fillStyle = colorRampNumDots(i);
        //context.fillStyle = colorRampWidth(d.x);
      }
      context.fill();
      context.closePath();

      // LINES
      dots.forEach(function(dot, i) {
        var distance = Math.sqrt(
          (d.x - dot.x) * (d.x - dot.x) + (d.y - dot.y) * (d.y - dot.y)
        );
        if (distance < lineDistance) {
          context.beginPath();
          context.moveTo(dot.x, dot.y);
          context.lineTo(d.x, d.y);
          context.strokeStyle = colorRampLines(distance);
          //context.strokeStyle = colorRampNumDots(i)
          context.stroke();
          context.closePath();
        }
      });
      var mouseDistance = Math.sqrt(
        (d.x - mousePos.x) * (d.x - mousePos.x) +
          (d.y - mousePos.y) * (d.y - mousePos.y)
      );
      if (mouseDistance < lineDistance) {
        context.beginPath();
        context.moveTo(mousePos.x, mousePos.y);
        context.lineTo(d.x, d.y);
        context.strokeStyle = colorRampLines(mouseDistance);
        context.stroke();
        context.closePath();
      }
    });
    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
});
