import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Card, Modal, Accordion, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { dashboardActions } from '../../store/dashboard/dashboardSlice';
import DonutChart from '../../components/chart/DonutChart';
import TaskCalendar from 'components/TaskCalander';
import moment from 'moment';
import pdf_i from '../../assets/images/pdf_i.svg';
import './style.scss';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../contexts/DataContext';
import { meetingsActions } from '../../store/mom/momSlice';
import { userActions } from '../../store/user/userSlice';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';

const DashDefault = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pdfContent = useRef();
  const { filterWith } = useStore();
  const [events, setEvents] = useState([]);
  const [showInfo, setshowInfo] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const dashboardCountInfo = useSelector((state) => state.dashboard.data);
  const MeetingLists = useSelector((state) => state.meetings.data);
  const userList = useSelector((state) => state.users.data);

  useEffect(() => {
    dispatch(dashboardActions.getdashboardInfo());
    dispatch(meetingsActions.getMeetingsInfo());
    dispatch(userActions.getuserInfo());
  }, []);

  useEffect(() => {
    if (MeetingLists?.MeetingDetails) {
      setEvents(
        MeetingLists?.MeetingDetails.map((row) => ({
          id: row.MeetingId,
          title: row.MeetingTitle,
          start: moment(row.MeetingDate, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD'),
          backgroundColor: '#098a30'
        }))
      );
    }
  }, [MeetingLists]);

  useEffect(() => {
    if (selectedEventId) setSelectedMeeting(MeetingLists?.MeetingDetails.filter((item) => item.MeetingId === selectedEventId));
  }, [selectedEventId]);

  useEffect(() => {
    if (selectedMeeting?.length) setshowInfo(true);
  }, [selectedMeeting]);

  const handleEvents = (data) => {
    setEvents(data);
  };

  const calculatePercentage = (part, total) => (total > 0 ? (part / total) * 100 : 0);

  const stats = dashboardCountInfo?.Result?.[0];

  const handleCardClick = (card) => {
    if (card === 'user') {
      navigate('/meetings/users');
    } else if (card === 'meeting') {
      filterWith(null);
      navigate('/meetings/view');
    } else if (card === 'panding') {
      filterWith(1);
      navigate('/meetings/view');
    } else if (card === 'inprogress') {
      filterWith(2);
      navigate('/meetings/view');
    } else if (card === 'completed') {
      filterWith(3);
      navigate('/meetings/view');
    }
  };

  const handleClose = () => {
    setshowInfo(false);
  };

  const exportPdf = () => {
    if (!pdfContent.current) return;

    html2canvas(pdfContent.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Meeting_Details_${moment(selectedMeeting?.[0]?.MeetingDate, 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY')}.pdf`);
    });
    setshowInfo(false);
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
                      <motion.i
                        className="fas fa-users text-c-brown icons f-80 m-r-5"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                      {/* <i className="fas fa-users text-c-brown icons f-80 m-r-5"></i> */}
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
                    <motion.i
                        className="fas fa-handshake text-c-blue icons f-80 m-r-5"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                      {/* <i className="fas fa-handshake text-c-blue icons f-80 m-r-5"></i> */}
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
                    <Col className="d-flex justify-content-end align-items-center">
                    <motion.i
                        className="fas fa-list text-c-purple icons f-80 m-r-5"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                      {/* <i className="fas fa-list text-c-purple icons f-80 m-r-5"></i> */}
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
                      <DonutChart
                        percentage={calculatePercentage(stats?.TotalComplete, stats?.TotalTask).toFixed(2)}
                        PercentageColor="#098a30"
                      />
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
                      <DonutChart
                        percentage={calculatePercentage(stats?.TotalPending, stats?.TotalTask).toFixed(2)}
                        PercentageColor="#791864"
                      />
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
                      <DonutChart
                        percentage={calculatePercentage(stats?.TotalInprogress, stats?.TotalTask).toFixed(2)}
                        PercentageColor="#f4a100"
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col sm={12} md={6} lg={6} xl={6} xxl={6}>
          <Card className="calander-card p-3 m-0">
            <TaskCalendar extra="dashboard-cal" eventsData={events} handleEvets={handleEvents} handleSelectedEvent={setSelectedEventId} />
          </Card>
        </Col>
      </Row>

      <Modal size="xl" show={showInfo} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title className="dashboardModalHeader">
            <h5>Meeting Details</h5>
            <img src={pdf_i} width={30} className="mr-1 pointer" alt="" onClick={exportPdf} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4" ref={pdfContent}>
          <Row>
            <Col md={12}>
              <div className="d-flex">
                <span className="report-label mr-1" style={{ width: '50px' }}>
                  Title :{' '}
                </span>
                <span>{selectedMeeting?.[0]?.MeetingTitle}</span>
              </div>
              <div className="d-flex">
                <span className="report-label mr-1" style={{ width: '50px' }}>
                  Date :{' '}
                </span>
                <span>{moment(selectedMeeting?.[0]?.MeetingDate, 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY')}</span>
              </div>
              <div className="d-flex">
                <span className="report-label mr-1" style={{ width: '50px' }}>
                  Time :{' '}
                </span>
                <span>{moment(selectedMeeting?.[0]?.currentTime).format('h:mm a')}</span>
              </div>
            </Col>

            <Col md={12} className="mt-3">
              <Accordion defaultActiveKey="1">
                <Accordion.Item eventKey="1">
                  <Accordion.Header className="mb-3">
                    <label className="fs-6 m-0 report-label pointer">Attendance List</label>
                  </Accordion.Header>
                  <Accordion.Body className="p-0 dark-table">
                    <Table responsive hover>
                      <thead>
                        <tr className="">
                          <th className="" style={{ width: '50px' }}>
                            Sno
                          </th>
                          <th className="w-60">Name</th>
                          <th className="w-20">Designation</th>
                          <th className="w-20">Division</th>
                          <th className="w-20">Company</th>
                          <th className="w-20">Mobile</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedMeeting?.[0]?.Attendance.map((item, idx) => {
                          const user = userList?.Result?.find((u) => u.UserId === item.userId);
                          if (item.userId !== '') {
                            return (
                              <tr key={`${item.userId}-${idx}_${Math.random()}`}>
                                <td>{idx + 1}</td>
                                <td>{item.UserName}</td>
                                <td>{item.DesignationTitle}</td>
                                <td>{item.DivisionTitle}</td>
                                <td>{item.OrganisationTitle}</td>
                                <td>{item.Mobile}</td>
                              </tr>
                            );
                          }
                          return;
                        })}
                      </tbody>
                    </Table>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <div></div>
            </Col>

            <Col md={12} className="mt-3">
              <Accordion defaultActiveKey="1">
                <Accordion.Item eventKey="1">
                  <Accordion.Header className="mb-3">
                    <label className="fs-6 m-0 report-label pointer">Discussion Points</label>
                  </Accordion.Header>
                  <Accordion.Body className="p-0 inner-table">
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th className="" style={{ width: '50px' }}>
                            Sno
                          </th>
                          <th className="w-60">Discussion Points</th>
                          <th className="w-20">End date</th>
                          <th className="w-20">Assign To</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedMeeting?.[0]?.DiscussionsPoint.map((item, idx) => {
                          const userIds = Array.isArray(item.UserId) ? item.UserId : item.UserId.split(',');
                          return (
                            <tr key={`${idx}-${idx}-${Math.random()}`}>
                              <td>{idx + 1}</td>
                              <td>{item.Description}</td>
                              <td>{moment(item.EndDate, 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY')}</td>
                              <td>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                  {userIds.map((id, index) => {
                                    const user = userList?.Result?.find((u) => Number(u.UserId) === Number(id));
                                    return user ? (
                                      <span key={`${index}__${Math.random()}`} className="label-user" onClick={() => handleUserInfo(user)}>
                                        {user.UserName}
                                      </span>
                                    ) : null;
                                  })}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default DashDefault;
