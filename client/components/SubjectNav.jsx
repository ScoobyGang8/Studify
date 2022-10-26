import { Button } from '@mui/material';
import { Calculate, Book, HistoryEdu, Language, School, Science } from '@mui/icons-material';
import React, { useState, useContext } from 'react';

function SubjectNav({ subject, setSubject }) {
  // navbar will send back new subject as updated state via useContext
  const subjectObj = {
    'math': <Calculate className='subject-link-icon'/>,
    'english': <Book className='subject-link-icon'/>,
    'history': <HistoryEdu className='subject-link-icon'/>,
    'science': <Science className='subject-link-icon'/>,
    'languages': <Language className='subject-link-icon'/>,
    'miscellaneous': <School className='subject-link-icon'/>
  };
  const subjects = Object.entries(subjectObj);

  const subjectBtns = subjects.map((e, i) => {
    return (
      <Button variant='text'
        key={i}
        value={e[0]}
        className='subject-links'
        id={`${e[0]}subject-link`}
        onClick={(event) => handleClick(event.target.value)}>
        {e[1]}
        {e[0]}
      </Button>
    );
  });

  const handleClick = (value) => {
    // react router????
    setSubject(value);
    console.log(subject);
  };

  return (
    <div className='subject-nav'>
      <h2 >Subjects</h2>
      <div id='subject-links-container'>
        {subjectBtns}
      </div>

    </div>
  );
}

export default SubjectNav;