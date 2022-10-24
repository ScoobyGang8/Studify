import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Login({ setLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const [signup, setSignup] = useState(false);
  const [warning, setWarning] = useState(false);

  const navigate = useNavigate();


  const logIn = async () => {
    const user = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    }).then(response => response.json());

    setLoggedIn(user);
    if (user) navigate('/main/home');
  };

  const signUp = async () => {
    // check that fields are valid
    if (!username || !nickname || password.length < 8) return setWarning(true);
    // post new user
    await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        nickname,
      })
    });

    setLoggedIn(true);
    navigate('/main/home');
  };


  const loginDetails = (
    <div className="auth-container details-container">
      <h2 id="login-text">Login Details</h2>
      <TextField label="Username" onChange={(event) => setUsername(event.target.value)} />
      <TextField type='password' label="Password" onChange={(event) => setPassword(event.target.value)} />
      
      <Button onClick={logIn} variant="contained" id='auth-btn'>Login</Button>
      
      <p>{'Don\'t have an account?'} <span className='switch-auth' onClick={() => setSignup(true)}>Click here!</span></p>
    </div>);

  const signupDetails = (
    <div className="auth-container  details-container">
      <h2 id="login-text">Signup Details</h2>
      <TextField name="Username" label="Username" onChange={(event) => setUsername(event.target.value)} />
      <TextField name="Nickname" label="Nickname" onChange={(event) => setNickname(event.target.value)} />
      <TextField type='password' placeholder='Must be at least 8 characters' label="Password"  onChange={(event) => setPassword(event.target.value)} />
      {warning && <p className='warning'>Please fill in all fields!</p>}
      
      <Button onClick={signUp} variant="contained" id='auth-btn'>Signup</Button>
      
      <p>{'Already have an account?'} <span className='switch-auth' onClick={() => setSignup(false)}>Click here!</span></p>
    </div>
  );

  return (
    <>
      <p className='logo' id='main-logo'>stud<span>if</span>y</p>
      <p id='slogan'><span>{'"does studying make you cry? use studify!"'}</span> - Confucius</p>
      {signup ? signupDetails : loginDetails}
    </>
    
  );
}