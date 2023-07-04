import React, { useEffect, useState } from 'react'
import queryString from 'query-string';
import io from 'socket.io-client';
import { useLocation } from 'react-router';
import InfoBar from '../InfoBar/InfoBar';
import './Chat.css'
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import ActiveUser from '../ActiveUser/ActiveUser';

let socket;

function Chat() {
  const location = useLocation();

  const [name , setName] = useState('');
  const [room , setRoom] = useState('');
  const [message , setMessage] = useState('');
  const [messages , setMessages] = useState([]);
  const [users , setUsers] = useState([]);
  const ENDPOINT = 'http://localhost:5000';

  useEffect(()=>{
    const {name , room} = queryString.parse(location.search);

    socket = io(ENDPOINT)

    setName(name);
    setRoom(room);

    socket.emit('join',{name ,room },()=>{
      
    });
    
    console.log(socket)

    return ()=>{
      socket.emit('disconnect');
      socket.off();
      
    }
  },[ENDPOINT , location.search ])

  useEffect(() => {
    socket.on('message' , (message) => {
      setMessages([...messages , message]);
    })
  },[messages])

 
  useEffect(() => {
    socket.on('roomData', (data) => {
      if (data.users) {
        setUsers(data.users.map(user => user.name));
        console.log(data.users);
      }
    });
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();
  
    if (message) {
      socket.emit('sendMessage', message, () => {
        setMessage('');
      });
    }
  }

  console.log(message , messages);

  return (
    <div className="outerContainer banner">
      <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      <ActiveUser users={users}/>
    </div>
  )
}

export default Chat
