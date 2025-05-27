import React, { useState } from 'react';
import { Button, Card, Col, Dropdown, Form, Image, Row } from 'react-bootstrap';
import pdf_i from '../../../assets/images/pdf_i.svg';
import print_i from '../../../assets/images/print_i.svg';
import setting from '../../../assets/images/settings.png';
import EnhancedTable from '../../../components/Table';
import DatePicker from 'react-datepicker';
import { FaCog } from 'react-icons/fa';

const TaskList = () => {
  const taskHeaders = [
    { id: 'projectName', label: 'Project Name', class: '' },
    { id: 'moduleName', label: 'Module Name', class: '' },
    { id: 'taskName', label: 'Task Name', class: '' },
    { id: 'taskDescription', label: 'Task Description', class: '' },
    { id: 'assignedDate', label: 'Assigned/Expected Date', class: '' },
    { id: 'status', label: 'Status', class: '' },
    { id: 'assignedTo', label: 'Assigned To', class: '' },
    { id: 'userRemarks', label: 'User Remarks', class: '' }
  ];

  const [TaskformData, setTaskFormData] = useState({
    groupName: '',
    projectName: '',
    moduleName: '',
    status: '',
    user: '',
    startDate: '',
    endDate: ''
  });

  const [visibleColumns, setVisibleColumns] = useState(
    taskHeaders.map((header) => header.id) // Initially show all columns
  );
  const filteredHeaders = taskHeaders.filter((header) => visibleColumns.includes(header.id));

  const toggleColumn = (columnId) => {
    setVisibleColumns(
      (prev) =>
        prev.includes(columnId)
          ? prev.filter((id) => id !== columnId) // remove column
          : [...prev, columnId] // add column
    );
  };

  const handleTaskChange = (e) => {
    const { name, value } = e.target;
    setTaskFormData({ ...TaskformData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateTasks()) return;
    console.log('TaskformData', TaskformData);
  };

  const handleStartDate = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
      setTaskFormData({ ...TaskformData, startDate: formattedDate });
    } else {
      setTaskFormData({ ...TaskformData, startDate: '' });
    }
  };

  const handleEndDate = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
      setTaskFormData({ ...TaskformData, endDate: formattedDate });
    } else {
      setTaskFormData({ ...TaskformData, endDate: '' });
    }
  };

  return (
    <div>
      <Card className="Recent-Users widget-focus-lg header-info default-shadow">
        <Card.Header className=" py-2">
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="d-flex align-items-center">
              <Col>
                <h5>Task List</h5>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Select
                    name="groupName"
                    value={TaskformData.groupName}
                    className="custom-form-select w-auto"
                    onChange={handleTaskChange}
                  >
                    <option value="">Select Group</option>
                    <option value="1">1</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Select
                    name="projectName"
                    value={TaskformData.projectName}
                    className="custom-form-select w-auto"
                    onChange={handleTaskChange}
                  >
                    <option value="">Select Project</option>
                    <option value="1">1</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Select
                    name="moduleName"
                    value={TaskformData.moduleName}
                    className="custom-form-select w-auto"
                    onChange={handleTaskChange}
                  >
                    <option value="">Select Module</option>
                    <option value="1">1</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Select name="status" value={TaskformData.status} className="custom-form-select w-auto" onChange={handleTaskChange}>
                    <option value="">Select Status</option>
                    <option value="1">1</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Select name="user" value={TaskformData.user} className="custom-form-select w-auto" onChange={handleTaskChange}>
                    <option value="">Select user</option>
                    <option value="1">1</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <DatePicker
                    selected={TaskformData.startDate || null}
                    className={`form-control cfs-14`}
                    onChange={handleStartDate}
                    placeholderText="Start Date"
                    dateFormat="dd-MM-yyyy"
                    name="startDate"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <DatePicker
                    selected={TaskformData.endDate || null}
                    className={`form-control cfs-14`}
                    onChange={handleEndDate}
                    placeholderText="End Date"
                    dateFormat="dd-MM-yyyy"
                    name="endDate"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="d-flex  justify-content-between align-items-center">
                  <Button variant="primary" type="submit" size="sm" className="m-0">
                    Submit
                  </Button>
                </Form.Group>
              </Col>
              <Col>
                <div className="d-flex align-items-center">
                  <img src={print_i} alt="" className="img-fluid ml-2 pointer" width={30} />
                  <img src={pdf_i} alt="" className="img-fluid ml-1 pointer" width={30} />
                  <Dropdown className="table-column-setting ml-1 mr-1">
                    <Dropdown.Toggle variant="light" id="dropdown-basic" className="border-0 p-0 setting-btn">
                      <Image src={setting} alt="" width={24}/>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {taskHeaders.map((item, idx) => (
                        <Form.Check
                          key={item.id}
                          type="switch"
                          id={`custom-switch-${idx}`}
                          label={item.label}
                          checked={visibleColumns.includes(item.id)}
                          onChange={() => toggleColumn(item.id)}
                        />
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Col>
            </Row>
          </Form>
        </Card.Header>
        <Card.Body className="p-3 pt-0 dark-table">
          <EnhancedTable
            data={[]} // replace with actual data
            headers={filteredHeaders}
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
    </div>
  );
};

export default TaskList;
