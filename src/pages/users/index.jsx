import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Table, Image, Modal, Button, CardSubtitle, Form } from 'react-bootstrap';
import avatar2 from '../../assets/images/user/avatar-2.jpg';
import api from '../../api';
import { Link } from 'react-router-dom';
import edit from '../../assets/images/edit.png';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/user/userSlice';

const UserList = () => {
  // Get dispatcher function for Redux actions
  const dispatch = useDispatch();
  const [selectedUser, setselectedUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);
  const [showregister, setShowregister] = useState(false);
  const [formData, setFormData] = useState({
    userName: '',
    type: '',
    designation: '',
    organization: '',
    mobile: '',
    division: '',
    status: 'Not Active',
    avatar: ''
  });

  const userList = useSelector((state) => state.users.data);

  const handleClose = () => {
    setShow(false);
    setShowregister(false);
  };

  const handleShow = () => setShow(true);

  const handleShowRegister = () => setShowregister(true);

  useEffect(() => {
    // Call the GET API to fetch users
    dispatch(userActions.getuserInfo());
  }, []);

  const validate = () => {
    let newErrors = {};
    if (!formData.userName) newErrors.userName = 'User name is required';
    if (!formData.designation) newErrors.designation = 'Designation is required';
    if (!formData.type) newErrors.type = 'Employment type is required';
    if (!formData.division) newErrors.division = 'Division is required';
    if (!formData.status) newErrors.status = 'Status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setFormData({ ...formData, avatar: reader.result });
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    api
      .post('/users', formData)
      .then(() => {
        getUserList();
        handleClose();
      })
      .catch((err) => console.error('Error adding user:', err));
  };

  console.log('selectedUser', selectedUser);

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
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userList?.data?.map((item, index) => {
                    return (
                      <tr className="unread" key={index}>
                        <td>
                          <img className="rounded-circle" style={{ width: '40px' }} src={item.avatar || avatar2} alt="activity-user" />
                        </td>
                        <td>
                          <h6 className="mb-1">{item.userName}</h6>
                        </td>
                        <td>
                          <h6 className="mb-1">{item.designationId}</h6>
                        </td>
                        <td>
                          <p className="m-0">{item.employmenttypeId}</p>
                        </td>
                        <td>
                          <p className="m-0">{item.employmenttypeId}</p>
                        </td>
                        <td>
                          <h6 className="mb-1">{item.divisionId}</h6>
                        </td>{' '}
                        <td>
                          {item.status === 'Active' ? (
                            <label to="#" className="label theme-bg text-white f-12">
                              Active
                            </label>
                          ) : (
                            <label to="#" className="label theme-bg2 text-white f-12">
                              Not Active
                            </label>
                          )}
                        </td>
                        <td>
                          <Link
                            className="action-section"
                            onClick={() => {
                              handleShow(), setselectedUser(item);
                            }}
                          >
                            <Image src={edit} height={20} />
                            <span className="text-black ml-1">Edit</span>{' '}
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
            <h5>Add User</h5>
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
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    isInvalid={!!errors.userName}
                  />
                  <Form.Control.Feedback type="invalid">{errors.userName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Designation</Form.Label>
                  <Form.Select
                    name="designation"
                    value={formData.designation}
                    className="custom-form-select"
                    onChange={handleChange}
                    isInvalid={!!errors.designation}
                  >
                    <option value="" disabled>
                      Select designation...
                    </option>
                    <option value="1">NIC Officer</option>
                    <option value="2">Consultant</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.designation}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Employment Type</Form.Label>
                  <Form.Select
                    name="type"
                    value={formData.type}
                    className="custom-form-select"
                    onChange={handleChange}
                    isInvalid={!!errors.type}
                  >
                    <option value="" disabled>
                      Select type...
                    </option>
                    <option value="1">NIC Officer</option>
                    <option value="2">Consultant</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.type}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Employee Division</Form.Label>
                  <Form.Select
                    name="division"
                    value={formData.division}
                    className="custom-form-select"
                    onChange={handleChange}
                    isInvalid={!!errors.division}
                  >
                    <option value="" disabled>
                      Select division...
                    </option>
                    <option value="1">DAID</option>
                    <option value="2">CCBS</option>
                    <option value="3">Tejas</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.division}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Organization</Form.Label>
                  <Form.Control
                    type="text"
                    name="organization"
                    placeholder="Enter organization name..."
                    value={formData.organization}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobile"
                    placeholder="Enter mobile number..."
                    value={formData.mobile}
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
                      name="status"
                      value="Active"
                      checked={formData.status === 'Active'}
                      onChange={handleChange}
                    />
                    <Form.Check
                      inline
                      type="radio"
                      label="Not Active"
                      name="status"
                      value="Not Active"
                      checked={formData.status === 'Not Active'}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                {' '}
                <Form.Group className="mb-3">
                  <Form.Label>Upload Image</Form.Label>
                  <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                </Form.Group>
              </Col>
              <Col>
                {formData.avatar && (
                  <img src={formData.avatar} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
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
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h5>Edit User Details</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="userModalBody">
            <Col md={4}>
              <div className="left">
                <Image src={avatar2} />
                <div className="userdetails">
                  <h6>{selectedUser && selectedUser.userName}</h6>
                  <p>{selectedUser && selectedUser.designationId}</p>
                </div>
              </div>
            </Col>
            <Col md={8}>
              <div className="right d-flex flex-column justify-content-between">
                <div className="d-flex mb-2">
                  <label className="userLabel mr-1">Division: </label>
                  <span>{selectedUser?.divisionId}</span>
                </div>
                <div className="d-flex mb-2">
                  <label className="userLabel mr-1">Organization:</label>
                  <span>{selectedUser?.organization}</span>
                </div>
                <div className="d-flex mb-2">
                  <label className="userLabel mr-1">Employment Type:</label>
                  <span>{selectedUser?.employmenttypeId}</span>
                </div>
                <div className="d-flex mb-2">
                  <label className="userLabel mr-1">Mobile:</label>
                  <span>{selectedUser?.mobile}</span>
                </div>
                <div className="d-flex mb-2">
                  <label className="userLabel mr-1">Status:</label>
                  <div className="d-flex align-items-center">
                    <input type="radio" name="status" value="Active" checked={true} />
                    <span>Active</span>
                  </div>
                  <div className="d-flex align-items-center ml-2">
                    <input type="radio" name="status" value="In Active" /> <span>In Active </span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default UserList;
