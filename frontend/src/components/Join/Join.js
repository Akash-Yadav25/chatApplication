import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import './Join.css'

function Join() {
  const [name , setName] = useState('');
  const [room , setRoom] = useState('');

  return (
    <div className='joinOuterContainer'>
      <div className='joinInnerContainer'>
        <div className='heading'>Chat Room</div>
        <div className='mt-20'>Name<input placeholder='' className='joinInput mt-10' type="text" onChange={(event)=> setName(event.target.value)} /></div>
        <div className='mt-20'>Room Name<input placeholder='' className='joinInput mt-10' type="text" onChange={(event)=> setRoom(event.target.value)}/></div>
        <Link onClick={event => (!name || !room) ? event.preventDefault() : null} to={`/chat?name=${name}&&room=${room}`}>
          <button className='button mt-20' type='submit'>Let's go</button>
        </Link>
      </div>
      Hello
    </div>
  )
}

export default Join
