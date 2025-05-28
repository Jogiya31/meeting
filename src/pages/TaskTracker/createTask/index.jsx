import EnhancedTable from 'components/Table';
import { useTheme } from '../../../contexts/themeContext';
import React, { useEffect, useState } from 'react';
import { Button, Card, CardSubtitle, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { settingsActions } from '../../../store/settings/settingSlice';
import { moduleActions } from '../../../store/module/moduleSlice';

const CreateTask = () => {
  const dispatch = useDispatch();
  const { mode } = useTheme();
  const GroupHeaders = [
    { id: 'projectName', label: 'Project Name', class: '' },
    { id: 'moduleName', label: 'Module Name', class: '' },
    { id: 'taskName', label: 'Task Name', class: '' },
    { id: 'taskDescription', label: 'Task Description', class: '' },
    { id: 'createdBy', label: 'Created By', class: '' },
    { id: 'createdAt', label: 'Created At', class: '' }
  ];

  const [showNewTask, setShowNewTask] = useState(false);
  const [taskErrors, setTaskErrors] = useState({});
  const [search, setSearch] = useState('');
  const [TaskformData, setTaskFormData] = useState({
    projectName: '',
    moduleName: '',
    task: '',
    taskDescription: ''
  });

  const projectDataList = useSelector((state) => state.settings.projectData);
  const moduleList = useSelector((state) => state.module.data);

  useEffect(() => {
    dispatch(settingsActions.getProjectInfo());
    dispatch(moduleActions.getModuleInfo());
  }, []);

  const handleClose = () => {
    setShowNewTask(false);
    setTaskErrors({});
    setTaskFormData({
      projectName: '',
      moduleName: '',
      task: '',
      taskDescription: ''
    });
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskFormData({ ...TaskformData, [name]: value });
  };
  const validateTasks = () => {
    let newErrors = {};
    if (!TaskformData.projectName) newErrors.projectName = 'Required field.';
    if (!TaskformData.moduleName) newErrors.moduleName = 'Required field.';
    if (!TaskformData.task) newErrors.task = 'Required field.';
    if (!TaskformData.taskDescription) newErrors.taskDescription = 'Required field.';
    setTaskErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmitGroup = (e) => {
    e.preventDefault();
    if (!validateTasks()) return;
    console.log('TaskformData', TaskformData);
  };
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0); // Reset page when search is modified
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
          </CardSubtitle>
        </Card.Header>
        <Card.Body className="p-3 pt-0 dark-table">
          <EnhancedTable
            data={[]}
            headers={GroupHeaders}
            headerCss="info"
            enableSno
            enablePagination
            rowactions={(row) => (
              <Button variant="primary" className="float-end btn-sm">
                Action
              </Button>
            )}
          />
        </Card.Body>
      </Card>
      <Modal size="md" show={showNewTask} onHide={handleClose} animation={true} backdrop="static" keyboard={false}>
        <Modal.Header className={mode}>
          <Modal.Title>
            <h5>Add New Task</h5>
          </Modal.Title>
          <span className="pointer" onClick={handleClose}>
            {' '}
            X{' '}
          </span>
        </Modal.Header>
        <Modal.Body className={mode}>
          <Form noValidate onSubmit={handleSubmitGroup}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Project Name</Form.Label>
                  <Form.Select
                    name="projectName"
                    value={TaskformData.projectName}
                    className="custom-form-select"
                    onChange={handleTaskChange}
                    isInvalid={!!taskErrors.projectName}
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
                  <Form.Control.Feedback type="invalid">{taskErrors.projectName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Module Name</Form.Label>
                  <Form.Select
                    name="moduleName"
                    value={TaskformData.moduleName}
                    className="custom-form-select"
                    onChange={handleTaskChange}
                    isInvalid={!!taskErrors.moduleName}
                  >
                    <option value="">Select Module...</option>
                    {moduleList?.Result?.map((item) => (
                      <option value={item.ModuleName}>{item.ModuleName}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{taskErrors.moduleName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Task</Form.Label>
                  <Form.Control
                    type="text"
                    name="task"
                    placeholder="Enter..."
                    value={TaskformData.task}
                    onChange={handleTaskChange}
                    isInvalid={!!taskErrors.task}
                  />
                  <Form.Control.Feedback type="invalid">{taskErrors.task}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Task Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={TaskformData.taskDescription}
                    rows={1}
                    name="taskDescription"
                    placeholder="Enter text here.."
                    onChange={handleTaskChange}
                    isInvalid={!!taskErrors.taskDescription}
                  />
                  <Form.Control.Feedback type="invalid">{taskErrors.taskDescription}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-2">
              <Button variant="primary" type="submit">
                Submit
              </Button>
              <Button variant="secondary" onClick={handleClose} className="ms-2">
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
