import { useMemo, useState } from 'react';
import { Table, Button, Collapse, Card, Modal, Form, Row, Col, Pagination, InputGroup } from 'react-bootstrap';
import { Fragment } from 'react';
import { FaSort } from 'react-icons/fa';
import attendanceImg from '../../assets/images/attendance.png';
import excelImg from '../../assets/images/excel_i.svg';
import * as XLSX from 'xlsx';
import moment from 'moment';
import EnhancedTable from '../../components/Table';
import Data from '../../utils/data';

export default function CollapsibleTable() {
  const [data, setData] = useState(Data || []);
  const [expandedRows, setExpandedRows] = useState({});
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');
  const [show, setShow] = useState(false);
  const [showAttendanceList, setShowAttendanceList] = useState(false);
  const [attendanceData, setattendanceData] = useState([]);

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

  const handleShow = () => setShow(true);

  const parentHeaders = [
    { id: 'title', label: 'Meeting Title' },
    { id: 'date', label: 'Date' },
    { id: 'In Progress', label: 'In Progress' },
    { id: 'Completed', label: 'Completed' },
    { id: 'Hold', label: 'Hold' }
  ];

  const headers = [
    { id: 'description', label: 'Description' },
    { id: 'startDate', label: 'Start Date' },
    { id: 'endDate', label: 'End Date' },
    { id: 'status', label: 'Status' },
    { id: 'reasion', label: 'Remark' },
    { id: 'userId', label: 'Reporting Officer' }
  ];

  // Action handler for each row (for example, Edit)
  const handleActionClick = (row) => {
    console.log('Action clicked for row:', row);
    // Access row.id or any other row property here
    handleShow();
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

  // Filter rows based on search input
  const filteredRows = useMemo(() => {
    return data?.filter((row) =>
      parentHeaders.some((phead) => row[phead.id] && row[phead.id].toString().toLowerCase().includes(search.toLowerCase()))
    );
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

  const handleSeletedAttendance = (row) => {
    console.log('row', row);
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
    const value = e.target.value;
    if (value) {
      const filteredData = filterDataByStatus(Data, value);
      setData(filteredData || []);
    } else {
      setData(Data || []);
    }
  };

  const filterDataByStatus = (data, status) => {
    return data
      .map((meeting) => ({
        ...meeting,
        discussionPoints: meeting.discussionPoints.filter((point) => point.status === status)
      }))
      .filter((meeting) => meeting.discussionPoints.length > 0); // Remove meetings with no matching discussion points
  };

  // Function to count discussion point statuses
  const countStatuses = (data) => {
    const statusCounts = {
      Pending: 0,
      Completed: 0,
      Hold: 0
    };

    data.discussionPoints.forEach((point) => {
      if (statusCounts.hasOwnProperty(point.status)) {
        statusCounts[point.status]++;
      }
    });

    return statusCounts;
  };

  return (
    <>
      <Card className="py-3 px-4 w-full">
        <Row className="tableHeaderSection">
          <Col className="titleSection">
            <h5 className="m-0 p-0">Meeting Lists</h5>
            <select className="form-control w-30 ml-2" onChange={(e) => handleStatusChangeFilter(e)}>
              <option value="">Select Status</option>
              <option value={'Pending'}>Pending</option>
              <option value={'Completed'}>Completed</option>
              <option value={'Hold'}>Hold</option>
            </select>
          </Col>
          <Col className="actionField">
            <Form.Control type="text" placeholder="Search.." value={search} onChange={handleSearchChange} className="searchBox" />
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
                    <Fragment key={`${row}__${row.id}`}>
                      <tr>
                        <td className="text-center">
                          <span variant="link" onClick={() => toggleRow(row.id)}>
                            {expandedRows[row.id] ? (
                              <i className="feather icon-chevron-down list-toggle-direction" />
                            ) : (
                              <i className="feather icon-chevron-right list-toggle-direction" />
                            )}
                          </span>
                        </td>
                        <td>{row.title}</td>
                        <td>{row.date}</td>
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
                        <td>
                          {' '}
                          <label to="#" className="label hold-bg text-white f-12 fw-bolder">
                            {statusCounts.Hold}
                          </label>
                        </td>
                        <td className="text-center">
                          <img
                            src={attendanceImg}
                            className="attendance pointer"
                            onClick={() => handleSeletedAttendance(row.attendance)}
                            alt=""
                          />
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={7} className="p-0">
                          <Collapse in={expandedRows[row.id]}>
                            <div className="p-3 bg-light border transition-all duration-300 ease-in-out inner-table">
                              <EnhancedTable
                                data={row.discussionPoints || []}
                                headers={headers}
                                headerCss="cinnerTable"
                                enableSno
                                rowactions={(row) => (
                                  <Button variant="primary" onClick={() => handleActionClick(row)} className="float-end btn-sm">
                                    Action
                                  </Button>
                                )}
                              />
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
          <Modal.Title>Update Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="userModalBody">
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                className="form-control mb-3" // Add error class for officer field
              >
                <option value="">Select status</option>
                <option value="1">In Progress</option>
                <option value="2">Complete</option>
                <option value="3">On Hold</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Remark</Form.Label>
              <Form.Control as="textarea" placeholder="Enter text here.." rows={3} />
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn-info">Save</Button>
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
                <th className="w-20">Organization</th>
                <th className="w-20">Mobile</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((item, idx) => {
                if (item.userId !== '') {
                  return (
                    <tr key={`${item?.division}${idx}`}>
                      <td>{idx + 1}</td>
                      <td>{item?.username}</td>
                      <td>{item?.designation}</td>
                      <td>{item?.division}</td>
                      <td>{item?.organization}</td>
                      <td>{item?.mobile}</td>
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
