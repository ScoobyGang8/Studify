import React, { useState, useEffect } from 'react';

function SelectedDocument ({ activeURL, document }){
  
  const [url, setURL] = useState(activeURL);
  
  
  return (
    <div className="doc-container">
      <h1 className="doc-header">{document.replace(/.*?_/, '').replace(/\.[^/.]+$/, '')}</h1>
      {activeURL && <iframe
        className='iframe'
        src={activeURL} 
        height="500px"
        width="auto"
        align="center"/>}
    </div>  
  );

}

export default SelectedDocument;