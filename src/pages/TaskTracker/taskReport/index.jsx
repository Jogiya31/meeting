import React, { useState } from 'react';
import { Button, Card, CardSubtitle, Col, Form, Row } from 'react-bootstrap';
import print_i from '../../../assets/images/print.png';

const TaskReport = () => {
  const [taskErrors, setTaskErrors] = useState({});
  const [TaskformData, setTaskFormData] = useState({
    groupName: '',
    projectName: '',
    moduleName: '',
    status: ''
  });

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskFormData({ ...TaskformData, [name]: value });
  };
  const validateTasks = () => {
    let newErrors = {};
    if (!TaskformData.groupName) newErrors.groupName = 'Required field.';
    if (!TaskformData.projectName) newErrors.projectName = 'Required field.';
    if (!TaskformData.moduleName) newErrors.moduleName = 'Required field.';
    if (!TaskformData.status) newErrors.status = 'Required field.';
    setTaskErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateTasks()) return;
    console.log('TaskformData', TaskformData);
  };
  return (
    <div>
      <Card className="Recent-Users widget-focus-lg header-info">
        <Card.Header className=" py-2">
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="d-flex align-items-center">
              <Col md={2}>
                <h5>Task Report</h5>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Select
                    name="groupName"
                    value={TaskformData.groupName}
                    className="custom-form-select"
                    onChange={handleTaskChange}
                    isInvalid={!!taskErrors.groupName}
                  >
                    <option value="">Select Group</option>
                    <option value="1">1</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{taskErrors.groupName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Select
                    name="projectName"
                    value={TaskformData.projectName}
                    className="custom-form-select"
                    onChange={handleTaskChange}
                    isInvalid={!!taskErrors.projectName}
                  >
                    <option value="">Select Project</option>
                    <option value="1">1</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{taskErrors.projectName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Select
                    name="moduleName"
                    value={TaskformData.moduleName}
                    className="custom-form-select"
                    onChange={handleTaskChange}
                    isInvalid={!!taskErrors.moduleName}
                  >
                    <option value="">Select Module</option>
                    <option value="1">1</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{taskErrors.moduleName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Select
                    name="status"
                    value={TaskformData.status}
                    className="custom-form-select"
                    onChange={handleTaskChange}
                    isInvalid={!!taskErrors.status}
                  >
                    <option value="">Select Status</option>
                    <option value="1">1</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{taskErrors.status}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="d-flex  justify-content-between align-items-center">
                  <Button variant="primary" type="submit" size="sm" className="m-0">
                    Submit
                  </Button>
                  <img src={print_i} alt="" className="img-fluid ml-2" width={50} />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Header>
        <Card.Body className="p-3 pt-0 dark-table"></Card.Body>
      </Card>
    </div>
  );
};

export default TaskReport;
