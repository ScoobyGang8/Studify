import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';


function MainNav({ setSubject, setLoggedIn }) {
  const logOut = async () => {
    const cookie = await fetch('/api/auth/logout').then(response => response.json());
    setLoggedIn(false);
  };
  //cookie not being used

  return (
    <div className='main-nav'>
      <p className='logo'>stud<span>if</span>y</p>
      <Link className='main-nav-btn' to='/main/home'>
        <Button 
          onClick={() => setSubject('')} variant="text" id='home-link'>Home
        </Button>
      </Link>
      <Link className='main-nav-btn' to='/main/profile'><Button variant="text" id='profile-link'>Profile</Button></Link>
      <Link className='main-nav-btn' to='/main/settings'><Button variant="text" id='settings-link'>Settings</Button></Link>
      <Link className='main-nav-btn' to='/' id='logout-link'><Button onClick={logOut} variant="text" id='logout-link-button' sx={{float: 'right'}}>Logout</Button></Link>
    </div>
  );
}

export default MainNav;