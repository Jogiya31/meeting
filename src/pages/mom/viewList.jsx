import { useEffect, useMemo, useState } from 'react';
import { Table, Button, Collapse, Card, Modal, Form, Row, Col, Pagination, InputGroup } from 'react-bootstrap';
import { Fragment } from 'react';
import { FaSort } from 'react-icons/fa';
import attendanceImg from '../../assets/images/attendance.png';
import excelImg from '../../assets/images/excel_i.svg';
import * as XLSX from 'xlsx';
import moment from 'moment';
import EnhancedTable from '../../components/Table';
import { useDispatch, useSelector } from 'react-redux';
import { meetingsActions } from '../../store/mom/momSlice';
import { userActions } from '../../store/user/userSlice';
import { settingsActions } from 'store/settings/settingSlice';
import { useStore } from '../../contexts/DataContext';

export default function CollapsibleTable() {
  const Role = localStorage.getItem('role');
  const dispatch = useDispatch();
  const { filterWith } = useStore();
  const { filterValue } = useStore();
  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(false);
  const [showAttendanceList, setShowAttendanceList] = useState(false);
  const [attendanceData, setattendanceData] = useState([]);
  const [selectedRow, setselectedRow] = useState({});
  const [formData, setFormData] = useState({
    Status: '',
    Reason: ''
  });
  const MeetingLists = useSelector((state) => state.meetings.data);
  const userLists = useSelector((state) => state.users.data);
  const statusLists = useSelector((state) => state.settings.statusData);

  useEffect(() => {
    dispatch(userActions.getuserInfo());
    dispatch(meetingsActions.getMeetingsInfo());
    dispatch(settingsActions.getStatusInfo());
  }, []);

  useEffect(() => {
    if (MeetingLists) {
      setData(MeetingLists?.MeetingDetails || []);
    }
  }, [MeetingLists]);

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
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
    { id: 'MeetingTitle', label: 'Meeting Title' },
    { id: 'MeetingDate', label: 'Date' },
    { id: 'MeetingStatus', label: 'Total Tasks' },
    { id: 'MeetingStatus', label: 'Pending Tasks' },
    { id: 'MeetingStatus', label: 'Completed Tasks' }
  ];

  const headers = [
    { id: 'Description', label: 'Description' },
    { id: 'StartDate', label: 'Start Date' },
    { id: 'EndDate', label: 'End Date' },
    { id: 'Status', label: 'Status' },
    { id: 'Reason', label: 'Remark' },
    { id: 'UserName', label: 'Assigned To' }
  ];

  // Action handler for each row (for example, Edit)
  const handleActionClick = (row) => {
    setselectedRow(row);
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
    setattendanceData(row);
    setShowAttendanceList(!showAttendanceList);
  };

  // Function to export data to Excel
  const exportToExcel = () => {
    const userHeaders = [
      { id: 'username', label: 'User Name' },
      { id: 'designation', label: 'Designation' },
      { id: 'division', label: 'Division' },
      { id: 'organization', label: 'Organization' },
      { id: 'mobile', label: 'Mobile' }
    ];
    const ws = XLSX.utils.json_to_sheet(
      attendanceData.map((row) => {
        const rowData = {};
        userHeaders.forEach((header) => {
          rowData[header.label] = row[header.id];
        });
        return rowData;
      })
    );
    const date = new Date();
    const CurrentTimeStamp = moment(date).format('DD-MM-YYYY HH:MM a');

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');

    // Export file
    XLSX.writeFile(wb, `Meeting Attendance ${CurrentTimeStamp}.xlsx`);
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
      DiscussionId: selectedRow.DiscussionId,
      Reason: formData.Reason,
      ModifyBy: Role,
      Status: formData.Status
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
                  <th className="" style={{ width: '50px' }}></th>
                  {parentHeaders.map((headCell, idx) => (
                    <th className="" key={`${headCell}_${idx}`}>
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
                {visibleRows.map((row, idx) => {
                  const statusCounts = countStatuses(row);
                  return (
                    <Fragment key={`${row}__${row.id}_${Math.random()}`}>
                      <tr key={`${row}__${row.id}_${Math.random()}`}>
                        <td className="text-center">
                          <span variant="link" onClick={() => toggleRow(row.MeetingId)}>
                            {expandedRows[row.MeetingId] ? (
                              <i className="feather icon-chevron-down list-toggle-direction" />
                            ) : (
                              <i className="feather icon-chevron-right list-toggle-direction" />
                            )}
                          </span>
                        </td>
                        <td>
                          <span className="pointer" onClick={() => toggleRow(row.MeetingId)}>
                            {row.MeetingTitle}
                          </span>
                        </td>
                        <td>{moment(row.MeetingDate, 'DD-MM-YYYY HH:mm:ss').format('DD-MM-YYYY')}</td>
                        <td>
                          <label to="#" className="label total-bg text-white f-12 fw-bolder">
                            {statusCounts.TotalTasks}
                          </label>
                        </td>
                        <td>
                          <label to="#" className="label pending-bg text-white f-12 fw-bolder">
                            {statusCounts.Pending}
                          </label>
                        </td>
                        <td>
                          <label to="#" className="label completed-bg text-white f-12 fw-bolder">
                            {statusCounts.Completed}
                          </label>
                        </td>

                        <td className="text-center">
                          <img
                            title="Attendance"
                            src={attendanceImg}
                            className="attendance pointer"
                            onClick={() => handleSeletedAttendance(row.Attendance)}
                            alt=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={7} className="p-0">
                          <Collapse in={expandedRows[row.MeetingId]}>
                            <div className="p-3 bg-light border transition-all duration-300 ease-in-out inner-table">
                              {userLists?.Result ? (
                                <EnhancedTable
                                  data={transformData(row.DiscussionsPoint, userLists) || []}
                                  headers={headers}
                                  headerCss="cinnerTable"
                                  enableSno
                                  rowactions={(row) => (
                                    <Button variant="primary" onClick={() => handleActionClick(row)} className="float-end btn-sm">
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
      </Card>
      <Modal show={show} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h5>Update Details</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="userModalBody">
            <div className="info">
              <div className="d-flex align-items-center mb-3">
                <h6 className="bold-text mb-0 p-0 mr-1">Expected End Date : </h6> {selectedRow.EndDate}
              </div>
              <div className="d-flex align-items-center mb-3">
                <h6 className="bold-text  mb-0 p-0 mr-1">Task Discription : </h6> {selectedRow.Description}
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
        <Modal.Footer>
          <Button className="btn-info" onClick={() => handleSaveClick()}>
            Save
          </Button>
          <Button className="btn-secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal size="xl" show={showAttendanceList} onHide={handleCloseAttendanceList}>
        <Modal.Header closeButton>
          <Modal.Title className="w-100">
            <div className="d-flex justify-content-between ">
              <h5 className="m-0">Attendance List</h5>
              <img src={excelImg} className="mr-1" width={25} onClick={exportToExcel} alt="" />
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="inner-table">
          <Table responsive hover className="">
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
                      <td>{item?.DesignationTitle}</td>
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
