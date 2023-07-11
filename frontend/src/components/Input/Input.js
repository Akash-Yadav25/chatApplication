import React from 'react'
import './Input.css'

const Input = ({message , setMessage , sendMessage}) => {
  return (
    <form className='form'>
        <input
        className='input'
        type='text'
        placeholder='Write Message...'
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={(event)=> event.key === 'Enter' ? sendMessage(event):null}
        />
        <button className='sendButton' onClick={(event)=>sendMessage(event)}>Send</button>
    </form>
  )
}

export default Input
