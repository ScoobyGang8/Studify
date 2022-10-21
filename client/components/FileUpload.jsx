import React, { useState } from 'react';
import axios from 'axios';

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
      onSubmit={submit} 
    >
      <input
        id="file-upload"
        type="file"
        name="file"
        onChange={e => setFile(e.target.files[0])}
      />
      
      <button
      id='display-btn'
      type="submit">
        Submit
      </button>

    </form>
  );
};

export default FileUpload;