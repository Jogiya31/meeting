import React from 'react';
import { Card, Tab, Tabs } from 'react-bootstrap';
import AuthLogin from './JWTLogin';
import logo from '../../assets/images/logo.png';
import { useTheme } from '../../contexts/themeContext';
import AdminLogin from './AdminLogin';

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
            <Card.Body className="p-0 login-container">
              <div className="mb-4 mt-3">
                <img src={logo} alt="" width={70} />
              </div>
              <Tabs defaultActiveKey="user" id="fill-tab-example" fill>
                <Tab eventKey="user" title="User">
                  <AuthLogin />
                </Tab>
                <Tab eventKey="admin" title="Admin">
                  <AdminLogin />
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signin1;
