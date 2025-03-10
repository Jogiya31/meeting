import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { userActions } from '../../store/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { meetingsActions } from '../../store/mom/momSlice';

const DashDefault = () => {
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.users.data);
  const MeetingLists = useSelector((state) => state.meetings.data);

  useEffect(() => {
    // Call the GET API to fetch users
    dispatch(userActions.getuserInfo());
    dispatch(meetingsActions.getMeetingsInfo());
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
                    <i className={`feather users text-c-blue f-30 m-r-5`}> {userList?.Result?.length}</i>
                  </h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} xxl={4}>
          <Card className="customcard">
            <Card.Body>
              <h6 className="mb-4">Total meeting</h6>
              <div className="row d-flex align-items-center">
                <div className="col-9">
                  <h3 className="f-w-300 d-flex align-items-center m-b-0">
                    <i className={`feather users text-c-green f-30 m-r-5`}> {MeetingLists?.MeetingDetails?.length} </i>
                  </h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} xxl={4}>
          <Card className="customcard">
            <Card.Body>
              <h6 className="mb-4">Total tasks</h6>
              <div className="row d-flex align-items-center">
                <div className="col-9">
                  <h3 className="f-w-300 d-flex align-items-center m-b-0">
                    <i className={`feather users text-c-red f-30 m-r-5`}> 0</i>
                  </h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} xxl={4}>
          <Card className="customcard">
            <Card.Body>
              <h6 className="mb-4">Total completed tasks</h6>
              <div className="row d-flex align-items-center">
                <div className="col-9">
                  <h3 className="f-w-300 d-flex align-items-center m-b-0">
                    <i className={`feather users text-c-green f-30 m-r-5`}> 0 </i>
                  </h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} xxl={4}>
          <Card className="customcard">
            <Card.Body>
              <h6 className="mb-4">Total Panding tasks</h6>
              <div className="row d-flex align-items-center">
                <div className="col-9">
                  <h3 className="f-w-300 d-flex align-items-center m-b-0">
                    <i className={`feather users text-c-red f-30 m-r-5`}> 0 </i>
                  </h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={6} xxl={4}>
          <Card className="customcard">
            <Card.Body>
              <h6 className="mb-4">Total tasks on hold</h6>
              <div className="row d-flex align-items-center">
                <div className="col-9">
                  <h3 className="f-w-300 d-flex align-items-center m-b-0">
                    <i className={`feather users text-c-red f-30 m-r-5`}> 0 </i>
                  </h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>{/* <TaskCalendar /> */}</Col>
      </Row>
    </React.Fragment>
  );
};

export default DashDefault;
