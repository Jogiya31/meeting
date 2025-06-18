import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Modal, Nav, Row, Tab } from 'react-bootstrap';
import { useTheme } from '../../../contexts/themeContext';
import EnhancedTable from '../../../components/Table';
import DatePicker from 'react-datepicker';
import edit from '../../../assets/images/edit.png';
import { settingsActions } from '../../../store/settings/settingSlice';
import { userActions } from '../../../store/user/userSlice';
import { moduleActions } from '../../../store/module/moduleSlice';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../api';
const CreateDependencies = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { mode } = useTheme();

  const [userdata, setUserData] = useState([]);
  const [showDivision, setShowDivision] = useState(false);
  const [showProject, setShowProject] = useState(false);
  const [showModule, setShowModule] = useState(false);
  const [divisionErrors, setDivisionErrors] = useState({});
  const [moduleErrors, setModuleErrors] = useState({});
  const [projectErrors, setProjectErrors] = useState({});
  const [selectedData, setSelectedData] = useState(null);
  const [currSelectedData, setCurrSelectedData] = useState('');
  const [projectstartDateError, setProjectStartDateError] = useState(false);
  const [projectCompletionDateError, setProjectCompletionDateError] = useState(false);
  const [projectData, setprojectData] = useState([]);

  const [DivisionformData, setDivisionFormData] = useState({
    DivisionTitle: '',
    CreatedBy: user.UserName,
    Description: '',
    Status: '1'
  });
  const [ProjectformData, setProjectFormData] = useState({
    ProjectTitle: '',
    ProjectDescription: '',
    GroupId: '',
    HogName: '',
    HodName: '',
    Technology: '',
    ProjectStartDate: '',
    CompletionDate: ''
  });
  const [ModuleformData, setModuleFormData] = useState({
    ModuleName: '',
    ProjectId: '',
    ModuleDescription: '',
    CreatedBy: user.UserName
  });

  const divisionDataList = useSelector((state) => state.settings.divisionData);
  const projectDataList = useSelector((state) => state.settings.projectData);
  const userList = useSelector((state) => state.users.data);
  const moduleList = useSelector((state) => state.module.data);
  const designationDataList = useSelector((state) => state.settings.designationData);

  useEffect(() => {
    dispatch(settingsActions.getDivisionInfo());
    dispatch(settingsActions.getProjectInfo());
    dispatch(userActions.getuserInfo());
    dispatch(settingsActions.getDesignationInfo());
    dispatch(moduleActions.getModuleInfo());
  }, []);

  useEffect(() => {
    if (userList && Array.isArray(userList.Result)) {
      const updatedData = userList?.Result.map((item) => {
        const officer = userList?.Result.find((user) => user.UserId === item.AssociatedOfficerId);
        const desc = item?.DesignationId?.split(',')
          .map((id) => getDesignation(id))
          .join('/ ');
        return {
          ...item,
          AssociatedOfficer: officer ? officer.UserName : '',
          DesignationTitle: desc
        };
      });
      setUserData(updatedData);
    } else {
      setUserData([]); // optional fallback
    }

    if (projectDataList && Array.isArray(projectDataList.Result)) {
      const updatedData = projectDataList?.Result?.map((item) => {
        const officerHOD = userList?.Result.find((user) => String(user.UserId) === String(item.HODName));
        const officerHOG = userList?.Result.find((user) => String(user.UserId) === String(item.HOGName));
        const divisionName = divisionDataList?.Result?.find((div) => String(div.DivisionId) === String(item.DivisionId));
        return {
          ...item,
          HODName: officerHOD?.UserName,
          HODId: officerHOD?.UserId,
          HOGName: officerHOG?.UserName,
          HOGId: officerHOG?.UserId,
          DivisionName: divisionName?.DivisionTitle
        };
      });
      setprojectData(updatedData || []);
    } else {
      setprojectData([]);
    }
  }, [userList, designationDataList, projectDataList]);

  const getDesignation = (val) => {
    const data = Array.isArray(designationDataList?.Result) ? designationDataList.Result : Object.values(designationDataList?.Result || {});
    const found = data.find((item) => item.DesignationId === val);
    return found ? found.DesignationTitle : '';
  };

  const DivisionHeaders = [
    { id: 'DivisionTitle', label: 'Division Name', class: '' },
    { id: 'Description', label: 'Division Description', class: '' }
  ];

  const ProjectHeaders = [
    { id: 'ProjectTitle', label: 'Project Name', class: '' },
    { id: 'ProjectDescription', label: 'Project Description', class: '' },
    { id: 'DivisionName', label: 'Division Name', class: '' },
    { id: 'HODName', label: 'HOD Name', class: '' },
    { id: 'HOGName', label: 'HOG Name', class: '' },
    { id: 'Technology', label: 'Technology Stack', class: '' }
  ];

  const ModuleHeaders = [
    { id: 'ProjectTitle', label: 'Project Name', class: '' },
    { id: 'ModuleName', label: 'Module Name', class: '' },
    { id: 'ModuleDescription', label: 'Module Description', class: '' },
    { id: 'CreatedBy', label: 'Created By', class: '' },
    { id: 'CreatedDate', label: 'Create At', class: '' }
  ];

  const handleClose = () => {
    setShowDivision(false);
    setShowProject(false);
    setShowModule(false);
    setProjectFormData({
      ProjectTitle: '',
      ProjectDescription: '',
      GroupId: '',
      HogName: '',
      HodName: '',
      Technology: '',
      ProjectStartDate: '',
      CompletionDate: '',
      CreatedBy: user.UserName
    });
    setDivisionFormData({
      DivisionTitle: '',
      CreatedBy: user.UserName,
      Description: '',
      Status: '1'
    });
    setModuleFormData({
      projectName: '',
      moduleName: '',
      moduleDescription: ''
    });
    setDivisionErrors({});
    setProjectErrors({});
    setModuleErrors({});
    setProjectStartDateError(false);
    setProjectCompletionDateError(false);
    setSelectedData(null);
    setCurrSelectedData('');
  };

  const handleDivisionChange = (e) => {
    const { name, value } = e.target;
    setDivisionFormData({ ...DivisionformData, [name]: value });
  };
  const validateDivision = () => {
    let newErrors = {};
    if (!DivisionformData.DivisionTitle) newErrors.DivisionTitle = 'Required field.';
    if (!DivisionformData.Description) newErrors.Description = 'Required field.';
    setDivisionErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmitDivision = (e) => {
    e.preventDefault();
    if (!validateDivision()) return;

    const payload = { ...DivisionformData };

    if (selectedData) {
      payload.Key = 9;
      payload.DivisionId = selectedData.DivisionId;
      payload.ModifyBy = user.UserName;
    } else {
      payload.Key = 8;
    }

    api
      .post('/Api', payload)
      .then(() => {
        dispatch(settingsActions.getDivisionInfo());
      })
      .catch((err) => console.error('Error saving user:', err));
    handleClose();
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectFormData({ ...ProjectformData, [name]: value });
  };
  const validateProject = () => {
    let newErrors = {};
    if (!ProjectformData.ProjectTitle) newErrors.ProjectTitle = 'Required field.';
    if (!ProjectformData.ProjectDescription) newErrors.ProjectDescription = 'Required field.';
    if (!ProjectformData.GroupId) newErrors.GroupId = 'Required field.';
    if (!ProjectformData.HogName) newErrors.HogName = 'Required field.';
    if (!ProjectformData.HodName) newErrors.HodName = 'Required field.';
    if (!ProjectformData.Technology) newErrors.Technology = 'Required field.';
    if (!ProjectformData.ProjectStartDate) {
      setProjectStartDateError(!projectstartDateError);
      newErrors.ProjectStartDate = 'Required field.';
    }
    if (!ProjectformData.CompletionDate) {
      setProjectCompletionDateError(!projectCompletionDateError);
      newErrors.CompletionDate = 'Required field.';
    }
    setProjectErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleProjectStartDate = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setProjectStartDateError(false);
      const formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
      setProjectFormData({ ...ProjectformData, ProjectStartDate: formattedDate || '' });
    } else {
      setProjectFormData({ ...ProjectformData, ProjectStartDate: '' });
    }
  };
  const handleProjectEndDate = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setProjectCompletionDateError(false);
      const formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
      setProjectFormData({ ...ProjectformData, CompletionDate: formattedDate || '' });
    } else {
      setProjectFormData({ ...ProjectformData, CompletionDate: '' });
    }
  };
  const handleSubmitProject = (e) => {
    e.preventDefault();
    if (!validateProject()) return;
    const payload = { ...ProjectformData };
    if (selectedData) {
      dispatch(settingsActions.updateProjectInfo(payload));
    } else {
      dispatch(settingsActions.addProjectInfo(payload));
    }
    handleClose();
    setTimeout(() => {
      dispatch(settingsActions.getProjectInfo());
    }, 300);
  };

  const handleModuleChange = (e) => {
    const { name, value } = e.target;
    setModuleFormData({ ...ModuleformData, [name]: value });
  };
  const validateModule = () => {
    let newErrors = {};
    if (!ModuleformData.ModuleName) newErrors.ModuleName = 'Required field.';
    if (!ModuleformData.ModuleDescription) newErrors.ModuleDescription = 'Required field.';
    if (!ModuleformData.ProjectId) newErrors.ProjectId = 'Required field.';
    setModuleErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmitModule = (e) => {
    e.preventDefault();
    if (!validateModule()) return;

    const payload = {
      ModuleName: ModuleformData.ModuleName,
      ProjectId: ModuleformData.ProjectId,
      ModuleDescription: ModuleformData.ModuleDescription
    };

    if (selectedData) {
      payload.Status = selectedData.Status;
      payload.ModuleId = selectedData.ModuleId;
      payload.ModifyBy = user.UserName;
      dispatch(moduleActions.updateModuleInfo(payload));
    } else {
      payload.CreatedBy = user.UserName;
      dispatch(moduleActions.addModuleInfo(payload));
    }

    setTimeout(() => {
      dispatch(moduleActions.getModuleInfo());
    }, 300);

    handleClose();
  };

  useEffect(() => {
    if (currSelectedData === 'division') {
      const updatedFormData = {
        DivisionId: selectedData.DivisionId,
        DivisionTitle: selectedData.DivisionTitle,
        ModifyBy: user.UserName,
        Description: selectedData.Description,
        Status: selectedData.Status
      };
      setDivisionFormData(updatedFormData);
      setShowDivision(true);
    }
    if (currSelectedData === 'project') {
      const updatedFormData = {
        ProjectId: selectedData.ProjectId,
        ProjectTitle: selectedData.ProjectTitle,
        ProjectDescription: selectedData.ProjectDescription,
        GroupId: selectedData.DivisionId,
        HogName: selectedData.HOGId,
        HodName: selectedData.HODId,
        Technology: selectedData.Technology,
        ProjectStartDate: selectedData.ProjectStartDate,
        CompletionDate: selectedData.CompletionDate,
        Status: selectedData.Status,
        ModifyBy: user.UserName
      };
      setProjectFormData(updatedFormData);
      setShowProject(true);
    }
    if (currSelectedData === 'module') {
      const updatedData = {
        ModuleId: selectedData.ModuleId,
        ModuleName: selectedData.ModuleName,
        ProjectId: selectedData.ProjectId,
        ModuleDescription: selectedData.ModuleDescription,
        ModifyBy: user.UserName,
        Status: selectedData.Status
      };
      setModuleFormData(updatedData);
      setShowModule(true);
    }
  }, [selectedData]);

  return (
    <div>
      <Row>
        <Col sm={12} md={12} xl={12} xxl={12}>
          <Tab.Container id="left-tabs-example" defaultActiveKey="group">
            <Row>
              <Col sm={2}>
                <Nav variant="pills" className="flex-column default-shadow">
                  <Nav.Item>
                    <Nav.Link eventKey="group">Division</Nav.Link>
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
                        <Button className="" onClick={() => setShowDivision(true)}>
                          Add New
                        </Button>
                      </div>
                      <div className="dark-table">
                        <EnhancedTable
                          data={divisionDataList.Result || []}
                          headers={DivisionHeaders}
                          headerCss="info"
                          enablePagination
                          enableSno
                          rowactions={(row) => (
                            <Button
                              variant=""
                              size="sm"
                              onClick={() => {
                                setSelectedData(row), setCurrSelectedData('division');
                              }}
                              title="Edit"
                            >
                              <img src={edit} width={20} alt="" />
                            </Button>
                          )}
                        />
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
                        <EnhancedTable
                          data={projectData || []}
                          headers={ProjectHeaders}
                          headerCss="info"
                          enablePagination
                          enableSno
                          rowactions={(row) => (
                            <Button
                              variant=""
                              size="sm"
                              onClick={() => {
                                setSelectedData(row), setCurrSelectedData('project');
                              }}
                              title="Edit"
                            >
                              <img src={edit} width={20} alt="" />
                            </Button>
                          )}
                        />
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
                        <EnhancedTable
                          data={moduleList.Result || []}
                          headers={ModuleHeaders}
                          headerCss="info"
                          enablePagination
                          rowactions={(row) => (
                            <Button
                              variant=""
                              size="sm"
                              onClick={() => {
                                setSelectedData(row), setCurrSelectedData('module');
                              }}
                              title="Edit"
                            >
                              <img src={edit} width={20} alt="" />
                            </Button>
                          )}
                        />
                      </div>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Col>
      </Row>
      <Modal size="md" show={showDivision} onHide={handleClose} animation={true} backdrop="static" keyboard={false}>
        <Modal.Header className={mode}>
          <Modal.Title>{selectedData ? <h5>Update Division</h5> : <h5>Add Division</h5>}</Modal.Title>
          <span className="pointer" onClick={handleClose}>
            {' '}
            X{' '}
          </span>
        </Modal.Header>
        <Modal.Body className={mode}>
          <Form noValidate onSubmit={handleSubmitDivision}>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Division Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="DivisionTitle"
                    placeholder="Enter..."
                    value={DivisionformData.DivisionTitle}
                    onChange={handleDivisionChange}
                    isInvalid={!!divisionErrors.DivisionTitle}
                  />
                  <Form.Control.Feedback type="invalid">{divisionErrors.DivisionTitle}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={DivisionformData.Description}
                    rows={1}
                    name="Description"
                    placeholder="Enter text here.."
                    onChange={handleDivisionChange}
                    isInvalid={!!divisionErrors.Description}
                  />
                  <Form.Control.Feedback type="invalid">{divisionErrors.Description}</Form.Control.Feedback>
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
          <Modal.Title>{selectedData ? <h5>Update Project</h5> : <h5>Add Project</h5>}</Modal.Title>
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
                    name="ProjectTitle"
                    placeholder="Enter..."
                    value={ProjectformData.ProjectTitle}
                    onChange={handleProjectChange}
                    isInvalid={!!projectErrors.ProjectTitle}
                  />
                  <Form.Control.Feedback type="invalid">{projectErrors.ProjectTitle}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Project Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={ProjectformData.ProjectDescription}
                    rows={1}
                    name="ProjectDescription"
                    placeholder="Enter text here.."
                    onChange={handleProjectChange}
                    isInvalid={!!projectErrors.ProjectDescription}
                  />
                  <Form.Control.Feedback type="invalid">{projectErrors.ProjectDescription}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Division Name</Form.Label>
                  <Form.Select
                    name="GroupId"
                    value={ProjectformData.GroupId}
                    className="custom-form-select"
                    onChange={handleProjectChange}
                    isInvalid={!!projectErrors.GroupId}
                  >
                    <option value="">Select Divison...</option>
                    {Array.isArray(divisionDataList?.Result)
                      ? divisionDataList.Result.filter((item) => item.Status === '1').map((item) => (
                          <option key={item.DivisionId} value={item.DivisionId}>
                            {item.DivisionTitle}
                          </option>
                        ))
                      : Object.values(divisionDataList?.Result || {})
                          .filter((item) => item.Status === '1')
                          .map((item) => (
                            <option key={item.DivisionId} value={item.DivisionId}>
                              {item.DivisionTitle}
                            </option>
                          ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{projectErrors.GroupId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>HOG Name</Form.Label>
                  <Form.Select
                    name="HogName"
                    value={ProjectformData.HogName}
                    className="custom-form-select"
                    onChange={handleProjectChange}
                    isInvalid={!!projectErrors.HogName}
                  >
                    <option value="">Select officer...</option>
                    {userdata
                      ?.filter((item) => item.DesignationTitle?.includes('HOG'))
                      .map((item) => (
                        <option key={item.UserId} value={item.UserId}>
                          {item.UserName}
                        </option>
                      ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{projectErrors.HogName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>HOD Name</Form.Label>
                  <Form.Select
                    name="HodName"
                    value={ProjectformData.HodName}
                    className="custom-form-select"
                    onChange={handleProjectChange}
                    isInvalid={!!projectErrors.HodName}
                  >
                    <option value="">Select officer...</option>
                    {userdata
                      ?.filter((item) => item.DesignationTitle?.includes('HOD'))
                      .map((item) => (
                        <option key={item.UserId} value={item.UserId}>
                          {item.UserName}
                        </option>
                      ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{projectErrors.HodName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Technology Stack</Form.Label>
                  <Form.Control
                    type="text"
                    name="Technology"
                    placeholder="Enter..."
                    value={ProjectformData.Technology}
                    onChange={handleProjectChange}
                    isInvalid={!!projectErrors.Technology}
                  />
                  <Form.Control.Feedback type="invalid">{projectErrors.Technology}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Project Start Date</Form.Label>
                  <DatePicker
                    selected={ProjectformData.ProjectStartDate || null}
                    className={`form-control cfs-14 ${projectstartDateError ? 'is-invalid' : ''}`}
                    onChange={handleProjectStartDate}
                    placeholderText="Start Date"
                    dateFormat="dd-MM-yyyy"
                    name="ProjectStartDate"
                  />
                  {projectstartDateError && <div className="text-danger">{projectErrors.ProjectStartDate}</div>}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Completion Date</Form.Label>
                  <DatePicker
                    selected={ProjectformData.CompletionDate || null}
                    className={`form-control cfs-14 ${projectCompletionDateError ? 'is-invalid' : ''}`}
                    onChange={handleProjectEndDate}
                    placeholderText="End Date"
                    dateFormat="dd-MM-yyyy"
                    name="CompletionDate"
                  />
                  {projectCompletionDateError && <div className="text-danger">{projectErrors.CompletionDate}</div>}
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
          <Modal.Title>{selectedData ? <h5>Update Module</h5> : <h5>Add Module</h5>}</Modal.Title>
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
                    name="ProjectId"
                    value={ModuleformData.ProjectId}
                    className="custom-form-select"
                    onChange={handleModuleChange}
                    isInvalid={!!moduleErrors.ProjectId}
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
                  <Form.Control.Feedback type="invalid">{moduleErrors.ProjectId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Module Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="ModuleName"
                    placeholder="Enter..."
                    value={ModuleformData.ModuleName}
                    onChange={handleModuleChange}
                    isInvalid={!!moduleErrors.ModuleName}
                  />
                  <Form.Control.Feedback type="invalid">{moduleErrors.ModuleName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Module Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={ModuleformData.ModuleDescription}
                    rows={3}
                    name="ModuleDescription"
                    placeholder="Enter text here.."
                    onChange={handleModuleChange}
                    isInvalid={!!moduleErrors.ModuleDescription}
                  />
                  <Form.Control.Feedback type="invalid">{moduleErrors.ModuleDescription}</Form.Control.Feedback>
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
