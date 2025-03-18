import React, { useEffect, useState } from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { authActions } from '../../store/auth/authrSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../contexts/AuthContext';
const JWTLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedIn, login } = useAuth();

  const [error, setError] = useState('');
  const [saveCredentials, setSaveCredentials] = useState(false);
  const loginDetails = useSelector((state) => state.auth.data);

  const handleSubmit = (values, { setSubmitting }) => {
    setError('');
    dispatch(authActions.getauthInfo(values));
    setSubmitting(false);
  };
  // Redirect logged-in users to dashboard
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
    <Formik
      initialValues={{
        UsernameMobile: '',
        Password: ''
      }}
      validationSchema={Yup.object().shape({
        UsernameMobile: Yup.string().max(255).required('User ID is required'),
        Password: Yup.string().required('Password is required')
      })}
      onSubmit={handleSubmit}
    >
      {({ errors, handleBlur, handleChange, isSubmitting, touched, values, handleSubmit }) => (
        <form noValidate onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="username">User ID</label>
            <input
              id="username"
              className="form-control"
              name="UsernameMobile"
              placeholder="Enter your User Name/Mobile"
              onBlur={handleBlur}
              onChange={handleChange}
              type="text"
              value={values.UsernameMobile}
            />
            {touched.UsernameMobile && errors.UsernameMobile && <small className="text-danger form-text">{errors.UsernameMobile}</small>}
          </div>
          <div className="form-group mb-4">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="form-control"
              name="Password"
              placeholder="Enter your Password"
              onBlur={handleBlur}
              onChange={handleChange}
              type="password"
              value={values.Password}
            />
            {touched.Password && errors.Password && <small className="text-danger form-text">{errors.Password}</small>}
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
