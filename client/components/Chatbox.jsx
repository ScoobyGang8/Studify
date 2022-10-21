import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';

function Chatbox({ roomId, socket, nickname }) {

  const [messageList, setMessages] = useState([]);
  // need function to retrieve messages

  const messages = messageList.map((e, i) => {
    return (<p key={i}>{e.from}: {e.msg}</p>);
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
      <div id='message-container'>
        {messages}
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();
        console.log(e.target[0].value);
        sendMsg(e.target[0].value);
        e.target[0].value = '';
      }}>
        <input type='text'></input>
        <Button type='submit' variant='text'>Send</Button>
      </form>
    </div>
  );
}

export default Chatbox;