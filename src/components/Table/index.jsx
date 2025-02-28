import React, { useState } from 'react';
import { Table, Pagination, Button, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { FaSort } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import './style.scss';

function EnhancedTable({
  tableTitle,
  leftHeaderAction,
  enableSelectRows,
  enableExports,
  enableSearch,
  enablePagination,
  rowactions,
  data,
  headers,
  headerCss,
  enableSno
}) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState('');

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  // Filter rows based on search input
  const filteredRows = data?.filter((row) => {
    return headers.some((header) => row[header.id] && row[header.id].toString().toLowerCase().includes(search.toLowerCase()));
  });

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

  const visibleRows = [...filteredRows]
    .sort((a, b) => {
      if (orderBy === '') {
        return 0;
      }
      if (order === 'asc') {
        return a[orderBy] < b[orderBy] ? -1 : 1;
      }
      return a[orderBy] > b[orderBy] ? -1 : 1;
    })
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const numSelected = selected.length;

  const renderPaginationItems = () => {
    const pagesToShow = 3;
    const startPage = Math.max(0, Math.min(page - Math.floor(pagesToShow / 2), totalPages - pagesToShow));

    const validPages = [];
    for (let i = startPage; i < startPage + pagesToShow; i++) {
      if (i * rowsPerPage < filteredRows.length) {
        validPages.push(i);
      }
    }

    return validPages.map((pageIndex) => (
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

  // Function to export data to Excel
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filteredRows.map((row) => {
        const rowData = {};
        headers.forEach((header) => {
          rowData[header.label] = row[header.id];
        });
        return rowData;
      })
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Desserts');

    // Export file
    XLSX.writeFile(wb, 'desserts_table.xlsx');
  };

  return (
    <div>
      <Row className="tableHeaderSection">
        <Col className="titleSection">
          {tableTitle && <h5 className="m-0 p-0">{tableTitle}</h5>} {leftHeaderAction}
        </Col>
        <Col className="actionField">
          {enableSearch && (
            <Form.Control type="text" placeholder="Search.." value={search} onChange={handleSearchChange} className="searchBox" />
          )}
          {enableExports && (
            <Button onClick={exportToExcel} className="ml-2">
              Export to Excel
            </Button>
          )}
        </Col>
      </Row>
      <Table responsive hover>
        <thead>
          <tr>
            {enableSelectRows && (
              <th className={`${headerCss || 'grey-bg'}`}>
                <Form.Check
                  className="p-0 text-center"
                  type="checkbox"
                  checked={selected.length > 0 && selected.length === filteredRows.length}
                  indeterminate={selected.length > 0 && selected.length < filteredRows.length ? 'true' : undefined}
                  onChange={handleSelectAllClick}
                />
              </th>
            )}
            {enableSno && <th className={`${headerCss || 'grey-bg'}`}>Sno</th>}
            {headers.map((headCell) => (
              <th key={headCell.id} className={`${headerCss || 'grey-bg'}`}>
                <Button variant="link" onClick={() => handleRequestSort(headCell.id)} className="pl-0 pr-0">
                  {headCell.label}
                  {orderBy === headCell.id ? <FaSort className={order === 'desc' ? 'rotate-180' : ''} /> : null}
                </Button>
              </th>
            ))}
            {/* Add a new column for Actions */}
            {rowactions && <th className={`${headerCss || 'grey-bg'} text-end action`}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row, idx) => {
            const isItemSelected = selected.includes(row.id);
            const count = idx + 1;
            return (
              <tr key={row.id} className={isItemSelected ? 'table-active' : ''}>
                {enableSelectRows && (
                  <td>
                    <Form.Check type="checkbox" checked={isItemSelected} className="p-0 text-center" onChange={() => handleClick(row.id)} />
                  </td>
                )}
                {enableSno && <td>{count}</td>}
                {headers.map((header) => (
                  <td key={header.id}>{row[header.id]}</td>
                ))}
                {/* Add action button to each row and float it to the right */}
                {rowactions && <td className="text-end action">{rowactions(row)}</td>}
              </tr>
            );
          })}
        </tbody>
      </Table>
      {enablePagination && (
        <Pagination className="custom-pagination">
          <InputGroup className="pagination-select">
            <Form.Control as="select" value={rowsPerPage} onChange={handleChangeRowsPerPage} className="text-center">
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
      )}
    </div>
  );
}

export default EnhancedTable;
