import React, { useState } from 'react';
import { Pagination, Form } from 'react-bootstrap';
import './style.scss';

const CustomPagination = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleChangePage = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0); // Reset to first page
  };

  const renderPaginationItems = () => {
    const items = [];

    for (let i = 0; i < totalPages; i++) {
      items.push(
        <Pagination.Item key={i} active={i === page} onClick={() => handleChangePage(i)}>
          {i + 1}
        </Pagination.Item>
      );
    }

    return items;
  };

  const paginatedData = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <>
      {/* Your table or list */}
      <div>
        {paginatedData.map((item, idx) => (
          <div key={idx}>{item.name}</div>
        ))}
      </div>

      {/* Pagination UI */}
      <Pagination className="custom-pagination d-flex justify-content-between align-items-center mt-3">
        <div className="d-flex align-items-center gap-2">
          <span>Page Size:</span>
          <Form.Control as="select" value={rowsPerPage} onChange={handleChangeRowsPerPage} style={{ width: '80px' }}>
            {[5, 10, 25, 50].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Form.Control>
        </div>

        <div className="d-flex align-items-center gap-1">
          <Pagination.First onClick={() => handleChangePage(0)} disabled={page === 0} />
          <Pagination.Prev onClick={() => handleChangePage(page - 1)} disabled={page === 0} />
          {renderPaginationItems()}
          <Pagination.Next onClick={() => handleChangePage(page + 1)} disabled={page >= totalPages - 1} />
          <Pagination.Last onClick={() => handleChangePage(totalPages - 1)} disabled={page >= totalPages - 1} />
        </div>
      </Pagination>
    </>
  );
};

export default CustomPagination;
