import React from 'react';
import { Card } from 'react-bootstrap';
import Breadcrumb from '../../layouts/AdminLayout/Breadcrumb';
import AuthLogin from './JWTLogin';
import logo from '../../assets/images/logo.png';
import { useTheme } from '../../contexts/themeContext';

const Signin1 = () => {
  const { mode } = useTheme();
  return (
    <React.Fragment>
      <div className={`auth-wrapper ${mode}`}>
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless text-center">
            <Card.Body>
              <div className="mb-4">
                <img src={logo} alt="" width={70} />
              </div>
              <AuthLogin />
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signin1;
