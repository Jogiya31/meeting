import React, { useEffect, useMemo, useState } from 'react';
import { Row, Col, Card, Table, Image, Modal, Button, CardSubtitle, Form, Pagination, InputGroup } from 'react-bootstrap';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import api from '../../api';
import edit from '../../assets/images/edit.png';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/user/userSlice';
import { settingsActions } from '../../store/settings/settingSlice';
import { FaSort } from 'react-icons/fa';

const UserList = () => {
  const dispatch = useDispatch();
  const [selectedUser, setselectedUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [showregister, setShowregister] = useState(false);
  const [data, setData] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
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
    UserName: '',
    EmployementId: '',
    DesignationId: '',
    EmployeementDivisionId: '',
    OrganizationId: '',
    Mobile: '',
    Status: '0',
    Gender: '',
    ImgPath: avatar2,
    CreatedBy: 'Admin'
  });

  const userList = useSelector((state) => state.users.data);
  const designationDataList = useSelector((state) => state.settings.designationData);
  const divisionDataList = useSelector((state) => state.settings.divisionData);
  const employeementDataList = useSelector((state) => state.settings.employeementData);
  const organizationDataList = useSelector((state) => state.settings.organizationData);

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
  }, []);

  useEffect(() => {
    if (userList) {
      setData(userList?.Result || []);
    }
  }, [userList]);

  const handleClose = () => {
    setShowregister(false);
  };

  const handleShowRegister = () => {
    setselectedUser(null); // Reset selected user
    setFormData({
      UserName: '',
      EmployementId: '',
      DesignationId: '',
      EmployeementDivisionId: '',
      OrganizationId: '',
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

    if (!formData.UserName) newErrors.UserName = 'User name is required';
    if (!formData.DesignationId) newErrors.DesignationId = 'Designation is required';
    if (!formData.EmployementId) newErrors.EmployementId = 'Employment type is required';
    if (!formData.EmployeementDivisionId) newErrors.EmployeementDivisionId = 'Division is required';
    if (!formData.OrganizationId) newErrors.OrganizationId = 'Organization is required';
    if (!formData.Gender) newErrors.Gender = 'Gender is required';

    // Mobile Number Validation
    if (!formData.Mobile) {
      newErrors.Mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.Mobile)) {
      newErrors.Mobile = 'Mobile number must be exactly 10 digits';
    }

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const updatedData = {
      UserName: formData.UserName,
      DesignationId: formData.DesignationId,
      EmployementId: formData.EmployementId,
      EmployeementDivisionId: formData.EmployeementDivisionId,
      OrganizationId: formData.OrganizationId,
      Mobile: formData.Mobile,
      Gender: formData.Gender,
      Status: formData.Status,
      ImgPath: formData.ImgPath || ''
    };

    if (selectedUser) {
      // Update User Payload
      updatedData.UserId = selectedUser.UserId;
      updatedData.ModifyBy = 'SuperAdmin';
    } else {
      // Save New User Payload
      updatedData.CreatedBy = 'Admin';
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
        UserName: selectedUser.UserName,
        EmployementId: selectedUser.EmployementId,
        DesignationId: selectedUser.DesignationId,
        EmployeementDivisionId: selectedUser.EmployeementDivisionId,
        OrganizationId: selectedUser.OrganisationId,
        Mobile: selectedUser.Mobile,
        Status: selectedUser.Status,
        Gender: selectedUser.Gender,
        ImgPath: selectedUser.ImgPath || '',
        CreatedBy: 'Admin'
      });
    } else {
    }
  }, [selectedUser]);

  const parentHeaders = [
    { id: 'UserName', label: 'User Name' },
    { id: 'DesignationTitle', label: 'Designation' },
    { id: 'EmployeeDivisionTitle', label: 'Division' },
    { id: 'EmployementTitle', label: 'Type' },
    { id: 'OrganisationTitle', label: 'Company Name' },
    { id: 'Status', label: 'Status' }
  ];

  // Filter rows based on search input
  const filteredRows = useMemo(() => {
    return data
      ?.filter((row) => {
        const searchLower = search.toLowerCase();
  
        // List of keys to search in
        const searchableKeys = [
          "UserName",
          "OrganisationTitle",
          "EmployeeDivisionTitle",
          "EmployementTitle",
          "DesignationTitle"
        ];
  
        // Check if any of the selected fields contain the search term
        return searchableKeys.some((key) => 
          row[key] && row[key].toLowerCase().includes(searchLower)
        );
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

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card className="Recent-Users widget-focus-lg header-info">
            <Card.Header className="d-flex justify-content-between align-items-center py-2">
              <Card.Title as="h5">List of Resourses</Card.Title>
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
                          <img className="rounded-circle" style={{ width: '40px' }} src={item.ImgPath || avatar2} alt="activity-user" />
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
                          <h6 className="mb-1">{item.OrganisationTitle}</h6>
                        </td>{' '}
                        <td>
                          {item.Status === '1' ? (
                            <label className="label theme-bg text-white f-12">In service</label>
                          ) : (
                            <label className="label theme-bg2 text-white f-12">Not in Service</label>
                          )}
                        </td>
                        <td>
                          <span
                            className="action-section cursor"
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
                <InputGroup className="pagination-select">
                  <Form.Control as="select" value={rowsPerPage} onChange={handleChangeRowsPerPage}>
                    {[5, 10, 25, 50].map((rowsPerPageOption) => (
                      <option key={rowsPerPageOption} value={rowsPerPageOption}>
                        {rowsPerPageOption}
                      </option>
                    ))}
                  </Form.Control>
                </InputGroup>
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
      <Modal show={showregister} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h5>{selectedUser ? 'Update User Details' : 'Add User'}</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate onSubmit={handleSubmit}>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Employee Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name..."
                    name="UserName"
                    value={formData.UserName}
                    onChange={handleChange}
                    isInvalid={!!errors.UserName}
                  />
                  <Form.Control.Feedback type="invalid">{errors.UserName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Designation</Form.Label>
                  <Form.Select
                    name="DesignationId"
                    value={formData.DesignationId}
                    className="custom-form-select"
                    onChange={handleChange}
                    isInvalid={!!errors.DesignationId}
                  >
                    <option value="" disabled>
                      Select designation...
                    </option>
                    {designationDataList?.Result?.filter((item) => item.Status === '1').map((item) => (
                      <option value={item.DesignationId}>{item.DesignationTitle}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.DesignationId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Employment Type</Form.Label>
                  <Form.Select
                    name="EmployementId"
                    value={formData.EmployementId}
                    className="custom-form-select"
                    onChange={handleChange}
                    isInvalid={!!errors.EmployementId}
                  >
                    <option value="" disabled>
                      Select type...
                    </option>
                    {employeementDataList?.Result?.filter((item) => item.Status === '1').map((item) => (
                      <option value={item.EmployeementId}>{item.EmployeementTitle}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.EmployementId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Employee Division</Form.Label>
                  <Form.Select
                    name="EmployeementDivisionId"
                    value={formData.EmployeementDivisionId}
                    className="custom-form-select"
                    onChange={handleChange}
                    isInvalid={!!errors.EmployeementDivisionId}
                  >
                    <option value="" disabled>
                      Select division...
                    </option>
                    {divisionDataList?.Result?.filter((item) => item.Status === '1').map((item) => (
                      <option value={item.DivisionId}>{item.DivisionTitle}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.EmployeementDivisionId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Organization</Form.Label>
                  <Form.Select name="OrganizationId" value={formData.OrganizationId} className="custom-form-select" onChange={handleChange}>
                    <option value="" disabled>
                      Select division...
                    </option>
                    {organizationDataList?.Result?.filter((item) => item.Status === '1').map((item) => (
                      <option value={item.OrganisationId}>{item.OrganisationTitle}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.OrganisationId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
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
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select name="Gender" value={formData.Gender} className="custom-form-select" onChange={handleChange}>
                    <option value="" disabled>
                      Select Gender...
                    </option>
                    {genderDataList?.map((item) => (
                      <option value={item.GenderTitle}>{item.GenderTitle}</option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.GenderTitle}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
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
