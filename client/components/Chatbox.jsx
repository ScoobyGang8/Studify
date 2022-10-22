import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';

function Chatbox({ roomId, socket, nickname }) {

  const [messageList, setMessages] = useState([]);
  // need function to retrieve messages

  const messages = messageList.map((e, i) => {
    let self = false;
    if (e.from === nickname) {self = true;}
    return (<p data-self={self} key={i}>{e.from}: <span>{e.msg}</span></p>);
  });

  useEffect(()=> {
    if (socket) {socket.on('received_message', (message) => {
      setMessages((oldMessages) => [...oldMessages, message]);
    });
    }
  }, [socket]);

  const sendMsg = (message) => {
    socket.emit('send_message', {
      from: nickname,
      msg: message
    }, roomId);
  };

  return (
    <div className='chatbox'>
      <h1 className='file-manager'>ROOM CHAT</h1>
      
      <div id='message-container'>
        {messages}
        <div id='anchor'></div>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        console.log(e.target[0].value);
        sendMsg(e.target[0].value);
        e.target[0].value = '';
      }}>
        <input
          id = 'input-text'
          type='text'
          
        >
        </input>
        
        <Button
          id = 'chat-btn'
          type='submit'
          variant='text'
        >
          Send
        </Button>
      </form>
    
      </div>
  );
}

export default Chatbox;