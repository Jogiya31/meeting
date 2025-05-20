import { useTheme } from '../../../contexts/themeContext';
import EnhancedTable from '../../../components/Table';
import React, { useState } from 'react';
import { Button, Card, CardSubtitle, Col, Row } from 'react-bootstrap';

const TaskApproval = () => {
  const { mode } = useTheme();
  const [search, setSearch] = useState('');
  const GroupHeaders = [
    { id: 'taskId', label: 'Task ID', class: '' },
    { id: 'projectName', label: 'Project Name', class: '' },
    { id: 'ModuleName', label: 'Module Name', class: '' },
    { id: 'taskName', label: 'Task Name', class: '' },
    { id: 'taskDescription', label: 'Task Description', class: '' },
    { id: 'createBy', label: 'Created By', class: '' },
    { id: 'createdAt', label: 'Created At', class: '' }
  ];
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0); // Reset page when search is modified
  };
  return (
    <div>
      <Card className="py-1  w-full header-secondary">
        <Card.Header className="d-flex justify-content-between align-items-center py-2">
          <Card.Title as="h5">Task List</Card.Title>
          <CardSubtitle className="user-table-right">
            <input
              type="text"
              placeholder="Search.."
              value={search}
              onChange={handleSearchChange}
              className="form-control mr-2 userSearch"
            />
            <Button onClick={() => setShowNewTask(true)} className="m-0 fw-bolder c-btn-secondary">
              <i className="feather icon-plus"> Add </i>
            </Button>
          </CardSubtitle>
        </Card.Header>
        <Card.Body className="p-3 pt-0 dark-table">
          <Row>
            <Col md={12} className="">
              <EnhancedTable data={[]} headers={GroupHeaders} headerCss="default" enablePagination enableSelectRows />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TaskApproval;
