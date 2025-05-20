import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';
import { Button, Col, Form, Modal, Nav, Row, Tab } from 'react-bootstrap';
import { useTheme } from '../../../contexts/themeContext';
import EnhancedTable from '../../../components/Table';
import DatePicker from 'react-datepicker';
import moment from 'moment';

const CreateDependencies = () => {
  const dispatch = useDispatch();
  const { mode } = useTheme();

  const [showGroup, setShowGroup] = useState(false);
  const [showProject, setShowProject] = useState(false);
  const [showModule, setShowModule] = useState(false);
  const [groupErrors, setGroupErrors] = useState({});
  const [moduleErrors, setModuleErrors] = useState({});
  const [projectErrors, setProjectErrors] = useState({});
  const [groupstartDateError, setGroupStartDateError] = useState(false);
  const [projectstartDateError, setProjectStartDateError] = useState(false);
  const [projectCompletionDateError, setProjectCompletionDateError] = useState(false);
  const [GroupformData, setGroupFormData] = useState({
    groupName: '',
    groupStartDate: null,
    groupDescription: ''
  });
  const [ProjectformData, setProjectFormData] = useState({
    projectName: '',
    projectDescription: '',
    groupName: '',
    HOGName: '',
    HODName: '',
    technologyStack: '',
    projectStartDate: null,
    completionDate: null
  });
  const [ModuleformData, setModuleFormData] = useState({
    projectName: '',
    moduleName: '',
    moduleDescription: ''
  });

  const GroupHeaders = [
    { id: 'groupname', label: 'Group Name', class: '' },
    { id: 'groupDescription', label: 'Group Description', class: '' },
    { id: 'groupStartDate', label: 'group Start Date', class: '' }
  ];

  const ProjectHeaders = [
    { id: 'projectName', label: 'Project Name', class: '' },
    { id: 'projectDescription', label: 'Project Description', class: '' },
    { id: 'groupName', label: 'Group Name', class: '' },
    { id: 'hodName', label: 'HOD Name', class: '' },
    { id: 'hogName', label: 'HOG Name', class: '' },
    { id: 'technologyStack', label: 'Technology Stack', class: '' }
  ];

  const ModuleHeaders = [
    { id: 'projectName', label: 'Project Name', class: '' },
    { id: 'moduleName', label: 'Module Name', class: '' },
    { id: 'moduleDescription', label: 'Module Description', class: '' },
    { id: 'createBy', label: 'Created By', class: '' },
    { id: 'CreateAt', label: 'Create At', class: '' }
  ];

  const handleClose = () => {
    setShowGroup(false);
    setShowProject(false);
    setShowModule(false);
    setGroupFormData({ groupName: '', groupStartDate: '', groupDescription: '' });
    setProjectFormData({
      projectName: '',
      projectDescription: '',
      groupName: '',
      HOGName: '',
      HODName: '',
      technologyStack: '',
      projectStartDate: null,
      completionDate: null
    });
    setGroupFormData({
      groupName: '',
      groupStartDate: null,
      groupDescription: ''
    });
    setModuleFormData({
      projectName: '',
      moduleName: '',
      moduleDescription: ''
    });
    setGroupErrors({});
    setProjectErrors({});
    setModuleErrors({});
    setGroupStartDateError(false);
    setProjectStartDateError(false);
    setProjectCompletionDateError(false);
  };

  const handleGroupChange = (e) => {
    const { name, value } = e.target;
    console.log('first', name, value);
    setGroupFormData({ ...GroupformData, [name]: value });
  };
  const validateGroup = () => {
    let newErrors = {};
    if (!GroupformData.groupName) newErrors.groupName = 'Required field.';
    if (!GroupformData.groupStartDate) {
      setGroupStartDateError(!groupstartDateError);
      newErrors.groupStartDate = 'Required field.';
    }
    if (!GroupformData.groupDescription) newErrors.groupDescription = 'Required field.';
    setGroupErrors(newErrors);

    console.log('newErrors', newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleGroupDate = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
      setGroupStartDateError(false);
      setGroupFormData({ ...GroupformData, groupStartDate: formattedDate });
    } else {
      setGroupFormData({ ...GroupformData, groupStartDate: '' });
    }
  };
  const handleSubmitGroup = (e) => {
    e.preventDefault();
    if (!validateGroup()) return;
    console.log('GroupformData', GroupformData);
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectFormData({ ...ProjectformData, [name]: value });
  };
  const validateProject = () => {
    let newErrors = {};
    if (!ProjectformData.projectName) newErrors.projectName = 'Required field.';
    if (!ProjectformData.projectDescription) newErrors.projectDescription = 'Required field.';
    if (!ProjectformData.groupName) newErrors.groupName = 'Required field.';
    if (!ProjectformData.HOGName) newErrors.HOGName = 'Required field.';
    if (!ProjectformData.HODName) newErrors.HODName = 'Required field.';
    if (!ProjectformData.technologyStack) newErrors.technologyStack = 'Required field.';
    if (!ProjectformData.projectStartDate) {
      setProjectStartDateError(!projectstartDateError);
      newErrors.projectStartDate = 'Required field.';
    }
    if (!ProjectformData.completionDate) {
      setProjectCompletionDateError(!projectCompletionDateError);
      newErrors.completionDate = 'Required field.';
    }
    setProjectErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleProjectStartDate = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setProjectStartDateError(false);
      const formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
      setProjectFormData({ ...ProjectformData, projectStartDate: formattedDate || '' });
    } else {
      setProjectFormData({ ...ProjectformData, projectStartDate: '' });
    }
  };
  const handleProjectEndDate = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setProjectCompletionDateError(false);
      const formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
      setProjectFormData({ ...ProjectformData, completionDate: formattedDate || '' });
    } else {
      setProjectFormData({ ...ProjectformData, completionDate: '' });
    }
  };
  const handleSubmitProject = (e) => {
    e.preventDefault();
    if (!validateProject()) return;
    console.log('ProjectformData', ProjectformData);
  };

  const handleModuleChange = (e) => {
    const { name, value } = e.target;
    setModuleFormData({ ...ModuleformData, [name]: value });
  };
  const validateModule = () => {
    let newErrors = {};
    if (!ModuleformData.projectName) newErrors.projectName = 'Required field.';
    if (!ModuleformData.moduleDescription) newErrors.moduleDescription = 'Required field.';
    if (!ModuleformData.moduleName) newErrors.moduleName = 'Required field.';
    setModuleErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmitModule = (e) => {
    e.preventDefault();
    if (!validateModule()) return;
    console.log('ModuleformData', ModuleformData);
  };

  return (
    <div>
      <Row>
        <Col sm={12} md={12} xl={12} xxl={12}>
          <Tab.Container id="left-tabs-example" defaultActiveKey="group">
            <Row>
              <Col sm={2}>
                <Nav variant="pills" className="flex-column default-shadow">
                  <Nav.Item>
                    <Nav.Link eventKey="group">Group</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="project">Projects</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="module">Module</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col sm={10}>
                <Tab.Content className="p-2 default-shadow">
                  <Tab.Pane eventKey="group">
                    <div>
                      <div className="w-full d-flex justify-content-end">
                        <Button className="" onClick={() => setShowGroup(true)}>
                          Add New
                        </Button>
                      </div>
                      <div className="dark-table">
                        <EnhancedTable data={[]} headers={GroupHeaders} headerCss="info" enablePagination />
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="project">
                    <div>
                      <div className="w-full d-flex justify-content-end">
                        <Button className="" onClick={() => setShowProject(true)}>
                          Add New
                        </Button>
                      </div>
                      <div className="dark-table">
                        <EnhancedTable data={[]} headers={ProjectHeaders} headerCss="info" enablePagination />
                      </div>
                    </div>
                  </Tab.Pane>
                  <Tab.Pane eventKey="module">
                    <div>
                      <div className="w-full d-flex justify-content-end">
                        <Button className="" onClick={() => setShowModule(true)}>
                          Add New
                        </Button>
                      </div>
                      <div className="dark-table">
                        <EnhancedTable data={[]} headers={ModuleHeaders} headerCss="info" enablePagination />
                      </div>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Col>
      </Row>
      <Modal size="md" show={showGroup} onHide={handleClose} animation={true} backdrop="static" keyboard={false}>
        <Modal.Header className={mode}>
          <Modal.Title>
            <h5>Add Group</h5>
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
                  <Form.Label>Group Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="groupName"
                    placeholder="Enter..."
                    value={GroupformData.groupName}
                    onChange={handleGroupChange}
                    isInvalid={!!groupErrors.groupName}
                  />
                  <Form.Control.Feedback type="invalid">{groupErrors.groupName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Group Start Date</Form.Label>
                  <DatePicker
                    selected={GroupformData.groupStartDate || null}
                    className={`form-control cfs-14 ${groupstartDateError ? 'is-invalid' : ''}`}
                    onChange={handleGroupDate}
                    placeholderText="Start Date"
                    dateFormat="dd-MM-yyyy"
                    name="groupStartDate"
                  />

                  {groupstartDateError && <div className="text-danger">{groupErrors.groupStartDate}</div>}
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Group Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={GroupformData.groupDescription}
                    rows={1}
                    name="groupDescription"
                    placeholder="Enter text here.."
                    onChange={handleGroupChange}
                    isInvalid={!!groupErrors.groupDescription}
                  />
                  <Form.Control.Feedback type="invalid">{groupErrors.groupDescription}</Form.Control.Feedback>
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
      <Modal size="lg" show={showProject} onHide={handleClose} animation={true} backdrop="static" keyboard={false}>
        <Modal.Header className={mode}>
          <Modal.Title>
            <h5>Add Project</h5>
          </Modal.Title>
          <span className="pointer" onClick={handleClose}>
            {' '}
            X{' '}
          </span>
        </Modal.Header>
        <Modal.Body className={mode}>
          <Form noValidate onSubmit={handleSubmitProject}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Project Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="projectName"
                    placeholder="Enter..."
                    value={ProjectformData.projectName}
                    onChange={handleProjectChange}
                    isInvalid={!!projectErrors.projectName}
                  />
                  <Form.Control.Feedback type="invalid">{projectErrors.projectName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Project Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={ProjectformData.projectDescription}
                    rows={1}
                    name="projectDescription"
                    placeholder="Enter text here.."
                    onChange={handleProjectChange}
                    isInvalid={!!projectErrors.projectDescription}
                  />
                  <Form.Control.Feedback type="invalid">{projectErrors.projectDescription}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Group Name</Form.Label>
                  <Form.Select
                    name="groupName"
                    value={ProjectformData.groupName}
                    className="custom-form-select"
                    onChange={handleProjectChange}
                    isInvalid={!!projectErrors.groupName}
                  >
                    <option value="">Select officer...</option>
                    <option value="1">1</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{projectErrors.groupName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>HOG Name</Form.Label>
                  <Form.Select
                    name="HOGName"
                    value={ProjectformData.HOGName}
                    className="custom-form-select"
                    onChange={handleProjectChange}
                    isInvalid={!!projectErrors.HOGName}
                  >
                    <option value="">Select officer...</option>
                    <option value="1">1</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{projectErrors.HOGName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>HOD Name</Form.Label>
                  <Form.Select
                    name="HODName"
                    value={ProjectformData.HODName}
                    className="custom-form-select"
                    onChange={handleProjectChange}
                    isInvalid={!!projectErrors.HODName}
                  >
                    <option value="">Select officer...</option>
                    <option value="1">1</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{projectErrors.HODName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Technology Stack</Form.Label>
                  <Form.Control
                    type="text"
                    name="technologyStack"
                    placeholder="Enter..."
                    value={ProjectformData.technologyStack}
                    onChange={handleProjectChange}
                    isInvalid={!!projectErrors.technologyStack}
                  />
                  <Form.Control.Feedback type="invalid">{projectErrors.technologyStack}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Project Start Date</Form.Label>
                  <DatePicker
                    selected={ProjectformData.projectStartDate || null}
                    className={`form-control cfs-14 ${projectstartDateError ? 'is-invalid' : ''}`}
                    onChange={handleProjectStartDate}
                    placeholderText="Start Date"
                    dateFormat="dd-MM-yyyy"
                    name="projectStartDate"
                  />
                  {projectstartDateError && <div className="text-danger">{projectErrors.projectStartDate}</div>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Completion Date</Form.Label>
                  <DatePicker
                    selected={ProjectformData.completionDate || null}
                    className={`form-control cfs-14 ${projectCompletionDateError ? 'is-invalid' : ''}`}
                    onChange={handleProjectEndDate}
                    placeholderText="End Date"
                    dateFormat="dd-MM-yyyy"
                    name="completionDate"
                  />
                  {projectCompletionDateError && <div className="text-danger">{projectErrors.completionDate}</div>}
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
      <Modal size="md" show={showModule} onHide={handleClose} animation={true} backdrop="static" keyboard={false}>
        <Modal.Header className={mode}>
          <Modal.Title>
            <h5>Add Module</h5>
          </Modal.Title>
          <span className="pointer" onClick={handleClose}>
            {' '}
            X{' '}
          </span>
        </Modal.Header>
        <Modal.Body className={mode}>
          <Form noValidate onSubmit={handleSubmitModule}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Project Name</Form.Label>
                  <Form.Select
                    name="projectName"
                    value={ModuleformData.projectName}
                    className="custom-form-select"
                    onChange={handleModuleChange}
                    isInvalid={!!moduleErrors.projectName}
                  >
                    <option value="">Select officer...</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{moduleErrors.projectName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Module Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="moduleName"
                    placeholder="Enter..."
                    value={ModuleformData.moduleName}
                    onChange={handleModuleChange}
                    isInvalid={!!moduleErrors.moduleName}
                  />
                  <Form.Control.Feedback type="invalid">{moduleErrors.moduleName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Module Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={ModuleformData.moduleDescription}
                    rows={3}
                    name="moduleDescription"
                    placeholder="Enter text here.."
                    onChange={handleModuleChange}
                    isInvalid={!!moduleErrors.moduleDescription}
                  />
                  <Form.Control.Feedback type="invalid">{moduleErrors.moduleDescription}</Form.Control.Feedback>
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
    </div>
  );
};

export default CreateDependencies;
