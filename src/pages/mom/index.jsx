import Box from '../../components/Box';
import { useEffect, useRef, useState } from 'react';
import { Accordion, Button, Col, Container, Form, Modal, Row, Table } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../store/user/userSlice';
import moment from 'moment';
import Stepper from '../../components/stepper';
import Attendance from './attendance';
import meetingImage from '../../assets/images/meeting.png';
import { MultiSelect } from 'react-multi-select-component';
import Textloading from '../../components/Loader/loading';
import male_i from '../../assets/images/user/male.jpg';
import female_i from '../../assets/images/user/female.jpg';
import axios from 'axios';
import { useStore } from '../../contexts/DataContext';
import { meetingsActions } from '../../store/mom/momSlice';
import Swal from 'sweetalert2';
import { useTheme } from '../../contexts/themeContext';

const NewPoint = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mode } = useTheme();
  const { store, currentMeetingId } = useStore();
  const API_URL = import.meta.env.VITE_APP_API_BASE_URL;
  const Role = localStorage.getItem('role');
  const [currentDate, setcurrentDate] = useState(null);
  const [currentTime, setcurrentTime] = useState(null);
  const [meetingTitle, setmeetingTitle] = useState('');
  const [discussionDate, setdiscussionDate] = useState(null);
  const [formFields, setFormFields] = useState([
    { task: '', endDate: null, officer: '', projectId: '', id: '', reason: '', status: '', discussionId: '' }
  ]);
  const lastInputRef = useRef(null);
  const [startDateError, setstartDateError] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [errors, setErrors] = useState([{ task: false, endDate: false, officer: false, projectId: false }]);
  const [currentStep, setCurrentStep] = useState(1);
  const [attendanceData, setAttendanceData] = useState([]);
  const [userListOption, setUserListOptions] = useState([]); // User options state
  const [showInfo, setShowInfo] = useState(false);
  const [selectedUser, setselectedUser] = useState(null);
  const [selectedMeeting, setselectedMeeting] = useState(null);
  const [draftMeetings, setDraftMeetings] = useState(null);
  const [isDraftMeetings, setIsDraftMeetings] = useState(false);
  const [meetingId, setMeetingId] = useState('');
  const stepsList = ['Create Meeting', 'Mark Attendance', 'Discussion Points', 'Review'];
  const userList = useSelector((state) => state.users.data);
  const projectList = useSelector((state) => state.settings.projectData);
  const MeetingLists = useSelector((state) => state.meetings.data);
  const designationDataList = useSelector((state) => state.settings.designationData);

  useEffect(() => {
    dispatch(meetingsActions.getMeetingsInfo());
    dispatch(userActions.getuserInfo());
  }, []);

  useEffect(() => {
    if (userList?.Result) {
      setUserListOptions(
        userList?.Result?.filter((item) => item.Status === '1').map((item) => ({ label: item.UserName, value: item.UserId }))
      );
    }
    if (store) {
      setcurrentDate(store.MeetingDate);
      setdiscussionDate(moment(store.MeetingDate, 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY'));
    }
    if (draftMeetings?.length) {
      setIsDraftMeetings(true);
    }
  }, [userList, store, draftMeetings]);

  useEffect(() => {
    setDraftMeetings(MeetingLists?.MeetingDetails?.filter((item) => item.Draft < 4));
    if (selectedMeeting) {
      setMeetingId(selectedMeeting?.MeetingId);
    }
    if (selectedMeeting?.MeetingDate) {
      const parsedDate = moment(selectedMeeting.MeetingDate, 'DD-MM-YYYY HH:mm:ss').toDate();
      handleDiscussionDate(parsedDate);
    }
    if (selectedMeeting?.MeetingTime) {
      const parsedTime = moment(`2024-01-01T${selectedMeeting.MeetingTime}`, 'YYYY-MM-DDTHH:mm:ss.SSSSSSS').toDate();
      handleDiscussionTime(parsedTime);
    }
    if (selectedMeeting?.MeetingTitle) {
      handleTitle(selectedMeeting.MeetingTitle);
    }
    if (selectedMeeting?.Attendance.length) {
      setAttendanceData(
        selectedMeeting?.Attendance.map((item) => {
          return {
            AttendanceId: item.AttendanceId,
            userId: item.UserId,
            designation: item?.DesignationId?.split(',')
              .map((id) => getDesignation(id))
              .join('/ '),
            division: item.DivisionTitle,
            organization: item.OrganisationTitle,
            mobile: item.Mobile,
            isOther: false,
            associatedOfficer: item.AssociatedOfficerId,
            Status: item.Status
          };
        })
      );
    }
    if (selectedMeeting?.DiscussionsPoint.length) {
      setFormFields(
        selectedMeeting?.DiscussionsPoint.map((item) => ({
          task: item.Description,
          endDate: item.EndDate,
          officer: item.UserId,
          projectId: item.ProjectId,
          id: item.DiscussionId,
          reason: item.Reason,
          status: item.Status,
          discussionId: item.DiscussionId
        }))
      );
    }
  }, [selectedMeeting, MeetingLists]);

  const getDraftMeetings = () => {
    setDraftMeetings(MeetingLists?.MeetingDetails?.filter((item) => item.Draft < 4));
    setselectedMeeting(null);
  };

  const handleAddField = () => {
    setFormFields([...formFields, { task: '', endDate: null, officer: '', projectId: '' }]);
    setTimeout(() => lastInputRef.current?.focus(), 0);
    setErrors([...errors, { task: false, endDate: false, officer: false }]);
  };

  const handleFieldChange = (index, field, value) => {
    setFormFields((prevFields) => {
      const updatedFields = [...prevFields];

      if (field === 'endDate' && value instanceof Date && !isNaN(value)) {
        updatedFields[index][field] = value;
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

  const handleDeleteField = (discussionId, index) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      theme: mode
    }).then((result) => {
      if (result.isConfirmed) {
        if (discussionId) {
          dispatch(
            meetingsActions.deleteDiscussionInfo({
              DiscussionId: discussionId
            })
          );
        }
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
          theme: mode
        });
        setFormFields((prevFields) => prevFields.filter((_, i) => i !== index));
      }
    });
  };

  const handleSaveAll = async () => {
    setTitleError(!meetingTitle.trim());
    setTimeError(!currentTime);
    setstartDateError(!currentDate);
    // Update meeting information after successfully saving or updating discussion points
    dispatch(
      meetingsActions.updateMeetingsInfo({
        MeetingId: meetingId,
        MeetingTitle: meetingTitle,
        MeetingDate: currentDate,
        MeetingTime: currentTime,
        Draft: 4,
        ModifyBy: Role
      })
    );
    // Navigate after all API calls complete
    navigate('/meetings/view');
  };

  const handleDiscussionDate = (date) => {
    setcurrentDate(date);
    if (date instanceof Date && !isNaN(date)) {
      setstartDateError(false);
      setdiscussionDate(moment(date).format('DD-MM-YYYY'));
    }
  };

  const handleDiscussionTime = (date) => {
    setcurrentTime(date);
    if (date instanceof Date && !isNaN(date)) {
      setTimeError(false);
    }
  };

  const handleTitle = (value) => {
    setmeetingTitle(value);
    setTitleError(!value?.trim());
  };

  const validateStep1 = () => {
    const isTitleValid = meetingTitle.trim() !== '';
    const isDateValid = currentDate !== null;
    const isTimeValid = currentTime !== null;

    setTitleError(!isTitleValid);
    setstartDateError(!isDateValid);
    setTimeError(!isTimeValid);

    if (!isTitleValid || !isDateValid || !isTimeValid) {
      Swal.fire({
        title: 'Meeting',
        text: 'You should fill all details.',
        icon: 'warning',
        theme: mode
      });
      return false;
    }

    try {
      if (selectedMeeting) {
        // If editing, only update the meeting, don't recreate it
        dispatch(
          meetingsActions.updateMeetingsInfo({
            MeetingId: selectedMeeting.MeetingId, // Use existing meeting ID
            MeetingTitle: meetingTitle,
            MeetingDate: currentDate,
            MeetingTime: currentTime,
            Draft: 1,
            ModifyBy: Role
          })
        );
        return true;
      } else if (!currentMeetingId) {
        dispatch(
          meetingsActions.addMeetingsInfo({
            MeetingTitle: meetingTitle,
            MeetingDate: currentDate,
            MeetingTime: currentTime,
            CreatedBy: Role
          })
        );
        return true;
      }
    } catch (error) {
      return false;
    }
  };

  const validateStep2 = () => {
    const filteredAttendance = attendanceData.filter((item) => item.userId !== '');

    if (filteredAttendance.length === 0) {
      Swal.fire({
        title: 'Attendance',
        text: 'You should select at least one employee.',
        icon: 'warning',
        theme: mode
      });
      return false;
    } else {
      try {
        const attendanceRequests = filteredAttendance.map((item) => {
          const requestPayload = {
            MeetingId: meetingId,
            UserId: item.userId
          };

          // If attendanceId is not available, treat it as a new attendance record (Save)
          if (!item.AttendanceId) {
            return axios.post(`${API_URL}/Save_Attendance`, { ...requestPayload, CreatedBy: Role });
          }
          // If attendanceId is available, update the attendance record (Update)
          return axios.post(`${API_URL}/Update_Attendance`, {
            ...requestPayload,
            ModifyBy: Role,
            AttendanceId: item.AttendanceId // Include AttendanceId for update
          });
        });

        Promise.all(attendanceRequests);

        // Update meeting information after successfully saving or updating attendance
        dispatch(
          meetingsActions.updateMeetingsInfo({
            MeetingId: meetingId,
            MeetingTitle: meetingTitle,
            MeetingDate: currentDate,
            MeetingTime: currentTime,
            Draft: 2,
            ModifyBy: Role
          })
        );

        return true;
      } catch (error) {
        return false;
      }
    }
  };

  const validateAllRows = () => {
    const newErrors = formFields.map((field) => ({
      task: !field.task,
      endDate: !field.endDate,
      officer: !field.officer,
      projectId: !field.projectId
    }));
    setErrors(newErrors);
    return newErrors.every((error) => !Object.values(error).includes(true));
  };

  const validateStep3 = () => {
    const filteredDiscussion = formFields.filter(
      (item) => item.task !== '' && item.endDate !== '' && item.projectId !== '' && item.officer !== ''
    );

    if (filteredDiscussion.length === 0) {
      Swal.fire({
        title: 'Discussion points',
        text: 'You should fill all the details.',
        icon: 'warning',
        theme: mode
      });
      return false;
    } else {
      const isValid = validateAllRows(); // Assuming validateAllRows() is your form validation function
      if (isValid) {
        try {
          const discussionRequests = formFields.map((item) => {
            const requestPayload = {
              MeetingId: meetingId,
              Description: item.task,
              DiscussionId: item.discussionId,
              StartDate: currentDate,
              EndDate: item.endDate,
              UserId: item.officer,
              Reason: selectedMeeting ? item.reason || '' : '',
              Status: selectedMeeting ? 1 : '', // set status pending by default for new record
              ProjectId: item.projectId || ''
            };
            if (!item.discussionId) {
              return axios.post(`${API_URL}/Save_DiscussionPoint`, { ...requestPayload, CreatedBy: Role });
            } else {
              return axios.post(`${API_URL}/update_DiscussionPoint`, {
                ...requestPayload,
                ModifyBy: Role,
                DiscussionId: item.id // Include DiscussionId for update
              });
            }
          });

          Promise.all(discussionRequests);

          // Update meeting information after successfully saving or updating discussion points
          dispatch(
            meetingsActions.updateMeetingsInfo({
              MeetingId: meetingId,
              MeetingTitle: meetingTitle,
              MeetingDate: currentDate,
              MeetingTime: currentTime,
              Draft: 3,
              ModifyBy: Role
            })
          );
          return true;
        } catch (error) {
          return; // Stop execution on API failure
        }
      }
    }
  };

  const handleStepChange = (nextStep) => {
    let isValid = true;
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = true;
        break;
      default:
        break;
    }
    if (!isValid) {
      return false; // Stop execution if validation fails
    }
    setCurrentStep(nextStep);
    dispatch(userActions.getuserInfo());
  };

  const handleAttendanceData = (data) => {
    // Filter out all blank rows except for one
    const filteredData = data.filter((row) => row.userId);

    // Ensure only one blank row remains if there are any
    if (filteredData.length === data.length) {
      // If there are no blank rows, add one blank row
      filteredData.push({
        userId: '',
        designation: '',
        division: '',
        organization: '',
        mobile: '',
        isOther: false,
        associatedOfficer: ''
      });
    }

    setAttendanceData(filteredData); // Keep only valid attendance data with one blank row
  };

  const handleClose = () => {
    setShowInfo(false);
    setselectedUser(null);
  };

  const handleUserInfo = (user) => {
    setselectedUser(user);
    setShowInfo(true);
  };

  const handleEditMeeting = (item) => {
    setselectedMeeting(item);
  };

  useEffect(() => {
    if (currentStep === 2) {
      if (currentMeetingId) {
        setMeetingId(currentMeetingId);
        dispatch(
          meetingsActions.updateMeetingsInfo({
            MeetingId: currentMeetingId || '', // Use existing meeting ID
            MeetingTitle: meetingTitle,
            MeetingDate: currentDate,
            MeetingTime: currentTime,
            Draft: 1,
            ModifyBy: Role
          })
        );
      }
    }
    if (currentStep === 3) {
    }
    if (currentStep === 4) {
    }
    if (currentStep === 5) {
      handleSaveAll();
    }
  }, [currentStep]);

  const getDesignation = (val) => {
    const data = Array.isArray(designationDataList?.Result) ? designationDataList.Result : Object.values(designationDataList?.Result || {});
    const found = data.find((item) => item.DesignationId === val);
    return found ? found.DesignationTitle : '';
  };

  return (
    <Container fluid>
      <Row>
        <Col>
          {draftMeetings?.length && selectedMeeting == null ? (
            <>
              <Row>
                <Col>
                  <h5 className="mb-3 theme-color">Draft Meetings</h5>
                </Col>
              </Row>
              <Row>
                {draftMeetings?.map((item, idx) => (
                  <Col sm={12} md={6} lg={3} xl={3}  key={`${idx}-${idx}-${Math.random()}`}>
                    <div className="card project-task pointer" onClick={() => handleEditMeeting(item)}>
                      <div className="card-body">
                        <div className="row align-items-center justify-content-center">
                          <div className="col">
                            <Link>
                              <h5 className="m-0 pointer text-success">
                                <i className="far fa-edit m-r-10"></i>Meeting
                              </h5>
                            </Link>
                          </div>
                          <div className="col-auto">
                            <label className="badge theme-bg2 text-white f-14 f-w-400 float-end">{(item.Draft / 4) * 100}% Done</label>
                          </div>
                        </div>
                        <h6 className="mt-3 mb-3">
                          Steps Complete: <span className="text-muted">{item.Draft}/4</span>
                        </h6>
                        <div className="progress">
                          <div
                            className="progress-bar progress-c-theme"
                            role="progressbar"
                            style={{ width: `${(item.Draft / 4) * 100}%`, height: '6px' }}
                            aria-valuenow="60"
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <h6 className="mt-3 mb-0">
                          Title : <span className="text-muted">{item.MeetingTitle}</span>
                        </h6>
                        <h6 className="mt-3 mb-0">
                          Date : <span className="text-muted">{moment(item.MeetingDate, 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY')}</span>
                        </h6>
                        <h6 className="mt-3 mb-0 ">
                          Time : <span className="text-muted">{moment(item.MeetingTime, 'HH:mm:ss.SSSSSSS').format('hh:mm A')}</span>
                        </h6>
                      </div>
                    </div>
                  </Col>
                ))}
                <Col sm={12} md={6} lg={3} xl={3} key={`${Math.random()}`}>
                  <div
                    className="card project-task pointer"
                    onClick={() => {
                      setDraftMeetings(null);
                      setselectedMeeting(null);
                    }}
                  >
                    <div className="card-body d-flex justify-content-center align-items-center">
                      <span className="fas fa-plus addMeeting"></span>
                    </div>
                  </div>
                </Col>
              </Row>
            </>
          ) : (
            <Stepper
              steps={stepsList}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              onStepChange={(nextStep) => handleStepChange(nextStep)}
              nextButttonTitle={currentStep === stepsList.length ? 'Save' : 'Next'}
              backButtonTitle={isDraftMeetings && currentStep === 1 ? 'View Drafts' : 'Back'}
              handleBackButton={getDraftMeetings}
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
                                onChange={(e) => handleTitle(e.target.value)}
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
                                maxDate={new Date()} // Disable future dates
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
                    {formFields.map((field, index) => {
                      return (
                        <Row key={index} className="mb-2">
                          <Col md={12} className="d-flex justify-content-between align-items-center w-100 discussion">
                            <div className="w-35">
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
                            </div>
                            <div className="w-17 ml-1">
                              <DatePicker
                                className={`form-control ${errors[index]?.endDate ? 'is-invalid' : ''}`} // Add error class for end date
                                selected={field.endDate ? moment(field.endDate, 'DD-MM-YYYY').toDate() : null} // Convert formatted date back to Date object for DatePicker
                                onChange={(date) => handleFieldChange(index, 'endDate', date)}
                                placeholderText="End Date"
                                dateFormat="dd-MM-yyyy"
                                name="enddate"
                                minDate={new Date()} // Disable past dates
                              />
                            </div>
                            <div className="w-17 ml-1">
                              <Form.Select
                                aria-label="Select a project"
                                name="projectId"
                                value={Number(field.projectId)}
                                onChange={(e) => handleFieldChange(index, 'projectId', e.target.value)}
                              >
                                <option value="">Select a project</option>
                                {projectList?.Result?.map((item) => (
                                  <option key={item.ProjectId} value={Number(item.ProjectId)}>
                                    {item.ProjectTitle}
                                  </option>
                                ))}
                              </Form.Select>
                            </div>
                            <div className="w-17 ml-1">
                              <MultiSelect
                                options={userListOption}
                                value={userListOption.filter((option) => formFields[index].officer.split(',').includes(option.value))} // Convert string to array for selection
                                onChange={(selected) => handleFieldChange(index, 'officer', selected)}
                                overrideStrings={{ selectSomeItems: 'Assign to..' }}
                                hasSelectAll={true}
                                valueRenderer={(selected) =>
                                  selected.length > 0 ? selected.map((s) => s.label).join(', ') : 'Assign to..'
                                }
                              />
                            </div>
                            <div className="w-10 ml-1">
                              <div className="lineForm d-flex justify-content-end">
                                {index === formFields.length - 1 && (
                                  <Button onClick={handleAddField} variant="info" className="sortBtn">
                                    <i className="feather icon-plus m-0" />
                                  </Button>
                                )}
                                {formFields.length !== 1 && (
                                  <Button variant="danger" onClick={() => handleDeleteField(field.discussionId, index)} className="sortBtn">
                                    <i className="feather icon-x m-0" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </Col>
                        </Row>
                      );
                    })}
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
                      <Accordion defaultActiveKey="1">
                        <Accordion.Item eventKey="1">
                          <Accordion.Header className="mb-3">
                            <label className="fs-6 m-0 report-label pointer">Attendance List</label>
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
                                  <th className="w-20">Company</th>
                                  <th className="w-20">Mobile</th>
                                </tr>
                              </thead>
                              <tbody>
                                {attendanceData.map((item, idx) => {
                                  const user = userList?.Result?.find((u) => u.UserId === item.userId);
                                  if (item.userId !== '') {
                                    return (
                                      <tr key={`${item.userId}-${idx}_${Math.random()}`}>
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
                      <Accordion defaultActiveKey="1">
                        <Accordion.Item eventKey="1">
                          <Accordion.Header className="mb-3">
                            <label className="fs-6 m-0 report-label pointer">Discussion Points</label>
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
                                  <th className="w-20">Project</th>
                                  <th className="w-20">Assign To</th>
                                </tr>
                              </thead>
                              <tbody>
                                {formFields.map((item, idx) => {
                                  const userIds = Array.isArray(item.officer) ? item.officer : item.officer.split(',');
                                  return (
                                    <tr key={`${idx}-${idx}-${Math.random()}`}>
                                      <td>{idx + 1}</td>
                                      <td>{item.task}</td>
                                      <td>{item.endDate.split(' ')?.[0]}</td>
                                      <td>
                                        {projectList?.Result?.map(
                                          (proj) => proj.ProjectId === item.projectId && <span>{proj.ProjectTitle}</span>
                                        )}
                                      </td>
                                      <td>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                          {userIds.map((id, index) => {
                                            const user = userList?.Result?.find((u) => u.UserId === id);
                                            return user ? (
                                              <span
                                                key={`${index}__${Math.random()}`}
                                                className="label-user"
                                                onClick={() => handleUserInfo(user)}
                                              >
                                                {user.UserName}
                                              </span>
                                            ) : null;
                                          })}
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
                <div className="showLoader mt-5 mb-5">
                  <div className="text-center mt-5">
                    <Textloading />
                    <h5>Saving Meeting</h5>
                  </div>
                </div>
              )}
            </Stepper>
          )}
        </Col>
      </Row>
      <Modal show={showInfo} onHide={handleClose} animation={true}>
        <Modal.Header className={mode}>
          <Modal.Title>
            <h5>User Details</h5>
          </Modal.Title>
          <span className="pointer" onClick={handleClose}>
            {' '}
            X{' '}
          </span>
        </Modal.Header>
        <Modal.Body className={mode}>
          <Row>
            <Col md={5}>
              <div className="userInfo-left">
                <img src={selectedUser?.ImgPath || selectedUser?.Gender === 'Male' ? male_i : female_i} alt="userImage" />
                <h4>{selectedUser?.UserName}</h4>
                <span>{selectedUser?.DesignationTitle}</span>
              </div>
            </Col>
            <Col md={7}>
              <div className="userInfo-right">
                <div className="userInfo-data">
                  <h6>Division : </h6>
                  <span>{selectedUser?.EmployeeDivisionTitle}</span>
                </div>
                <div className="userInfo-data">
                  <h6>Employment : </h6> <span>{selectedUser?.EmployementTitle}</span>
                </div>
                <div className="userInfo-data">
                  <h6>Gender : </h6>
                  <span>{selectedUser?.Gender}</span>
                </div>
                <div className="userInfo-data">
                  <h6>Mobile : </h6>
                  <span>{selectedUser?.Mobile}</span>
                </div>
                <div className="userInfo-data">
                  <h6>Company : </h6>
                  <span>{selectedUser?.OrganisationTitle}</span>
                </div>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-sm btn-secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default NewPoint;
