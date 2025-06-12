import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Dropdown, Form, Image, Row } from 'react-bootstrap';
import pdf_i from '../../../assets/images/pdf_i.svg';
import print_i from '../../../assets/images/print_i.svg';
import refresh from '../../../assets/images/refresh-arrow.png';
import DatePicker from 'react-datepicker';
import { useSelector, useDispatch } from 'react-redux';
import { settingsActions } from '../../../store/settings/settingSlice';
import { userActions } from '../../../store/user/userSlice';
import { moduleActions } from '../../../store/module/moduleSlice';
import { MultiSelect } from 'react-multi-select-component';
import './style.scss';
import AdvanceTable from '../../../components/Table/advanceTable';
import { taskActions } from '../../../store/task/taskSlice';

const TaskList = () => {
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
  const [groupOption, setGroupOption] = useState([]);
  const [projectOption, setProjectOption] = useState([]);
  const [moduleOption, setModuleOption] = useState([]);
  const [statusOption, setStatusOption] = useState([]);
  const [userOption, setuserOption] = useState([]);
  const [groupFilter, setGroupFilter] = useState([]);
  const [projectFilter, setProjectFilter] = useState([]);
  const [moduleFilter, setModuleFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [userFilter, setuserFilter] = useState([]);
  const [resetTrigger, setResetTrigger] = useState(0);

  const divisionDataList = useSelector((state) => state.settings.divisionData);
  const projectDataList = useSelector((state) => state.settings.projectData);
  const statusLists = useSelector((state) => state.settings.statusData);
  const userList = useSelector((state) => state.users.data);
  const moduleList = useSelector((state) => state.module.data);
  const taskList = useSelector((state) => state.task.data);

  useEffect(() => {
    dispatch(taskActions.getTaskInfo(filterPayload));
    dispatch(settingsActions.getDivisionInfo());
    dispatch(settingsActions.getProjectInfo());
    dispatch(settingsActions.getStatusInfo());
    dispatch(userActions.getuserInfo());
    dispatch(moduleActions.getModuleInfo());
  }, []);

  useEffect(() => {
    let options = [];

    if (divisionDataList) {
      options = [];
      divisionDataList?.Result?.forEach((item) => {
        if (item.DivisionTitle) {
          options.push({ label: item.DivisionTitle, value: item.DivisionId });
        }
      });
      setGroupOption([...options]);
    }
    if (projectDataList) {
      options = [];
      projectDataList?.Result?.forEach((item) => {
        if (item.ProjectTitle) {
          options.push({ label: item.ProjectTitle, value: item.ProjectId });
        }
      });
      setProjectOption([...options]);
    }
    if (moduleList) {
      options = [];
      moduleList?.Result?.forEach((item) => {
        if (item.ModuleName) {
          options.push({ label: item.ModuleName, value: item.ModuleId });
        }
      });
      setModuleOption([...options]);
    }
    if (statusLists) {
      options = [];
      statusLists?.Result?.forEach((item) => {
        if (item.StatusTitle) {
          options.push({ label: item.StatusTitle, value: item.StatusId });
        }
      });
      setStatusOption([...options]);
    }
    if (userList) {
      options = [];
      userList?.Result?.forEach((item) => {
        if (item.Status === '1') {
          options.push({ label: item.UserName, value: item.UserId });
        }
      });

      setuserOption([...options]);
    }
  }, [divisionDataList, projectDataList, statusLists, userList, moduleList]);

  useEffect(() => {
    let filterParams = { ...filterPayload };

    // GROUP filter values
    if (groupFilter && groupFilter.length > 0) {
      let groupPayload = '';
      if (groupFilter && groupFilter.length === divisionDataList?.Result?.length) {
        filterParams = { ...filterParams, GroupId: '' };
      } else {
        for (let index = 0; index < groupFilter.length; index++) {
          const element = groupFilter[index];
          groupPayload += `${element.value},`;
        }
        filterParams = {
          ...filterParams,
          GroupId: groupPayload
        };
      }
    } else {
      filterParams = { ...filterParams, GroupId: '' };
    }

    // PROJECT filter values
    if (projectFilter && projectFilter.length > 0) {
      let projectPayload = '';
      if (projectFilter && projectFilter.length === projectDataList?.Result?.length) {
        filterParams = { ...filterParams, ProjectId: '' };
      } else {
        for (let index = 0; index < projectFilter.length; index++) {
          const element = projectFilter[index];
          projectPayload += `${element.value},`;
        }
        filterParams = {
          ...filterParams,
          ProjectId: projectPayload
        };
      }
    } else {
      filterParams = { ...filterParams, ProjectId: '' };
    }

    // MODULE filter values
    if (moduleFilter && moduleFilter.length > 0) {
      let modulePayload = '';
      if (moduleFilter && moduleFilter.length === moduleList?.Result?.length) {
        filterParams = { ...filterParams, ModuleId: '' };
      } else {
        for (let index = 0; index < moduleFilter.length; index++) {
          const element = moduleFilter[index];
          modulePayload += `${element.value},`;
        }
        filterParams = {
          ...filterParams,
          ModuleId: modulePayload
        };
      }
    } else {
      filterParams = { ...filterParams, ModuleId: '' };
    }

    // USER filter values
    if (userFilter && userFilter.length > 0) {
      let userPayload = '';
      if (userFilter && userFilter.length === userList?.Result?.filter((item) => item.Status === '1').length) {
        filterParams = { ...filterParams, UserId: '' };
      } else {
        for (let index = 0; index < userFilter.length; index++) {
          const element = userFilter[index];
          userPayload += `${element.value},`;
        }
        filterParams = {
          ...filterParams,
          UserId: userPayload
        };
      }
    } else {
      filterParams = { ...filterParams, UserId: '' };
    }

    // STATUS filter values
    if (statusFilter && statusFilter.length > 0) {
      let statusPayload = '';
      if (statusFilter && statusFilter.length === statusLists?.Result?.length) {
        filterParams = { ...filterParams, StatusId: '' };
      } else {
        for (let index = 0; index < statusFilter.length; index++) {
          const element = statusFilter[index];
          statusPayload += `${element.value},`;
        }
        filterParams = {
          ...filterParams,
          StatusId: statusPayload
        };
      }
    } else {
      filterParams = { ...filterParams, StatusId: '' };
    }

    setFilterPayload(filterParams);
  }, [groupFilter, projectFilter, moduleFilter, userFilter, statusFilter]);

  const handleGroupFilter = (newSelected) => {
    if (newSelected.length) {
      setGroupFilter(newSelected);
    } else {
      setGroupFilter([]);
    }
  };
  const handleProjectFilter = (newSelected) => {
    if (newSelected.length) {
      setProjectFilter(newSelected);
    } else {
      setProjectFilter([]);
    }
  };
  const handleModuleFilter = (newSelected) => {
    if (newSelected.length) {
      setModuleFilter(newSelected);
    } else {
      setModuleFilter([]);
    }
  };
  const handleuserFilter = (newSelected) => {
    if (newSelected.length) {
      setuserFilter(newSelected);
    } else {
      setuserFilter([]);
    }
  };
  const handleStatusFilter = (newSelected) => {
    if (newSelected.length) {
      setStatusFilter(newSelected);
    } else {
      setStatusFilter([]);
    }
  };

  const [columnDefs] = useState([
    { field: 'ProjectTitle', sortable: true, filter: true, flex: 1 },
    { field: 'ModuleName', sortable: true, filter: true, flex: 1 },
    { field: 'Task', sortable: true, filter: true, flex: 1 },
    { field: 'Description', sortable: true, filter: true, flex: 1 },
    { field: 'StartDate', sortable: true, filter: true, flex: 1 },
    { field: 'Status', sortable: true, filter: true, flex: 1 },
    { field: 'AssignTo', sortable: true, filter: true, flex: 1 },
    { field: 'Remark', flex: 1 }
  ]);

  const triggerReset = () => {
    setResetTrigger((prev) => prev + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('filterPayload', filterPayload);
  };

  const handleStartDate = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
      setFilterPayload({ ...filterPayload, startDate: formattedDate });
    } else {
      setFilterPayload({ ...filterPayload, startDate: '' });
    }
  };

  const handleEndDate = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const formattedDate = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
      setFilterPayload({ ...filterPayload, endDate: formattedDate });
    } else {
      setFilterPayload({ ...filterPayload, endDate: '' });
    }
  };
  return (
    <div>
      <Card className="Recent-Users widget-focus-lg header-info default-shadow">
        <Card.Header className=" py-2">
          <Form noValidate onSubmit={handleSubmit}>
            <div className="filter-row">
              <div className="filter-title">
                <h5>Task List</h5>
              </div>
              <div className="filter-col">
                <MultiSelect
                  options={groupOption}
                  value={groupFilter}
                  onChange={handleGroupFilter}
                  overrideStrings={{
                    selectSomeItems: 'Groups'
                  }}
                  hasSelectAll={true}
                />
              </div>
              <div className="filter-col">
                <MultiSelect
                  options={projectOption}
                  value={projectFilter}
                  onChange={handleProjectFilter}
                  overrideStrings={{
                    selectSomeItems: 'Projects'
                  }}
                  hasSelectAll={true}
                />
              </div>
              <div className="filter-col">
                {' '}
                <MultiSelect
                  options={moduleOption}
                  value={moduleFilter}
                  onChange={handleModuleFilter}
                  overrideStrings={{
                    selectSomeItems: 'Modules'
                  }}
                  hasSelectAll={true}
                />
              </div>
              <div className="filter-col">
                <MultiSelect
                  options={userOption}
                  value={userFilter}
                  onChange={handleuserFilter}
                  overrideStrings={{
                    selectSomeItems: 'Users'
                  }}
                  hasSelectAll={true}
                />
              </div>
              <div className="filter-col">
                <MultiSelect
                  options={statusOption}
                  value={statusFilter}
                  onChange={handleStatusFilter}
                  overrideStrings={{
                    selectSomeItems: 'Status'
                  }}
                  hasSelectAll={true}
                />
              </div>
              <div className="filter-col">
                {' '}
                <DatePicker
                  selected={filterPayload.startDate || null}
                  className={`form-control cfs-14`}
                  onChange={handleStartDate}
                  placeholderText="Start Date"
                  dateFormat="dd-MM-yyyy"
                  name="startDate"
                />
              </div>
              <div className="filter-col">
                {' '}
                <DatePicker
                  selected={filterPayload.endDate || null}
                  className={`form-control cfs-14`}
                  onChange={handleEndDate}
                  placeholderText="End Date"
                  dateFormat="dd-MM-yyyy"
                  name="endDate"
                />
              </div>
              <div className="filter-submit">
                <Button type="submit" size="sm" className="m-0 bg-defaultBlue" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
              <div className="filter-col">
                <div className="d-flex align-items-center justify-content-center">
                  <img src={print_i} alt="" className="img-fluid ml-2 pointer" title="Print" width={30} />
                  <img src={pdf_i} alt="" className="img-fluid ml-1 pointer" width={30} title="Export PDF" />
                  <img
                    src={refresh}
                    alt=""
                    className="img-fluid ml-1 pointer"
                    title="Reset Table"
                    width={30}
                    onClick={() => triggerReset()}
                  />
                </div>
              </div>
            </div>
          </Form>
        </Card.Header>
        <Card.Body className="p-3 pt-0 dark-table">
          <AdvanceTable
            rowData={taskList?.Result || []}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={15}
            paginationPageSizeSelector={[10, 15, 20, 25, 50, 100]}
            resetTrigger={resetTrigger}
            tablethemes="blue"
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default TaskList;
