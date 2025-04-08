import Box from '../../components/Box';
import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/user/userSlice';
import { MultiSelect } from 'react-multi-select-component';
import { settingsActions } from '../../store/settings/settingSlice';
import Swal from 'sweetalert2';
import { meetingsActions } from '../../store/mom/momSlice';

const Attendance = ({ handleAttendanceFormData, formFields: initialFields }) => {
  const Role = localStorage.getItem('role');
  const dispatch = useDispatch();
  const userList = useSelector((state) => state.users.data);
  const designationDataList = useSelector((state) => state.settings.designationData);
  const divisionDataList = useSelector((state) => state.settings.divisionData);
  const employeementDataList = useSelector((state) => state.settings.employeementData);
  const organizationDataList = useSelector((state) => state.settings.organizationData);
  const [formFields, setFormFields] = useState(
    initialFields.length
      ? [...initialFields, { AttendanceId: '', userId: '', designation: '', division: '', organization: '', mobile: '', isOther: false }]
      : [{ AttendanceId: '', userId: '', designation: '', division: '', organization: '', mobile: '', isOther: false }]
  );
  const [userListOption, setUserListOptions] = useState([]); // User options state
  const [userFilter, setuserFilter] = useState([]); // user filter state
  const [showregister, setShowregister] = useState(false);
  const [errors, setErrors] = useState({});
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
  const [newUserName, setNewUserName] = useState(null);

  const CallAPIs = () => {
    dispatch(userActions.getuserInfo());
    dispatch(settingsActions.getDesignationInfo());
    dispatch(settingsActions.getDivisionInfo());
    dispatch(settingsActions.getEmployeementInfo());
    dispatch(settingsActions.getOrganizationInfo());
  };

  useEffect(() => {
    CallAPIs();
  }, []);

  useEffect(() => {
    handleAttendanceFormData(formFields);
  }, [formFields]);

  useEffect(() => {
    if (userList?.Result) {
      const activeUsers = userList.Result.filter((item) => item.Status === '1');
      setUserListOptions(activeUsers.map((item) => ({ label: item.UserName, value: item.UserId })));

      // Preselect users from initialFields
      if (initialFields.length) {
        const preselectedUsers = initialFields
          .map((field) => {
            const user = activeUsers.find((u) => u.UserId.toString() === field.userId);
            return user ? { label: user.UserName, value: user.UserId } : null;
          })
          .filter(Boolean); // Remove null values

        setuserFilter(preselectedUsers);
      }
    }
  }, [userList]);

  const handleOfficerChange = (index, userId) => {
    if (userId) {
      if (userId === 'other') {
        CallAPIs();
        setShowregister(true);
        return;
      } else {
        // Find the selected user from userList
        const selectedUser = userList?.Result?.find((user) => user.UserId.toString() === userId);

        setFormFields((prevFields) =>
          prevFields.map((field, i) =>
            i === index
              ? {
                  ...field,
                  userId,
                  designation: selectedUser?.DesignationTitle || '',
                  division: selectedUser?.EmployeeDivisionTitle || '',
                  organization: selectedUser?.OrganisationTitle || '',
                  mobile: selectedUser?.Mobile || '',
                  isOther: false
                }
              : field
          )
        );

        // Update the MultiSelect state to include the selected user
        setuserFilter((prevSelected) => {
          const alreadySelected = prevSelected.some((u) => u.value === userId);
          if (!alreadySelected) {
            return [...prevSelected, { label: selectedUser.UserName, value: userId }];
          }
          return prevSelected;
        });

        handleAddField();
      }
    }
  };

  const handleDeleteField = (attendanceId, index) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        if (attendanceId) {
          dispatch(
            meetingsActions.deleteAttendanceInfo({
              AttendanceId: attendanceId
            })
          );
        }
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success'
        });
        setFormFields((prevFields) => prevFields.filter((_, i) => i !== index));
      }
    });
  };

  const handleAddField = () => {
    setFormFields((prevFields) => [
      ...prevFields,
      { userId: '', designation: '', division: '', organization: '', mobile: '', isOther: false }
    ]);
  };

  const handleClose = () => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.isOther
          ? {
              ...field,
              userId: field.previousUserId || '', // Restore the last selection
              isOther: false
            }
          : field
      )
    );
    setFormData({
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
    setNewUserName(null); // Reset after updating fields
    setErrors({});
    setShowregister(false);
  };

  useEffect(() => {
    handleAttendanceFormData(formFields);
  }, [formFields]);

  const handleUserFilter = (newSelected) => {
    const removedUsers = userFilter.filter((prev) => !newSelected.some((curr) => curr.value === prev.value));
    removedUsers.forEach((removed) => {
      const existingRecord = initialFields.find((field) => field.userId.toString() === removed.value.toString());
      if (existingRecord?.AttendanceId) {
        // Call delete API if user was previously saved
        dispatch(
          meetingsActions.deleteAttendanceInfo({
            AttendanceId: existingRecord.AttendanceId
          })
        );
      }
    });

    setuserFilter(newSelected);

    // Extract selected user IDs
    const selectedUserIds = newSelected.map((user) => user.value.toString());

    // Generate new form fields based on selected users
    const updatedFields = selectedUserIds.map((userId) => {
      const existingField = formFields.find((field) => field.userId === userId);
      if (existingField) return existingField;

      // Find user details from userList.Result
      const selectedUser = userList?.Result?.find((user) => user.UserId.toString() === userId);

      return {
        userId: userId,
        designation: selectedUser?.DesignationTitle || '',
        division: selectedUser?.EmployeeDivisionTitle || '',
        organization: selectedUser?.OrganisationTitle || '',
        mobile: selectedUser?.Mobile || '',
        isOther: false
      };
    });

    // Ensure at least one empty field exists for new input
    if (updatedFields.length === 0 || updatedFields[updatedFields.length - 1].userId !== '') {
      updatedFields.push({ userId: '', designation: '', division: '', organization: '', mobile: '', isOther: false });
    }

    setFormFields(updatedFields);
  };

  const customHeader = (
    <div className="d-flex align-items-center">
      <h5 className="ml-3">Meeting attendance</h5>
      <div className="multi-user-filter">
        <MultiSelect
          options={userListOption}
          value={userFilter}
          onChange={handleUserFilter}
          overrideStrings={{
            selectSomeItems: "Select employee's.."
          }}
          hasSelectAll={true}
          valueRenderer={(selected, _options) => {
            if (selected.length === 1) {
              return selected[0].label; // Show the single selected user's name
            } else if (selected.length > 1) {
              return `${selected.length} Employee's Selected`; // Show count for multiple selections
            }
            return "Select employee's.."; // Default text when none are selected
          }}
        />
      </div>
    </div>
  );

  const validate = () => {
    let newErrors = {};

    if (!formData.UserName) newErrors.UserName = 'User name is required';
    if (!formData.DesignationId) newErrors.DesignationId = 'Designation is required';
    if (!formData.EmployementId) newErrors.EmployementId = 'Employment type is required';
    if (!formData.EmployeementDivisionId) newErrors.EmployeementDivisionId = 'Division is required';
    if (!formData.OrganizationId) newErrors.OrganizationId = 'Company is required';

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

  const handleSaveOther = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      UserName: formData.UserName,
      DesignationId: formData.DesignationId,
      EmployementId: formData.EmployementId,
      EmployeementDivisionId: formData.EmployeementDivisionId,
      OrganizationId: formData.OrganizationId,
      Mobile: formData.Mobile,
      Status: formData.Status,
      ImgPath: formData.ImgPath || '',
      CreatedBy: Role
    };

    dispatch(userActions.adduserInfo(payload));
    setNewUserName(formData.UserName);
    setTimeout(() => {
      CallAPIs();
      setShowregister(false);
    }, 500);
  };

  useEffect(() => {
    if (newUserName && userList?.Result) {
      const updatedUser = userList.Result.find((user) => user.UserName === newUserName);
      if (updatedUser) {
        setFormFields((prevFields) => {
          // Remove all blank rows
          let newFields = prevFields.filter((field) => field.userId !== '');

          // Add the new user row
          newFields.push({
            userId: updatedUser.UserId,
            designation: updatedUser.DesignationTitle || '',
            division: updatedUser.EmployeeDivisionTitle || '',
            organization: updatedUser.OrganisationTitle || '',
            mobile: updatedUser.Mobile || '',
            isOther: false
          });

          // Ensure there's exactly one blank row at the end
          return [...newFields, { userId: '', designation: '', division: '', organization: '', mobile: '', isOther: false }];
        });

        // Update MultiSelect filter
        setuserFilter((prevFilters) => [...prevFilters, { label: updatedUser.UserName, value: updatedUser.UserId }]);

        // Reset after updating fields
        setNewUserName(null);
      }
    }
  }, [userList]);

  return (
    <Container fluid>
      <Row>
        <Col>
          <Form autoComplete="off">
            <Box extra="header-danger" customHeader={customHeader}>
              <Row>
                <Col>
                  <div className="lineForm-header">
                    <h5 className="p-0">Employee</h5>
                    <h5>Designation</h5>
                    <h5>Division</h5>
                    <h5>Company</h5>
                    <h5>Mobile</h5>
                  </div>
                </Col>
              </Row>
              {formFields.map((field, index) => (
                <Row key={`${index}-${Math.random()}`} className="mb-2">
                  <Col>
                    <div className="lineForm">
                      <Form.Select
                        aria-label="Select an officer"
                        name="userId"
                        value={field.userId}
                        onChange={(e) => handleOfficerChange(index, e.target.value)}
                      >
                        <option value="">Select an employee</option>
                        {userList?.Result?.map((item) => (
                          <option
                            key={item.UserId}
                            value={item.UserId}
                            className={formFields.some((f) => f.userId === item.UserId && f.userId !== field.userId) ? 'lightgrey-bg' : ''}
                            disabled={formFields.some((f) => f.userId === item.UserId && f.userId !== field.userId)}
                          >
                            {item.UserName}
                          </option>
                        ))}
                        <option value="other">Other</option>
                      </Form.Select>
                      <Form.Control
                        type="text"
                        name="designation"
                        className="ml-1"
                        value={field.designation}
                        placeholder="Designation"
                        disabled
                      />
                      <Form.Control type="text" name="division" className="ml-1" value={field.division} placeholder="Division" disabled />
                      <Form.Control
                        type="text"
                        name="organization"
                        className="ml-1"
                        value={field.organization}
                        placeholder="Company"
                        disabled
                      />
                      <Form.Control type="text" name="mobile" className="ml-1" value={field.mobile} placeholder="Mobile" disabled />

                      {formFields.length > 1 && (
                        <Button variant="danger" onClick={() => handleDeleteField(field.AttendanceId, index)} className="sortBtn ml-1">
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
            <h4>Add Employee</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate onSubmit={handleSaveOther}>
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
                    {designationDataList?.Result?.map((item) => (
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
                    {employeementDataList?.Result?.map((item) => (
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
                    {divisionDataList?.Result?.map((item) => (
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
                  <Form.Select
                    name="OrganizationId"
                    value={formData.OrganizationId}
                    className="custom-form-select"
                    onChange={handleChange}
                    isInvalid={!!errors.OrganizationId}
                  >
                    <option value="" disabled>
                      Select division...
                    </option>
                    {organizationDataList?.Result?.map((item) => (
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
                    placeholder="Enter mobile number..."
                    value={formData.Mobile}
                    onChange={handleChange}
                    isInvalid={!!errors.Mobile}
                  />
                  <Form.Control.Feedback type="invalid">{errors.Mobile}</Form.Control.Feedback>
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
    </Container>
  );
};

export default Attendance;
