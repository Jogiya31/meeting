import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { dashboardActions } from '../../store/dashboard/dashboardSlice';
import DonutChart from '../../components/chart/DonutChart';
import TaskCalendar from 'components/TaskCalander';
import './style.scss';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../contexts/DataContext';
import { meetingsActions } from 'store/mom/momSlice';
import moment from 'moment';

const DashDefault = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { filterWith } = useStore();
  const [events, setEvents] = useState([]);
  const dashboardCountInfo = useSelector((state) => state.dashboard.data);
  const MeetingLists = useSelector((state) => state.meetings.data);

  useEffect(() => {
    dispatch(dashboardActions.getdashboardInfo());
    dispatch(meetingsActions.getMeetingsInfo());
  }, []);

  useEffect(() => {
    if (MeetingLists?.MeetingDetails) {
      setEvents(
        MeetingLists.MeetingDetails.map((row) => ({
          id: row.MeetingId,
          title: row.MeetingTitle,
          start: moment(row.endDate).format('YYYY-MM-DD'),
          backgroundColor: '#098a30'
        }))
      );
    }
  }, [MeetingLists]);

  const handleEvents = (data) => {
    setEvents(data)
  };

  const calculatePercentage = (part, total) => (total > 0 ? (part / total) * 100 : 0);

  const stats = dashboardCountInfo?.Result?.[0];

  const handleCardClick = (card) => {
    if (card === 'user') {
      navigate('/meetings/users');
    } else if (card === 'meeting') {
      filterWith(null);
      navigate('/meetings/viewPoints');
    } else if (card === 'panding') {
      filterWith(1);
      navigate('/meetings/viewPoints');
    } else if (card === 'inprogress') {
      filterWith(2);
      navigate('/meetings/viewPoints');
    } else if (card === 'completed') {
      filterWith(3);
      navigate('/meetings/viewPoints');
    }
  };

  return (
    <React.Fragment>
      <Row className="dashboard-cards">
        <Col sm={12} md={6} xl={6} xxl={6}>
          <Row>
            <Col sm={12} md={6} xl={6} xxl={6}>
              <Card className="customcard bg-color-7 pointer" onClick={() => handleCardClick('user')}>
                <Card.Body>
                  <Row>
                    <Col className="d-flex align-items-center">
                      <div>
                        <h6 className="mb-4">Total Employee's</h6>
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
                      <i className="fas fa-users text-c-brown icons f-80 m-r-5"></i>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={6} xl={6} xxl={6}>
              <Card className="customcard bg-color-2 pointer" onClick={() => handleCardClick('meeting')}>
                <Card.Body>
                  <Row>
                    <Col className="d-flex align-items-center">
                      <div>
                        <h6 className="mb-4">Total meeting's</h6>
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
                      <i className="fas fa-handshake text-c-blue icons f-80 m-r-5"></i>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={6} xl={6} xxl={6}>
              <Card className="customcard bg-color-3 pointer" onClick={() => handleCardClick('meeting')}>
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
                      <i className="fas fa-list text-c-purple icons f-80 m-r-5"></i>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={12} md={6} xl={6} xxl={6}>
              <Card className="customcard bg-color-4 pointer" onClick={() => handleCardClick('completed')}>
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
            <Col sm={12} md={6} xl={6} xxl={6}>
              <Card className="customcard  bg-color-5 pointer" onClick={() => handleCardClick('panding')}>
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
            <Col sm={12} md={6} xl={6} xxl={6}>
              <Card className="customcard bg-color-6 pointer" onClick={() => handleCardClick('inprogress')}>
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
        </Col>
        <Col sm={12} md={6} lg={6} xl={6} xxl={6}>
          <Card className="customcard p-3 m-0">
            <TaskCalendar extra="dashboard-cal" eventsData={events} handleEvets={handleEvents} />
          </Card>
        </Col>
      </Row>
      <Row></Row>
    </React.Fragment>
  );
};

export default DashDefault;
