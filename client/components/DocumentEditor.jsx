import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import FilePicker from './FilePicker';
import FileUpload from './FileUpload';
import Dropdown from './Dropdown';
import SelectedDocument from './SelectedDocument';
import { PropaneSharp } from '@mui/icons-material';

function DocumentEditor({ hostView, documents, setActiveDocumentHandler, updateRoom, deleteFile}) {
  // some fake data for rendering purposes
  const fakeFileList = ['test1', 'someDocument', 'my story'];

  const [openPicker, setPicker] = useState(false);
  const [fileList, setFiles] = useState(fakeFileList);
  const [document, setDocument] = useState({});


  const connectAuth = async () => {
    console.log('click auth');
    // first check to see if token is already in cookies
    const files = await fetch('/oauth/access_drive').then(response => response.json());

    if (files) {
      console.log(files);
      setPicker(true);
      return setFiles(files);
    }
    console.log('not authorized yet');
    // request oauth url from server
    const redirectURL = await fetch('/oauth').then(response => response.json());
    // redirect user to consent screen
    window.location.replace(redirectURL);
    // redirect should come back as an array with the files
    setFiles(await fetch('/oauth/access_drive').then(response => response.json()));
    setPicker(true);
  };

  return (
    <div className='doc-editor'>
      
      <h1 className = 'file-manager'>
      Upload your files
      </h1>

      <FileUpload updateRoom={updateRoom}/>
      
      <h1 className = 'file-manager'>
        Manage your files
      </h1>
      
      {openPicker && <FilePicker fileList={fileList} setDocument={setDocument} />}

      <Dropdown 
        setActiveDocumentHandler={setActiveDocumentHandler}
        documents={documents}
        deleteFile={deleteFile}
      />
    </div>
  );
}

export default DocumentEditor;