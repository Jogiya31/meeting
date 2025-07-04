import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Card, Modal, Button, CardSubtitle, Form } from 'react-bootstrap';
import female_i from '../../../assets/images/user/female.jpg';
import male_i from '../../../assets/images/user/male.jpg';
import api from '../../../api';
import excel_i from '../../../assets/images/excel_i.svg';
import print_i from '../../../assets/images/print_i.svg';
import refresh from '../../../assets/images/refresh-arrow.png';
import edit from '../../../assets/images/edit.png';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../../store/user/userSlice';
import { settingsActions } from '../../../store/settings/settingSlice';
import { FaUserCircle, FaUserEdit } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Swal from 'sweetalert2';
import { MultiSelect } from 'react-multi-select-component';
import { useTheme } from '../../../contexts/themeContext';
import AdvanceTable from '../../../components/Table/advanceTable';
import { capitalizeWords, exportJsonToExcel } from '../../../utils/utils';

const UserList = () => {
  const dispatch = useDispatch();
  const { mode } = useTheme();
  const { user } = useAuth();
  const gridRef = useRef();
  const Role = localStorage.getItem('role');
  const [selectedUser, setselectedUser] = useState(null);
  const [currentDate, setcurrentDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [showregister, setShowregister] = useState(false);
  const [designationListOption, setDesignationListOptions] = useState([]); // User options state
  const [designationFilter, setDesignationFilter] = useState([]); // user filter state
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [resetTrigger, setResetTrigger] = useState(0);

  const [genderDataList, setGenderDataList] = useState([
    {
      GenderId: 1,
      GenderTitle: 'Male'
    },
    {
      GenderId: 2,
      GenderTitle: 'Female'
    }
  ]);

  const [userStatus, setUserStatus] = useState([
    {
      Status: 1,
      StatusTitle: 'Active'
    },
    {
      Status: 0,
      StatusTitle: 'Deactive'
    }
  ]);

  const [formData, setFormData] = useState({
    SalutationId: '',
    UserName: '',
    EmployementId: '',
    DesignationId: '',
    EmployeementDivisionId: '',
    OrganizationId: '',
    AssociatedOfficerId: '',
    ServiceDate: '',
    Mobile: '',
    Status: 1,
    Gender: '',
    ImgPath: male_i,
    CreatedBy: Role,
    PriorityOrderId: '',
    DisplayOrderId: '',
    Group_id: '',
    Team_id: '',
    TeamName: '',
    Dept_id: '',
    Ministry_id: '',
    Assigneddept: '',
    Email: '',
    Password: ''
  });

  const userList = useSelector((state) => state.users.data);
  const designationDataList = useSelector((state) => state.settings.designationData);
  const divisionDataList = useSelector((state) => state.settings.divisionData);
  const employeementDataList = useSelector((state) => state.settings.employeementData);
  const organizationDataList = useSelector((state) => state.settings.organizationData);
  const salutationDataList = useSelector((state) => state.settings.salutationData);
  const roleDataList = useSelector((state) => state.settings.roleData);

  const ActionCellRenderer = (props) => {
    const { data } = props;
    const handleEdit = () => {
      setselectedUser(data);
      setShowregister(true);
    };

    const handleDelete = () => {
      handleToggleStatus(data);
    };

    return (
      <div className="action-column">
        <Button variant="" size="sm" onClick={handleEdit} title="Edit User">
          <img src={edit} width={20} alt="" />
        </Button>
        <Button
          variant={data.Status === '1' || data.Status === 1 ? 'outline-success' : 'outline-danger'}
          onClick={handleDelete}
          className="c-btn-sm"
        >
          {data.Status === '1' || data.Status === 1 ? 'Active' : 'Inactive'}
        </Button>
      </div>
    );
  };
  const StatusCellRenderer = (props) => {
    const { data } = props;
    return (
      <div>
        {data.StatusTitle === 'In Service' ? (
          <label
            className="status-label theme-bg text-white f-12 pointer"
            onClick={() => {
              handleToggleStatus(data); // Set selected user
            }}
          >
            In service
          </label>
        ) : (
          <label
            className="status-label theme-bg2 text-white f-12 pointer"
            onClick={() => {
              handleToggleStatus(data); // Set selected user
            }}
          >
            Not in Service
          </label>
        )}
      </div>
    );
  };
  const UserNameCellRenderer = (props) => {
    const { data } = props;
    return (
      <div className="d-flex">
        <img
          className="rounded-circle"
          style={{ width: '40px', height: '40px', marginRight: '8px' }}
          src={data.ImgPath || data.Gender === 'Male' ? male_i : female_i}
          alt="activity-user"
        />
        {data.UserName}
      </div>
    );
  };
  const UserRoleCellRenderer = (props) => {
    const { data } = props;
    const userData = roleDataList?.Result?.filter((item) => String(item.RoleId) === String(data.Role));
    return <div className="d-flex">{capitalizeWords(userData?.[0]?.Title)}</div>;
  };

  const [columnDefs] = useState([
    { field: 'UserName', sortable: true, filter: true, flex: 1, cellRenderer: UserNameCellRenderer },
    { field: 'DesignationTitle', sortable: true, filter: true, flex: 1 },
    { field: 'EmployeeDivisionTitle', sortable: true, filter: true, flex: 1 },
    { field: 'EmployementTitle', sortable: true, filter: true, flex: 1 },
    { field: 'AssociatedOfficer', sortable: true, filter: true, flex: 1 },
    { field: 'OrganisationTitle', sortable: true, filter: true, flex: 1 },
    { field: 'Mobile', sortable: true, filter: true, flex: 1 },
    { field: 'Role', sortable: true, filter: true, flex: 1, cellRenderer: UserRoleCellRenderer },
    {
      field: 'StatusTitle',
      headerName: 'Status',
      flex: 1,
      cellRenderer: StatusCellRenderer
    },
    {
      headerName: 'Actions',
      field: 'actions',
      flex: 1,
      cellRenderer: ActionCellRenderer
    }
  ]);

  const triggerReset = () => {
    setResetTrigger((prev) => prev + 1);
  };
  const getUserList = () => {
    // Call the GET API to fetch users
    dispatch(userActions.getuserInfo());
  };

  useEffect(() => {
    getUserList();
    dispatch(settingsActions.getDesignationInfo());
    dispatch(settingsActions.getDivisionInfo());
    dispatch(settingsActions.getEmployeementInfo());
    dispatch(settingsActions.getOrganizationInfo());
    dispatch(settingsActions.getSalutationInfo());
    dispatch(settingsActions.getPriorityInfo());
    dispatch(settingsActions.getRoleInfo());
  }, []);

  // Filter rows based on search input
  useEffect(() => {
    const updatedData = userList?.Result?.map((item) => {
      const officer = userList?.Result.find((user) => user.UserId === item.AssociatedOfficerId);
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

    const filteredData = updatedData?.filter((row) => {
      const searchLower = search.toLowerCase();

      // List of keys to search in
      const searchableKeys = [
        'UserName',
        'OrganisationTitle',
        'EmployeeDivisionTitle',
        'EmployementTitle',
        'DesignationTitle',
        'AssociatedOfficer'
      ];

      // Check if any of the selected fields contain the search term
      return searchableKeys.some((key) => row[key] && row[key].toLowerCase().includes(searchLower));
    });
    return search ? setData(filteredData) : setData(updatedData);
  }, [search]);

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
      setData(updatedData);
    } else {
      setData([]); // optional fallback
    }
    if (designationDataList?.Result) {
      setDesignationListOptions(
        designationDataList?.Result?.filter((item) => item.Status === '1').map((item) => ({
          label: item.DesignationTitle,
          value: item.DesignationId
        }))
      );
    }
  }, [userList, designationDataList]);

  useEffect(() => {
    if (designationFilter && designationFilter.length > 0) {
      let designationPayload = '';
      for (let index = 0; index < designationFilter.length; index++) {
        const element = designationFilter[index];
        designationPayload += `${element.value},`;
      }
      setFormData({ ...formData, DesignationId: designationPayload.slice(0, -1) });
    } else {
      setFormData({ ...formData, DesignationId: '' });
    }
  }, [designationFilter]);

  const handleClose = () => {
    setShowregister(false);
    setFormData({
      SalutationId: '',
      UserName: '',
      EmployementId: '',
      DesignationId: '',
      EmployeementDivisionId: '',
      OrganizationId: '',
      AssociatedOfficerId: '',
      ServiceDate: '',
      Mobile: '',
      Status: 1,
      Role: 3,
      Gender: '',
      ImgPath: male_i,
      CreatedBy: user.UserName,
      PriorityOrderId: '',
      DisplayOrderId: '',
      Group_id: '',
      Team_id: '',
      TeamName: '',
      Dept_id: '',
      Ministry_id: '',
      Assigneddept: '',
      Email: '',
      Password: ''
    });
    setErrors({});
  };

  const handleShowRegister = () => {
    setselectedUser(null); // Reset selected user
    setFormData({
      SalutationId: '',
      UserName: '',
      EmployementId: '',
      DesignationId: '',
      EmployeementDivisionId: '',
      OrganizationId: '',
      AssociatedOfficerId: '',
      ServiceDate: '',
      Mobile: '',
      Status: 1,
      Role: '3',
      Gender: '',
      ImgPath: male_i,
      CreatedBy: user.UserName,
      PriorityOrderId: '',
      DisplayOrderId: '',
      Group_id: '',
      Team_id: '',
      TeamName: '',
      Dept_id: '',
      Ministry_id: '',
      Assigneddept: '',
      Email: '',
      Password: ''
    });
    setShowregister(true);
  };

  const validate = () => {
    let newErrors = {};

    const cleanedFormData = {};
    for (const key in formData) {
      const value = formData[key];
      cleanedFormData[key] = typeof value === 'string' ? value.trim() : value;
    }

    if (!cleanedFormData.SalutationId) newErrors.SalutationId = 'Salutation is required';
    if (!cleanedFormData.UserName) newErrors.UserName = 'User name is required';
    if (!cleanedFormData.DesignationId) newErrors.DesignationId = 'Designation is required';
    if (!cleanedFormData.EmployementId) newErrors.EmployementId = 'Employment type is required';
    if (!cleanedFormData.EmployeementDivisionId) newErrors.EmployeementDivisionId = 'Division is required';
    if (!cleanedFormData.OrganizationId) newErrors.OrganizationId = 'Organization is required';
    if (!cleanedFormData.Gender) newErrors.Gender = 'Gender is required';
    if (!cleanedFormData.Mobile) newErrors.Mobile = 'Mobile number is required';
    if (!cleanedFormData.Status) newErrors.Status = 'Status is required';
    if (!cleanedFormData.Role) newErrors.Role = 'User Role is required';
    if (!cleanedFormData.Email) {
      newErrors.Email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanedFormData.Email)) {
        newErrors.Email = 'Invalid email format';
      }
    }

    Object.assign(formData, cleanedFormData);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'Mobile' || name === 'DisplayOrderId') {
      if (/^\d{0,10}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setFormData({ ...formData, ImgPath: reader.result });
    if (file) reader.readAsDataURL(file);
  };

  const handleServiceDate = (date) => {
    setcurrentDate(date);
    if (date instanceof Date && !isNaN(date)) {
      setFormData({ ...formData, ServiceDate: date || '' });
    } else {
      setFormData({ ...formData, ServiceDate: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const customPassword = formData.UserName.split(' ')[0] + '@123';

    const updatedData = {
      UserName: formData.UserName,
      DesignationId: formData.DesignationId,
      EmployementId: formData.EmployementId,
      EmployeementDivisionId: formData.EmployeementDivisionId,
      OrganizationId: formData.OrganizationId,
      AssociatedOfficerId: formData.AssociatedOfficerId,
      serviceDate: formData.ServiceDate || '',
      Mobile: formData.Mobile,
      Gender: formData.Gender,
      Status: formData.Status || 1,
      Role: formData.Role || '3',
      ImgPath: formData.ImgPath || '',
      SalutationId: formData.SalutationId || '0',
      PriorityOrderId: formData.PriorityOrderId || '',
      DisplayOrderId: formData.DisplayOrderId || '999',
      Group_id: formData.EmployeementDivisionId,
      Password: customPassword,
      Team_id: '',
      TeamName: '',
      Dept_id: '',
      Ministry_id: '',
      Assigneddept: '',
      Email: formData.Email
    };

    if (selectedUser) {
      // Update User Payload
      updatedData.UserId = selectedUser.UserId;
      updatedData.ModifyBy = user.UserName;
      dispatch(userActions.updateuserInfo(updatedData));
    } else {
      // Save New User Payload
      updatedData.CreatedBy = user.UserName;
      updatedData.Password = formData.Password;
      dispatch(userActions.adduserInfo(updatedData));
    }

    setTimeout(() => {
      getUserList();
      handleClose();
      setShowregister(false);
    }, 300);
  };

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        SalutationId: selectedUser.SalutationId,
        UserName: selectedUser.UserName,
        EmployementId: selectedUser.EmployementId,
        DesignationId: selectedUser.DesignationId,
        EmployeementDivisionId: selectedUser.EmployeementDivisionId,
        OrganizationId: selectedUser.OrganisationId,
        AssociatedOfficerId: selectedUser.AssociatedOfficerId,
        ServiceDate: selectedUser.ServiceDate || '',
        Mobile: selectedUser.Mobile,
        Status: selectedUser.Status || 1,
        Role: selectedUser.Role,
        Gender: selectedUser.Gender,
        ImgPath: selectedUser.ImgPath || '',
        CreatedBy: user.UserName,
        PriorityOrderId: selectedUser.PriorityOrderId,
        DisplayOrderId: selectedUser.DisplayOrderId,
        Group_id: selectedUser.EmployeementDivisionId,
        Team_id: '',
        TeamName: '',
        Dept_id: '',
        Ministry_id: '',
        Assigneddept: '',
        Email: selectedUser.Email
      });
      if (selectedUser?.ServiceDate) {
        if (selectedUser.ServiceDate === '01-01-1900 00:00:00') {
          setcurrentDate(null);
        } else {
          const parsedDate = moment(selectedUser?.ServiceDate, 'DD-MM-YYYY HH:mm:ss').toDate();
          setcurrentDate(parsedDate);
        }
      }
    }
  }, [selectedUser]);

  const handleToggleStatus = (user) => {
    const updatedData = {
      SalutationId: user.SalutationId,
      UserName: user.UserName,
      DesignationId: user.DesignationId,
      EmployementId: user.EmployementId,
      EmployeementDivisionId: user.EmployeementDivisionId,
      OrganizationId: user.OrganisationId,
      AssociatedOfficerId: user.AssociatedOfficerId,
      serviceDate: user.ServiceDate || '',
      Mobile: user.Mobile,
      Gender: user.Gender,
      Status: user.Status === '1' ? 0 : 1,
      Role: user.Role,
      ImgPath: user.ImgPath,
      UserId: user.UserId,
      ModifyBy: user.UserName,
      PriorityOrderId: user.PriorityOrderId || '',
      DisplayOrderId: user.DisplayOrderId || '',
      Group_id: user.EmployeementDivisionId,
      Team_id: '',
      TeamName: '',
      Dept_id: '',
      Ministry_id: '',
      Assigneddept: '',
      Email: user.Email
    };

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
        api.post('/Update_User', updatedData).then(() => {
          getUserList();
        });
      }
    });
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const getDesignation = (val) => {
    const data = Array.isArray(designationDataList?.Result) ? designationDataList.Result : Object.values(designationDataList?.Result || {});
    const found = data.find((item) => item.DesignationId === val);
    return found ? found.DesignationTitle : '';
  };

  const handleDesignationFilter = (newSelected) => {
    if (newSelected.length) {
      setDesignationFilter(newSelected);
    } else {
      setDesignationFilter([]);
    }
  };

  const onExport = () => {
    if (!gridRef.current?.api) return;

    const visibleColumns = gridRef.current.api.getAllDisplayedColumns();
    const visibleColKeys = visibleColumns.map((col) => col.getColId());

    const rowData = [];
    gridRef.current.api.forEachNodeAfterFilterAndSort((node) => {
      const filteredRow = {};
      visibleColKeys.forEach((key) => {
        filteredRow[key] = node.data[key];
      });
      rowData.push(filteredRow);
    });

    exportJsonToExcel(rowData, 'User_List.xlsx');
  };

  return (
    <React.Fragment>
      <Card className="Recent-Users widget-focus-lg w-full default-shadow header-default ">
        <Card.Header className="d-flex justify-content-between align-items-center py-2">
          <Card.Title as="h5">List of Resource</Card.Title>
          <CardSubtitle className="user-table-right">
            <input
              type="text"
              placeholder="Search.."
              value={search}
              onChange={handleSearchChange}
              className="form-control mr-2 userSearch"
            />
            <Button onClick={() => handleShowRegister()} className="m-0 fw-bolder">
              <i className="feather icon-plus"> Add </i>
            </Button>
            <img src={excel_i} alt="" className="img-fluid ml-1 pointer" width={30} onClick={() => onExport()} title="Export PDF" />
            <img src={refresh} alt="" className="img-fluid ml-1 pointer" title="Reset Table" width={30} onClick={() => triggerReset()} />
          </CardSubtitle>
        </Card.Header>
        <Card.Body className="p-3 pt-2 dark-table">
          <AdvanceTable
            reference={gridRef}
            rowData={data}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={15}
            paginationPageSizeSelector={[10, 15, 20, 25, 50, 100]}
            cellRenderer={ActionCellRenderer}
            resetTrigger={resetTrigger}
            tablethemes="primary"
          />
        </Card.Body>
      </Card>

      <Modal size="xl" show={showregister} onHide={handleClose} animation={true} backdrop="static" keyboard={false}>
        <Modal.Header className={mode}>
          <Modal.Title>
            <h5>
              {selectedUser ? (
                <>
                  <FaUserEdit className="f-26 text-primary" /> Update User Details
                </>
              ) : (
                <>
                  <FaUserCircle className="f-26 text-primary" /> Add User
                </>
              )}
            </h5>
          </Modal.Title>
          <span className="pointer" onClick={handleClose}>
            {' '}
            X{' '}
          </span>
        </Modal.Header>
        <Modal.Body className={mode}>
          <Form noValidate onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Label>Employee Name</Form.Label>
                <Row className="align-items-center mb-3">
                  <Col xs="auto">
                    <Form.Select
                      value={formData.SalutationId}
                      name="SalutationId"
                      onChange={handleChange}
                      isInvalid={!!errors.SalutationId}
                    >
                      <option value="">Select</option>
                      {Array.isArray(salutationDataList?.Result)
                        ? salutationDataList.Result.filter((item) => item.Status === '1').map((item) => (
                            <option key={item.SalutationId} value={item.SalutationId}>
                              {item.SalutationTitle}
                            </option>
                          ))
                        : Object.values(salutationDataList?.Result || {})
                            .filter((item) => item.Status === '1')
                            .map((item) => (
                              <option key={item.SalutationId} value={item.SalutationId}>
                                {item.SalutationTitle}
                              </option>
                            ))}
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      name="UserName"
                      placeholder="Enter name..."
                      value={formData.UserName}
                      onChange={handleChange}
                      isInvalid={!!errors.UserName}
                    />
                  </Col>
                </Row>
                <Form.Control.Feedback type="invalid">{errors.UserName}</Form.Control.Feedback>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Designation</Form.Label>
                  <MultiSelect
                    options={designationListOption}
                    value={designationListOption.filter((option) => formData.DesignationId.split(',').includes(option.value))}
                    className={`custom-form-select ${errors.DesignationId ? 'isInvalid' : ''}`}
                    onChange={handleDesignationFilter}
                    overrideStrings={{ selectSomeItems: 'Select Designation' }}
                    valueRenderer={(selected) => (selected.length > 0 ? selected.map((s) => s.label).join(', ') : '')}
                  />
                  {errors.DesignationId && <div className="invalid-feedback d-block">{errors.DesignationId}</div>}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Employment Type</Form.Label>
                  <Form.Select
                    name="EmployementId"
                    value={formData.EmployementId}
                    className="custom-form-select"
                    onChange={handleChange}
                    isInvalid={!!errors.EmployementId}
                  >
                    <option value="">Select type...</option>
                    {Array.isArray(employeementDataList?.Result)
                      ? employeementDataList.Result.filter((item) => item.Status === '1').map((item) => (
                          <option key={item.EmployeementId} value={item.EmployeementId}>
                            {item.EmployeementTitle}
                          </option>
                        ))
                      : Object.values(employeementDataList?.Result || {})
                          .filter((item) => item.Status === '1')
                          .map((item) => (
                            <option key={item.EmployeementId} value={item.EmployeementId}>
                              {item.EmployeementTitle}
                            </option>
                          ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.EmployementId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Employee Division</Form.Label>
                  <Form.Select
                    name="EmployeementDivisionId"
                    value={formData.EmployeementDivisionId}
                    className="custom-form-select"
                    onChange={handleChange}
                    isInvalid={!!errors.EmployeementDivisionId}
                  >
                    <option value="">Select division...</option>
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
                  <Form.Control.Feedback type="invalid">{errors.EmployeementDivisionId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Organization</Form.Label>
                  <Form.Select
                    name="OrganizationId"
                    value={formData.OrganizationId}
                    className="custom-form-select"
                    onChange={handleChange}
                    isInvalid={!!errors.OrganizationId}
                  >
                    <option value="">Select division...</option>
                    {Array.isArray(organizationDataList?.Result)
                      ? organizationDataList.Result.filter((item) => item.Status === '1').map((item) => (
                          <option key={item.OrganisationId} value={item.OrganisationId}>
                            {item.OrganisationTitle}
                          </option>
                        ))
                      : Object.values(organizationDataList?.Result || {})
                          .filter((item) => item.Status === '1')
                          .map((item) => (
                            <option key={item.OrganisationId} value={item.OrganisationId}>
                              {item.OrganisationTitle}
                            </option>
                          ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.OrganizationId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Associated Officer</Form.Label>
                  <Form.Select
                    name="AssociatedOfficerId"
                    value={formData.AssociatedOfficerId}
                    className="custom-form-select"
                    onChange={handleChange}
                  >
                    <option value="">Select officer...</option>
                    {Array.isArray(userList?.Result)
                      ? userList.Result.filter((item) => item.Status === '1' && item.EmployementId === '1').map((item) => (
                          <option key={item.UserId} value={item.UserId}>
                            {item.UserName}
                          </option>
                        ))
                      : Object.values(organizationDataList?.Result || {})
                          .filter((item) => item.Status === '1')
                          .map((item) => (
                            <option key={item.UserId} value={item.UserId}>
                              {item.UserName}
                            </option>
                          ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.AssociatedOfficerId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="Email"
                    placeholder="Enter e-mail id..."
                    value={formData.Email}
                    onChange={handleChange}
                    isInvalid={!!errors.Email}
                  />
                  <Form.Control.Feedback type="invalid">{errors.Email}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="text"
                    name="Password"
                    placeholder="Enter password..."
                    value={formData.Password}
                    onChange={handleChange}
                    isInvalid={!!errors.Password}
                  />
                  <Form.Control.Feedback type="invalid">{errors.Password}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    type="text"
                    name="Mobile"
                    placeholder="Enter 10-digit mobile number..."
                    value={formData.Mobile}
                    onChange={handleChange}
                    isInvalid={!!errors.Mobile}
                    maxLength={10}
                  />
                  <Form.Control.Feedback type="invalid">{errors.Mobile}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Role</Form.Label>
                  <Form.Select name="Role" value={formData.Role} className="custom-form-select" onChange={handleChange}>
                    <option value="">Select role...</option>
                    {Array.isArray(roleDataList?.Result)
                      ? roleDataList.Result.map((item) => (
                          <option key={item.RoleId} value={item.RoleId}>
                            {capitalizeWords(item.Title)}
                          </option>
                        ))
                      : Object.values(roleDataList?.Result || {}).map((item) => (
                          <option key={item.RoleId} value={item.RoleId}>
                            {capitalizeWords(item.Title)}
                          </option>
                        ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.Role}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Service Date</Form.Label>
                  <DatePicker
                    selected={currentDate}
                    className="form-control"
                    onChange={handleServiceDate}
                    placeholderText="Start Date"
                    dateFormat="dd-MM-yyyy"
                    name="ServiceDate"
                    maxDate={new Date()} // Disable future dates
                  />
                  <Form.Control.Feedback type="invalid">{errors.ServiceDate}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Display Order</Form.Label>
                  <Form.Control
                    type="text"
                    name="DisplayOrderId"
                    placeholder="Enter display order (1 to 99) "
                    value={formData.DisplayOrderId}
                    onChange={handleChange}
                    isInvalid={!!errors.DisplayOrderId}
                    maxLength={3}
                  />
                  <Form.Control.Feedback type="invalid">{errors.DisplayOrderId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="Gender"
                    value={formData.Gender}
                    className="custom-form-select"
                    onChange={handleChange}
                    isInvalid={!!errors.Gender}
                  >
                    <option value="">Select Gender...</option>
                    {genderDataList?.map((item) => (
                      <option value={item.GenderTitle}>{item.GenderTitle}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.Gender}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="Status"
                    value={formData.Status}
                    className="custom-form-select"
                    onChange={handleChange}
                    isInvalid={!!errors.Status}
                  >
                    <option value="">Select Status...</option>
                    {userStatus?.map((item) => (
                      <option value={item.Status}>{item.StatusTitle}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.Status}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                </Form.Group>
              </Col>
              <Col>
                {formData.ImgPath && (
                  <img src={formData.ImgPath} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                )}
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
    </React.Fragment>
  );
};

export default UserList;
