import EnhancedTable from 'components/Table';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import { MultiSelect } from 'react-multi-select-component';
import { useDispatch, useSelector } from 'react-redux';
import { taskActions } from '../../../store/task/taskSlice';
import { userActions } from '../../../store/user/userSlice';
import { useTheme } from '../../../contexts/themeContext';
import { settingsActions } from '../../../store/settings/settingSlice';
import { moduleActions } from '../../../store/module/moduleSlice';
import { useAuth } from '../../../contexts/AuthContext';
import './style.scss';
import TaskList from '../taskList';

const TaskAssigment = () => {
  const dispatch = useDispatch();
  const { mode } = useTheme();
  const { user, role } = useAuth();
  const [assignedTask, setassignedTask] = useState([]);
  const [UnAssignedTasks, setUnAssignedTasks] = useState([]);
  const [taskProgress, setTaskProgress] = useState([]);
  const [TaskformData, setTaskFormData] = useState({
    ProjectId: '',
    ModuleId: '',
    Task: '',
    TaskDescription: '',
    UserId: '',
    ChangeAssignTo: '',
    Status: '',
    Remark: ''
  });
  const [showNewTask, setShowNewTask] = useState(false);
  const [showUnAssignedTask, setShowUnAssignedTask] = useState(false);
  const [taskErrors, setTaskErrors] = useState({});
  const [selectedData, setselectedData] = useState(null);
  const [userOption, setuserOption] = useState([]);
  const [userFilter, setuserFilter] = useState([]);
  const [changeAssignedUserFilter, setChangeAssignedUserFilter] = useState([]);
  const [unAssignedUserOption, setUnAssignedUserOption] = useState([]);

  const projectDataList = useSelector((state) => state.settings.projectData);
  const moduleList = useSelector((state) => state.module.data);
  const taskList = useSelector((state) => state.task.data);
  const userList = useSelector((state) => state.users.data);
  const statusDataList = useSelector((state) => state.settings.statusData);

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
    dispatch(userActions.getuserInfo());
    dispatch(settingsActions.getProjectInfo());
    dispatch(moduleActions.getModuleInfo());
    dispatch(settingsActions.getStatusInfo());
  }, []);

  const handleEdit = (data) => {
    setselectedData(data);
    setShowNewTask(true);
  };

  const handleUnassignedEdit = (data) => {
    setselectedData(data);
    setShowUnAssignedTask(true);
  };

  useEffect(() => {
    if (selectedData) {
      const updatedFormData = {
        ...TaskformData,
        ProjectId: selectedData.ProjectId,
        ModuleId: selectedData.ModuleId,
        Task: selectedData.Task,
        TaskDescription: selectedData.Description,
        UserId: selectedData.UserId,
        ChangeAssignTo: selectedData.ChangeAssignTo,
        Status: selectedData.Status,
        Remark: selectedData.Remark || ''
      };
      setTaskFormData(updatedFormData);
    }
  }, [selectedData]);

  useEffect(() => {
    if (!selectedData || !userList?.Result?.length) return;

    const userIdSet = new Set();

    const collectIds = (idString) => {
      if (!idString) return;
      idString.split(',').forEach((id) => {
        const trimmedId = id.trim();
        if (trimmedId && trimmedId !== '0') {
          userIdSet.add(trimmedId);
        }
      });
    };

    collectIds(selectedData.UserId);
    collectIds(selectedData.ChangeAssignTo);

    const filteredOptions = userList.Result.filter((user) => user.Status === '1' && userIdSet.has(user.UserId)).map((user) => ({
      label: user.UserName,
      value: user.UserId
    }));

    setuserOption(filteredOptions);
  }, [selectedData, userList]);

  useEffect(() => {
    if (showUnAssignedTask && userList?.Result?.length) {
      const options = userList.Result.filter((user) => user.Status === '1').map((user) => ({
        label: user.UserName,
        value: user.UserId
      }));

      setUnAssignedUserOption(options);
    }
  }, [showUnAssignedTask, userList]);

  useEffect(() => {
    if (taskList?.Result && userList?.Result) {
      const assignedTasks = [];
      const unAssignedTasks = [];
      const progressMap = {};

      taskList.Result.forEach((item) => {
        // Split and clean IDs
        const assignedIds =
          item.UserId?.split(',')
            .map((id) => id.trim())
            .filter((id) => id && id !== '0') || [];
        const changeAssignIds =
          item.ChangeAssignTo?.split(',')
            .map((id) => id.trim())
            .filter((id) => id) || [];

        // Combine and deduplicate
        const allAssignedUserIds = Array.from(new Set([...assignedIds, ...changeAssignIds]));

        if (allAssignedUserIds.length === 0) {
          unAssignedTasks.push({ ...item, StartDate: item?.StartDate?.split(' ')[0] });
        } else {
          // Get distinct user names
          const userNames = allAssignedUserIds
            .map((uid) => userList.Result.find((u) => u.UserId?.trim() === uid)?.UserName)
            .filter(Boolean);

          assignedTasks.push({
            ...item,
            AssignedToUsers: userNames.join(', '),
            StartDate: item?.StartDate?.split(' ')[0]
          });

          // Update progress stats
          if (role === 'user') {
            allAssignedUserIds
              .filter((item) => String(item) === String(user.UserId))
              .forEach((userId) => {
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
                if (status === '1' || status === '2') {
                  progressMap[userId].taskpending += 1;
                } else if (status === '3') {
                  progressMap[userId].taskComplete += 1;
                }
                progressMap[userId].taskProgress = (progressMap[userId].taskComplete / progressMap[userId].taskAssigned) * 100 + '%';
              });
          } else {
            allAssignedUserIds.forEach((userId, index) => {
              const user = userList.Result.find((u) => u.UserId?.trim() === userId);
              const userName = user?.UserName;

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
              if (status === '1' || status === '2') {
                progressMap[userId].taskpending += 1;
              } else if (status === '3') {
                progressMap[userId].taskComplete += 1;
              }
              progressMap[userId].taskProgress =
                ((progressMap[userId].taskComplete / progressMap[userId].taskAssigned) * 100).toFixed(2) + '%';
            });
          }
        }
      });

      setassignedTask(assignedTasks);
      setUnAssignedTasks(unAssignedTasks);
      setTaskProgress(Object.values(progressMap));
    }
  }, [taskList, userList]);

  const GroupHeaders = [
    { id: 'ProjectTitle', label: 'Project Name', class: '' },
    { id: 'ModuleName', label: 'Module Name', class: '' },
    { id: 'Task', label: 'Task Name', class: '' },
    { id: 'Description', label: 'Task Description', class: '' },
    { id: 'AssignedToUsers', label: 'Assigned Users', class: '' },
    { id: 'StartDate', label: 'Created At', class: '' }
  ];
  const unAssignedHeaders = [
    { id: 'ProjectTitle', label: 'Project Name', class: '' },
    { id: 'ModuleName', label: 'Module Name', class: '' },
    { id: 'Task', label: 'Task Name', class: '' },
    { id: 'Description', label: 'Task Description', class: '' },
    { id: 'StartDate', label: 'Created At', class: '' }
  ];

  const progressHeaders = [
    { id: 'userName', label: 'User Name', class: '' },
    { id: 'taskAssigned', label: 'Task Assigned', class: '' },
    { id: 'taskpending', label: 'Task Pending / Inprogress', class: '' },
    { id: 'taskComplete', label: 'Task Complete', class: '' },
    { id: 'taskProgress', label: 'Task Progress %', class: '' }
  ];

  const handleClose = () => {
    setShowNewTask(false);
    setShowUnAssignedTask(false);
    setTaskErrors({});
    setTaskFormData({
      ProjectId: '',
      ModuleId: '',
      Task: '',
      TaskDescription: '',
      Remark: '',
      UserId: ''
    });
    setuserFilter([]);
    setChangeAssignedUserFilter([]);
    setselectedData(null);
  };

  // Update UserId when userFilter changes
  useEffect(() => {
    if (!userList) return;

    let userPayload = '';
    if (userFilter && userFilter.length === userList?.Result?.filter((item) => item.Status === '1').length) {
      userPayload = '';
    } else if (userFilter && userFilter.length > 0) {
      userPayload = userFilter.map((item) => item.value).join(',');
    }

    setTaskFormData((prev) => ({
      ...prev,
      UserId: userPayload
    }));
  }, [userFilter, userList]);

  // Update ChangeAssignTo when changeAssignedUserFilter changes
  useEffect(() => {
    if (!userList) return;

    let userPayload = '';
    if (changeAssignedUserFilter && changeAssignedUserFilter.length === userList?.Result?.filter((item) => item.Status === '1').length) {
      userPayload = '';
    } else if (changeAssignedUserFilter && changeAssignedUserFilter.length > 0) {
      userPayload = changeAssignedUserFilter.map((item) => item.value).join(',');
    }

    setTaskFormData((prev) => ({
      ...prev,
      ChangeAssignTo: userPayload
    }));
  }, [changeAssignedUserFilter, userList]);

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskFormData({ ...TaskformData, [name]: value });
  };

  const validateTasks = () => {
    let newErrors = {};
    if (!TaskformData.ProjectId) newErrors.ProjectId = 'Required field.';
    if (!TaskformData.ModuleId) newErrors.ModuleId = 'Required field.';
    if (!TaskformData.Task) newErrors.Task = 'Required field.';
    if (!TaskformData.TaskDescription) newErrors.TaskDescription = 'Required field.';
    setTaskErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitTask = (e) => {
    e.preventDefault();
    if (!validateTasks()) return;

    const finalPayload = {
      ProjectId: TaskformData.ProjectId,
      ModuleId: TaskformData.ModuleId,
      Task: TaskformData.Task,
      TaskDescription: TaskformData.TaskDescription,
      UserId: TaskformData.UserId,

      DiscussionId: selectedData.DiscussionId,
      ModifyBy: user.UserName,
      Status: TaskformData.Status || selectedData.Status,
      ChangeAssignTo: TaskformData.ChangeAssignTo || '',
      Remark: TaskformData.Remark || selectedData.Remark || ''
    };

    dispatch(taskActions.updateTaskInfo(finalPayload));
    setTimeout(() => {
      setShowNewTask(false);
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
    }, 300);
    handleClose();
  };

  const handleuserFilter = (newSelected) => {
    if (newSelected.length) {
      setuserFilter(newSelected);
    } else {
      setuserFilter([]);
    }
  };

  const handleChangeAssignedUserFilter = (newSelected) => {
    if (newSelected.length) {
      setChangeAssignedUserFilter(newSelected);
    } else {
      setChangeAssignedUserFilter([]);
    }
  };

  return (
    <>
      <Card className="w-full header-info default-shadow">
        <Row>
          <Col md={12}>
            <Tabs defaultActiveKey="allTask">
              <Tab eventKey="allTask" title="All Tasks"><TaskList /></Tab>
              <Tab eventKey="assignedTask" title="Assigned Tasks">
                <EnhancedTable
                  enableSno
                  data={assignedTask}
                  headers={GroupHeaders}
                  headerCss="success"
                  enablePagination
                  PerPagelimit={15}
                  rowactions={(row) => (
                    <Button className="float-end btn-sm table-header-primary" onClick={() => handleEdit(row)}>
                      Action
                    </Button>
                  )}
                />
              </Tab>
              {role !== 'user' && (
                <Tab eventKey="UnAssignedTasks" title="UnAssigned Tasks">
                  <EnhancedTable
                    enableSno
                    data={UnAssignedTasks}
                    headers={unAssignedHeaders}
                    headerCss="info"
                    enablePagination
                    PerPagelimit={15}
                    rowactions={(row) => (
                      <Button className="float-end btn-sm table-header-primary" onClick={() => handleUnassignedEdit(row)}>
                        Action
                      </Button>
                    )}
                  />
                </Tab>
              )}
              <Tab eventKey="userTaskProgress" title="User Task Progress">
                <EnhancedTable
                  enableSno
                  data={taskProgress}
                  headers={progressHeaders}
                  headerCss="warning"
                  enablePagination
                  PerPagelimit={15}
                />
              </Tab>
            </Tabs>
            <button
              type="button"
              class="float-end btn-sm table-header-primary btn btn-primary new-task"
              onClick={() => setShowUnAssignedTask(true)}
            >
              Add Task
            </button>
          </Col>
        </Row>
      </Card>
      <Modal size="lg" show={showNewTask} onHide={handleClose} animation={true} backdrop="static" keyboard={false}>
        <Modal.Header className={mode}>
          <Modal.Title>
            <h5>Update Task</h5>
          </Modal.Title>
          <span className="pointer" onClick={() => handleClose()}>
            {' '}
            X{' '}
          </span>
        </Modal.Header>
        <Modal.Body className={mode}>
          <Form noValidate onSubmit={handleSubmitTask}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Project Name</Form.Label>
                  <Form.Select
                    name="ProjectId"
                    value={TaskformData.ProjectId}
                    className="custom-form-select"
                    onChange={handleTaskChange}
                    isInvalid={!!taskErrors.ProjectId}
                    disabled={selectedData}
                  >
                    <option value="">Select project...</option>
                    {Array.isArray(projectDataList?.Result)
                      ? projectDataList.Result.filter((item) => item.Status === '1').map((item) => (
                          <option key={item.ProjectId} value={item.ProjectId}>
                            {item.ProjectTitle}
                          </option>
                        ))
                      : Object.values(projectDataList?.Result || {})
                          .filter((item) => item.Status === '1')
                          .map((item) => (
                            <option key={item.ProjectId} value={item.ProjectId}>
                              {item.ProjectTitle}
                            </option>
                          ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{taskErrors.ProjectId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Module Name</Form.Label>
                  <Form.Select
                    name="ModuleId"
                    value={TaskformData.ModuleId}
                    className="custom-form-select"
                    onChange={handleTaskChange}
                    isInvalid={!!taskErrors.ModuleId}
                    disabled={selectedData}
                  >
                    <option value="">Select Module...</option>
                    {moduleList?.Result?.map((item) => (
                      <option value={item.ModuleId}>{item.ModuleName}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{taskErrors.ModuleId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Task</Form.Label>
                  <Form.Control
                    type="text"
                    name="Task"
                    placeholder="Enter..."
                    value={TaskformData.Task}
                    onChange={handleTaskChange}
                    isInvalid={!!taskErrors.Task}
                    disabled={selectedData}
                  />
                  <Form.Control.Feedback type="invalid">{taskErrors.Task}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Task Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={TaskformData.TaskDescription}
                    rows={1}
                    name="TaskDescription"
                    placeholder="Enter text here.."
                    onChange={handleTaskChange}
                    isInvalid={!!taskErrors.TaskDescription}
                    disabled={selectedData}
                  />
                  <Form.Control.Feedback type="invalid">{taskErrors.TaskDescription}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Assign</Form.Label>
                  <MultiSelect
                    options={userOption}
                    className={`${selectedData ? 'disabled' : ''}`}
                    value={userOption?.filter(
                      (option) => TaskformData && TaskformData.UserId && TaskformData.UserId.split(',').includes(option.value)
                    )}
                    onChange={handleuserFilter}
                    overrideStrings={{
                      selectSomeItems: 'Users'
                    }}
                    hasSelectAll={true}
                    disabled={selectedData}
                  />
                  <Form.Control.Feedback type="invalid">{taskErrors.UserId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Change Assigned user</Form.Label>
                  <MultiSelect
                    options={userOption}
                    value={userOption?.filter(
                      (option) =>
                        TaskformData && TaskformData.ChangeAssignTo && TaskformData.ChangeAssignTo.split(',').includes(option.value)
                    )}
                    onChange={handleChangeAssignedUserFilter}
                    overrideStrings={{
                      selectSomeItems: 'Users'
                    }}
                    hasSelectAll={true}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="Status"
                    value={TaskformData.Status}
                    className="custom-form-select"
                    onChange={handleTaskChange}
                    isInvalid={!!taskErrors.Status}
                  >
                    <option value="">Select Status...</option>
                    {statusDataList?.Result?.filter((item) => item.Status === '1')?.map((item) => (
                      <option value={item.StatusId}>{item.StatusTitle}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{taskErrors.Status}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Remark</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={TaskformData.Remark}
                    rows={1}
                    name="Remark"
                    placeholder="Enter text here.."
                    onChange={handleTaskChange}
                    isInvalid={!!taskErrors.Remark}
                  />
                  <Form.Control.Feedback type="invalid">{taskErrors.Remark}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end mt-2">
              <Button variant="primary" type="submit">
                Submit
              </Button>
              <Button variant="secondary" onClick={() => handleClose()} className="ms-2">
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal size="lg" show={showUnAssignedTask} onHide={handleClose} animation={true} backdrop="static" keyboard={false}>
        <Modal.Header className={mode}>
          <Modal.Title>
            <h5>Assign Task</h5>
          </Modal.Title>
          <span className="pointer" onClick={() => handleClose()}>
            {' '}
            X{' '}
          </span>
        </Modal.Header>
        <Modal.Body className={mode}>
          <Form noValidate onSubmit={handleSubmitTask}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Project Name</Form.Label>
                  <Form.Select
                    name="ProjectId"
                    value={TaskformData.ProjectId}
                    className="custom-form-select"
                    onChange={handleTaskChange}
                    isInvalid={!!taskErrors.ProjectId}
                  >
                    <option value="">Select project...</option>
                    {Array.isArray(projectDataList?.Result)
                      ? projectDataList.Result.filter((item) => item.Status === '1').map((item) => (
                          <option key={item.ProjectId} value={item.ProjectId}>
                            {item.ProjectTitle}
                          </option>
                        ))
                      : Object.values(projectDataList?.Result || {})
                          .filter((item) => item.Status === '1')
                          .map((item) => (
                            <option key={item.ProjectId} value={item.ProjectId}>
                              {item.ProjectTitle}
                            </option>
                          ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{taskErrors.ProjectId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Module Name</Form.Label>
                  <Form.Select
                    name="ModuleId"
                    value={TaskformData.ModuleId}
                    className="custom-form-select"
                    onChange={handleTaskChange}
                    isInvalid={!!taskErrors.ModuleId}
                  >
                    <option value="">Select Module...</option>
                    {moduleList?.Result?.map((item) => (
                      <option value={item.ModuleId}>{item.ModuleName}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{taskErrors.ModuleId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Task</Form.Label>
                  <Form.Control
                    type="text"
                    name="Task"
                    placeholder="Enter..."
                    value={TaskformData.Task}
                    onChange={handleTaskChange}
                    isInvalid={!!taskErrors.Task}
                  />
                  <Form.Control.Feedback type="invalid">{taskErrors.Task}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Task Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={TaskformData.TaskDescription}
                    rows={1}
                    name="TaskDescription"
                    placeholder="Enter text here.."
                    onChange={handleTaskChange}
                    isInvalid={!!taskErrors.TaskDescription}
                  />
                  <Form.Control.Feedback type="invalid">{taskErrors.TaskDescription}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Assign</Form.Label>
                  <MultiSelect
                    options={unAssignedUserOption}
                    value={unAssignedUserOption?.filter(
                      (option) => TaskformData && TaskformData.UserId && TaskformData.UserId.split(',').includes(option.value)
                    )}
                    onChange={handleuserFilter}
                    overrideStrings={{
                      selectSomeItems: 'Users'
                    }}
                    hasSelectAll={true}
                  />
                  <Form.Control.Feedback type="invalid">{taskErrors.UserId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Remark</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={TaskformData.Remark}
                    rows={1}
                    name="Remark"
                    placeholder="Enter text here.."
                    onChange={handleTaskChange}
                    isInvalid={!!taskErrors.Remark}
                  />
                  <Form.Control.Feedback type="invalid">{taskErrors.Remark}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <div className="d-flex justify-content-end mt-2">
              <Button variant="primary" type="submit">
                Submit
              </Button>
              <Button variant="secondary" onClick={() => handleClose()} className="ms-2">
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TaskAssigment;
