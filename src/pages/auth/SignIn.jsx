import React from 'react';
import { Card} from 'react-bootstrap';
import Breadcrumb from '../../layouts/AdminLayout/Breadcrumb';
import AuthLogin from './JWTLogin';
import logo from "../../assets/images/logo.png"

const Signin1 = () => {
  return (
    <React.Fragment>
      <Breadcrumb />
      <div className="auth-wrapper">
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
                <img src={logo} alt='' width={70} />
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
