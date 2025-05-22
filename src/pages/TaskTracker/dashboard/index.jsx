import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Card, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { dashboardActions } from '../../../store/dashboard/dashboardSlice';
import './style.scss';
import { useNavigate } from 'react-router-dom';
import { meetingsActions } from '../../../store/mom/momSlice';
import { userActions } from '../../../store/user/userSlice';
import { motion } from 'framer-motion';
import { settingsActions } from '../../../store/settings/settingSlice';
import { FaProjectDiagram } from 'react-icons/fa';
import { useTheme } from '../../../contexts/themeContext';

const DashDefault = () => {
  const { mode, theme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showProjects, setShowProjects] = useState(false);
  const dashboardCountInfo = useSelector((state) => state.dashboard.data);
  const projectDataList = useSelector((state) => state.settings.projectData);

  useEffect(() => {
    dispatch(dashboardActions.getdashboardInfo());
    dispatch(meetingsActions.getMeetingsInfo());
    dispatch(userActions.getuserInfo());
    dispatch(settingsActions.getProjectInfo());
    dispatch(settingsActions.getDesignationInfo());
  }, []);

  const calculatePercentage = (part, total) => (total > 0 ? (part / total) * 100 : 0);

  const stats = dashboardCountInfo?.Result?.[0];

  const handleCardClick = (card) => {
    if (card === 'user') {
      navigate('/tasktracker/users');
    } else if (card === 'task') {
      navigate('/tasktracker/Task-List');
    }
  };

  const handleClose = () => {
    setShowProjects(false);
  };

  const groupData = [
    { name: 'CCBS', total: 41, pending: 13 },
    { name: 'DAID', total: 10, pending: 4 },
    { name: 'PRAYAS', total: 30, pending: 94 },
    { name: 'TEJAS', total: 44, pending: 2 }
  ];
  const columns = [
    [
      { label: 'CCBS - Total Tasks', color: '#00C9A7' },
      { label: 'CCBS - Pending Task', color: '#333' }
    ],
    [
      { label: 'DAID - Total Tasks', color: '#ff5b5b' },
      { label: 'DAID - Pending Task', color: '#f5c518' }
    ],
    [
      { label: 'PRAYAS - Total Tasks', color: '#444' },
      { label: 'PRAYAS - Pending Task', color: '#8ed6fb' }
    ],
    [
      { label: 'TEJAS - Total Tasks', color: '#ff9c6e' },
      { label: 'TEJAS - Pending Task', color: '#b478c2' }
    ]
  ];

  const legendItems = [
    { label: 'CCBS - Total Tasks', color: '#00C9A7' },
    { label: 'CCBS - Pending Task', color: '#333' },
    { label: 'DAID - Total Tasks', color: '#ff5b5b' },
    { label: 'DAID - Pending Task', color: '#f5c518' },
    { label: 'PRAYAS - Total Tasks', color: '#444' },
    { label: 'PRAYAS - Pending Task', color: '#8ed6fb' },
    { label: 'TEJAS - Total Tasks', color: '#ff9c6e' },
    { label: 'TEJAS - Pending Task', color: '#b478c2' }
  ];
  return (
    <React.Fragment>
      <div className="dashboard-cards grid-wrapper">
        <div className="grid-inner">
          <div className="grid-item">
            <Card
              className={`customcard mb-1 ${theme === 'static' ? 'bg-color-7' : 'grd-bg-color-7'} pointer`}
              onClick={() => handleCardClick('user')}
            >
              <Card.Body>
                <Row>
                  <Col className="d-flex align-items-center">
                    <div>
                      <h6 className="mb-4">No. of Employes</h6>
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
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
          <div className="grid-item">
            <Card
              className={`customcard mb-1 ${theme === 'static' ? 'bg-color-12' : 'grd-bg-color-12'} pointer`}
              onClick={() => setShowProjects(!showProjects)}
            >
              <Card.Body>
                <Row>
                  <Col className="d-flex align-items-center">
                    <div>
                      <h6 className="mb-4">No. of Projects</h6>
                      <div className="row d-flex align-items-center">
                        <div className="col-9">
                          <h3 className="f-w-300 d-flex align-items-center m-b-0">
                            <i className={`text-c-purple f-40 m-r-5`}>{projectDataList?.Result?.length}</i>
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col className="d-flex  justify-content-end align-items-center">
                    <motion.i
                      className="text-c-purple icons f-67 m-r-5"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      children={<FaProjectDiagram />}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
          <div className="grid-item">
            <Card
              className={`customcard mb-1 ${theme === 'static' ? 'bg-color-3' : 'grd-bg-color-3'} pointer`}
              onClick={() => handleCardClick('task')}
            >
              <Card.Body>
                <Row>
                  <Col className="d-flex align-items-center">
                    <div>
                      <h6 className="mb-4">No. of tasks</h6>
                      <div className="row d-flex align-items-center">
                        <div className="col-9">
                          <h3 className="f-w-300 d-flex align-items-center m-b-0">
                            <i className={`text-c-grey f-40 m-r-5`}>{dashboardCountInfo?.Result?.[0]?.TotalTask}</i>
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col className="d-flex justify-content-end align-items-center">
                    <motion.i
                      className="fas fa-list text-c-grey icons f-80 m-r-5"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
          <div className="grid-item">
            <Card
              className={`customcard mb-1 ${theme === 'static' ? 'bg-color-4' : 'grd-bg-color-4'}  pointer`}
              onClick={() => handleCardClick('task')}
            >
              <Card.Body>
                <Row>
                  <Col className="d-flex align-items-center">
                    <div>
                      <h6 className="mb-4">No. of completed tasks</h6>
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
          </div>
          <div className="grid-item">
            <Card
              className={`customcard mb-1  ${theme === 'static' ? 'bg-color-5' : 'grd-bg-color-5'}  pointer`}
              onClick={() => handleCardClick('task')}
            >
              <Card.Body>
                <Row>
                  <Col className="d-flex align-items-center">
                    <div>
                      <h6 className="mb-4">No. of Panding tasks</h6>
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
          </div>
          <div className="grid-item">
            <Card
              className={`customcard mb-1 ${theme === 'static' ? 'bg-color-6' : 'grd-bg-color-6'}  pointer`}
              onClick={() => handleCardClick('task')}
            >
              <Card.Body>
                <Row>
                  <Col className="d-flex align-items-center">
                    <div>
                      <h6 className="mb-4">No. of tasks Inprogress</h6>
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
          </div>
        </div>
        <Row>
          <Col md={6}>
            <Card>
              <Card.Header>
                <Card.Title as="h5">Grouped Multi-Bar Chart</Card.Title>
              </Card.Header>
              <Card.Body>
                <div>
                  <h3 style={{ textAlign: 'center', marginBottom: 20 }}>Total Tasks/Pending Tasks By group</h3>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginBottom: '10px',
                      gap: '40px' // spacing between columns
                    }}
                  >
                    {columns.map((col, colIndex) => (
                      <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {col.map((item) => (
                          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div
                              style={{
                                width: 12,
                                height: 12,
                                backgroundColor: item.color,
                                borderRadius: 2
                              }}
                            ></div>
                            <span style={{ fontSize: 13 }}>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

         
        </Row>
      </div>

      <Modal show={showProjects} animation={true} backdrop="static" keyboard={false}>
        <Modal.Header className={mode}>
          <Modal.Title className="dashboardModalHeader">
            <h5>Total no. of projects</h5>
          </Modal.Title>
          <span className="pointer" onClick={handleClose}>
            X
          </span>
        </Modal.Header>
        <Modal.Body className={`p-4 ${mode}`}>
          {projectDataList?.Result?.length > 0 && (
            <div className="events">
              <ul className="event-list p-0">
                {projectDataList?.Result?.filter((proj) => String(proj.Status) === String(1)).map((item, index) => (
                  <li key={index.id + '__'} className="item">
                    <div className="d-flex align-items-center">
                      <span>{index + 1}.</span>
                      <p className="m-0 p-1">{item.ProjectTitle}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default DashDefault;
