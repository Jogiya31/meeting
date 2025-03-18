import React, { useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { dashboardActions } from '../../store/dashboard/dashboardSlice';
import DonutChart from '../../components/chart/DonutChart';

const DashDefault = () => {
  const dispatch = useDispatch();
  const dashboardCountInfo = useSelector((state) => state.dashboard.data);

  useEffect(() => {
    dispatch(dashboardActions.getdashboardInfo());
  }, []);

  const calculatePercentage = (part, total) => (total > 0 ? (part / total) * 100 : 0);

  const stats = dashboardCountInfo?.Result?.[0];
  return (
    <React.Fragment>
      <Row className="dashboard-cards">
        <Col md={6} xl={4} xxl={3}>
          <Card className="customcard bg-color-7">
            <Card.Body>
              <Row>
                <Col className="d-flex align-items-center">
                  <div>
                    <h6 className="mb-4">Total Users</h6>
                    <div className="row d-flex align-items-center">
                      <div className="col-9">
                        <h3 className="f-w-300 d-flex align-items-center m-b-0">
                          <i className={`text-c-brown f-40 m-r-5`}>{dashboardCountInfo?.Result?.[0]?.TotalUser}</i>
                        </h3>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="d-flex  justify-content-end align-items-center">
                  <i className="fas fa-users text-c-brown f-80 m-r-5"></i>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} xl={4} xxl={3}>
          <Card className="customcard bg-color-2 ">
            <Card.Body>
              <Row>
                <Col className="d-flex align-items-center">
                  <div>
                    <h6 className="mb-4">Total meeting</h6>
                    <div className="row d-flex align-items-center">
                      <div className="col-9">
                        <h3 className="f-w-300 d-flex align-items-center m-b-0">
                          <i className={`text-c-blue f-40 m-r-5`}>{dashboardCountInfo?.Result?.[0]?.TotalMeeting}</i>
                        </h3>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="d-flex  justify-content-end align-items-center">
                  <i className="fas fa-handshake text-c-blue f-80 m-r-5"></i>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} xl={4} xxl={3}>
          <Card className="customcard bg-color-3">
            <Card.Body>
              <Row>
                <Col className="d-flex align-items-center">
                  <div>
                    <h6 className="mb-4">Total tasks</h6>
                    <div className="row d-flex align-items-center">
                      <div className="col-9">
                        <h3 className="f-w-300 d-flex align-items-center m-b-0">
                          <i className={`text-c-purple f-40 m-r-5`}>{dashboardCountInfo?.Result?.[0]?.TotalTask}</i>
                        </h3>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="d-flex  justify-content-end align-items-center">
                  <i className="fas fa-list text-c-purple f-80 m-r-5"></i>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} xl={4} xxl={3}>
          <Card className="customcard bg-color-4">
            <Card.Body>
              <Row>
                <Col className="d-flex align-items-center">
                  <div>
                    <h6 className="mb-4">Total completed tasks</h6>
                    <div className="row d-flex align-items-center">
                      <div className="col-9">
                        <h3 className="f-w-300 d-flex align-items-center m-b-0">
                          <i className={`text-c-green f-40 m-r-5`}>{dashboardCountInfo?.Result?.[0]?.TotalComplete}</i>
                        </h3>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="d-flex  justify-content-end align-items-center">
                  <DonutChart percentage={calculatePercentage(stats?.TotalComplete, stats?.TotalTask)} PercentageColor="#098a30" />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} xl={4} xxl={3}>
          <Card className="customcard  bg-color-5">
            <Card.Body>
              <Row>
                <Col className="d-flex align-items-center">
                  <div>
                    <h6 className="mb-4">Total Panding tasks</h6>
                    <div className="row d-flex align-items-center">
                      <div className="col-9">
                        <h3 className="f-w-300 d-flex align-items-center m-b-0">
                          <i className={`text-c-pink f-40 m-r-5`}>{dashboardCountInfo?.Result?.[0]?.TotalPending}</i>
                        </h3>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="d-flex  justify-content-end align-items-center">
                  <DonutChart percentage={calculatePercentage(stats?.TotalPending, stats?.TotalTask)} PercentageColor="#791864" />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} xl={4} xxl={3}>
          <Card className="customcard bg-color-6">
            <Card.Body>
              <Row>
                <Col className="d-flex align-items-center">
                  <div>
                    <h6 className="mb-4">Total tasks Inprogress</h6>
                    <div className="row d-flex align-items-center">
                      <div className="col-9">
                        <h3 className="f-w-300 d-flex align-items-center m-b-0">
                          <i className={`text-c-default f-40 m-r-5`}>{dashboardCountInfo?.Result?.[0]?.TotalInprogress}</i>
                        </h3>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col className="d-flex  justify-content-end align-items-center">
                  <DonutChart percentage={calculatePercentage(stats?.TotalInprogress, stats?.TotalTask)} PercentageColor="#f4a100" />
                </Col>
              </Row>
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
