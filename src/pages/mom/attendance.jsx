import Box from '../../components/Box';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/user/userSlice';
import { MultiSelect } from 'react-multi-select-component';

const Attendance = ({ handleAttendanceFormData, formFields: initialFields }) => {
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.users.data);
  const [formFields, setFormFields] = useState(
    initialFields.length ? initialFields : [{ userId: '', designationId: '', divisionId: '', organization: '', mobile: '', isOther: false }]
  );
  const [userListOption, setUserListOptions] = useState([]); // User options state
  const [userFilter, setuserFilter] = useState([]); // user filter state
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
  
  useEffect(() => {
    if (userList?.data) {
      setUserListOptions(userList.data.map((item) => ({ label: item.userName, value: item.userId })));
    }
  }, [userList]);

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

  const handleUserFilter = (newSelected) => {
    setuserFilter(newSelected);

    // Extract selected user IDs
    const selectedUserIds = newSelected.map((user) => user.value.toString());

    // Generate new form fields based on selected users
    const updatedFields = selectedUserIds.map((userId) => {
      const existingField = formFields.find((field) => field.userId === userId);

      if (existingField) {
        return existingField; // Keep existing fields if already in list
      }

      // Find user details from userList
      const selectedUser = userList?.data?.find((user) => user.userId.toString() === userId);

      return {
        userId: userId,
        designationId: selectedUser?.designationId || '',
        divisionId: selectedUser?.divisionId || '',
        organization: selectedUser?.organization || '',
        mobile: selectedUser?.mobile || '',
        isOther: false
      };
    });

    // Ensure at least one empty field exists for new input
    if (updatedFields.length === 0 || updatedFields[updatedFields.length - 1].userId !== '') {
      updatedFields.push({ userId: '', designationId: '', divisionId: '', organization: '', mobile: '', isOther: false });
    }

    setFormFields(updatedFields);
  };

  const customHeader = (
    <div className="d-flex align-items-center">
      <h5 className="ml-3">Meeting attendance</h5>
      <div>
        <MultiSelect
          options={userListOption}
          value={userFilter}
          onChange={handleUserFilter}
          overrideStrings={{
            selectSomeItems: 'Select Multiple Officers'
          }}
          hasSelectAll={true}
        />
      </div>
    </div>
  );

  return (
    <Container fluid>
      <Row>
        <Col>
          <Form autoComplete="off">
            <Box extra="header-danger" customHeader={customHeader}>
              {formFields.map((field, index) => (
                <Row key={index} className="mb-2">
                  <Col>
                    <div className="lineForm">
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
