import EnhancedTable from 'components/Table';
import React from 'react';
import { Button, Card, Col, Row, Tab, Tabs } from 'react-bootstrap';

const TaskAssigment = () => {
  const GroupHeaders = [
    { id: 'projectName', label: 'Project Name', class: '' },
    { id: 'moduleName', label: 'Module Name', class: '' },
    { id: 'taskName', label: 'Task Name', class: '' },
    { id: 'taskDescription', label: 'Task Description', class: '' },
    { id: 'createdBy', label: 'Created By', class: '' },
    { id: 'createdAt', label: 'Created At', class: '' }
  ];

  const progressHeaders = [
    { id: 'userName', label: 'User Name', class: '' },
    { id: 'taskAssigned', label: 'Task Assigned', class: '' },
    { id: 'taskpending', label: 'Task Pending', class: '' },
    { id: 'taskComplete', label: 'Task Complete', class: '' },
    { id: 'ytaskProgress', label: 'Task Progress', class: '' }
  ];

  return (
    <Row>
      <Col md={12} className="">
        <Tabs defaultActiveKey="assignedTask">
          <Tab eventKey="assignedTask" title="Assigned Tasks">
            <EnhancedTable
              data={[]}
              headers={GroupHeaders}
              headerCss="success"
              enableSno
              enablePagination
              rowactions={(row) => (
                <Button variant="primary" className="float-end btn-sm">
                  Action
                </Button>
              )}
            />
          </Tab>
          <Tab eventKey="UnAssignedTasks" title="UnAssigned Tasks">
            <EnhancedTable
              data={[]}
              headers={GroupHeaders}
              headerCss="info"
              enableSno
              enablePagination
              rowactions={(row) => (
                <Button variant="primary" className="float-end btn-sm">
                  Action
                </Button>
              )}
            />
          </Tab>
          <Tab eventKey="taskProgress" title="Task Progress">
            <EnhancedTable
              data={[]}
              headers={progressHeaders}
              headerCss="warning"
              enableSno
              enablePagination
              rowactions={(row) => (
                <Button variant="primary" className="float-end btn-sm">
                  Action
                </Button>
              )}
            />
          </Tab>
        </Tabs>
      </Col>
    </Row>
  );
};

export default TaskAssigment;
