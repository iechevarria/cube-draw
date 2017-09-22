// from https://codepen.io/AshKyd/pen/JKGVmY

var CANVAS_WIDTH = 800
var CANVAS_HEIGHT = 800

var mouseLoc = [-1, -1]

var canvas = document.getElementById('canvas')
var context = canvas.getContext('2d')

var cursorMode = 'draw'

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
  for (var i = 0; i < 21; i++) {
    context.moveTo(CANVAS_WIDTH / 2 - 20 * i, CANVAS_HEIGHT - 10 * (2 * y + i))
    context.lineTo(CANVAS_WIDTH - 20 * i, CANVAS_HEIGHT * 0.75 - 10 * (2 * y + i))

    context.moveTo(CANVAS_WIDTH / 2 + 20 * i, CANVAS_HEIGHT - 10 * (2 * y + i))
    context.lineTo(20 * i, CANVAS_HEIGHT * 0.75 - 10 * (2 * y + i))
  }

  context.strokeStyle = '#aaa'
  context.stroke()
}

var board = {
  arrContents: new Array(20),

  fill: function (i, j) {
    this.arrContents[i][j] = 1
  },

  erase: function (i, j) {
    this.arrContents[i][j] = 0
  },

  reset: function () {
    for (var i = 0; i < 20; i++) {
      this.arrContents[i] = new Array(20)
      for (var j = 0; j < 20; j++) {
        this.arrContents[i][j] = 0
      }
    }
  }
}

function drawCursor () {
  if (cursorMode === 'draw') {
    drawCube((mouseLoc[0] + mouseLoc[1] + 1) * 20, 600 + (mouseLoc[0] - mouseLoc[1] + 1) * 10, 20, 20, 20, '#aaaaaa')
    drawOutline((mouseLoc[0] + mouseLoc[1] + 1) * 20, 600 + (mouseLoc[0] - mouseLoc[1] + 1) * 10, 20, 20, 20, '#0f0')
  } else {
    drawOutline((mouseLoc[0] + mouseLoc[1] + 1) * 20, 600 + (mouseLoc[0] - mouseLoc[1] + 1) * 10, 20, 20, 20, '#f00')
  }
}

function draw () {
  context.beginPath()
  context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  context.fillStyle = '#fff'
  context.font = '14px Courier'
  context.fillText('x: ' + mouseLoc[0].toString(), 25, 30)
  context.fillText('y: ' + mouseLoc[1].toString(), 25, 50)
  drawGrid(0)

  for (var i = 0; i < 20; i++) {
    for (var j = 19; j >= 0; j--) {
      if (board.arrContents[i][j] === 1) {
        drawCube((i + j + 1) * 20, 600 + (i - j + 1) * 10, 20, 20, 20, '#aaaaaa')
      }
      if (i === mouseLoc[0] && j === mouseLoc[1]) {
        drawCursor()
      }
    }
  }
}

function setCursor (e) {
  if (Math.floor((e.offsetX * 0.5 + e.offsetY) / 20) - 30 !== mouseLoc[0] ||
      -(Math.floor((e.offsetY - e.offsetX * 0.5) / 20) - 29) !== mouseLoc[1]) {
    mouseLoc[0] = Math.floor((e.offsetX * 0.5 + e.offsetY) / 20) - 30
    mouseLoc[1] = -(Math.floor((e.offsetY - e.offsetX * 0.5) / 20) - 29)
    draw()
  }
}

function handleClick () {
  if (cursorMode === 'draw') {
    board.fill(mouseLoc[0], mouseLoc[1])
    draw()
  }
  //} else if (drawMode === 'erase') {
  //  board.arrContents[mouseLoc[0]][mouseLoc[1]] = 0
  //}
}

board.reset()
canvas.addEventListener('mousemove', setCursor)
canvas.addEventListener('mousedown', handleClick)
draw()
