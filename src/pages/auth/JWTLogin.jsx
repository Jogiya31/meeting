import React, { useEffect, useState } from 'react';
import { Row, Col, Alert, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../store/auth/authrSlice';
import { useAuth } from '../../contexts/AuthContext';

const JWTLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedIn, login } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [saveCredentials, setSaveCredentials] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');

  const loginDetails = useSelector((state) => state.auth.data);

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

  useEffect(() => {
    if (loggedIn || localStorage.getItem('loggedIn')) {
      navigate('/meetings/dashboard');
    }
  }, [loggedIn, navigate]);

  useEffect(() => {
    if (loginDetails?.Result && loginDetails.Result.length > 0) {
      localStorage.setItem('loggedIn', true);
      localStorage.setItem('role', loginDetails?.Result[0]?.Role);
      login(loginDetails?.Result[0]);
      navigate('/meetings/dashboard');
    }
  }, [loginDetails]);

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="username">
        <Form.Label>User ID</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter your User Name/Mobile"
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
            Sign In
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default JWTLogin;
