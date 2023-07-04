import React from 'react'
import './ActiveUser.css'
import ScrollToBottom from 'react-scroll-to-bottom'
import onlineIcon from '../icons/onlineIcon.png';
function ActiveUser({ users }) {
  return (

    <div className="textContainer">
      <div>
        <h1>Group Chats<span role="img" aria-label="emoji">💬</span></h1>

      </div>
      {
        users
          ? (
            <div>
              <h1>People currently chatting:</h1>
              <div className="activeContainer">
                <h2>
                  {users.map((user, index) => (
                    <div key={index} className="activeItem">
                      <img alt="Online Icon" src={onlineIcon} />
                      <div style={{ marginLeft: '5px' }}>{user}</div>
                    </div>
                  ))}
                </h2>
              </div>
            </div>
          )
          : null
      }
    </div>

  )
}

export default ActiveUser
