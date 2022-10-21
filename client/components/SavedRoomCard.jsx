import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

export default function SavedRoomCard({fetchUser, info, id, setRoomCookie, roomId}) {
  const [host, setHost] = useState('');

  const navigate = useNavigate();

  const getHost = async () => {
    const user = await fetch(`/api/users/${info.host}`).then(response => response.json());
    setHost(user.nickname);
  };

  useEffect(() => {
    getHost();
  }, []);

  async function deleteSavedRoom () {
    const options = {method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({'savedRooms': `${info._id}`})};
    await fetch('/api/users/unsaveroom', options);
    await fetchUser();
  }

  return (
    <div className='saved-room'>
      <p><label>Subject: </label>{info.subject} </p>
      <p><label>Host: </label>{host} </p>
      <p><label>Restricted: </label>{info.restricted ? 'Yes' : 'No'}</p>
      <p><label>Allowed users: </label></p>
      {/* <Link to={'/main/room'} state={{info}}> */}
        <Button variant='contained' id="joinRoom" onClick={() => {
        setRoomCookie(roomId);
        setTimeout(() => {
          navigate('/main/room');
        }, 500);
        }}>Join Room</Button>
      {/* </Link> */}
      <Button variant='outlined' id="removeMyRoom" onClick={deleteSavedRoom}>Remove</Button>
    </div>
  );
}