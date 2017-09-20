// from https://codepen.io/AshKyd/pen/JKGVmY

var CANVAS_WIDTH = 800
var CANVAS_HEIGHT = 800

var blockSize = 20

var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')

function shadeColor (color, percent) {
  color = color.substr(1)
  var num = parseInt(color, 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
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
  /*
  context.beginPath
  context.moveTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT - blockSize)
  context.lineTo(20, CANVAS_HEIGHT * 0.75 - blockSize + 10)
  context.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - blockSize + 10)
  context.lineTo(CANVAS_WIDTH - blockSize, CANVAS_HEIGHT * 0.75 - 20)
  context.closePath()
  context.fillStyle = 'rgba(200, 225, 255, 0.35)'
  context.fill()
  */

  for (var i = 0; i < 20; i++) {
    context.moveTo(CANVAS_WIDTH / 2 - 20 * i, CANVAS_HEIGHT - 10 * (i + 2))
    context.lineTo(CANVAS_WIDTH - 20 * (i + 1), CANVAS_HEIGHT * 0.75 - 10 * (i + 1))

    context.moveTo(CANVAS_WIDTH / 2 + 20 * i, CANVAS_HEIGHT - 10 * (i + 2))
    context.lineTo(20 * (i + 1), CANVAS_HEIGHT * 0.75 - 10 * (i + 1))
  }

  context.strokeStyle = '#acf'
  context.stroke()
}

drawGrid(0)

drawCube(200, 200, 20, 20, 20, '#bbbbbb')
drawCube(260, 230, 20, 20, 20, '#bbbbbb')
drawCube(260, 230, 20, 20, 20, '#bbbbbb')

drawCube(500, 540, 20, 20, 20, '#cccccc')
drawCube(500, 520, 20, 20, 20, '#cccccc')
drawCube(520, 490, 20, 20, 20, '#cccccc')
drawCube(400, 780, 20, 20, 20, '#cccccc')

drawOutline(500, 500, 20, 20, 20, '#aaccff')

