import { Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';


function RoomCard( { info, id } ) {
  const [roomInfoBoolean, setRoomInfoBoolean] = useState(false);
  const [saved, setSaved] = useState(false);

  // const textOnSubmit = event => {
  //   event.preventDefault();
  //   setName((prevName) => {return newName})
  // }

  // function handleChange() {
  //   newName = event.target.value
  //   return event.target.value
  // }
  console.log('ROOM CARD INFO ', info);
  async function saveRoom () {
    const options = {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({savedRoom: id})};
    const saved = await fetch('/api/users/saveroom', options).then(response => response.json());

    setSaved(saved);
  }

  const showRoomInfo = event => {
    setRoomInfoBoolean(!roomInfoBoolean);
  };

  const setRoomCookie = async (roomID) => {
    const response = await fetch('/api/rooms/cookie', {
      method: 'POST',
      body: JSON.stringify({ room: roomID }),
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
      },
    });

    const success = await response.json();
    console.log(success);
  };

  const mainRoom = (
    <div className="mainRoom" onClick={() => {
      showRoomInfo();
      setRoomCookie(id);
    }}>
      {/* <div > */}
      {/* <div>
          <img src='https://csunshinetoday.csun.edu/wp-content/uploads/Math4-web.jpg' width="192" height="144"/>
        </div> */}
      {info?.host?.nickname} Room
      {/* <InfoIcon fontSize="small" onClick={showRoomInfo}></InfoIcon> */}
      {/* </div> */}
      {/* <form>
        <input id="nameInput" type="text" placeholder="Your Name Here" onChange={handleChange}></input>
        <button id="onSubmitButton" onClick={textOnSubmit}>Enter</button>
        <button id="showRoomInfo" onClick={showRoomInfo}>Show Room Info</button>
      </form> */}
    </div>
  );

  const roomInfo = (
    <div className="roomInfo">
      <p><span>Subject:  </span>{info?.subject?.toUpperCase()} </p>
      <p><span>Creator:  </span>{info?.host?.username} </p>
      <p><span>People Inside: </span>{info?.allowedUsers} </p>
      <div id='main-button'>
        <Link to='/main/room' state={{ info }}><Button variant='contained'>Join Room</Button></Link>
        {!saved && <Button variant='contained' id="saveMyRoom" onClick={saveRoom}>Save</Button>}
        {saved && <Button variant='outlined' id="saveMyRoom">Saved!</Button>}
        <Button id="exitRoomInfo" onClick={showRoomInfo}>Back</Button>
      </div>
    </div>
  );

  if (!roomInfoBoolean) {
    return mainRoom;
  } else if (roomInfoBoolean) {
    return roomInfo;
  }
}

export default RoomCard;