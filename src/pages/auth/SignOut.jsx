import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authActions } from '../../store/auth/authrSlice';
import { useAuth } from '../../contexts/AuthContext';

const Signout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { logout } = useAuth();
  useEffect(() => {
    logout();
    dispatch(authActions.clearData());
    navigate('/meetings/login');
  }, []);

  return <div></div>;
};

export default Signout;
