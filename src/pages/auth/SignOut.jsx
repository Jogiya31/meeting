import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Signout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem('loggedIn');
    navigate('/login');
  }, []);

  return <div></div>;
};

export default Signout;
