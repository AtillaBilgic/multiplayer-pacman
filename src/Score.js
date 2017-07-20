import { version } from 'inferno'
import Component from 'inferno-component'
import mori from 'mori'

function Score (players) {
  let playersArr = []
  mori.each(players, function (p) {
    let id = mori.get(p, 'id')
    let score = mori.get(p, 'score')

    playersArr.push(
      <div className='score'>
        <div>Player{id}</div><div>Score: {score}</div>
      </div>
    )
  })

  return (
    <div className='score-board'>
      {playersArr}
    </div>
  )
}

export default Score