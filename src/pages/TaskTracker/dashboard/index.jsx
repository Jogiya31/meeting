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
import DonutChart from '../../../components/charts/DonutChart';
import DonutChart2 from '../../../components/charts/DonutChat2';
import GroupedColumnChart from '../../../components/charts/GroupedColumnChart';
import { useAuth } from '../../../contexts/AuthContext';
import { useStore } from '../../../contexts/DataContext';
import { taskActions } from '../../../store/task/taskSlice';

const DashDefault = () => {
  const { mode, theme } = useTheme();
  const { role, user } = useAuth();
  const { filterWith } = useStore();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showProjects, setShowProjects] = useState(false);
  const [assignedTask, setAssignedTasks] = useState([]);
  const [UnAssignedTasks, setUnAssignedTasks] = useState([]);
  const [taskProgress, setTaskProgress] = useState([]);
  const [pendingTasksData, setPendingTasksData] = useState([]);
  const dashboardCountInfo = useSelector((state) => state.dashboard.data);
  const projectDataList = useSelector((state) => state.settings.projectData);
  const statusDataList = useSelector((state) => state.settings.statusData);
  const taskList = useSelector((state) => state.task.data);
  const userList = useSelector((state) => state.users.data);
  useEffect(() => {
    dispatch(
      taskActions.getTaskInfo({
        ProjectId: '',
        ModuleId: '',
        StatusMulti: '',
        UserId: role === 'user' ? user.UserId : '',
        StartDate: '',
        EndDate: '',
        GroupIdMulti: ''
      })
    );
    dispatch(dashboardActions.getdashboardInfo({ UserId: role === 'user' ? user.UserId : 0 }));
    dispatch(meetingsActions.getMeetingsInfo());
    dispatch(userActions.getuserInfo());
    dispatch(settingsActions.getProjectInfo());
    dispatch(settingsActions.getDesignationInfo());
    dispatch(settingsActions.getStatusInfo());
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
  const labels = ['CCBS', 'DAID', 'PRAYAS', 'TEJAS'];

  const groupsData = [
    {
      label: 'CCBS - Total Tasks',
      data: [40, 0, 0, 0],
      backgroundColor: '#00C9A7'
    },
    {
      label: 'CCBS - Pending Task',
      data: [12, 0, 0, 0],
      backgroundColor: '#333'
    },
    {
      label: 'DAID - Total Tasks',
      data: [0, 10, 0, 0],
      backgroundColor: '#ff5b5b'
    },
    {
      label: 'DAID - Pending Task',
      data: [0, 5, 0, 0],
      backgroundColor: '#f5c518'
    },
    {
      label: 'PRAYAS - Total Tasks',
      data: [0, 0, 25, 0],
      backgroundColor: '#444'
    },
    {
      label: 'PRAYAS - Pending Task',
      data: [0, 0, 90, 0],
      backgroundColor: '#8ed6fb'
    },
    {
      label: 'TEJAS - Total Tasks',
      data: [0, 0, 0, 45],
      backgroundColor: '#ff9c6e'
    },
    {
      label: 'TEJAS - Pending Task',
      data: [0, 0, 0, 3],
      backgroundColor: '#b478c2'
    }
  ];

  useEffect(() => {
    if (taskList?.Result && userList?.Result) {
      const assignedTasks = [];
      const unAssignedTasks = [];
      const progressMap = {};

      taskList.Result.forEach((item) => {
        // Split and clean User IDs
        const assignedIds =
          item.UserId?.split(',')
            .map((id) => id.trim())
            .filter((id) => id && id !== '0') || [];

        const changeAssignIds =
          item.ChangeAssignTo?.split(',')
            .map((id) => id.trim())
            .filter((id) => id) || [];

        // Combine and deduplicate IDs
        const allAssignedUserIds = Array.from(new Set([...assignedIds, ...changeAssignIds]));

        if (allAssignedUserIds.length === 0) {
          unAssignedTasks.push(item);
        } else {
          // Get assigned user names
          const userNames = allAssignedUserIds
            .map((uid) => userList.Result.find((u) => u.UserId?.trim() === uid)?.UserName)
            .filter(Boolean);

          assignedTasks.push({
            ...item,
            AssignedToUsers: userNames.join(', ')
          });

          // Update progress stats
          allAssignedUserIds.forEach((userId) => {
            const user = userList.Result.find((u) => u.UserId?.trim() === userId);
            const userName = user?.UserName || `User ID: ${userId}`;

            if (!progressMap[userId]) {
              progressMap[userId] = {
                userId,
                userName,
                taskAssigned: 0,
                taskpending: 0,
                taskComplete: 0,
                taskProgress: 0
              };
            }

            progressMap[userId].taskAssigned += 1;

            const status = item.Status?.toLowerCase() || '';
            if (status === 'pending' || status === 'inprogress') {
              progressMap[userId].taskpending += 1;
            } else if (status === 'completed') {
              progressMap[userId].taskComplete += 1;
            }

            progressMap[userId].taskProgress =
              ((progressMap[userId].taskComplete / progressMap[userId].taskAssigned) * 100).toFixed(2) + '%';
          });
        }
      });

      // Extract pendingTasksData
      const pending = Object.values(progressMap)
        .filter((user) => user.taskAssigned > 0)
        .map((user) => ({
          name: user.userName,
          tasks: user.taskAssigned
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      // Set all states
      setAssignedTasks(assignedTasks);
      setUnAssignedTasks(unAssignedTasks);
      setTaskProgress(Object.values(progressMap));
      setPendingTasksData(pending);
    }
  }, [taskList, userList]);
  return (
    <React.Fragment>
      <div className="dashboard-cards grid-wrapper">
        <div className="grid-inner">
          <div className={`grid-item ${role === 'user' && 'd-none'}`}>
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
          <div className={`grid-item ${role === 'user' && 'd-none'}`}>
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
              onClick={() => {
                handleCardClick('task');
                filterWith(null);
              }}
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
              onClick={() => {
                handleCardClick('task');
                filterWith(statusDataList?.Result?.filter((item) => item.StatusTitle === 'Completed'));
              }}
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
              onClick={() => {
                handleCardClick('task');
                filterWith(statusDataList?.Result?.filter((item) => item.StatusTitle === 'Pending'));
              }}
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
              onClick={() => {
                handleCardClick('task');
                filterWith(statusDataList?.Result?.filter((item) => item.StatusTitle === 'Inprogress'));
              }}
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
        {role !== 'user' && (
          <Row>
            {/* <Col md={6}>
              <Card className="mt-3">
                <Card.Body className="p-0">
                  <div className="dashboard-barchart">
                    <GroupedColumnChart data={groupsData} labels={labels} title="Total Tasks/Pending Tasks By group" />
                  </div>
                </Card.Body>
              </Card>
            </Col> */}
            <Col md={6}>
              <Card className="mt-3">
                <Card.Body className="p-0">
                  <div className="dashboard-donut">
                    <DonutChart2 title="Pending Tasks By Team Members" data={pendingTasksData} />;
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
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
