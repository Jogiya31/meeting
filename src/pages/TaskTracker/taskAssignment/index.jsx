import EnhancedTable from 'components/Table';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Tab, Tabs } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { taskActions } from '../../../store/task/taskSlice';
import { useSelector } from 'react-redux';

const TaskAssigment = () => {
  const dispatch = useDispatch();

  const [filterPayload, setFilterPayload] = useState({
    ProjectId: '',
    ModuleId: '',
    Status: '',
    UserId: '',
    StartDate: '',
    EndDate: '',
    GroupId: ''
  });
  const [assignedTask, setassignedTask] = useState([]);
  const [UnAssignedTasks, setUnAssignedTasks] = useState([]);

  const taskList = useSelector((state) => state.task.data);

  useEffect(() => {
    dispatch(taskActions.getTaskInfo(filterPayload));
  }, []);

  useEffect(() => {
    taskList?.Result.map((item) => {
      if (item.AssignTo !== '') {
        setassignedTask((prev) => [...prev, item]);
      } else {
        setUnAssignedTasks((prev) => [...prev, item]);
      }
    });
  }, [taskList]);

  const GroupHeaders = [
    { id: 'ProjectTitle', label: 'Project Name', class: '' },
    { id: 'ModuleName', label: 'Module Name', class: '' },
    { id: 'Task', label: 'Task Name', class: '' },
    { id: 'taskDescription', label: 'Task Description', class: '' },
    { id: 'createdBy', label: 'Created By', class: '' },
    { id: 'StartDate', label: 'Created At', class: '' }
  ];

  const progressHeaders = [
    { id: 'userName', label: 'User Name', class: '' },
    { id: 'taskAssigned', label: 'Task Assigned', class: '' },
    { id: 'taskpending', label: 'Task Pending', class: '' },
    { id: 'taskComplete', label: 'Task Complete', class: '' },
    { id: 'taskProgress', label: 'Task Progress', class: '' }
  ];

  return (
    <Card className="w-full  w-full header-info  default-shadow">
      <Row>
        <Col md={12} className="">
          <Tabs defaultActiveKey="assignedTask">
            <Tab eventKey="assignedTask" title="Assigned Tasks">
              <EnhancedTable
                data={assignedTask || []}
                headers={GroupHeaders}
                headerCss="success"
                enablePagination
                PerPagelimit={10}
                rowactions={(row) => (
                  <Button variant="primary" className="float-end btn-sm">
                    Action
                  </Button>
                )}
              />
            </Tab>
            <Tab eventKey="UnAssignedTasks" title="UnAssigned Tasks">
              <EnhancedTable
                data={UnAssignedTasks || []}
                headers={GroupHeaders}
                headerCss="info"
                enablePagination
                PerPagelimit={10}
                rowactions={(row) => (
                  <Button variant="primary" className="float-end btn-sm">
                    Action
                  </Button>
                )}
              />
            </Tab>
            <Tab eventKey="taskProgress" title="Task Progress">
              <EnhancedTable
                data={taskList?.Result || []}
                headers={progressHeaders}
                headerCss="warning"
                enablePagination
                PerPagelimit={10}
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
    </Card>
  );
};

export default TaskAssigment;
