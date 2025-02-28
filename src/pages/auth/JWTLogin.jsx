import React, { useEffect, useState } from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const JWTLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [saveCredentials, setSaveCredentials] = useState(false);

  useEffect(() => {
    const logged = localStorage.getItem('loggedIn');
    if (logged) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <Formik
      initialValues={{
        username: '',
        password: ''
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().max(255).required('User ID is required'),
        password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required')
      })}
      onSubmit={(values, { setSubmitting }) => {
        setError('');
        api
          .post('/login', values) // Replace `/login` with your API endpoint
          .then((response) => {
            // Save credentials if the checkbox is checked
            if (saveCredentials) {
              localStorage.setItem('loggedIn', true);
            }
            navigate('/dashboard'); // Navigate to dashboard on success
          })
          .catch((err) => {
            // Handle error response
            if (err.response?.status === 401) {
              setError('Invalid user ID or password');
            } else {
              setError('An unexpected error occurred. Please try again later.');
            }
          })
          .finally(() => {
            setSubmitting(false);
          });
      }}
    >
      {({ errors, handleBlur, handleChange, isSubmitting, touched, values, handleSubmit }) => (
        <form noValidate onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="username">User ID</label>
            <input
              id="username"
              className="form-control"
              name="username"
              placeholder="Enter your User ID"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={values.username}
            />
            {touched.username && errors.username && <small className="text-danger form-text">{errors.username}</small>}
          </div>
          <div className="form-group mb-4">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="form-control"
              name="password"
              placeholder="Enter your Password"
              onBlur={handleBlur}
              onChange={handleChange}
              type="password"
              value={values.password}
            />
            {touched.password && errors.password && <small className="text-danger form-text">{errors.password}</small>}
          </div>

          <div className="custom-control custom-checkbox text-start mb-4 mt-2">
            <input
              type="checkbox"
              className="custom-control-input mx-2"
              id="customCheck1"
              checked={saveCredentials}
              onChange={() => setSaveCredentials(!saveCredentials)}
            />
            <label className="custom-control-label" htmlFor="customCheck1">
              Save credentials
            </label>
          </div>

          {error && (
            <Col sm={12}>
              <Alert variant="danger">{error}</Alert>
            </Col>
          )}

          <Row>
            <Col mt={2}>
              <Button className="btn-block mb-4" color="primary" disabled={isSubmitting} size="large" type="submit" variant="primary">
                Sign In
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </Formik>
  );
};

export default JWTLogin;
