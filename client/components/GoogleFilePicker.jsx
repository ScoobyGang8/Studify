import React from 'react';
import useDrivePicker from 'react-google-drive-picker';
import Button from '@mui/material/Button';

const GoogleFilePicker = ({ setGoogleDoc }) => {

  const [openPicker, authResponse] = useDrivePicker();

  const handleOpenPicker = () => {
    openPicker({
      clientId: process.env.OAUTH_CLIENT_ID,
      developerKey: process.env.OAUTH_API_KEY,
      viewId: 'DOCS',
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      callbackFunction: (data) => {
        if (data.action === 'cancel') console.log('Cancelled');
        console.log(data);

        const url = data.docs[0].url;
        const shareUrl = url.replace('drive_web', 'sharing');

        setGoogleDoc(data.docs[0].name, shareUrl);
      }
    });
  };

  return (
    <div> 
      <Button variant='contained' onClick={() => handleOpenPicker()}>GOOGLE DRIVE</Button>
    </div>
  );
};

export default GoogleFilePicker;