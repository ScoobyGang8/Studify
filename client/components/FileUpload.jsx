import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

const FileUpload = ({ updateRoom }) => {
  const [file, setFile] = useState(null);
  

  const submit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    await formData.append('file', file);

    const response = await axios.post('http://localhost:3000/api/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data'},
      withCredentials: true
    });
    
    console.log(response);
    if (response.status === 200) await updateRoom();
  };

  return (

    <form 
      className="file-form"
      id='file-upload-form'
      onSubmit={submit} 
    >
      <input
        id="file-upload"
        type="file"
        name="file"
        onChange={e => setFile(e.target.files[0])}
      />
      
      <Button
        variant='contained'
        id='display-btn'
        type="submit">
        Submit
      </Button>

    </form>
  );
};

export default FileUpload;