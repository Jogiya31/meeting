import React, { useEffect, useMemo, useState } from 'react';
import MainCard from '../../../components/Card/MainCard';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { settingsActions } from 'store/settings/settingSlice';
import Swal from 'sweetalert2';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useTheme } from '../../../contexts/themeContext';
import DatePicker from 'react-datepicker';
import { useAuth } from '../../../contexts/AuthContext';
import { moduleActions } from '../../../store/module/moduleSlice';
import { userActions } from '../../../store/user/userSlice';
import './style.scss';

const Index = () => {
  const dispatch = useDispatch();
  const { mode } = useTheme();
  const { user } = useAuth();

  const [employmentTypeList, setEmploymentTypeList] = useState([]);
  const [organisationList, setOrganisationList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [salutationList, setSalutationList] = useState([]);
  const [priorityList, setPriorityList] = useState([]);
  const [showProject, setShowProject] = useState(false);
  const [userData, setUserData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [ProjectformData, setProjectFormData] = useState({
    ProjectTitle: '',
    ProjectDescription: '',
    GroupId: '',
    HogName: '',
    HodName: '',
    Technology: '',
    ProjectStartDate: null,
    CompletionDate: null
  });
  const [projectErrors, setProjectErrors] = useState({});
  const [projectstartDateError, setProjectStartDateError] = useState(false);
  const [projectCompletionDateError, setProjectCompletionDateError] = useState(false);

  const [showModule, setShowModule] = useState(false);
  const [moduleErrors, setModuleErrors] = useState({});
  const [ModuleformData, setModuleFormData] = useState({
    ModuleName: '',
    ProjectId: '',
    ModuleDescription: ''
  });

  const [showDivision, setShowDivision] = useState(false);
  const [divisionErrors, setDivisionErrors] = useState({});
  const [DivisionformData, setDivisionFormData] = useState({
    DivisionTitle: '',
    Description: '',
    Status: '1'
  });

  const [currSelectedData, setCurrSelectedData] = useState('');
  const [divisionSearchTerm, setDivisionSearchTerm] = useState('');
  const [filteredDivisionList, setFilteredDivisionList] = useState([]);

  const [globalSearch, setGlobalSearch] = useState('');

  const designationDataList = useSelector((state) => state.settings.designationData);
  const divisionDataList = useSelector((state) => state.settings.divisionData);
  const employeementDataList = useSelector((state) => state.settings.employeementData);
  const organizationDataList = useSelector((state) => state.settings.organizationData);
  const statusDataList = useSelector((state) => state.settings.statusData);
  const projectDataList = useSelector((state) => state.settings.projectData);
  const salutationDataList = useSelector((state) => state.settings.salutationData);
  const priorityDataList = useSelector((state) => state.settings.priorityData);
  const moduleList = useSelector((state) => state.module.data);
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
    dispatch(moduleActions.getModuleInfo());
    dispatch(userActions.getuserInfo());
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
        isEditing: false,

        ProjectId: item.ProjectId,
        ProjectTitle: item.ProjectTitle,
        ProjectDescription: item.ProjectDescription,
        DivisionId: item.DivisionId,
        HogName: Number(item.HOGName),
        HodName: Number(item.HODName),
        Technology: item.Technology,
        ProjectStartDate: item.ProjectStartDate,
        CompletionDate: item.CompletionDate,
        Status: item.Status,
        ModifyBy: item.ModifyBy,
        CreatedBy: item.CreatedBy
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
    employeementDataList,
    organizationDataList,
    statusDataList,
    projectDataList,
    salutationDataList,
    priorityDataList
  ]);

  useEffect(() => {
    if (divisionDataList?.Result) {
      const lowercasedSearch = divisionSearchTerm?.toLowerCase() || '';
      const results = divisionDataList.Result.filter((item) => item.DivisionTitle?.toLowerCase().includes(lowercasedSearch));
      setFilteredDivisionList(results);
    }
  }, [divisionDataList, divisionSearchTerm]);

  useEffect(() => {
    if (userList && Array.isArray(userList.Result)) {
      const updatedData = userList.Result.map((item) => {
        const officer = userList.Result.find((user) => user.UserId === item.AssociatedOfficerId);
        const StatusTitle = item.Status === '1' ? 'In Service' : 'Not In Service';
        const desc = item?.DesignationId?.split(',')
          .map((id) => getDesignation(id))
          .join('/ ');
        return {
          ...item,
          AssociatedOfficer: officer ? officer.UserName : '',
          DesignationTitle: desc,
          StatusTitle: StatusTitle
        };
      });
      setUserData(updatedData);
    } else {
      setUserData([]); // optional fallback
    }
  }, [userList, designationDataList]);

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
      ModifyBy: user.UserName,
      Status: updatedItem.status
    };
    if (fieldName === 'Division') {
      payload.Description = '';
    }
    if (fieldName === 'PriorityOrder') {
      payload.UserId = updatedItem.UserId || 0;
    }

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
          ModifyBy: user.UserName,
          Status: updatedItem.status === 1 ? '0' : '1' // Ensure it's a string
        };

        if (fieldName === 'Division') {
          payload.Description = '';
        }
        if (fieldName === 'PriorityOrder') {
          payload.UserId = updatedItem.UserId || 0;
        }

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
  const handleProjectDelete = (item) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to change status for this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!',
      theme: mode
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          ProjectId: item.ProjectId,
          ProjectTitle: item.ProjectTitle,
          ProjectDescription: item.ProjectDescription,
          GroupId: item.DivisionId,
          HogName: item.HogName,
          HodName: item.HodName,
          Technology: item.Technology,
          ProjectStartDate: item.ProjectStartDate,
          CompletionDate: item.CompletionDate,
          Status: item.status === 1 ? 0 : 1,
          ModifyBy: user.UserName
        };
        try {
          dispatch(settingsActions.updateProjectInfo(payload));
        } catch (error) {}
        Swal.fire({
          title: 'Updated!',
          text: 'Selected item status has been updated.',
          icon: 'success',
          theme: mode
        }).then((result) => {
          dispatch(settingsActions.getProjectInfo());
        });
      }
    });
  };
  const handleAddItem = async (newItem, setNewItem, apiAction, fetchAction, fieldName) => {
    if (!newItem.trim()) return; // Prevent empty input

    try {
      const payload = {
        [fieldName + 'Title']: newItem,
        CreatedBy: user.UserName,
        Status: '1'
      };
      if (fieldName === 'PriorityOrder') {
        payload.UserId = '1';
      }

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
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredList, setFilteredList] = useState([]);

    // Effect to filter the list whenever the list or searchTerm changes
    useEffect(() => {
      if (list) {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const results = list.filter((item) => item.title && item.title.toLowerCase().includes(lowercasedSearchTerm));
        setFilteredList(results);
      }
    }, [list, searchTerm]);

    return (
      <>
        <div className="px-4 py-2">
          <Row>
            {/* Search Input Field */}
            <Col md={9} sm={9}>
              <input
                type="text"
                className="form-control"
                placeholder={`Search ${fieldName}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={2} sm={2} className="d-flex align-items-center justify-content-end ">
              <h6>Action</h6>
            </Col>
          </Row>
        </div>
        <div className="px-4 py-2 c-card-body">
          {filteredList?.map((item, idx) => (
            <Row key={item.id}>
              <Col md={9} sm={9}>
                <div className={`d-flex justify-content-start custom-cards ${item.status ? '' : 'op-5'}`}>
                  <span className="mr-1">{idx + 1}. </span>
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
                      title="Active"
                      className="d-flex theme-bg text-white f-16 fw-bolder p-2 ml-1 pointer"
                      onClick={() => handleDelete(list, setList, updateAction, item.id, fieldName)}
                    >
                      <FaCheckCircle />
                    </span>
                  ) : (
                    <span
                      title="Not Active"
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
          {filteredList.length === 0 && searchTerm !== '' && <div className="text-center py-3">No results found for "{searchTerm}"</div>}
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

  const DivisionList = ({ divisionDataList, setSelectedData, setCurrSelectedData, handleDivisionDelete, setShowDivision }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredList = useMemo(() => {
      const lowerSearch = searchTerm.toLowerCase();
      return divisionDataList?.Result?.filter((item) => item.DivisionTitle?.toLowerCase().includes(lowerSearch)) || [];
    }, [divisionDataList, searchTerm]);

    return (
      <>
        <div className="px-4 py-2">
          <Row>
            <Col md={9} sm={9}>
              <input
                type="text"
                className="form-control"
                placeholder="Search Division..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={2} sm={2} className="d-flex align-items-center justify-content-end">
              <h6>Action</h6>
            </Col>
          </Row>
        </div>

        <div className="px-4 py-2 c-card-body">
          {filteredList.map((item, idx) => (
            <Row key={item.id}>
              <Col md={9} sm={9}>
                <div className={`d-flex justify-content-start custom-cards ${item.Status === '1' ? '' : 'op-5'}`}>
                  <span className="mr-1">{idx + 1}.</span>
                  <span>{item.DivisionTitle}</span>
                </div>
              </Col>
              <Col md={2} sm={2} className="d-flex align-items-center">
                <div className="d-flex justify-content-between">
                  <span
                    title="Edit"
                    className="feather icon-edit theme-bg2 text-white f-14 p-2 pointer"
                    onClick={() => {
                      setSelectedData(item);
                      setCurrSelectedData('division');
                    }}
                  />
                  {item.Status === '1' ? (
                    <span
                      title="Active"
                      className="d-flex theme-bg text-white f-16 fw-bolder p-2 ml-1 pointer"
                      onClick={() => handleDivisionDelete(item)}
                    >
                      <FaCheckCircle />
                    </span>
                  ) : (
                    <span
                      title="Not Active"
                      className="d-flex hold-bg text-white f-16 fw-bolder p-2 ml-1 pointer"
                      onClick={() => handleDivisionDelete(item)}
                    >
                      <FaTimesCircle />
                    </span>
                  )}
                </div>
              </Col>
            </Row>
          ))}

          {filteredList.length === 0 && searchTerm && <div className="text-center py-3">No results found for "{searchTerm}"</div>}
        </div>

        <hr />

        <div className="footer d-flex justify-content-end px-4">
          <Button className="m-0" onClick={() => setShowDivision(true)}>
            Add
          </Button>
        </div>
      </>
    );
  };
  const ProjectList = ({ projectList, setSelectedData, setCurrSelectedData, handleProjectDelete, setShowProject }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredList = useMemo(() => {
      const lowerSearch = searchTerm.toLowerCase();
      return projectList?.filter((item) => item.title?.toLowerCase().includes(lowerSearch)) || [];
    }, [projectList, searchTerm]);

    return (
      <>
        <div className="px-4 py-2">
          <Row>
            <Col md={9} sm={9}>
              <input
                type="text"
                className="form-control"
                placeholder="Search Project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={2} sm={2} className="d-flex align-items-center justify-content-end">
              <h6>Action</h6>
            </Col>
          </Row>
        </div>

        <div className="px-4 py-2 c-card-body">
          {filteredList.map((item, idx) => (
            <Row key={item.id}>
              <Col md={9} sm={9}>
                <div className={`d-flex justify-content-start custom-cards ${item.status ? '' : 'op-5'}`}>
                  <span className="mr-1">{idx + 1}.</span>
                  <span>{item.title}</span>
                </div>
              </Col>
              <Col md={2} sm={2} className="d-flex align-items-center">
                <div className="d-flex justify-content-between">
                  <span
                    title="Edit"
                    className="feather icon-edit theme-bg2 text-white f-14 p-2 pointer"
                    onClick={() => {
                      setSelectedData(item);
                      setCurrSelectedData('project');
                    }}
                  />
                  {item.status ? (
                    <span
                      title="Active"
                      className="d-flex theme-bg text-white f-16 fw-bolder p-2 ml-1 pointer"
                      onClick={() => handleProjectDelete(item)}
                    >
                      <FaCheckCircle />
                    </span>
                  ) : (
                    <span
                      title="Not Active"
                      className="d-flex hold-bg text-white f-16 fw-bolder p-2 ml-1 pointer"
                      onClick={() => handleProjectDelete(item)}
                    >
                      <FaTimesCircle />
                    </span>
                  )}
                </div>
              </Col>
            </Row>
          ))}

          {filteredList.length === 0 && searchTerm && <div className="text-center py-3">No results found for "{searchTerm}"</div>}
        </div>

        <hr />

        <div className="footer d-flex justify-content-end px-4">
          <Button className="m-0" onClick={() => setShowProject(true)}>
            Add
          </Button>
        </div>
      </>
    );
  };
  const ModuleList = ({ moduleList, setSelectedData, setCurrSelectedData, handleModuleDelete, setShowModule }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredList = useMemo(() => {
      const lowerSearch = searchTerm.toLowerCase();
      return moduleList?.Result?.filter((item) => item.ModuleName?.toLowerCase().includes(lowerSearch)) || [];
    }, [moduleList, searchTerm]);

    return (
      <>
        <div className="px-4 py-2">
          <Row>
            <Col md={9} sm={9}>
              <input
                type="text"
                className="form-control"
                placeholder="Search Module..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={2} sm={2} className="d-flex align-items-center justify-content-end">
              <h6>Action</h6>
            </Col>
          </Row>
        </div>

        <div className="px-4 py-2 c-card-body">
          {filteredList.map((item, idx) => (
            <Row key={item.id}>
              <Col md={9} sm={9}>
                <div className={`d-flex justify-content-start custom-cards ${item.Status === '1' ? '' : 'op-5'}`}>
                  <span className="mr-1">{idx + 1}.</span>
                  <span>{item.ModuleName}</span>
                </div>
              </Col>
              <Col md={2} sm={2} className="d-flex align-items-center">
                <div className="d-flex justify-content-between">
                  <span
                    title="Edit"
                    className="feather icon-edit theme-bg2 text-white f-14 p-2 pointer"
                    onClick={() => {
                      setSelectedData(item);
                      setCurrSelectedData('module');
                    }}
                  />
                  {item.Status === '1' ? (
                    <span
                      title="Active"
                      className="d-flex theme-bg text-white f-16 fw-bolder p-2 ml-1 pointer"
                      onClick={() => handleModuleDelete(item)}
                    >
                      <FaCheckCircle />
                    </span>
                  ) : (
                    <span
                      title="Not Active"
                      className="d-flex hold-bg text-white f-16 fw-bolder p-2 ml-1 pointer"
                      onClick={() => handleModuleDelete(item)}
                    >
                      <FaTimesCircle />
                    </span>
                  )}
                </div>
              </Col>
            </Row>
          ))}

          {filteredList.length === 0 && searchTerm && <div className="text-center py-3">No results found for "{searchTerm}"</div>}
        </div>

        <hr />

        <div className="footer d-flex justify-content-end px-4">
          <Button className="m-0" onClick={() => setShowModule(true)}>
            Add
          </Button>
        </div>
      </>
    );
  };

  useEffect(() => {
    if (currSelectedData === 'division' && selectedData) {
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
    if (currSelectedData === 'project' && selectedData) {
      const updatedFormData = {
        ProjectId: selectedData.ProjectId,
        ProjectTitle: selectedData.ProjectTitle,
        ProjectDescription: selectedData.ProjectDescription,
        GroupId: selectedData.DivisionId,
        HogName: selectedData.HogName,
        HodName: selectedData.HodName,
        Technology: selectedData.Technology,
        ProjectStartDate: selectedData.ProjectStartDate,
        CompletionDate: selectedData.CompletionDate,
        Status: selectedData.Status
      };
      setProjectFormData(updatedFormData);
      setShowProject(true);
    }
    if (currSelectedData === 'module' && selectedData) {
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
  }, [currSelectedData]);

  const handleModuleDelete = (item) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to change status for this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!',
      theme: mode
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          ModuleId: item.ModuleId,
          ModuleName: item.ModuleName,
          ProjectId: item.ProjectId,
          ModuleDescription: item.ModuleDescription,
          ModifyBy: user.UserName,
          Status: item.Status === '1' ? '0' : '1'
        };
        try {
          dispatch(moduleActions.updateModuleInfo(payload));
        } catch (error) {}
        Swal.fire({
          title: 'Updated!',
          text: 'Selected item status has been updated.',
          icon: 'success',
          theme: mode
        }).then((result) => {
          dispatch(moduleActions.getModuleInfo());
        });
      }
    });
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

    const payload = { ...ModuleformData };

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

  const handleDivisionDelete = (item) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to change status for this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!',
      theme: mode
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          DivisionId: item.DivisionId,
          DivisionTitle: item.DivisionTitle,
          Description: item.Description,
          ModifyBy: user.UserName,
          Status: item.Status === '1' ? '0' : '1'
        };
        try {
          dispatch(settingsActions.updateDivisionInfo(payload));
        } catch (error) {}
        Swal.fire({
          title: 'Updated!',
          text: 'Selected item status has been updated.',
          icon: 'success',
          theme: mode
        }).then((result) => {
          dispatch(settingsActions.getDivisionInfo());
        });
      }
    });
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
      payload.DivisionId = selectedData.DivisionId;
      payload.ModifyBy = user.UserName;

      dispatch(settingsActions.updateDivisionInfo(payload));
    } else {
      payload.CreatedBy = user.UserName;
      dispatch(settingsActions.addDivisionInfo(payload));
    }

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

    const Payload = { ...ProjectformData };

    if (selectedData) {
      Payload.ModifyBy = user.UserName;
      dispatch(settingsActions.updateProjectInfo(Payload));
    } else {
      Payload.CreatedBy = user.UserName;
      dispatch(settingsActions.addProjectInfo(Payload));
    }
    handleClose();
  };

  const handleClose = () => {
    setSelectedData(null);
    setCurrSelectedData('');
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
      CompletionDate: ''
    });
    setDivisionFormData({
      DivisionTitle: '',
      Description: '',
      Status: '1'
    });
    setModuleFormData({
      ModuleName: '',
      ProjectId: '',
      ModuleDescription: ''
    });
    setProjectErrors({});
    setDivisionErrors({});
    setModuleErrors({});
    dispatch(settingsActions.getProjectInfo());
    dispatch(moduleActions.getModuleInfo());
    dispatch(settingsActions.getDivisionInfo());
  };
  const matchesSearch = (text) => text?.toLowerCase().includes(globalSearch.toLowerCase()) || globalSearch.trim() === '';

  return (
    <div>
      <Row className="mb-3">
        <Col md={4} className="ml-auto">
          <Form.Control
            type="text"
            placeholder="Global Search..."
            className="globalSearch"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        {(matchesSearch('Division Lists') ||
          divisionDataList?.Result?.some((item) => item.DivisionTitle?.toLowerCase().includes(globalSearch.toLowerCase()))) && (
          <Col sm={12} md={12} xl={6} xxl={4}>
            <MainCard title="Division Lists" cardClass="info default-shadow" isOption>
              <DivisionList
                divisionDataList={divisionDataList}
                setSelectedData={setSelectedData}
                setCurrSelectedData={setCurrSelectedData}
                handleDivisionDelete={handleDivisionDelete}
                setShowDivision={setShowDivision}
              />
            </MainCard>
          </Col>
        )}
        {(matchesSearch('Employment Type') ||
          employmentTypeList?.some((item) => item.title?.toLowerCase().includes(globalSearch.toLowerCase()))) && (
          <Col sm={12} md={12} xl={6} xxl={4}>
            <MainCard title="Employment Type" cardClass="warning default-shadow" isOption>
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
        )}
        {(matchesSearch('Designation List') ||
          designationList?.some((item) => item.title?.toLowerCase().includes(globalSearch.toLowerCase()))) && (
          <Col sm={12} md={12} xl={6} xxl={4}>
            <MainCard title="Designation List" cardClass="success default-shadow" isOption>
              <RenderList
                list={designationList}
                setList={setDesignationList}
                apiAction={settingsActions.addDesignationInfo}
                fetchAction={settingsActions.getDesignationInfo}
                updateAction={settingsActions.updateDesignationInfo}
                fieldName={'Designation'}
                enableAddNew
              />
            </MainCard>
          </Col>
        )}
        {(matchesSearch('Company List') ||
          organisationList?.some((item) => item.title?.toLowerCase().includes(globalSearch.toLowerCase()))) && (
          <Col sm={12} md={12} xl={6} xxl={4}>
            <MainCard title="Company List" cardClass="purple default-shadow" isOption>
              <RenderList
                list={organisationList}
                setList={setOrganisationList}
                apiAction={settingsActions.addOrganizationInfo}
                fetchAction={settingsActions.getOrganizationInfo}
                updateAction={settingsActions.updateOrganizationInfo}
                fieldName={'Organisation'}
                enableAddNew
              />
            </MainCard>
          </Col>
        )}
        {(matchesSearch('Task Status') ||
          statusList?.some((item) => item.title?.toLowerCase().includes(globalSearch.toLowerCase()))) && (
          <Col sm={12} md={12} xl={6} xxl={4}>
            <MainCard title="Task Status" cardClass="brown default-shadow" isOption>
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
        )}
        {(matchesSearch('Salutation List') ||
          salutationList?.some((item) => item.title?.toLowerCase().includes(globalSearch.toLowerCase()))) && (
          <Col sm={12} md={12} xl={6} xxl={4}>
            <MainCard title="Salutation List" cardClass="info default-shadow" isOption>
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
        )}
        {(matchesSearch('Priority Order List') ||
          priorityList?.some((item) => item.title?.toLowerCase().includes(globalSearch.toLowerCase()))) && (
          <Col sm={12} md={12} xl={6} xxl={4}>
            <MainCard title="Priority Order List" cardClass="warning default-shadow" isOption>
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
        )}
        {(matchesSearch('Available Projects') ||
          projectList?.some((item) => item.title?.toLowerCase().includes(globalSearch.toLowerCase()))) && (
          <Col sm={12} md={12} xl={6} xxl={4}>
            <MainCard title="Available Projects" cardClass="secondary default-shadow" isOption>
              <ProjectList
                projectList={projectList}
                setSelectedData={setSelectedData}
                setCurrSelectedData={setCurrSelectedData}
                handleProjectDelete={handleProjectDelete}
                setShowProject={setShowProject}
              />
            </MainCard>
          </Col>
        )}
        {(matchesSearch('Module Lists') ||
          moduleList?.Result?.some((item) => item.ModuleName?.toLowerCase().includes(globalSearch.toLowerCase()))) && (
          <Col sm={12} md={12} xl={6} xxl={4}>
            <MainCard title="Module Lists" cardClass="success default-shadow" isOption>
              <ModuleList
                moduleList={moduleList}
                setSelectedData={setSelectedData}
                setCurrSelectedData={setCurrSelectedData}
                handleModuleDelete={handleModuleDelete}
                setShowModule={setShowModule}
              />
            </MainCard>
          </Col>
        )}
      </Row>
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
                    {userData
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
                    {userData
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
              <Button variant="secondary" onClick={() => handleClose()} className="ms-2">
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <Modal size="md" show={showDivision} onHide={handleClose} animation={true} backdrop="static" keyboard={false}>
        <Modal.Header className={mode}>
          <Modal.Title>{selectedData ? <h5>Update Division</h5> : <h5>Add Division</h5>}</Modal.Title>
          <span className="pointer" onClick={() => handleClose()}>
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
              <Button variant="secondary" onClick={() => handleClose()} className="ms-2">
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
