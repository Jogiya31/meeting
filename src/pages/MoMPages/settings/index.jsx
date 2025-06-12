import React, { useEffect, useState } from 'react';
import MainCard from '../../../components/Card/MainCard';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { settingsActions } from 'store/settings/settingSlice';
import Swal from 'sweetalert2';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useTheme } from '../../../contexts/themeContext';
import DatePicker from 'react-datepicker';

const Index = () => {
  const dispatch = useDispatch();
  const { mode } = useTheme();
  const Role = localStorage.getItem('role');

  const [divisionList, setDivisionList] = useState([]);
  const [employmentTypeList, setEmploymentTypeList] = useState([]);
  const [organisationList, setOrganisationList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [salutationList, setSalutationList] = useState([]);
  const [priorityList, setPriorityList] = useState([]);
  const [showProject, setShowProject] = useState(false);
  const [userData, setUserData] = useState([]);
  const [projectStartDate, setProjectStartDate] = useState(null);
  const [projectEndDate, setProjectEndDate] = useState(null);
  const [ProjectformData, setProjectFormData] = useState({
    ProjectTitle: '',
    projectDescription: '',
    GroupId: '',
    HogName: '',
    HodName: '',
    Technology: '',
    ProjectStartDate: null,
    CompletionDate: null,
    CreatedBy: Role
  });
  const [projectErrors, setProjectErrors] = useState({});
  const [projectstartDateError, setProjectStartDateError] = useState(false);
  const [projectCompletionDateError, setProjectCompletionDateError] = useState(false);

  const designationDataList = useSelector((state) => state.settings.designationData);
  const divisionDataList = useSelector((state) => state.settings.divisionData);
  const employeementDataList = useSelector((state) => state.settings.employeementData);
  const organizationDataList = useSelector((state) => state.settings.organizationData);
  const statusDataList = useSelector((state) => state.settings.statusData);
  const projectDataList = useSelector((state) => state.settings.projectData);
  const salutationDataList = useSelector((state) => state.settings.salutationData);
  const priorityDataList = useSelector((state) => state.settings.priorityData);
  const userList = useSelector((state) => state.users.data);

  useEffect(() => {
    dispatch(settingsActions.getDesignationInfo());
    dispatch(settingsActions.getDivisionInfo());
    dispatch(settingsActions.getEmployeementInfo());
    dispatch(settingsActions.getOrganizationInfo());
    dispatch(settingsActions.getStatusInfo());
    dispatch(settingsActions.getProjectInfo());
    dispatch(settingsActions.getSalutationInfo());
    dispatch(settingsActions.getPriorityInfo());
  }, []);

  useEffect(() => {
    if (Array.isArray(designationDataList?.Result)) {
      const list = designationDataList?.Result?.map((item) => ({
        id: item.DesignationId,
        title: item.DesignationTitle,
        status: Number(item.Status),
        isEditing: false
      }));
      setDesignationList(list);
    }
    if (Array.isArray(divisionDataList?.Result)) {
      const list = divisionDataList?.Result?.map((item) => ({
        id: item.DivisionId,
        title: item.DivisionTitle,
        status: Number(item.Status),
        isEditing: false
      }));
      setDivisionList(list);
    }
    if (Array.isArray(employeementDataList?.Result)) {
      const list = employeementDataList?.Result?.map((item) => ({
        id: item.EmployeementId,
        title: item.EmployeementTitle,
        status: Number(item.Status),
        isEditing: false
      }));
      setEmploymentTypeList(list);
    }
    if (Array.isArray(organizationDataList?.Result)) {
      const list = organizationDataList.Result.map((item) => ({
        id: item.OrganisationId,
        title: item.OrganisationTitle,
        status: Number(item.Status),
        isEditing: false
      }));
      setOrganisationList(list);
    }
    if (Array.isArray(statusDataList?.Result)) {
      const list = statusDataList.Result.map((item) => ({
        id: item.StatusId,
        title: item.StatusTitle,
        status: Number(item.Status),
        isEditing: false
      }));
      setStatusList(list);
    }
    if (Array.isArray(projectDataList?.Result)) {
      const list = projectDataList.Result.map((item) => ({
        id: item.ProjectId,
        title: item.ProjectTitle,
        status: Number(item.Status),
        isEditing: false
      }));
      setProjectList(list);
    }
    if (Array.isArray(salutationDataList?.Result)) {
      const list = salutationDataList.Result.map((item) => ({
        id: item.SalutationId,
        title: item.SalutationTitle,
        status: Number(item.Status),
        isEditing: false
      }));
      setSalutationList(list);
    }
    if (Array.isArray(priorityDataList?.Result)) {
      const list = priorityDataList.Result.map((item) => ({
        id: item.PriorityOrderId,
        title: item.PriorityOrderTitle,
        status: Number(item.Status),
        isEditing: false
      }));
      setPriorityList(list);
    }
  }, [
    designationDataList,
    divisionDataList,
    employeementDataList,
    organizationDataList,
    statusDataList,
    projectDataList,
    salutationDataList,
    priorityDataList
  ]);

  useEffect(() => {
    if (userList && Array.isArray(userList.Result)) {
      const updatedData = userList.Result.map((item) => {
        const officer = userList.Result.find((user) => user.UserId === item.AssociatedOfficerId);
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
  }, [userList]);

  const getDesignation = (val) => {
    const data = Array.isArray(designationDataList?.Result) ? designationDataList.Result : Object.values(designationDataList?.Result || {});
    const found = data.find((item) => item.DesignationId === val);
    return found ? found.DesignationTitle : '';
  };

  const handleEdit = (list, setList, id) => {
    Swal.fire({
      title: 'Update',
      text: `Click on proceed button, If you want yo update the information`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Proceed',
      theme: mode
    }).then((result) => {
      if (result.isConfirmed) {
        setList(list.map((item) => (item.id === id ? { ...item, isEditing: true } : item)));
      }
    });
  };

  const handleChange = (list, setList, id, newValue) => {
    setList(list.map((item) => (item.id === id ? { ...item, title: newValue } : item)));
  };

  const handleSaveChange = async (list, setList, updateAction, id, fieldName) => {
    const updatedItem = list.find((item) => item.id === id);
    if (!updatedItem) return;
    const payload = {
      [fieldName + 'Id']: updatedItem.id, // Dynamically setting the ID field
      [fieldName + 'Title']: updatedItem.title,
      ModifyBy: Role,
      Status: updatedItem.status
    };

    try {
      await dispatch(updateAction(payload));
      setList(list.map((item) => (item.id === id ? { ...item, isEditing: false } : item)));
    } catch (error) {}
  };

  const handleDelete = async (list, setList, updateAction, id, fieldName) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to change status for this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!',
      theme: mode
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updatedItem = list.find((item) => item.id === id);
        if (!updatedItem) return;

        const payload = {
          [fieldName + 'Id']: updatedItem.id,
          [fieldName + 'Title']: updatedItem.title,
          ModifyBy: Role,
          Status: updatedItem.status === 1 ? '0' : '1' // Ensure it's a string
        };

        try {
          await dispatch(updateAction(payload));

          // Create a new array reference to trigger re-render
          setList((prevList) => prevList.map((item) => (item.id === id ? { ...item, status: updatedItem.status === 1 ? 0 : 1 } : item)));
        } catch (error) {}
        Swal.fire({
          title: 'Updated!',
          text: 'Selected item status has been updated.',
          icon: 'success',
          theme: mode
        });
      }
    });
  };

  const handleAddItem = async (newItem, setNewItem, apiAction, fetchAction, fieldName) => {
    if (!newItem.trim()) return; // Prevent empty input

    try {
      const payload = {
        [fieldName + 'Title']: newItem,
        CreatedBy: Role,
        Status: '1'
      };

      // Dispatch action to add new item
      await dispatch(apiAction(payload));

      // Wait for Redux state to update before re-fetching
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Fetch updated list
      await dispatch(fetchAction());

      // Reset input field
      setNewItem('');
    } catch (error) {}
  };

  const RenderList = ({ list, setList, apiAction, fetchAction, updateAction, fieldName, enableAddNew }) => {
    const [newItem, setNewItem] = useState('');

    return (
      <>
        <div className="px-4 py-2 c-card-body">
          <div className="d-flex justify-content-between">
            <h6>Title</h6>
            <h6>Action</h6>
          </div>
          {list?.map((item) => (
            <Row key={item.id}>
              <Col md={9} sm={9}>
                <div className={`d-flex justify-content-between custom-cards ${item.status ? '' : 'op-5'}`}>
                  {item.isEditing ? (
                    <input
                      type="text"
                      className="w-100 form-control bg-0 p-2"
                      value={item.title}
                      onChange={(e) => handleChange(list, setList, item.id, e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <span>{item.title}</span>
                  )}
                </div>
              </Col>
              <Col md={2} sm={2} className="d-flex align-items-center">
                <div className="d-flex justify-content-between">
                  {item.isEditing ? (
                    <span
                      title="Save"
                      className={`feather icon-check theme-bg2 text-white f-14 p-2 pointer`}
                      onClick={() => handleSaveChange(list, setList, updateAction, item.id, fieldName)}
                    />
                  ) : (
                    <span
                      title="Edit"
                      className={`feather icon-edit theme-bg2 text-white f-14 p-2 pointer`}
                      onClick={() => handleEdit(list, setList, item.id)}
                    />
                  )}
                  {item.status ? (
                    <span
                      title="Visible"
                      className="d-flex theme-bg text-white f-16 fw-bolder p-2 ml-1 pointer"
                      onClick={() => handleDelete(list, setList, updateAction, item.id, fieldName)}
                    >
                      <FaCheckCircle />
                    </span>
                  ) : (
                    <span
                      title="Not Visible"
                      className="d-flex hold-bg text-white f-16 fw-bolder p-2 ml-1 pointer"
                      onClick={() => handleDelete(list, setList, updateAction, item.id, fieldName)}
                    >
                      <FaTimesCircle />
                    </span>
                  )}
                </div>
              </Col>
            </Row>
          ))}
        </div>
        <hr />
        {enableAddNew && (
          <div className="footer d-flex justify-content-between px-4">
            <input
              type="text"
              className="form-control mr-3"
              placeholder="Enter text here.."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
            />
            <Button className="m-0" onClick={() => handleAddItem(newItem, setNewItem, apiAction, fetchAction, fieldName)}>
              Add
            </Button>
          </div>
        )}
      </>
    );
  };

  const handleClose = () => {
    setShowProject(false);
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
    dispatch(settingsActions.getProjectInfo());
  };
  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProjectFormData({ ...ProjectformData, [name]: value });
  };
  const validateProject = () => {
    let newErrors = {};
    if (!ProjectformData.ProjectTitle) newErrors.ProjectTitle = 'Required field.';
    if (!ProjectformData.projectDescription) newErrors.projectDescription = 'Required field.';
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
      setProjectStartDate(date);
      setProjectFormData({ ...ProjectformData, ProjectStartDate: formattedDate || '' });
    } else {
      setProjectFormData({ ...ProjectformData, ProjectStartDate: '' });
    }
  };
  const handleProjectEndDate = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setProjectCompletionDateError(false);
      const formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
      setProjectEndDate(date);
      setProjectFormData({ ...ProjectformData, CompletionDate: formattedDate || '' });
    } else {
      setProjectFormData({ ...ProjectformData, CompletionDate: '' });
    }
  };
  const handleSubmitProject = (e) => {
    e.preventDefault();
    if (!validateProject()) return;
    dispatch(settingsActions.addProjectInfoFromTracker(ProjectformData));
    handleClose();
  };

  return (
    <div>
      <Row>
        <Col sm={12} md={12} xl={6} xxl={4}>
          <MainCard title="Division List" cardClass="info default-shadow">
            <RenderList
              list={divisionList}
              setList={setDivisionList}
              apiAction={settingsActions.addDivisionInfo}
              fetchAction={settingsActions.getDivisionInfo}
              updateAction={settingsActions.updateDivisionInfo}
              fieldName={'Division'}
              enableAddNew
            />
          </MainCard>
        </Col>
        <Col sm={12} md={12} xl={6} xxl={4}>
          <MainCard title="Employment Type" cardClass="warning default-shadow">
            <RenderList
              list={employmentTypeList}
              setList={setEmploymentTypeList}
              apiAction={settingsActions.addEmployeementInfo}
              fetchAction={settingsActions.getEmployeementInfo}
              updateAction={settingsActions.updateEmployeementInfo}
              fieldName={'Employeement'}
              enableAddNew
            />
          </MainCard>
        </Col>
        <Col sm={12} md={12} xl={6} xxl={4}>
          <MainCard title="Designation List" cardClass="success default-shadow">
            <RenderList
              list={designationList}
              setList={setDesignationList}
              apiAction={settingsActions.addDesignationInfo}
              fetchAction={settingsActions.getDesignationInfo}
              updateAction={settingsActions.updateDesignationInfo}
              fieldName={'Employeement'}
              enableAddNew
            />
          </MainCard>
        </Col>
        <Col sm={12} md={12} xl={6} xxl={4}>
          <MainCard title="Company List" cardClass="purple default-shadow">
            <RenderList
              list={organisationList}
              setList={setOrganisationList}
              apiAction={settingsActions.addOrganizationInfo}
              fetchAction={settingsActions.getOrganizationInfo}
              updateAction={settingsActions.updateOrganizationInfo}
              fieldName={'Employeement'}
              enableAddNew
            />
          </MainCard>
        </Col>
        <Col sm={12} md={12} xl={6} xxl={4}>
          <MainCard title="Task Status" cardClass="brown default-shadow">
            <RenderList
              list={statusList}
              setList={setStatusList}
              apiAction={settingsActions.addStatusInfo}
              fetchAction={settingsActions.getStatusInfo}
              updateAction={settingsActions.updateStatusInfo}
              fieldName={'Status'}
              enableAddNew
            />
          </MainCard>
        </Col>

        <Col sm={12} md={12} xl={6} xxl={4}>
          <MainCard title="Salutation List" cardClass="info default-shadow">
            <RenderList
              list={salutationList}
              setList={setSalutationList}
              apiAction={settingsActions.addSalutationInfo}
              fetchAction={settingsActions.getSalutationInfo}
              updateAction={settingsActions.updateSalutationInfo}
              fieldName={'Salutation'}
              enableAddNew
            />
          </MainCard>
        </Col>
        <Col sm={12} md={12} xl={6} xxl={4}>
          <MainCard title="Priority Order List" cardClass="warning default-shadow">
            <RenderList
              list={priorityList}
              setList={setPriorityList}
              apiAction={settingsActions.addPriorityInfo}
              fetchAction={settingsActions.getPriorityInfo}
              updateAction={settingsActions.updatePriorityInfo}
              fieldName={'PriorityOrder'}
              enableAddNew
            />
          </MainCard>
        </Col>

        <Col sm={12} md={12} xl={6} xxl={4}>
          <MainCard title="Available Projects" cardClass="secondary default-shadow">
            <div className="px-4 py-2 c-card-body">
              <div className="d-flex justify-content-between">
                <h6>Title</h6>
                <h6>Action</h6>
              </div>
              {projectList?.map((item) => (
                <Row key={item.id}>
                  <Col md={9} sm={9}>
                    <div className={`d-flex justify-content-between custom-cards ${item.status ? '' : 'op-5'}`}>
                      {item.isEditing ? (
                        <input
                          type="text"
                          className="w-100 form-control bg-0 p-2"
                          value={item.title}
                          onChange={(e) => handleChange(projectList, setProjectList, item.id, e.target.value)}
                          autoFocus
                        />
                      ) : (
                        <span>{item.title}</span>
                      )}
                    </div>
                  </Col>
                  <Col md={2} sm={2} className="d-flex align-items-center">
                    <div className="d-flex justify-content-between">
                      {item.isEditing ? (
                        <span
                          title="Save"
                          className={`feather icon-check theme-bg2 text-white f-14 p-2 pointer`}
                          onClick={() => handleSaveChange(projectList, setProjectList, settingsActions.addProjectInfo, item.id, 'Project')}
                        />
                      ) : (
                        <span
                          title="Edit"
                          className={`feather icon-edit theme-bg2 text-white f-14 p-2 pointer`}
                          onClick={() => handleEdit(projectList, setProjectList, item.id)}
                        />
                      )}
                      {item.status ? (
                        <span
                          title="Visible"
                          className="d-flex theme-bg text-white f-16 fw-bolder p-2 ml-1 pointer"
                          onClick={() => handleDelete(projectList, setProjectList, settingsActions.addProjectInfo, item.id, 'Project')}
                        >
                          <FaCheckCircle />
                        </span>
                      ) : (
                        <span
                          title="Not Visible"
                          className="d-flex hold-bg text-white f-16 fw-bolder p-2 ml-1 pointer"
                          onClick={() => handleDelete(projectList, setProjectList, settingsActions.addProjectInfo, item.id, 'Project')}
                        >
                          <FaTimesCircle />
                        </span>
                      )}
                    </div>
                  </Col>
                </Row>
              ))}
            </div>
            <hr />
            <div className="footer d-flex justify-content-end px-4">
              <Button className="m-0" onClick={() => setShowProject(true)}>
                Add
              </Button>
            </div>
          </MainCard>
        </Col>
      </Row>
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
                    name="GroupId"
                    value={ProjectformData.GroupId}
                    className="custom-form-select"
                    onChange={handleProjectChange}
                    isInvalid={!!projectErrors.GroupId}
                  >
                    <option value="">Select Group...</option>
                    {divisionDataList?.Result?.map((item) => (
                      <option value={item.DivisionId}>{item.DivisionTitle}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{projectErrors.GroupId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>HOG Name</Form.Label>
                  <Form.Select
                    name="HogName"
                    value={ProjectformData.HogName}
                    className="custom-form-select"
                    onChange={handleProjectChange}
                    isInvalid={!!projectErrors.HogName}
                  >
                    <option value="">Select officer...</option>
                    {userData
                      .filter((item) => item.DesignationTitle?.includes('HOG'))
                      .map((item) => (
                        <option key={item.UserName} value={item.UserId}>
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
                    {userData
                      .filter((item) => item.DesignationTitle?.includes('HOD'))
                      .map((item) => (
                        <option key={item.UserName} value={item.UserId}>
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
                    selected={projectStartDate || null}
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
                    selected={projectEndDate || null}
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
    </div>
  );
};

export default Index;
