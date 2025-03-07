import Box from '../../components/Box';
import { useEffect, useRef, useState } from 'react';
import { Accordion, Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/user/userSlice';
import moment from 'moment';
import Stepper from '../../components/stepper';
import Attendance from './attendance';
import meetingImage from '../../assets/images/meeting.png';
import { MultiSelect } from 'react-multi-select-component';
import { meetingsActions } from '../../store/mom/momSlice';

const NewPoint = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const Role = localStorage.getItem('role');
  const [currentDate, setcurrentDate] = useState(null);
  const [currentTime, setcurrentTime] = useState(null);
  const [meetingTitle, setmeetingTitle] = useState('');
  const [discussionDate, setdiscussionDate] = useState(null);
  const [formFields, setFormFields] = useState([{ task: '', endDate: null, officer: '' }]);
  const lastInputRef = useRef(null);
  const [startDateError, setstartDateError] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [errors, setErrors] = useState([{ task: false, endDate: false, officer: false }]);
  const [currentStep, setCurrentStep] = useState(1);
  const [attendanceData, setAttendanceData] = useState([]);
  const [userListOption, setUserListOptions] = useState([]); // User options state
  const stepsList = ['Create Meeting', 'Mark Attendance', 'Discussion Points', 'Review'];
  const userList = useSelector((state) => state.users.data);
  const meetingDetails = useSelector((state) => state.meetings.data);

  useEffect(() => {
    dispatch(userActions.getuserInfo());
  }, [dispatch]);

  useEffect(() => {
    if (userList?.Result) {
      setUserListOptions(userList.Result.map((item) => ({ label: item.UserName, value: item.UserId })));
    }
  }, [userList]);

  const handleAddField = () => {
    setFormFields([...formFields, { task: '', endDate: null, officer: '' }]);
    setTimeout(() => lastInputRef.current?.focus(), 0);
    setErrors([...errors, { task: false, endDate: false, officer: false }]);
  };

  const handleFieldChange = (index, field, value) => {
    setFormFields((prevFields) => {
      const updatedFields = [...prevFields];

      if (field === 'endDate' && value instanceof Date && !isNaN(value)) {
        updatedFields[index][field] = moment(value).format('DD-MM-YYYY');
      } else if (field === 'officer') {
        updatedFields[index][field] = Array.isArray(value)
          ? value.map((item) => item.value).join(',') // Convert to comma-separated string
          : '';
      } else {
        updatedFields[index][field] = value;
      }

      return updatedFields;
    });
  };

  const handleDeleteField = (index) => {
    if (window.confirm('Are you sure you want to delete this row?')) {
      setFormFields(formFields.filter((_, i) => i !== index));
      setErrors(errors.filter((_, i) => i !== index));
    }
  };

  const validateAllRows = () => {
    const newErrors = formFields.map((field) => ({
      task: !field.task,
      endDate: !field.endDate,
      officer: !field.officer
    }));
    setErrors(newErrors);
    return newErrors.every((error) => !Object.values(error).includes(true));
  };

  const handleSaveAll = () => {
    console.log('enter');
    setTitleError(!meetingTitle.trim());
    setTimeError(!currentTime);
    setstartDateError(!currentDate);
    dispatch(
      meetingsActions.addMeetingsInfo({
        MeetingTitle: meetingTitle,
        MeetingDate: currentDate,
        MeetingTime: currentTime,
        CreatedBy: Role
      })
    );
  };

  useEffect(() => {
    if (attendanceData.length > 0) {
      attendanceData.forEach((item) => {
        dispatch(meetingsActions.addAttendanceInfo(item));
      });
    }

    if (formFields.length > 0) {
      formFields.forEach((item) => {
        dispatch(meetingsActions.addDiscussionInfo(item));
      });
    }
  }, [meetingDetails]); // Ensure correct dependencies

  const handleDiscussionDate = (date) => {
    setcurrentDate(date);
    if (date instanceof Date && !isNaN(date)) {
      setstartDateError(false);
      setdiscussionDate(moment(date).format('DD-MM-YYYY'));
    }
  };

  const handleDiscussionTime = (date) => {
    setcurrentTime(date);
    if (date && !isNaN(date)) {
      setTimeError(false);
    }
  };

  const handleTitle = (e) => {
    const value = e.target.value;
    setmeetingTitle(value);
    setTitleError(!value.trim());
  };

  const validateStep1 = () => {
    const isTitleValid = meetingTitle && meetingTitle.trim() !== '';
    const isDateValid = currentDate !== null;
    const isTimeValid = currentTime !== null;

    setTitleError(!isTitleValid);
    setstartDateError(!isDateValid);
    setTimeError(!isTimeValid);

    return isTitleValid && isDateValid && isTimeValid;
  };

  const handleStepChange = (nextStep) => {
    let isValid = true;
    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      setAttendanceData((prevData) => prevData.filter((field) => field.userId !== ''));
      if (attendanceData.length) {
        isValid = true;
      } else {
        isValid = false;
      }
    } else if (currentStep === 3) {
      isValid = validateAllRows();
    }
    if (!isValid) {
      return false; // Prevent step change if validation fails
    }
    setCurrentStep(nextStep);
    dispatch(userActions.getuserInfo());
    return true; // Allow step change
  };

  const handleAttendanceData = (data) => {
    setAttendanceData(data); // Keep attendance data even when switching steps
  };
  useEffect(() => {
    if (currentStep === 5) {
      handleSaveAll();
    }
  }, [currentStep]);

  return (
    <Container fluid>
      <Row>
        <Col>
          <Stepper
            steps={stepsList}
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            onStepChange={(nextStep) => handleStepChange(nextStep)}
            nextButttonTitle={currentStep === stepsList.length ? 'Save' : 'Next'}
          >
            {currentStep === 1 && (
              <div className="d-flex justify-content-center">
                <Box extra="">
                  <Row>
                    <Col sm={12} md={7} className="d-flex justify-content-center">
                      <img src={meetingImage} className="meetingImg" alt="Meeting" />
                    </Col>
                    <Col sm={12} md={5}>
                      <Form autoComplete="off">
                        <div className="meetingEntry">
                          <div className="mb-2">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter title"
                              value={meetingTitle} // Bind value to state
                              onChange={(e) => handleTitle(e)}
                              className={`mr-2 ${titleError ? 'is-invalid' : ''}`}
                            />
                          </div>
                          <div className="mb-2">
                            <Form.Label>Date</Form.Label>
                            <DatePicker
                              className={`form-control cfs-14 ${startDateError ? 'is-invalid' : ''}`}
                              selected={currentDate}
                              onChange={handleDiscussionDate}
                              placeholderText="Start Date"
                              dateFormat="dd-MM-yyyy"
                              name="startdate"
                            />
                          </div>
                          <div>
                            <Form.Label>Time</Form.Label>
                            <DatePicker
                              className={`form-control cfs-14 ${timeError ? 'is-invalid' : ''}`}
                              selected={currentTime}
                              onChange={handleDiscussionTime}
                              placeholderText="Select Time"
                              showTimeSelect
                              timeFormat="h:mm a"
                              timeIntervals={15}
                              dateFormat="h:mm a"
                              showTimeSelectOnly
                            />
                          </div>
                        </div>
                      </Form>
                    </Col>
                  </Row>
                </Box>
              </div>
            )}

            {currentStep === 2 && <Attendance handleAttendanceFormData={handleAttendanceData} formFields={attendanceData} />}

            {currentStep === 3 && (
              <Form autoComplete="off">
                <Box extra="">
                  {formFields.map((field, index) => (
                    <Row key={index} className="mb-2">
                      <Col md={5}>
                        <Form.Control
                          as="textarea"
                          placeholder="Enter text here.."
                          rows={1}
                          className={`mr-2 ${errors[index]?.task ? 'is-invalid' : ''}`} // Add error class for task field
                          value={field.task}
                          onChange={(e) => handleFieldChange(index, 'task', e.target.value)}
                          autoFocus={index === formFields.length - 1} // Auto-focus only on the last input field
                          ref={index === formFields.length - 1 ? lastInputRef : null} // Set ref to the last input field
                        />
                      </Col>
                      <Col md={3}>
                        <DatePicker
                          className={`form-control ${errors[index]?.endDate ? 'is-invalid' : ''}`} // Add error class for end date
                          selected={field.endDate ? moment(field.endDate, 'DD-MM-YYYY').toDate() : null} // Convert formatted date back to Date object for DatePicker
                          onChange={(date) => handleFieldChange(index, 'endDate', date)}
                          placeholderText="End Date"
                          dateFormat="dd-MM-yyyy"
                          name="enddate"
                          minDate={new Date()} // Disable past dates
                        />
                      </Col>

                      <Col md={3}>
                        <MultiSelect
                          options={userListOption}
                          value={userListOption.filter((option) => formFields[index].officer.split(',').includes(option.value))} // Convert string to array for selection
                          onChange={(selected) => handleFieldChange(index, 'officer', selected)}
                          overrideStrings={{ selectSomeItems: 'Select Multiple Officers' }}
                          hasSelectAll={true}
                          valueRenderer={(selected) =>
                            selected.length > 0 ? selected.map((s) => s.label).join(', ') : 'Select Multiple Officers'
                          }
                        />
                      </Col>
                      <Col md={1}>
                        <div className="lineForm d-flex justify-content-end">
                          {index === formFields.length - 1 && (
                            <Button onClick={handleAddField} variant="info" className="sortBtn">
                              <i className="feather icon-plus m-0" />
                            </Button>
                          )}
                          {formFields.length !== 1 && (
                            <Button variant="danger" onClick={() => handleDeleteField(index)} className="sortBtn">
                              <i className="feather icon-x m-0" />
                            </Button>
                          )}
                        </div>
                      </Col>
                    </Row>
                  ))}
                </Box>
              </Form>
            )}

            {currentStep === 4 && (
              <Box extra="header-info">
                <Row>
                  <Col md={12}>
                    <div className="d-flex">
                      <span className="report-label mr-1" style={{ width: '50px' }}>
                        Title :{' '}
                      </span>
                      <span>{meetingTitle}</span>
                    </div>
                    <div className="d-flex">
                      <span className="report-label mr-1" style={{ width: '50px' }}>
                        Date :{' '}
                      </span>
                      <span>{discussionDate}</span>
                    </div>
                    <div className="d-flex">
                      <span className="report-label mr-1" style={{ width: '50px' }}>
                        Time :{' '}
                      </span>
                      <span>{moment(currentTime).format('h:mm a')}</span>
                    </div>
                  </Col>

                  <Col md={12} className="mt-3">
                    <Accordion defaultActiveKey="0">
                      <Accordion.Item eventKey="1">
                        <Accordion.Header className="mb-3">
                          <label className="fs-6 text-secondary m-0 ">Attendance List</label>
                        </Accordion.Header>
                        <Accordion.Body className="p-0 dark-table">
                          <Table responsive hover>
                            <thead>
                              <tr className="">
                                <th className="" style={{ width: '50px' }}>
                                  Sno
                                </th>
                                <th className="w-60">Name</th>
                                <th className="w-20">Designation</th>
                                <th className="w-20">Division</th>
                                <th className="w-20">Organization</th>
                                <th className="w-20">Mobile</th>
                              </tr>
                            </thead>
                            <tbody>
                              {attendanceData.map((item, idx) => {
                                const user = userList?.Result?.find((u) => u.UserId === item.userId);
                                if (item.userId !== '') {
                                  return (
                                    <tr>
                                      <td>{idx + 1}</td>
                                      <td>{user ? user.UserName : ''}</td>
                                      <td>{item.designation}</td>
                                      <td>{item.division}</td>
                                      <td>{item.organization}</td>
                                      <td>{item.mobile}</td>
                                    </tr>
                                  );
                                }
                                return;
                              })}
                            </tbody>
                          </Table>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                    <div></div>
                  </Col>

                  <Col md={12} className="mt-3">
                    <Accordion defaultActiveKey="0">
                      <Accordion.Item eventKey="1">
                        <Accordion.Header className="mb-3">
                          <label className="fs-6 text-secondary  m-0">Discussion Points</label>
                        </Accordion.Header>
                        <Accordion.Body className="p-0 inner-table">
                          <Table responsive hover>
                            <thead>
                              <tr>
                                <th className="" style={{ width: '50px' }}>
                                  Sno
                                </th>
                                <th className="w-60">Discussion Points</th>
                                <th className="w-20">End date</th>
                                <th className="w-20">Officer Name</th>
                              </tr>
                            </thead>
                            <tbody>
                              {formFields.map((item, idx) => {
                                const userIds = Array.isArray(item.officer) ? item.officer : item.officer.split(',');
                                const userNamesArray = userIds
                                  .map((id) => {
                                    const user = userList?.Result?.find((u) => u.UserId === id);
                                    return user ? user.UserName : null;
                                  })
                                  .filter((name) => name) // Remove null values if any UserId does not match
                                  .join(', '); // Convert array to comma-separated string
                                const userNames = userNamesArray.split(',');
                                return (
                                  <tr>
                                    <td>{idx + 1}</td>
                                    <td>{item.task}</td>
                                    <td>{item.endDate}</td>
                                    <td>
                                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                        {userNames.map((name, index) => (
                                          <span key={index} className="label-user">
                                            {name.trim()}
                                          </span>
                                        ))}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </Col>
                </Row>
              </Box>
            )}
            {currentStep === 5 && (
              <div>
                <span className="fas fa-spinner"></span>
              </div>
            )}
          </Stepper>
        </Col>
      </Row>
    </Container>
  );
};

export default NewPoint;
