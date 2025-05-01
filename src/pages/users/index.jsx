import React, { useEffect, useMemo, useState } from 'react';
import { Row, Col, Card, Table, Image, Modal, Button, CardSubtitle, Form, Pagination, InputGroup } from 'react-bootstrap';
import female_i from '../../assets/images/user/female.jpg';
import male_i from '../../assets/images/user/male.jpg';
import api from '../../api';
import edit from '../../assets/images/edit.png';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/user/userSlice';
import { settingsActions } from '../../store/settings/settingSlice';
import { FaSort, FaUserCircle, FaUserEdit } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Swal from 'sweetalert2';
import { MultiSelect } from 'react-multi-select-component';
import { useTheme } from '../../contexts/themeContext';

const UserList = () => {
  const dispatch = useDispatch();
  const { mode } = useTheme();
  const Role = localStorage.getItem('role');
  const [selectedUser, setselectedUser] = useState(null);
  const [currentDate, setcurrentDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [showregister, setShowregister] = useState(false);
  const [designationListOption, setDesignationListOptions] = useState([]); // User options state
  const [designationFilter, setDesignationFilter] = useState([]); // user filter state
  const [data, setData] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');

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
    SalutationId: 0,
    ImgPath: male_i,
    CreatedBy: Role
  });

  const userList = useSelector((state) => state.users.data);
  const designationDataList = useSelector((state) => state.settings.designationData);
  const divisionDataList = useSelector((state) => state.settings.divisionData);
  const employeementDataList = useSelector((state) => state.settings.employeementData);
  const organizationDataList = useSelector((state) => state.settings.organizationData);
  const salutationDataList = useSelector((state) => state.settings.salutationData);

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
  }, []);

  const customEmployementOrder = ['NIC Officer', 'Out-Sourced'];

  const designationPriority = ['HOG', 'HOD', 'Scientist-G', 'Scientist-F', 'Scientist-E', 'Scientist-D', 'Scientist-C'];

  // Get the priority index of a DesignationTitle
  const getDesignationPriorityIndex = (title) => {
    for (let i = 0; i < designationPriority.length; i++) {
      if (title.includes(designationPriority[i])) {
        return i; // lower index = higher priority
      }
    }
    return designationPriority.length; // for "others"
  };

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

      const sorted = [...updatedData].sort((a, b) => {
        const empCompare = customEmployementOrder.indexOf(a.EmployementTitle) - customEmployementOrder.indexOf(b.EmployementTitle);
        if (empCompare !== 0) return empCompare;

        const desigCompare = getDesignationPriorityIndex(a.DesignationTitle) - getDesignationPriorityIndex(b.DesignationTitle);
        if (desigCompare !== 0) return desigCompare;

        // ✅ Fallback to alphabetical sort by UserName
        const nameA = a.UserName.trim().toLowerCase();
        const nameB = b.UserName.trim().toLowerCase();

        return nameA.localeCompare(nameB);
      });

      setData(sorted);
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
      Status: '',
      Gender: '',
      ImgPath: '',
      CreatedBy: ''
    });
    setShowregister(true);
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.SalutationId) newErrors.SalutationId = 'SalutationId is required';
    if (!formData.UserName) newErrors.UserName = 'User name is required';
    if (!formData.DesignationId) newErrors.DesignationId = 'Designation is required';
    if (!formData.EmployementId) newErrors.EmployementId = 'Employment type is required';
    if (!formData.EmployeementDivisionId) newErrors.EmployeementDivisionId = 'Division is required';
    if (!formData.OrganizationId) newErrors.OrganizationId = 'Organization is required';
    if (!formData.Gender) newErrors.Gender = 'Gender is required';
    if (!formData.Mobile) newErrors.Mobile = 'Mobile number is required';
    if (!formData.Status) newErrors.Status = 'Status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'Mobile') {
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

    const updatedData = {
      SalutationId: formData.SalutationId,
      UserName: formData.UserName,
      DesignationId: formData.DesignationId,
      EmployementId: formData.EmployementId,
      EmployeementDivisionId: formData.EmployeementDivisionId,
      OrganizationId: formData.OrganizationId,
      AssociatedOfficerId: formData.AssociatedOfficerId,
      serviceDate: formData.ServiceDate || '',
      Mobile: formData.Mobile,
      Gender: formData.Gender,
      Status: formData.Status,
      ImgPath: formData.ImgPath || '',
      SalutationId: formData.SalutationId || '0'
    };

    if (selectedUser) {
      // Update User Payload
      updatedData.UserId = selectedUser.UserId;
      updatedData.ModifyBy = Role;
    } else {
      // Save New User Payload
      updatedData.CreatedBy = Role;
    }

    const endpoint = selectedUser ? '/Update_User' : '/Save_User';

    api
      .post(endpoint, updatedData)
      .then(() => {
        getUserList();
        handleClose();
        setShowregister(false);
      })
      .catch((err) => console.error('Error saving user:', err));
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
        Status: selectedUser.Status,
        Gender: selectedUser.Gender,
        ImgPath: selectedUser.ImgPath || '',
        CreatedBy: Role
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

  const parentHeaders = [
    { id: 'UserName', label: 'User Name' },
    { id: 'DesignationTitle', label: 'Designation' },
    { id: 'EmployeeDivisionTitle', label: 'Division' },
    { id: 'EmployementTitle', label: 'Type' },
    { id: 'AssociatedOfficer', label: 'Associated Officer' },
    { id: 'OrganisationTitle', label: 'Company Name' },
    { id: 'Status', label: 'Status' }
  ];

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
      ImgPath: user.ImgPath,
      UserId: user.UserId,
      ModifyBy: Role
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

  // Filter rows based on search input
  const filteredRows = useMemo(() => {
    return data?.filter((row) => {
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
  }, [search, data]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      if (orderBy === '') return 0;
      return order === 'asc' ? (a[orderBy] < b[orderBy] ? -1 : 1) : a[orderBy] > b[orderBy] ? -1 : 1;
    });
  }, [filteredRows, order, orderBy]);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  const visibleRows = useMemo(
    () => sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedRows, page, rowsPerPage]
  );

  const renderPaginationItems = () => {
    const pagesToShow = 3;
    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

    if (totalPages <= 1) 1; // Hide pagination if only one page

    const startPage = Math.max(0, Math.min(page - Math.floor(pagesToShow / 2), totalPages - pagesToShow));
    const endPage = Math.min(startPage + pagesToShow, totalPages);

    return Array.from({ length: endPage - startPage }, (_, i) => startPage + i).map((pageIndex) => (
      <Pagination.Item key={pageIndex} active={pageIndex === page} onClick={() => handleChangePage(pageIndex)}>
        {pageIndex + 1}
      </Pagination.Item>
    ));
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0); // Reset page when search is modified
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card className="Recent-Users widget-focus-lg header-info">
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
              </CardSubtitle>
            </Card.Header>
            <Card.Body className="p-3 pt-0 dark-table">
              <Table responsive hover className="recent-users">
                <thead className="header-bg">
                  <tr>
                    <th></th>
                    {parentHeaders.map((headCell, idx) => (
                      <th className="" key={`${headCell}_${idx} ${headCell.id === 'status' && 'w-10'}`}>
                        <Button variant="link" onClick={() => handleRequestSort(headCell.id)} className="pl-0 pr-0">
                          {headCell.label}
                          {orderBy === headCell.id ? <FaSort className={order === 'desc' ? 'rotate-180' : ''} /> : null}
                        </Button>
                      </th>
                    ))}
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRows.map((item, index) => {
                    return (
                      <tr className="unread" key={`${index}-${Math.random()}`}>
                        <td>
                          <img
                            className="rounded-circle"
                            style={{ width: '40px' }}
                            src={item.ImgPath || item.Gender === 'Male' ? male_i : female_i}
                            alt="activity-user"
                          />
                        </td>
                        <td>
                          <h6 className="mb-1">{item.UserName}</h6>
                        </td>
                        <td>
                          <h6 className="mb-1">{item.DesignationTitle}</h6>
                        </td>
                        <td>
                          <p className="m-0">{item.EmployeeDivisionTitle}</p>
                        </td>
                        <td>
                          <p className="m-0">{item.EmployementTitle}</p>
                        </td>
                        <td>
                          <p className="m-0">{item.AssociatedOfficer}</p>
                        </td>
                        <td>
                          <h6 className="mb-1">{item.OrganisationTitle}</h6>
                        </td>
                        <td>
                          {item.Status === '1' ? (
                            <label
                              className="label theme-bg text-white f-12 pointer"
                              onClick={() => {
                                handleToggleStatus(item); // Set selected user
                              }}
                            >
                              In service
                            </label>
                          ) : (
                            <label
                              className="label theme-bg2 text-white f-12 pointer"
                              onClick={() => {
                                handleToggleStatus(item); // Set selected user
                              }}
                            >
                              Not in Service
                            </label>
                          )}
                        </td>
                        <td>
                          <span
                            className="action-section pointer"
                            title="Edit user"
                            onClick={() => {
                              setselectedUser(item); // Set selected user
                              setShowregister(true); // Open modal without resetting
                            }}
                          >
                            <Image src={edit} height={20} />
                            <span className="text-black ml-1"></span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <Pagination className="custom-pagination">
                <Form.Control as="select" value={rowsPerPage} onChange={handleChangeRowsPerPage} className="limit">
                  {[5, 10, 25, 50].map((rowsPerPageOption) => (
                    <option key={rowsPerPageOption} value={rowsPerPageOption}>
                      {rowsPerPageOption}
                    </option>
                  ))}
                </Form.Control>
                <div className="flex">
                  <Pagination.Prev onClick={() => handleChangePage(page - 1)} disabled={page === 0} />
                  {renderPaginationItems()}
                  <Pagination.Next onClick={() => handleChangePage(page + 1)} disabled={page >= totalPages - 1} />
                </div>
              </Pagination>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal size="xl" show={showregister} onHide={handleClose} animation={false}>
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
            </Row>
            <Row>
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
            </Row>
            <Row>
              <Col>
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
              {/* <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="In service"
                      name="Status"
                      value="1"
                      checked={formData.Status === '1'}
                      onChange={handleChange}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Not in service"
                      name="Status"
                      value="0"
                      checked={formData.Status === '0'}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>
              </Col> */}

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
