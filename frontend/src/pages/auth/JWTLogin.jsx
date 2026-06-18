import React, { useEffect, useState } from 'react';
import { Row, Col, Alert, Button, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../store/auth/authSlice';
import { useAuth } from '../../contexts/AuthContext';
import { settingsActions } from 'store/settings/settingSlice';

const JWTLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedIn, login, role } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [saveCredentials, setSaveCredentials] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [processed, setProcessed] = useState(false);

  const loginDetails = useSelector((state) => state.auth.data);
  const roleDetails = useSelector((state) => state.settings.roleData);
  const loader = useSelector((state) => state.auth.loader);

  useEffect(() => {
    dispatch(settingsActions.getRoleInfo());
  }, [dispatch]);

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'User ID is required';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitError('');
    dispatch(authActions.getauthInfo({ UsernameMobile: username, Password: password }));
  };

  // Map roleTitle to loginDetails when both are available
  useEffect(() => {
    if (
      loginDetails?.Result &&
      loginDetails.Result.length > 0 &&
      roleDetails?.Result &&
      !processed
    ) {
      const roleMap = roleDetails.Result.reduce((acc, role) => {
        acc[role.RoleId] = role.Title;
        return acc;
      }, {});

      const updatedUser = {
        ...loginDetails.Result[0],
        Role: roleMap[loginDetails.Result[0].Role] || loginDetails.Result[0].Role
      };

      // localStorage.setItem('loggedIn', true);
      // localStorage.setItem('role', updatedUser.Role);
      // localStorage.setItem('userDetails', JSON.stringify(updatedUser));

      login(updatedUser);
      setProcessed(true); // prevent this logic from running again

      if (updatedUser.Role === 'superadmin') {
        navigate('/meetings/dashboard');
      } else {
        navigate('/tasktracker/dashboard');
      }
    }
  }, [loginDetails, roleDetails, login, navigate, processed]);

  // Redirect if already logged in
  useEffect(() => {
    if (loggedIn) {
      if (role === 'superadmin') {
        navigate('/meetings/dashboard');
      } else {
        navigate('/tasktracker/dashboard');
      }
    }
  }, [loggedIn, navigate]);

  return (
    <Form noValidate onSubmit={handleSubmit} className="login-form">
      <Form.Group className="mb-3" controlId="username">
        <Form.Label>User ID</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Name/Mobile"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          isInvalid={!!errors.username}
        />
        <Form.Control.Feedback type="invalid">
          {errors.username}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          isInvalid={!!errors.password}
        />
        <Form.Control.Feedback type="invalid">
          {errors.password}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4 mt-2" controlId="saveCredentials">
        <Form.Check
          type="checkbox"
          label="Save credentials"
          checked={saveCredentials}
          onChange={() => setSaveCredentials(!saveCredentials)}
        />
      </Form.Group>

      {submitError && (
        <Col sm={12}>
          <Alert variant="danger">{submitError}</Alert>
        </Col>
      )}

      <Row>
        <Col>
          <Button type="submit" variant="primary" className="w-100">
            {loader ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Logging in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default JWTLogin;
