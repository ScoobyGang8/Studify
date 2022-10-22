import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';

function Chatbox({ roomId, socket, nickname, messages }) {

  const [messageList, setMessages] = useState(messages);
  // need function to retrieve messages

  const activeMessages = messageList?.map((e, i) => {
    return (<p key={i}>{e.from}: {e.msg}</p>);
  });

  const sendMsg = (message) => {
    socket.emit('send_message', {
      from: nickname,
      msg: message
    }, roomId);
  };

  const updateRoomMessages = async (messages) => {
    const response = await fetch(`/api/rooms/messages/${roomId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        messages: messages
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  };

  useEffect(() => {
    setMessages(messages);
  }, [messages]);

  useEffect(()=> {
    if (socket) {socket.on('received_message', (message) => {
      setMessages((oldMessages) => [...oldMessages, message]);
    });
    }
  }, [socket]);

  return (
    <div className='chatbox'>
      <div id='message-container'>
        {activeMessages}
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();
        if (e.target[0].value.trim().length > 0) {
          sendMsg(e.target[0].value.trim());
          updateRoomMessages([...messageList, {
            from: nickname,
            msg: e.target[0].value.trim()
          }]);
        }
        e.target[0].value = '';
      }}>
        <input type='text'></input>
        <Button type='submit' variant='text'>Send</Button>
      </form>
    </div>
  );
}

export default Chatbox;