import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Card, Table, Form, CardSubtitle, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import pdf from '../../assets/images/pdf_i.svg';
import api from '../../api';
import { PDFExport } from '@progress/kendo-react-pdf';
import moment from 'moment';

const AttendanceHistoryList = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [filter, setfilter] = useState();
  const [period, setPeriod] = useState(); // Default to 3 'today'

  const pdfExportComponent = useRef();
  const currentDateTime = moment(); // Get the current date and time
  const filetimeStamp = currentDateTime.format('DD/MM/YYYY HH_mm');

  useEffect(() => {
    // Fetch the attendance data based on the selected period
    // if (period) {
    //   api
    //     .get(`/attendance/${period}`)
    //     .then((response) => {
    //       setAttendanceList(response.data.data);
    //     })
    //     .catch((err) => {
    //       console.error('Error fetching attendance data:', err);
    //     });
    // }
  }, [period]);

  const getPdfHeader = (props) => (
    <div>
      <div
        className="CKR__header__sticky"
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%'
        }}
      >
        <div className="text-center mt-1">
          <h2>DAID Attendance</h2>
        </div>
      </div>
      <div
        className="d-flex justify-content-between align-items-center"
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '20px',
          width: '98%'
        }}
      >
        <div className="ml-1">Report generated on {currentDateTime.format('DD/MM/YYYY')}</div>
        <div className="mr-2">
          {props.pageNum} / {props.totalPages}
        </div>
      </div>
    </div>
  );
  const handlePdf = () => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
    }
  };

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card className="Recent-Users widget-focus-lg header-success">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <Card.Title as="h5">Attendance List</Card.Title>
              <CardSubtitle className="d-flex">
                <Form.Group className="mb-3" controlId="exampleForm.ControlSelect1">
                  <Form.Control
                    as="select"
                    value={filter || ''}
                    onChange={(e) => {
                      setfilter(e.target.value), setPeriod(e.target.value);
                    }}
                  >
                    <option value="1">Today </option>
                    <option value="2">This Week</option>
                    <option value="3">This Month</option>
                    <option value="4">Last 6 Month</option>
                    <option value="5">This year</option>
                  </Form.Control>
                </Form.Group>
                <Image src={pdf} height={30} alt="export" className="ml-1" onClick={() => handlePdf()} />
              </CardSubtitle>
            </Card.Header>
            <Card.Body className="px-0 py-2">
              <PDFExport
                ref={pdfExportComponent}
                pageTemplate={getPdfHeader}
                fileName={`DAID Attendance - ${filetimeStamp}`}
                paperSize="A4"
                margin={{
                  top: '1cm',
                  left: '1cm',
                  right: '1cm',
                  bottom: '1cm'
                }}
                scale={0.4}
              >
                <Table responsive className="recent-users mt-0">
                  <thead className="header-bg">
                    <tr>
                      <td></td>
                      <td>UserName</td>
                      <td>Division</td>
                      <td>Punch Time</td>
                      <td className="text-center">Status</td>
                      <td>Date</td>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceList &&
                      attendanceList.map((item, index) => (
                        <tr className="unread" key={index}>
                          <td>
                            <img className="rounded-circle" style={{ width: '40px' }} src={item.avatar || avatar2} alt="activity-user" />
                          </td>
                          <td>
                            <h6 className="mb-1">{item.userName}</h6>
                          </td>
                          <td>
                            <p className="m-0">{item.division}</p>
                          </td>
                          <td>
                            {' '}
                            <p className="m-0">
                              {item.punchIn === 1
                                ? 'Before 9am'
                                : item.punchIn === 2
                                  ? 'Before 9:10am'
                                  : item.punchIn === 3
                                    ? 'Before 9:15am'
                                    : item.punchIn === 3
                                      ? 'After 9:15am'
                                      : 'On Leave'}
                            </p>
                          </td>
                          <td className="text-center">
                            {item.attendanceStatus === 0 && (
                              <Link to="#" className="label theme-bg3 text-white f-12">
                                Leave
                              </Link>
                            )}

                            {item.attendanceStatus === 1 && (
                              <Link to="#" className="label theme-bg text-white f-12">
                                On Time
                              </Link>
                            )}

                            {item.attendanceStatus === 2 && (
                              <Link to="#" className="label theme-bg2 text-white f-12">
                                Late
                              </Link>
                            )}
                          </td>
                          <td>{item.createDate && new Date(item.createDate).toLocaleDateString('en-CA')}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </PDFExport>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default AttendanceHistoryList;
