import EnhancedTable from 'components/Table';
import { useTheme } from '../../../contexts/themeContext';
import React, { useState } from 'react';
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';

const CreateTask = () => {
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
  const [TaskformData, setTaskFormData] = useState({
    projectName: '',
    moduleName: '',
    task: '',
    taskDescription: ''
  });

  const handleClose = () => {
    setShowNewTask(false);
    setTaskErrors({});
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    console.log('first', name, value);
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

  return (
    <>
      <Card className="py-3 px-4 w-full">
        <Row>
          <Col md={12} className="d-flex justify-content-between  align-items-center">
            <h5>Task List</h5>
            <Button className="" onClick={() => setShowNewTask(true)}>
              {' '}
              Add
            </Button>
          </Col>
          <Col md={12} className="dark-table">
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
          </Col>
        </Row>
      </Card>
      <Modal size="md" show={showNewTask} onHide={handleClose} animation={true}>
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
                    name="groupDescription"
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
