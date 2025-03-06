import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authActions } from '../../store/auth/authrSlice';

const Signout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem('loggedIn');
    dispatch(authActions.clearData());
    navigate('/login');
  }, []);

  return <div></div>;
};

export default Signout;
