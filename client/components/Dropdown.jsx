import React, {useState, useEffect} from 'react';
import Button from '@mui/material/Button';

function Dropdown ({documents, setActiveDocumentHandler, deleteFile}) {
  
  const [filesHash, setFilesHash] = useState({});
  const [selectedDocument, setSelectedDocument] = useState('');

  useEffect(() => {
    const res = {};

    if (documents?.length) {
      for (const document of documents) {

        //Create a key with the characters and underscore at the beginning of document name removed
        const key = document.replace(/.*?_/, '');

        //Set the created key and original document name as key value pairs in the filesHash object
        res[key] = document;
      }
      setFilesHash(res);
    }
  }, [documents]);
  
  // console.log('DROPDOWN SELECTED DOC ', selectedDocument);

  return (    
    <div>
      <label htmlFor="file-selector"> Choose a file to upload: </label>

      <select
        name="user-files"
        id="file-selector"
        onChange={(e) => setSelectedDocument(e.target.value)}>
        <option
          className="fileOptions"
          value="">---Please Choose an Option--
        </option>
        {Object.entries(filesHash)?.map(pair => <option className="fileOptions" key={pair[1]} value={pair[1]}>{pair[0]}</option>)}
      </select>

      <Button 
        id="display-btn"
        variant="contained"
        onClick={() => setActiveDocumentHandler(selectedDocument)}>
        Display
      </Button>
      
      <Button
        id="delete-btn" 
        onClick = {() => deleteFile(selectedDocument)}>
        Delete
      </Button>

    </div>

    
  );}
export default Dropdown;