import { linkEvent } from 'inferno'
import { sendKeyPress } from '../Socket'

function handleController (id, event) {
  const direction = event.target.id
  if (id && direction) sendKeyPress({ id, direction })
}

function Controller ({ id }) {
  if (id) {
    return (
      <div className='controller'>
        <div>
          <button onClick={linkEvent(id, handleController)} id='top' />
          <button onClick={linkEvent(id, handleController)} id='right' />
        </div>
        <div>
          <button onClick={linkEvent(id, handleController)} id='left' />
          <button onClick={linkEvent(id, handleController)} id='bottom' />
        </div>
      </div>
    )
  }
}

export default Controller
