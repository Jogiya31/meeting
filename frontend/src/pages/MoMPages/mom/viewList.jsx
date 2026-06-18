import { useEffect, useMemo, useState } from 'react';
import { Table, Button, Collapse, Card, Modal, Form, Row, Col, Pagination } from 'react-bootstrap';
import { Fragment } from 'react';
import { FaSort } from 'react-icons/fa';
import attendanceImg from '../../../assets/images/attendance.png';
import excelImg from '../../../assets/images/excel_i.svg';
import moment from 'moment';
import EnhancedTable from '../../../components/Table';
import { useDispatch, useSelector } from 'react-redux';
import { meetingsActions } from '../../../store/mom/momSlice';
import { userActions } from '../../../store/user/userSlice';
import { settingsActions } from 'store/settings/settingSlice';
import { useStore } from '../../../contexts/DataContext';
import { useTheme } from '../../../contexts/themeContext';
import { exportcustomJsonToExcelwithHeader } from '../../../utils/utils';
import { useAuth } from '../../../contexts/AuthContext';

export default function CollapsibleTable() {
  const { mode } = useTheme();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { filterWith } = useStore();
  const { filterValue } = useStore();
  const [data, setData] = useState([]);
  const [expandedRow, setExpandedRow] = useState({});
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(false);
  const [showAttendanceList, setShowAttendanceList] = useState(false);
  const [attendanceData, setattendanceData] = useState([]);
  const [selectedParentRow, setSelectedParentRow] = useState({});
  const [selectedRow, setselectedRow] = useState({});
  const [formData, setFormData] = useState({
    Status: '',
    Reason: ''
  });
  const [currentMeeting, setcurrentMeeting] = useState(null);

  const MeetingLists = useSelector((state) => state.meetings.data);
  const userLists = useSelector((state) => state.users.data);
  const statusLists = useSelector((state) => state.settings.statusData);
  const designationDataList = useSelector((state) => state.settings.designationData);

  useEffect(() => {
    dispatch(userActions.getuserInfo());
    dispatch(meetingsActions.getMeetingsInfo());
    dispatch(settingsActions.getStatusInfo());
  }, []);

  useEffect(() => {
    if (MeetingLists) {
      setData(MeetingLists?.MeetingDetails?.filter((item) => Number(item.Draft) === 4) || []);
    }
  }, [MeetingLists]);

  const toggleRow = (meetingId) => {
    setExpandedRow((prev) => (prev === meetingId ? null : meetingId));
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleCloseAttendanceList = () => {
    setShowAttendanceList(false);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const parentHeaders = [
    { id: 'MeetingTitle', label: 'Meeting Title', class: 'meetingW' },
    { id: 'MeetingDate', label: 'Date', class: '' },
    { id: 'MeetingStatus', label: 'Total Tasks', class: '' },
    { id: 'MeetingStatus', label: 'Pending Tasks', class: '' },
    { id: 'MeetingStatus', label: 'In Progress Tasks', class: '' },
    { id: 'MeetingStatus', label: 'Completed Tasks', class: '' }
  ];

  const headers = [
    { id: 'Description', label: 'Description', class: 'descriptionW' },
    { id: 'StartDate', label: 'Start Date', class: '' },
    { id: 'EndDate', label: 'End Date', class: '' },
    { id: 'Status', label: 'Status', class: '' },
    { id: 'Reason', label: 'Remark', class: '' },
    { id: 'UserName', label: 'Assigned To', class: '' }
  ];

  // Action handler for each row (for example, Edit)
  const handleActionClick = (parent_row, row) => {
    setselectedRow(row);
    setSelectedParentRow(parent_row);
    setShow(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const filteredRows = useMemo(() => {
    return data
      ?.map((row) => {
        const searchLower = search.toLowerCase();

        // Define searchable fields in the parent object
        const parentFields = ['MeetingTitle'];

        // Check if any parent field contains the search substring
        const parentMatch = parentFields.some((key) => row[key] && row[key].toLowerCase().includes(searchLower));

        // Filter DiscussionsPoint based on Status and Search
        const filteredDiscussions = (row.DiscussionsPoint || []).filter(
          (point) =>
            (filterValue ? Number(point.Status) === Number(filterValue) : true) &&
            (!search || (point.Description && point.Description.toLowerCase().includes(searchLower)))
        );

        // Filter Attendance records based on search
        const filteredAttendance = (row.Attendance || []).filter((attendee) =>
          ['UserName', 'OrganisationTitle', 'DesignationTitle', 'DivisionTitle', 'Mobile'].some(
            (key) => attendee[key] && attendee[key].toLowerCase().includes(searchLower)
          )
        );

        // Ensure the row is included ONLY if discussions match the filterValue
        if (filteredDiscussions.length > 0) {
          return { ...row, DiscussionsPoint: filteredDiscussions, Attendance: filteredAttendance };
        }

        return null; // Exclude row if no DiscussionsPoint matches filterValue
      })
      .filter(Boolean); // Remove null rows
  }, [search, data, filterValue]); // Include filterValue in dependencies

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

  const handleSeletedAttendance = (row) => {
    const updatedAttendance = row.map((item) => ({
      ...item,
      DesignationTitle: item?.DesignationId
        ? item.DesignationId.split(',')
            .map((id) => getDesignation(id))
            .join('/ ')
        : ''
    }));

    setattendanceData(updatedAttendance);
    setShowAttendanceList(!showAttendanceList);
  };

  // Function to export data to Excel

  const exportToExcel = () => {
    const headerMapping = [
      { id: 'UserName', label: 'User Name' },
      { id: 'DesignationTitle', label: 'Designation' },
      { id: 'DivisionTitle', label: 'Division' },
      { id: 'OrganisationTitle', label: 'Organization' },
      { id: 'Mobile', label: 'Mobile' }
    ];

    if (!attendanceData || attendanceData.length === 0) return;

    exportcustomJsonToExcelwithHeader(attendanceData, 'Attendance List', headerMapping, {
      headerLines: [
        `Meeting Title : ${currentMeeting.MeetingTitle}`,
        `Meeting Date : ${moment(currentMeeting?.MeetingDate, 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY')}`,
        `Meeting Time : ${currentMeeting?.MeetingTime}`
      ],
      footerLines: [`Exported On : ${moment().format('DD-MM-YYYY hh:mm A')}`]
    });
  };

  const handleStatusChangeFilter = (e) => {
    filterWith(null);
    const value = e.target.value;
    if (value) {
      const filteredData = filterDataByStatus(MeetingLists?.MeetingDetails, value);
      setData(filteredData || []);
    } else {
      setData(MeetingLists?.MeetingDetails || []);
    }
  };

  const filterDataByStatus = (data, status) => {
    return data
      .map((meeting) => ({
        ...meeting,
        DiscussionsPoint: meeting.DiscussionsPoint.filter((point) => point.Status === status)
      }))
      .filter((meeting) => meeting.DiscussionsPoint.length > 0); // Remove meetings with no matching discussion points
  };

  // Function to count discussion point statuses
  const countStatuses = (data) => {
    const statusCounts = { TotalTasks: 0 };

    if (!Array.isArray(data?.DiscussionsPoint)) {
      return statusCounts; // Return default if DiscussionsPoint is missing
    }

    // Initialize counts dynamically from statusLists
    statusLists?.Result?.forEach((status) => {
      statusCounts[status.StatusTitle] = 0;
    });

    // Count occurrences of each status
    data.DiscussionsPoint.forEach((point) => {
      const statusTitle = statusLists?.Result?.find((s) => String(s.StatusId) === String(point.Status))?.StatusTitle;

      if (statusTitle) {
        statusCounts[statusTitle] = (statusCounts[statusTitle] || 0) + 1;
      }

      statusCounts.TotalTasks++;
    });

    return statusCounts;
  };

  const handleSaveClick = () => {
    const payload = {
      MeetingId: Number(selectedParentRow.MeetingId),
      Description: selectedRow.Description,
      StartDate: selectedRow.StartDate,
      EndDate: selectedRow.EndDate,
      UserId: selectedRow.UserId,
      Reason: formData.Reason,
      Status: Number(formData.Status),
      ProjectId: Number(selectedRow.ProjectId),
      DiscussionId: Number(selectedRow.DiscussionId),
      ModifyBy: user.UserName
    };
    dispatch(meetingsActions.updateDiscussionInfo(payload));
    setTimeout(() => {
      setShow(false);
      dispatch(meetingsActions.getMeetingsInfo());
    }, 500);
  };

  const transformData = (discussions, userLists) => {
    if (!discussions || !Array.isArray(discussions)) return [];

    return discussions.map((discussion) => {
      const userIds = discussion.UserId ? discussion.UserId.split(',').map((id) => id.trim()) : [];

      const officerNames = userIds
        .map((id) => {
          const user = userLists?.Result?.find((user) => String(user.UserId) === String(id));
          return user?.UserName || '';
        })
        .join(', ');

      const statusTitle = statusLists?.Result?.find((item) => String(item.StatusId) === String(discussion.Status))?.StatusTitle || '';
      return {
        ...discussion,
        Status: statusTitle,
        StatusId: discussion.Status,
        EndDate: moment(discussion.EndDate, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD') || '',
        StartDate: moment(discussion.StartDate, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD') || '',
        UserName: officerNames
      };
    });
  };

  const getDesignation = (val) => {
    const data = Array.isArray(designationDataList?.Result) ? designationDataList.Result : Object.values(designationDataList?.Result || {});
    const found = data.find((item) => String(item.DesignationId) === String(val));
    return found ? found.DesignationTitle : '';
  };

  return (
    <>
      <Card className="py-3 px-4 w-full">
        <Row className="tableHeaderSection">
          <Col className="titleSection">
            <h5 className="m-0 p-0">Meeting Lists</h5>
            <select className="form-control w-30 ml-2" onChange={(e) => handleStatusChangeFilter(e)} defaultValue={filterValue}>
              <option value="">All status</option>
              {statusLists?.Result?.filter((item) => item.Status === '1')?.map((item) => (
                <option value={item.StatusId}>{item.StatusTitle}</option>
              ))}
            </select>
          </Col>
          <Col className="actionField">
            <Form.Control
              type="text"
              placeholder="Search meeting Title / Discussion.."
              value={search}
              onChange={handleSearchChange}
              className="searchBox"
            />
          </Col>
        </Row>
        <Row>
          <Col className="dark-table">
            <Table responsive hover>
              <thead>
                <tr className="bg-light ">
                  <th className="" style={{ width: '50px' }}>
                    Sno.
                  </th>
                  {parentHeaders.map((headCell, idx) => (
                    <th className={headCell.class} key={`${headCell}_${idx}`}>
                      <Button variant="link" onClick={() => handleRequestSort(headCell.id)} className="pl-0 pr-0">
                        {headCell.label}
                        {orderBy === headCell.id ? <FaSort className={order === 'desc' ? 'rotate-180' : ''} /> : null}
                      </Button>
                    </th>
                  ))}
                  <th className="" style={{ width: '100px' }}>
                    Attendance
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((parent_row, idx) => {
                  const statusCounts = countStatuses(parent_row);
                  return (
                    <Fragment key={`${parent_row}__${parent_row.id}_${Math.random()}`}>
                      <tr key={`${parent_row}__${parent_row.id}_${Math.random()}`}>
                        <td className="text-center pointer">
                          <span
                            variant="link"
                            className="d-flex justify-content-center align-items-center pointer"
                            onClick={() => toggleRow(parent_row.MeetingId)}
                          >
                            <span> {idx + 1} </span>
                            {expandedRow === parent_row.MeetingId ? (
                              <i className="feather icon-chevron-down pointer" />
                            ) : (
                              <i className="feather icon-chevron-right pointer" />
                            )}
                          </span>
                        </td>
                        <td style={{ wordBreak: 'break-word', whiteSpace: 'normal', maxWidth: '250px' }}>
                          <span className="pointer" onClick={() => toggleRow(parent_row.MeetingId)}>
                            {parent_row.MeetingTitle}
                          </span>
                        </td>
                        <td>{moment(parent_row.MeetingDate, 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY')}</td>
                        <td>
                          <span to="#" className="count text-c-blue default-text-shadow f-16 fw-bolder">
                            {statusCounts.TotalTasks}
                          </span>
                        </td>
                        <td>
                          <span to="#" className="count text-c-brown default-text-shadow f-16 fw-bolder">
                            {statusCounts.Pending}
                          </span>
                        </td>
                        <td>
                          <span to="#" className="count text-c-brown default-text-shadow f-16 fw-bolder">
                            {statusCounts.Inprogress}
                          </span>
                        </td>
                        <td>
                          <span to="#" className="count text-c-green default-text-shadow f-16 fw-bolder">
                            {statusCounts.Completed}
                          </span>
                        </td>

                        <td className="text-center">
                          <img
                            title="Attendance"
                            src={attendanceImg}
                            className="attendance pointer"
                            onClick={() => {
                              handleSeletedAttendance(parent_row.Attendance);
                              setcurrentMeeting(parent_row);
                            }}
                            alt=""
                          />
                        </td>
                      </tr>

                      <tr>
                        <td colSpan={parentHeaders.length + 2} className="p-0">
                          <Collapse in={expandedRow === parent_row.MeetingId}>
                            <div className="p-3 bg-light border transition-all duration-300 ease-in-out inner-table view-Meetings">
                              {userLists?.Result ? (
                                <EnhancedTable
                                  data={transformData(parent_row.DiscussionsPoint, userLists) || []}
                                  headers={headers}
                                  headerCss="cinnerTable"
                                  enableSno
                                  rowactions={(row) => (
                                    <Button
                                      variant="primary"
                                      onClick={() => handleActionClick(parent_row, row)}
                                      className="float-end btn-sm"
                                    >
                                      Action
                                    </Button>
                                  )}
                                />
                              ) : (
                                ''
                              )}
                            </div>
                          </Collapse>
                        </td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Pagination className="custom-pagination">
          <div className="d-flex align-items-center">
            Page Limit:
            <Form.Control as="select" value={rowsPerPage} onChange={handleChangeRowsPerPage} className="text-center limit ml-1">
              {[5, 10, 25, 50].map((rowsPerPageOption) => (
                <option key={rowsPerPageOption} value={rowsPerPageOption}>
                  {rowsPerPageOption}
                </option>
              ))}
            </Form.Control>
          </div>
          <div className="d-flex align-items-center">
            Pages:
            <div className="flex ml-1">
              <Pagination.Prev title="Previous Page" onClick={() => handleChangePage(page - 1)} disabled={page === 0} />
              {renderPaginationItems()}
              <Pagination.Next title="Next Page" onClick={() => handleChangePage(page + 1)} disabled={page >= totalPages - 1} />
            </div>
          </div>
        </Pagination>
      </Card>
      <Modal show={show} onHide={handleClose} animation={true} backdrop="static" keyboard={false}>
        <Modal.Header className={mode}>
          <Modal.Title>
            <h5>Update Details</h5>
          </Modal.Title>
          <span className="pointer" onClick={handleClose}>
            X
          </span>
        </Modal.Header>
        <Modal.Body className={mode}>
          <div className="userModalBody">
            <div className="info">
              <div className="d-flex justify-content-between mb-3 w-full">
                <h6 className="bold-text mb-0 p-0 mr-1 w-30">Task Assign To : </h6>
                <span className="w-70"> {selectedRow.UserName}</span>
              </div>
              <div className="d-flex justify-content-between mb-3  w-full">
                <h6 className="bold-text mb-0 p-0 mr-1 w-30">Expected End Date : </h6> <span className="w-70"> {selectedRow.EndDate}</span>
              </div>
              <div className="d-flex justify-content-between mb-3  w-full">
                <h6 className="bold-text  mb-0 p-0 mr-1 w-30 ">Task Discription : </h6>{' '}
                <span className="w-70">{selectedRow.Description}</span>
              </div>
            </div>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                className="form-control mb-3" // Add error class for officer field
                name="Status"
                defaultValue={Number(selectedRow?.StatusId)}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select status
                </option>
                {statusLists?.Result?.filter((item) => item.Status === '1')?.map((item) => (
                  <option value={item.StatusId}>{item.StatusTitle}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Remark</Form.Label>
              <Form.Control
                as="textarea"
                defaultValue={selectedRow?.Reason}
                rows={3}
                name="Reason"
                placeholder="Enter text here.."
                onChange={handleChange}
              />
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer className={mode}>
          <Button className="btn-info" onClick={() => handleSaveClick()}>
            Save
          </Button>
          <Button className="btn-secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal size="xl" show={showAttendanceList} onHide={handleCloseAttendanceList} backdrop="static" keyboard={false}>
        <Modal.Header className={mode}>
          <Modal.Title className="w-100">
            <div className="d-flex justify-content-between ">
              <h5 className="m-0">Attendance List</h5>
              <img src={excelImg} className="mr-1 pointer" width={25} onClick={exportToExcel} alt="" title="Export Excel" />
            </div>
          </Modal.Title>
          <span className="pointer" onClick={handleCloseAttendanceList}>
            X
          </span>
        </Modal.Header>
        <Modal.Body className={`inner-table ${mode}`}>
          <div>
            <label className="text-dark">
              <span className="fw-bolder"> Meeting Title :</span> <span>{currentMeeting?.MeetingTitle}</span>
            </label>
          </div>
          <div>
            <label className="text-dark">
              <span className="fw-bolder"> Meeting Date:</span>{' '}
              <span>{moment(currentMeeting?.MeetingDate, 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY')}</span>{' '}
            </label>
          </div>
          <div>
            <label className="text-dark">
              <span className="fw-bolder"> Meeting Time:</span> <span>{currentMeeting?.MeetingTime}</span>
            </label>
          </div>

          <Table responsive hover className=" ">
            <thead>
              <tr className="" style={{ height: '45px' }}>
                <th className="" style={{ width: '50px' }}>
                  Sno
                </th>
                <th className="w-30">Name</th>
                <th className="w-20">Designation</th>
                <th className="w-10">Division</th>
                <th className="w-20">Company</th>
                <th className="w-20">Mobile</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((item, idx) => {
                if (item.userId !== '') {
                  return (
                    <tr key={`${item?.division}${idx}`}>
                      <td>{idx + 1}</td>
                      <td>{item?.UserName}</td>
                      <td>
                        {item?.DesignationId?.split(',')
                          .map((id) => getDesignation(id))
                          .join('/ ')}
                      </td>
                      <td>{item?.DivisionTitle}</td>
                      <td>{item?.OrganisationTitle}</td>
                      <td>{item?.Mobile}</td>
                    </tr>
                  );
                }
                return;
              })}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </>
  );
}
