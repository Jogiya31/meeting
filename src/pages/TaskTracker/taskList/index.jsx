import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Dropdown, Form, Image, Row } from 'react-bootstrap';
import pdf_i from '../../../assets/images/pdf_i.svg';
import print_i from '../../../assets/images/print_i.svg';
import setting from '../../../assets/images/settings.png';
import EnhancedTable from '../../../components/Table';
import DatePicker from 'react-datepicker';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { settingsActions } from '../../../store/settings/settingSlice';
import { userActions } from '../../../store/user/userSlice';
import { moduleActions } from '../../../store/module/moduleSlice';
import { MultiSelect } from 'react-multi-select-component';
import './style.scss';

const TaskList = () => {
  const dispatch = useDispatch();

  const [filterPayload, setFilterPayload] = useState({
    GroupId: '',
    ProjectId: '',
    ModuleId: '',
    StatusId: '',
    UserId: '',
    startDate: '',
    endDate: ''
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

  const divisionDataList = useSelector((state) => state.settings.divisionData);
  const projectDataList = useSelector((state) => state.settings.projectData);
  const statusLists = useSelector((state) => state.settings.statusData);
  const userList = useSelector((state) => state.users.data);
  const moduleList = useSelector((state) => state.module.data);

  useEffect(() => {
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

  const taskHeaders = [
    { id: 'projectName', label: 'Project Name', class: '' },
    { id: 'moduleName', label: 'Module Name', class: '' },
    { id: 'taskName', label: 'Task Name', class: '' },
    { id: 'taskDescription', label: 'Task Description', class: '' },
    { id: 'assignedDate', label: 'Assigned/Expected Date', class: '' },
    { id: 'status', label: 'Status', class: '' },
    { id: 'assignedTo', label: 'Assigned To', class: '' },
    { id: 'userRemarks', label: 'User Remarks', class: '' }
  ];

  const [visibleColumns, setVisibleColumns] = useState(
    taskHeaders.map((header) => header.id) // Initially show all columns
  );
  const filteredHeaders = taskHeaders.filter((header) => visibleColumns.includes(header.id));

  const toggleColumn = (columnId) => {
    setVisibleColumns(
      (prev) =>
        prev.includes(columnId)
          ? prev.filter((id) => id !== columnId) // remove column
          : [...prev, columnId] // add column
    );
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
            {/* <Row className="d-flex align-items-center">
              <Col>
                <h5>Task List</h5>
              </Col>
              <Col>
                <Form.Group>
                  <MultiSelect
                    options={groupOption}
                    value={groupFilter}
                    onChange={handleGroupFilter}
                    overrideStrings={{
                      selectSomeItems: 'Groups'
                    }}
                    hasSelectAll={true}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <MultiSelect
                    options={projectOption}
                    value={projectFilter}
                    onChange={handleProjectFilter}
                    overrideStrings={{
                      selectSomeItems: 'Projects'
                    }}
                    hasSelectAll={true}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <MultiSelect
                    options={moduleOption}
                    value={moduleFilter}
                    onChange={handleModuleFilter}
                    overrideStrings={{
                      selectSomeItems: 'Modules'
                    }}
                    hasSelectAll={true}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <MultiSelect
                    options={userOption}
                    value={userFilter}
                    onChange={handleuserFilter}
                    overrideStrings={{
                      selectSomeItems: 'Users'
                    }}
                    hasSelectAll={true}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <MultiSelect
                    options={statusOption}
                    value={statusFilter}
                    onChange={handleStatusFilter}
                    overrideStrings={{
                      selectSomeItems: 'Statuss'
                    }}
                    hasSelectAll={true}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <DatePicker
                    selected={TaskformData.startDate || null}
                    className={`form-control cfs-14`}
                    onChange={handleStartDate}
                    placeholderText="Start Date"
                    dateFormat="dd-MM-yyyy"
                    name="startDate"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <DatePicker
                    selected={TaskformData.endDate || null}
                    className={`form-control cfs-14`}
                    onChange={handleEndDate}
                    placeholderText="End Date"
                    dateFormat="dd-MM-yyyy"
                    name="endDate"
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="d-flex  justify-content-between align-items-center">
                  <Button variant="primary" type="submit" size="sm" className="m-0">
                    Submit
                  </Button>
                </Form.Group>
              </Col>
              <Col>
                <div className="d-flex justify-content-center align-items-center">
                  <img src={print_i} alt="" className="img-fluid ml-2 pointer" width={30} />
                  <img src={pdf_i} alt="" className="img-fluid ml-1 pointer" width={30} />
                  <Dropdown className="table-column-setting ml-1 mr-1">
                    <Dropdown.Toggle variant="light" id="dropdown-basic" className="border-0 p-0 setting-btn">
                      <Image src={setting} alt="" width={24} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {taskHeaders.map((item, idx) => (
                        <Form.Check
                          key={item.id}
                          type="switch"
                          id={`custom-switch-${idx}`}
                          label={item.label}
                          checked={visibleColumns.includes(item.id)}
                          onChange={() => toggleColumn(item.id)}
                        />
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Col>
            </Row> */}
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
                <Button variant="primary" type="submit" size="sm" className="m-0" onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
              <div className="filter-col">
                <div className="d-flex align-items-center justify-content-center">
                  <img src={print_i} alt="" className="img-fluid ml-2 pointer" width={30} />
                  <img src={pdf_i} alt="" className="img-fluid ml-1 pointer" width={30} />
                  <Dropdown className="table-column-setting ml-1 mr-1">
                    <Dropdown.Toggle variant="light" id="dropdown-basic" className="border-0 p-0 setting-btn">
                      <Image src={setting} alt="" width={24} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {taskHeaders.map((item, idx) => (
                        <Form.Check
                          key={item.id}
                          type="switch"
                          id={`custom-switch-${idx}`}
                          label={item.label}
                          checked={visibleColumns.includes(item.id)}
                          onChange={() => toggleColumn(item.id)}
                        />
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </Form>
        </Card.Header>
        <Card.Body className="p-3 pt-0 dark-table">
          <EnhancedTable
            data={[]} // replace with actual data
            headers={filteredHeaders}
            headerCss="info"
            enableSno
            enablePagination
            rowactions={(row) => (
              <Button variant="primary" className="float-end btn-sm">
                Action
              </Button>
            )}
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default TaskList;
