import { version } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import { log } from './App'

function checkCollision (x, y, direction) {
  let value = null
  let board = mori.get(window.appState, 'board')

  if (direction === 'right') value = mori.getIn(board, [y, x + 1])
  if (direction === 'left') value = mori.getIn(board, [y, x - 1])
  if (direction === 'bottom') value = mori.getIn(board, [y + 1, x])
  if (direction === 'top') value = mori.getIn(board, [y - 1, x])
  return value
}

function checkTunnel (x, y, dir, board, id) {
  let xMax = 27
  if (x === 0 && dir === 'left') window.appState = mori.assocIn(window.appState, ['players', id, 'x'], xMax)
  if (x === (xMax) && dir === 'right') window.appState = mori.assocIn(window.appState, ['players', id, 'x'], 0)
}

function updateRenderFrame (id, count, speed) {
  if (count === speed) window.appState = mori.assocIn(window.appState, ['players', id, 'count'], 0)
  window.appState = mori.updateIn(window.appState, ['players', id, 'count'], mori.inc)
}

function extraPoints (v) {
  return v + 100
}

function weakenAllPlayers (id) {
  let players = mori.get(window.appState, 'players')
  mori.each(players, function (p) {
    const currentPlayerID = mori.get(p, 'id')
    if (currentPlayerID !== id) {
      window.appState = mori.assocIn(window.appState, ['players', currentPlayerID, 'isWeak'], true)
    }
  })
}

function movePlayer (id, direction, x, y) {
  let collisionVal = checkCollision(x, y, direction)

  if (collisionVal !== 1) {
    if (direction === 'right' && x < 27) x += 1
    if (direction === 'left' && x > 0) x -= 1
    if (direction === 'bottom' && y < 30) y += 1
    if (direction === 'top' && y > 0) y -= 1

    if (collisionVal === 3) {
      // if the player eata a power dot assing extra points and eating power
      window.appState = mori.assocIn(window.appState, ['board', y, x], 0)
      window.appState = mori.updateIn(window.appState, ['players', id, 'score'], extraPoints)
      window.appState = mori.assocIn(window.appState, ['players', id, 'hasPower'], true)
      // start game power mode
      window.appState = mori.assoc(window.appState, 'isPowerMode', true)
      weakenAllPlayers(id)
    }

    if (collisionVal === 2) {
      window.appState = mori.assocIn(window.appState, ['board', y, x], 0)
      window.appState = mori.updateIn(window.appState, ['players', id, 'score'], mori.inc)
    }
    window.appState = mori.assocIn(window.appState, ['players', id, 'x'], x)
    window.appState = mori.assocIn(window.appState, ['players', id, 'y'], y)
  }
}

function Player (player, board) {
  const id = mori.get(player, 'id')
  const direction = mori.get(player, 'direction')
  const speed = mori.get(player, 'speed')
  const hasPower = mori.get(player, 'hasPower')
  const isWeak = mori.get(player, 'isWeak')
  let x = mori.get(player, 'x')
  let y = mori.get(player, 'y')
  let count = mori.get(player, 'count')
  let classVal = 'player player' + id

  if (count === speed) movePlayer(id, direction, x, y)
  updateRenderFrame(id, count, speed)

  if (!hasPower && speed !== 4) window.appState = mori.assocIn(window.appState, ['players', id, 'speed'], 4)
  if (hasPower) {
    classVal += ' hasPower'
    window.appState = mori.assocIn(window.appState, ['players', id, 'speed'], 2)
  }
  if (isWeak) classVal += ' isWeak'

  var xPercent = x * 100 / 28
  var yPercent = y * 100 / 31

  let styles = {
    left: xPercent + '%',
    top: yPercent + '%',
    transition: 'all ' + speed + '00ms linear'
  }

  checkTunnel(x, y, direction, board, id)
  if (x <= 0 || x >= 27) styles.display = 'none'

  return (
    <div className={classVal} style={styles} />
  )
}

export default Player
