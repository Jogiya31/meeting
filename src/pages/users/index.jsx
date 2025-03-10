import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Image, Modal, Button, CardSubtitle, Form } from 'react-bootstrap';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import api from '../../api';
import { Link } from 'react-router-dom';
import edit from '../../assets/images/edit.png';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/user/userSlice';
import { settingsActions } from '../../store/settings/settingSlice';

const UserList = () => {
  const dispatch = useDispatch();
  const [selectedUser, setselectedUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [showregister, setShowregister] = useState(false);
  const [formData, setFormData] = useState({
    UserName: '',
    EmployementId: '',
    DesignationId: '',
    EmployeementDivisionId: '',
    OrganizationId: '',
    Mobile: '',
    Status: '0',
    ImgPath: '',
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

  const handleClose = () => {
    setShow(false);
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
    if (!formData.Mobile) newErrors.mobile = 'Mobile is required';
    if (!formData.Status) newErrors.status = 'Status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        ImgPath: selectedUser.ImgPath || '',
        CreatedBy: 'Admin'
      });
    } else {
    }
  }, [selectedUser]);

  return (
    <React.Fragment>
      <Row>
        <Col>
          <Card className="Recent-Users widget-focus-lg header-info">
            <Card.Header className="d-flex justify-content-between align-items-center py-2">
              <Card.Title as="h5">Current Users</Card.Title>
              <CardSubtitle className="flex">
                <Button onClick={() => handleShowRegister()} className="m-0 mt-1 btn-sm fw-bolder">
                  <i className="feather icon-plus" />
                  Add Users
                </Button>
              </CardSubtitle>
            </Card.Header>
            <Card.Body className="px-0 py-0">
              <Table responsive hover className="recent-users">
                <thead className="header-bg">
                  <tr>
                    <th></th>
                    <th>User Name</th>
                    <th>Designation</th>
                    <th>Division</th>
                    <th>Type</th>
                    <th>Organization</th>
                    <th className="w-10">Status</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userList?.Result?.map((item, index) => {
                    return (
                      <tr className="unread" key={index}>
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
                            <label className="label theme-bg text-white f-12">Active</label>
                          ) : (
                            <label className="label theme-bg2 text-white f-12">Not Active</label>
                          )}
                        </td>
                        <td>
                          <Link
                            className="action-section"
                            onClick={() => {
                              setselectedUser(item); // Set selected user
                              setShowregister(true); // Open modal without resetting
                            }}
                          >
                            <Image src={edit} height={20} />
                            <span className="text-black ml-1">Edit</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
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
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    type="text"
                    name="Mobile"
                    placeholder="Enter mobile number..."
                    value={formData.Mobile}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      type="radio"
                      label="Active"
                      name="Status"
                      value="1"
                      checked={formData.Status === '1'}
                      onChange={handleChange}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Not Active"
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
