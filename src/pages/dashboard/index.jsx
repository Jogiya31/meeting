import api from '../../api';
import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const DashDefault = () => {
  const [counts, setCounts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Call the GET API to fetch users
    api
      .get('/dashboardCounts')
      .then((response) => {
        setCounts(response.data);
      })
      .catch((err) => {
        setError('Error fetching users');
        console.error(err);
      });
  }, []);

  return (
    <React.Fragment>
      <Row>
        <Col xl={6} xxl={4}>
          <Card className="customcard">
            <Card.Body>
              <h6 className="mb-4">Total Users</h6>
              <div className="row d-flex align-items-center">
                <div className="col-9">
                  <h3 className="f-w-300 d-flex align-items-center m-b-0">
                    <i className={`feather users text-c-blue f-30 m-r-5`}> {counts && counts.totalUsers}</i>
                  </h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} xxl={4}>
          <Card className="customcard">
            <Card.Body>
              <h6 className="mb-4">Preset Users</h6>
              <div className="row d-flex align-items-center">
                <div className="col-9">
                  <h3 className="f-w-300 d-flex align-items-center m-b-0">
                    <i className={`feather users text-c-green f-30 m-r-5`}> {counts && counts.presentUsers} </i>
                  </h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} xxl={4}>
          <Card className="customcard">
            <Card.Body>
              <h6 className="mb-4">Absent Users</h6>
              <div className="row d-flex align-items-center">
                <div className="col-9">
                  <h3 className="f-w-300 d-flex align-items-center m-b-0">
                    <i className={`feather users text-c-red f-30 m-r-5`}> {counts && counts.absentUsers} </i>
                  </h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} xxl={4}>
          <Card className="customcard">
            <Card.Body>
              <h6 className="mb-4">OnTime Users</h6>
              <div className="row d-flex align-items-center">
                <div className="col-9">
                  <h3 className="f-w-300 d-flex align-items-center m-b-0">
                    <i className={`feather users text-c-green f-30 m-r-5`}> {counts && counts.onTimeUsers} </i>
                  </h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} xxl={4}>
          <Card className="customcard">
            <Card.Body>
              <h6 className="mb-4">Late Users</h6>
              <div className="row d-flex align-items-center">
                <div className="col-9">
                  <h3 className="f-w-300 d-flex align-items-center m-b-0">
                    <i className={`feather users text-c-red f-30 m-r-5`}> {counts && counts.lateUsers} </i>
                  </h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default DashDefault;
