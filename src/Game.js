import { version } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'
import Board from './Board'
import Score from './Score'
import { testServer } from './Socket'

export const log = (...args) => {
  console.log(...args.map(mori.toJs))
}

function resetAllPlayers () {
  let players = mori.get(window.appState, 'players')
  mori.each(players, function (p) {
    const id = mori.get(p, 'id')
    window.appState = mori.assocIn(window.appState, ['players', id, 'isWeak'], false)
    window.appState = mori.assocIn(window.appState, ['players', id, 'hasPower'], false)
  })
}

function updatePowerTimer (powerTimer, isPowerMode) {
  if (isPowerMode) {
    if (powerTimer === 50) {
      // when timer is done, reset all values
      window.appState = mori.assoc(window.appState, 'powerTimer', 0)
      window.appState = mori.assoc(window.appState, 'isPowerMode', false)
      resetAllPlayers()
    }
    // increments timer by 1 every 100ms
    window.appState = mori.updateIn(window.appState, ['powerTimer'], mori.inc)
  }
}

function Game (state) {
  let gameClass = 'game'
  const players = mori.get(state, 'players')
  const powerTimer = mori.get(state, 'powerTimer')
  const isPowerMode = mori.get(state, 'isPowerMode')
  const isGameReady = mori.get(state, 'isGameReady')

  updatePowerTimer(powerTimer, isPowerMode)

  if (isPowerMode) gameClass = 'game power-mode'
  if (!isGameReady) {
    return
  }

  return (
    <div className={gameClass}>
      <div>
        <h2>Multiplayer Pacman</h2>
        {Score(players)}
        {Board(state)}
        <button className='button-3d' onClick={testServer}>send test to server</button>
      </div>
    </div>
  )
}

export default Game