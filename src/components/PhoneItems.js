import mori from 'mori'
import Score from './Score'
import Timer from './Timer'
import Controller from './Controller'

function PhoneItems ({ state }) {
  const players = mori.getIn(state, ['game', 'players'])
  const timer = mori.getIn(state, ['game', 'gameTimer'])
  const id = mori.get(state, 'id')

  return (
    <div className='phone-items'>
      <header>
        <h2>Multiplayer Pacman</h2>
      </header>
      <Score players={players} />
      <Timer timer={timer} />
      <Controller id={id} />
    </div>
  )
}

export default PhoneItems
