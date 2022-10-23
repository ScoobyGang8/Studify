import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Chatbox from '../components/Chatbox';
import DocumentEditor from '../components/DocumentEditor';
import SelectedDocument from '../components/SelectedDocument';
import { io } from 'socket.io-client';
import axios from 'axios';

function Room( ) {
  const [hostInfo, setHost] = useState({});//whoever is logged in
  const [hostView, setHostView] = useState(false);
  const [info, setInfo] = useState({});//room info
  const [activeDocument, setActiveDocument] = useState('');
  const [activeURL, setActiveURL] = useState('');
  const [socket, setSocket] = useState(null);

  const state = useLocation().state;

  // save roomdoc in cookie for retrieval after redirect
  const saveRoom = async () => {
    const response = await fetch('/api/rooms/cookie', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({room: info._id})
    });

    const saved = await response.json();
  };

  // fetch host if info doesn't already exist
  const fetchHost = async () => {
    const response = await fetch('/api/users');
    const details = await response.json();
    setHost(details);
    // if room host is the same as the current user
    if (!info.host._id || info.host._id === details._id) setHostView(true);
  };

  // fetch document from s3 bucket and set the response to the active url
  const fetchFromS3 = async (filename) => {
    const awsFile = await fetch(`http://localhost:3000/api/uploads/${filename}`, {
      credentials: 'include',
    });
    if (awsFile.ok){
      const url = await awsFile.json();
      console.log('FETCH FROMS3 url', url);
      await setActiveURL(url);
    }
  };

  // handler function to change toggle active document when host changes what to display
  const setActiveDocumentHandler = async (filename) => {
    //Check if the entered filename is empty or matches the current activeDocument
    if (!filename.trim().length || filename.trim() === activeDocument) return;

    //emit new filename to all listeners in the room
    socket.emit('set_filename', filename, info._id);

    //Set the activeDocument and then fetch the file from aws bucket endpoint
    // await setActiveDocument(filename);

    // const awsFile = await fetch(`/api/uploads/${filename}`, {
    //   credentials: 'include',
    // });

    // if (awsFile.ok){
    //   const url = await awsFile.json();
    //   console.log('url', url);
    //   setActiveURL(url);
    // }
  };

  //Fetches room information. Used when the component first mounts
  const fetchRoomInfo = async () => {
   
    const response = await axios.get('http://localhost:3000/api/rooms/cookie', {withCredentials: true});

    if (response.status === 200) {
      const room = response.data;
      console.log('Updated Room: ', room);
      setInfo(room);
    }
  };

  useEffect(()=>{
    console.log('fetching room info...');
    fetchRoomInfo();
  }, []);

  // set host and set cookie for room
  useEffect(() => {
    if (info?.host) fetchHost();
    // if info was read from state then save id
    // if (state) saveRoom();
  }, [info]);

  useEffect(() => {
    if (info?.activeFile) {
      setActiveDocument(info.activeFile);
      fetchFromS3(info.activeFile);
    }
  }, [info]);

  useEffect(() => {
    //Create client side socket connection
    const newSocket = io('http://localhost:3000');

    //On connect join the room id on server side
    newSocket.on('connect', () => {
      console.log('ROOM COMPONENT SOCKET ', newSocket.id);
      if (info._id) newSocket.emit('join_room', info._id);
    });

    //handler for when a host changes the active file of the room and the event is emitted back from the server
    newSocket.on('updated_filename', async (filename) => {
      setActiveDocument(filename);

      await fetchFromS3(filename);
    });

    newSocket.on('clear_roomFile', () => {
      setActiveDocument('');
      setActiveURL('');
    });

    newSocket.on('connect_error',  (err) => {
      console.log(err.message);
    });

    setSocket(newSocket);

    return () => {
      console.log('Closing room socket');
      newSocket.close();
    };
  }, [info]);

  // console.log('ROOM COMPONENT STATE', state);
  console.log('ROOM COMPONENT INFO', info);
  console.log('ROOM COMPONENT HOSTINFO', hostInfo);
  // console.log('ROOM COMPONENT HOST VIEW ', hostView);

  const deleteFile = async (selectedDocument) => {
    if (selectedDocument === activeDocument) {
      socket.emit('clear_file', (info._id));
    }

    const response = await fetch(`/api/uploads/${selectedDocument}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({room: info._id})
    });
    
    if (response.ok) {
      const deleted = await response.json();
      await fetchRoomInfo();
    }
        
  };

  return (
    <div className="room-page">
      <div id='room-page-info'>
        <h2>Host: {info?.host && (info?.host?.nickname || hostInfo.nickname)} </h2>
        <p>Subject: {info?.subject}</p>
      </div>
      {hostView && 
      <DocumentEditor 
        hostView={hostView} 
        documents={info.files ? info.files : info.host?.files} 
        setActiveDocumentHandler={setActiveDocumentHandler}
        updateRoom={fetchRoomInfo}
        deleteFile = {deleteFile}
        setActiveDocument={setActiveDocument}
        setActiveURL={setActiveURL}
      />
      }
      <div className='docAndChatArea'>

        {(activeDocument && activeURL) &&
          <SelectedDocument
            document={activeDocument}
            activeURL={activeURL}
          />
        }

        <Chatbox
          roomId={info._id}
          socket={socket}
          nickname={hostInfo.nickname}
          messages={info?.messages}
        />

      </div>

    </div>
  );
}

export default Room;