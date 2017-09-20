// from https://codepen.io/AshKyd/pen/JKGVmY

var CANVAS_WIDTH = 800
var CANVAS_HEIGHT = 800

var blockSize = 20
var mouseLoc = [-1, -1]

var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')

function shadeColor (color, percent) {
  color = color.substr(1)
  var num = parseInt(color, 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
}

function drawCube (x, y, wx, wy, h, color) {
  context.beginPath()
  context.moveTo(x, y)
  context.lineTo(x - wx, y - wx * 0.5)
  context.lineTo(x - wx, y - h - wx * 0.5)
  context.lineTo(x, y - h * 1)
  context.closePath()
  context.fillStyle = shadeColor(color, -10)
  context.strokeStyle = color
  context.stroke()
  context.fill()

  context.beginPath()
  context.moveTo(x, y)
  context.lineTo(x + wy, y - wy * 0.5)
  context.lineTo(x + wy, y - h - wy * 0.5)
  context.lineTo(x, y - h * 1)
  context.closePath()
  context.fillStyle = shadeColor(color, 10)
  context.strokeStyle = shadeColor(color, 50)
  context.stroke()
  context.fill()

  context.beginPath()
  context.moveTo(x, y - h)
  context.lineTo(x - wx, y - h - wx * 0.5)
  context.lineTo(x - wx + wy, y - h - (wx * 0.5 + wy * 0.5))
  context.lineTo(x + wy, y - h - wy * 0.5)
  context.closePath()
  context.fillStyle = shadeColor(color, 20)
  context.strokeStyle = shadeColor(color, 60)
  context.stroke()
  context.fill()
}

function drawOutline (x, y, wx, wy, h, color) {
  context.beginPath()
  context.moveTo(x, y)
  context.lineTo(x - wx, y - wx * 0.5)
  context.lineTo(x - wx, y - h - wx * 0.5)
  context.lineTo(x - wx + wy, y - h - (wx * 0.5 + wy * 0.5))
  context.lineTo(x + wy, y - h - wy * 0.5)
  context.lineTo(x + wy, y - wy * 0.5)
  context.closePath()

  context.moveTo(x - wx, y - wx * 0.5)
  context.lineTo(x + wy, y - h - wy * 0.5)

  context.moveTo(x, y)
  context.lineTo(x - wx + wy, y - h - (wx * 0.5 + wy * 0.5))

  context.moveTo(x - wx, y - h - wx * 0.5)
  context.lineTo(x + wy, y - wy * 0.5)

  context.strokeStyle = color
  context.stroke()
}

function drawGrid (y) {
  for (var i = 0; i < 20; i++) {
    context.moveTo(CANVAS_WIDTH / 2 - 20 * i, CANVAS_HEIGHT - 10 * (2 * y + i + 2))
    context.lineTo(CANVAS_WIDTH - 20 * (i + 1), CANVAS_HEIGHT * 0.75 - 10 * (2 * y + i + 1))

    context.moveTo(CANVAS_WIDTH / 2 + 20 * i, CANVAS_HEIGHT - 10 * (2 * y + i + 2))
    context.lineTo(20 * (i + 1), CANVAS_HEIGHT * 0.75 - 10 * (2 * y + i + 1))
  }

  context.strokeStyle = '#aaa'
  context.stroke()
}

function draw () {
  context.beginPath()
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  drawGrid(0)
  drawOutline(mouseLoc[0], mouseLoc[1], 20, 20, 20, '#4f4')
}

function setCursor (e) {
  mouseLoc[0] = e.offsetX
  mouseLoc[1] = e.offsetY
  draw()
}

canvas.addEventListener('mousemove', setCursor)

draw()
