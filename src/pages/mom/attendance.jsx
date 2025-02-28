import Box from '../../components/Box';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/user/userSlice';

const Attendance = ({ handleAttendanceFormData, formFields: initialFields }) => {
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.users.data);
  const [formFields, setFormFields] = useState(
    initialFields.length ? initialFields : [{ userId: '', designationId: '', divisionId: '', organization: '', mobile: '', isOther: false }]
  );

  const [showregister, setShowregister] = useState(false);

  const [formData, setFormData] = useState({
    userName: '',
    type: '',
    designation: '',
    organization: '',
    mobile: '',
    division: '',
    status: 'Active',
    avatar: ''
  });

  useEffect(() => {
    dispatch(userActions.getuserInfo());
  }, [dispatch]);

  useEffect(() => {
    handleAttendanceFormData(formFields);
  }, [formFields]);

  const handleOfficerChange = (index, userId) => {
    if (userId === 'other') {
      setShowregister(true);
      setFormFields((prevFields) => prevFields.map((field, i) => (i === index ? { ...field, userId: '', isOther: true } : field)));
    } else {
      const selectedUser = userList?.data?.find((user) => user.userId === parseInt(userId, 10));

      setFormFields((prevFields) =>
        prevFields.map((field, i) =>
          i === index
            ? {
                ...field,
                userId: userId,
                designationId: selectedUser?.designationId || '',
                divisionId: selectedUser?.divisionId || '',
                organization: selectedUser?.organization || '',
                mobile: selectedUser?.mobile || '',
                isOther: false
              }
            : field
        )
      );

      if (index === formFields.length - 1) {
        handleAddField();
      }
    }
  };

  const handleChange = (index, fieldName, value) => {
    setFormFields((prevFields) => prevFields.map((field, i) => (i === index ? { ...field, [fieldName]: value } : field)));
  };

  const handleDeleteField = (index) => {
    if (window.confirm('Are you sure you want to delete this row?')) {
      setFormFields((prevFields) => prevFields.filter((_, i) => i !== index));
    }
  };

  const handleAddField = () => {
    setFormFields((prevFields) => [
      ...prevFields,
      { userId: '', designationId: '', divisionId: '', organization: '', mobile: '', isOther: false }
    ]);
  };

  const handleSaveOther = () => {
    if (formData.userName) {
      setFormFields((prevFields) => {
        // Update the last "Other" entry with the new user's data
        return prevFields.map((field) =>
          field.isOther
            ? {
                ...field,
                userId: formData.userName, // Using the entered name as userId
                designationId: formData.designation,
                divisionId: formData.division,
                organization: formData.organization,
                mobile: formData.mobile,
                isOther: false // Reset "Other" flag
              }
            : field
        );
      });
    }

    // Reset form data
    setFormData({
      userName: '',
      type: '',
      designation: '',
      organization: '',
      mobile: '',
      division: '',
      status: 'Active',
      avatar: ''
    });

    setShowregister(false);
    handleAddField();
  };

  const handleClose = () => {
    // Reset form data
    setFormData({
      userName: '',
      type: '',
      designation: '',
      organization: '',
      mobile: '',
      division: '',
      status: 'Active',
      avatar: ''
    });

    setShowregister(false);
  };

  useEffect(() => {
    handleAttendanceFormData(formFields);
  }, [formFields]);

  return (
    <Container fluid>
      <Row>
        <Col>
          <Form autoComplete="off">
            <Box title="Meeting attendance" extra="header-danger">
              {formFields.map((field, index) => (
                <Row key={index} className="mb-2">
                  <Col>
                    <div className="lineForm">
                      {/* {field.isOther ? (
                        <Form.Control
                          type="text"
                          name="userId"
                          value={field.userId}
                          placeholder="Enter user manually"
                          onChange={(e) => handleChange(index, 'userId', e.target.value)}
                        />
                      ) : ( */}
                      <Form.Select
                        aria-label="Select an officer"
                        name="userId"
                        value={field.userId}
                        onChange={(e) => handleOfficerChange(index, e.target.value)}
                      >
                        <option value="">Select an officer</option>
                        {userList?.data?.map((item) => (
                          <option value={item.userId} key={item.userId}>
                            {item.userName}
                          </option>
                        ))}
                        <option value="other">Other</option>
                      </Form.Select>
                      {/* )} */}

                      <Form.Control
                        type="text"
                        name="designationId"
                        className="ml-1"
                        value={field.designationId}
                        placeholder="Designation"
                        disabled
                      />
                      <Form.Control
                        type="text"
                        name="divisionId"
                        className="ml-1"
                        value={field.divisionId}
                        placeholder="Division"
                        disabled
                      />
                      <Form.Control
                        type="text"
                        name="organization"
                        className="ml-1"
                        value={field.organization}
                        placeholder="Organization"
                        disabled
                      />
                      <Form.Control type="text" name="mobile" className="ml-1" value={field.mobile} placeholder="Mobile" disabled />

                      {formFields.length > 1 && (
                        <Button variant="danger" onClick={() => handleDeleteField(index)} className="sortBtn ml-1">
                          <i className="feather icon-x m-0" />
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>
              ))}
            </Box>
          </Form>
        </Col>
      </Row>

      <Modal show={showregister} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h4>Add User</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Employee Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name..."
                    name="userName"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Designation</Form.Label>
                  <Form.Control
                    type="text"
                    name="designation"
                    placeholder="Enter designation..."
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Division</Form.Label>
                  <Form.Control
                    type="text"
                    name="division"
                    placeholder="Enter division..."
                    value={formData.division}
                    onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                  />
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
                    placeholder="Enter organization..."
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    type="text"
                    name="mobile"
                    placeholder="Enter mobile..."
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-2">
              <Button variant="primary" onClick={handleSaveOther}>
                Save
              </Button>
              <Button variant="secondary" onClick={handleClose} className="ms-2">
                Cancel
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Attendance;
