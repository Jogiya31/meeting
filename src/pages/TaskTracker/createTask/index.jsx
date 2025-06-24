import { useTheme } from '../../../contexts/themeContext';
import React, { useEffect, useState } from 'react';
import { Button, Card, CardSubtitle, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { settingsActions } from '../../../store/settings/settingSlice';
import { moduleActions } from '../../../store/module/moduleSlice';
import { taskActions } from '../../../store/task/taskSlice';
import AdvanceTable from '../../../components/Table/advanceTable';
import refresh from '../../../assets/images/refresh-arrow.png';
import edit from '../../../assets/images/edit.png';
import { useAuth } from '../../../contexts/AuthContext';
import { userActions } from '../../../store/user/userSlice';
import { MultiSelect } from 'react-multi-select-component';

const CreateTask = () => {
  const { role, user } = useAuth();
  const dispatch = useDispatch();
  const { mode } = useTheme();

  const [showNewTask, setShowNewTask] = useState(false);
  const [taskErrors, setTaskErrors] = useState({});
  const [search, setSearch] = useState('');
  const [TaskformData, setTaskFormData] = useState({
    ProjectId: '',
    ModuleId: '',
    Task: '',
    TaskDescription: '',
    UserId: ''
  });
  const [resetTrigger, setResetTrigger] = useState(0);
  const [selectedData, setselectedData] = useState(null);
  const [userOption, setuserOption] = useState([]);
  const [userFilter, setuserFilter] = useState([]);
  const [changeAssignedUserFilter, setChangeAssignedUserFilter] = useState([]);

  const projectDataList = useSelector((state) => state.settings.projectData);
  const moduleList = useSelector((state) => state.module.data);
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
    dispatch(userActions.getuserInfo());
    dispatch(settingsActions.getProjectInfo());
    dispatch(moduleActions.getModuleInfo());
  }, []);

  const handleEdit = (data) => {
    setselectedData(data);
    setShowNewTask(true);
  };
  const ActionCellRenderer = (props) => {
    const { data } = props;
    return (
      <div className="action-column">
        <Button variant="" size="sm" onClick={() => handleEdit(data)} title="Edit Task">
          <img src={edit} width={20} alt="" />
        </Button>
      </div>
    );
  };
  const [columnDefs] = useState([
    { field: 'ProjectTitle', sortable: true, filter: true, flex: 1 },
    { field: 'ModuleName', sortable: true, filter: true, flex: 1 },
    { field: 'Task', sortable: true, filter: true, flex: 1 },
    { field: 'Description', sortable: true, filter: true, flex: 1 },
    { field: 'StartDate', sortable: true, filter: true, flex: 1 },
    {
      headerName: 'Actions',
      field: 'actions',
      flex: 1,
      cellRenderer: ActionCellRenderer
    }
  ]);

  useEffect(() => {
    if (selectedData) {
      const updatedFormData = {
        ...TaskformData,
        ProjectId: selectedData.ProjectId,
        ModuleId: selectedData.ModuleId,
        Task: selectedData.Task,
        TaskDescription: selectedData.Description,
        UserId: selectedData.UserId
      };
      setTaskFormData(updatedFormData);
    }
  }, [selectedData]);

  const handleClose = () => {
    setShowNewTask(false);
    setTaskErrors({});
    setTaskFormData({
      ProjectId: '',
      ModuleId: '',
      Task: '',
      TaskDescription: '',
      UserId: ''
    });
    setuserFilter([]);
    setChangeAssignedUserFilter([]);
    setselectedData(null);
  };
  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskFormData({ ...TaskformData, [name]: value });
  };
  const validateTasks = () => {
    let newErrors = {};
    if (!TaskformData.ProjectId) newErrors.ProjectId = 'Required field.';
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
      UserId: TaskformData.UserId || ''
    };

    if (selectedData) {
      finalPayload.DiscussionId = selectedData.DiscussionId;
      finalPayload.ModifyBy = user.UserName;
      finalPayload.Status = selectedData.Status;
      finalPayload.UserId = selectedData.UserId;
      finalPayload.ChangeAssignTo = selectedData.ChangeAssignTo || '';
      finalPayload.Remark = selectedData.Remark;
      dispatch(taskActions.updateTaskInfo(finalPayload));
    } else {
      finalPayload.CreatedBy = user.UserName;
      finalPayload.Remark = selectedData.Remark;
      dispatch(taskActions.addTaskInfo(finalPayload));
    }

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
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0); // Reset page when search is modified
  };
  const triggerReset = () => {
    setResetTrigger((prev) => prev + 1);
  };

  // Update UserId when userFilter changes
  useEffect(() => {
    if (!userList) return;
    if (userList) {
      let options = [];
      userList?.Result?.forEach((item) => {
        if (item.Status === '1') {
          options.push({ label: item.UserName, value: item.UserId });
        }
      });

      setuserOption([...options]);
    }
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

  const handleuserFilter = (newSelected) => {
    if (newSelected.length) {
      setuserFilter(newSelected);
    } else {
      setuserFilter([]);
    }
  };

  return (
    <>
      <Card className="py-1 w-full default-shadow header-info">
        <Card.Header className="d-flex justify-content-between align-items-center py-2">
          <Card.Title as="h5">Unassigned Task</Card.Title>
          <CardSubtitle className="user-table-right">
            <input
              type="text"
              placeholder="Search.."
              value={search}
              onChange={handleSearchChange}
              className="form-control mr-2 userSearch"
            />
            <Button onClick={() => setShowNewTask(true)} className="m-0 fw-bolder">
              <i className="feather icon-plus"> Add </i>
            </Button>
            <img src={refresh} alt="" className="img-fluid ml-1 pointer" title="Reset Table" width={30} onClick={() => triggerReset()} />
          </CardSubtitle>
        </Card.Header>
        <Card.Body className="p-3 pt-0 dark-table">
          <AdvanceTable
            rowData={taskList?.Result?.filter((item) => (item.UserId === '' || item.UserId === '0') && item.ChangeAssignTo === '') || []}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={15}
            paginationPageSizeSelector={[10, 15, 20, 25, 50, 100]}
            resetTrigger={resetTrigger}
            tablethemes="blue"
          />
        </Card.Body>
      </Card>
      <Modal size="md" show={showNewTask} onHide={handleClose} animation={true} backdrop="static" keyboard={false}>
        <Modal.Header className={mode}>
          <Modal.Title>{selectedData ? <h5>Update Task</h5> : <h5>Add New Task</h5>}</Modal.Title>
          <span className="pointer" onClick={handleClose}>
            {' '}
            X{' '}
          </span>
        </Modal.Header>
        <Modal.Body className={mode}>
          <Form noValidate onSubmit={handleSubmitTask}>
            <Row>
              <Col md={12}>
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
                      ? projectDataList?.Result?.filter((item) => item.Status === '1').map((item) => (
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
              <Col md={12}>
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
              <Col md={12}>
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
              <Col md={12}>
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
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Assign</Form.Label>
                  <MultiSelect
                    options={userOption}
                    value={userOption?.filter(
                      (option) => TaskformData && TaskformData?.UserId && TaskformData?.UserId?.split(',').includes(option.value)
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

export default CreateTask;
