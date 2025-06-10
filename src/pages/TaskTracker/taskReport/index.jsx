import React, { useEffect, useState } from 'react';
import { Button, Card, CardSubtitle, Col, Form, Row } from 'react-bootstrap';
import pdf_i from '../../../assets/images/pdf_i.svg';
import print_i from '../../../assets/images/print_i.svg';
import refresh from '../../../assets/images/refresh-arrow.png';
import { MultiSelect } from 'react-multi-select-component';
import { useSelector } from 'react-redux';
import { settingsActions } from '../../../store/settings/settingSlice';
import { userActions } from '../../../store/user/userSlice';
import { moduleActions } from '../../../store/module/moduleSlice';
import { useDispatch } from 'react-redux';
import AdvanceTable from 'components/Table/advanceTable';

const TaskReport = () => {
  const dispatch = useDispatch();
  const [taskErrors, setTaskErrors] = useState({});
  const [TaskformData, setTaskFormData] = useState({
    groupName: '',
    projectName: '',
    moduleName: '',
    status: ''
  });

  const [groupOption, setGroupOption] = useState([]);
  const [projectOption, setProjectOption] = useState([]);
  const [moduleOption, setModuleOption] = useState([]);
  const [statusOption, setStatusOption] = useState([]);
  const [groupFilter, setGroupFilter] = useState([]);
  const [projectFilter, setProjectFilter] = useState([]);
  const [moduleFilter, setModuleFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [filterPayload, setFilterPayload] = useState({
    GroupId: '',
    ProjectId: '',
    ModuleId: '',
    StatusId: ''
  });

  const divisionDataList = useSelector((state) => state.settings.divisionData);
  const projectDataList = useSelector((state) => state.settings.projectData);
  const statusLists = useSelector((state) => state.settings.statusData);
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
  }, [divisionDataList, projectDataList, statusLists, moduleList]);

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
  }, [groupFilter, projectFilter, moduleFilter, statusFilter]);

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
  const handleStatusFilter = (newSelected) => {
    if (newSelected.length) {
      setStatusFilter(newSelected);
    } else {
      setStatusFilter([]);
    }
  };
  const validateTasks = () => {
    let newErrors = {};
    if (!TaskformData.groupName) newErrors.groupName = 'Required field.';
    if (!TaskformData.projectName) newErrors.projectName = 'Required field.';
    if (!TaskformData.moduleName) newErrors.moduleName = 'Required field.';
    if (!TaskformData.status) newErrors.status = 'Required field.';
    setTaskErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateTasks()) return;
    console.log('TaskformData', TaskformData);
  };
  const [columnDefs] = useState([
    { field: 'projectName', sortable: true, filter: true, flex: 1 },
    { field: 'moduleName', sortable: true, filter: true, flex: 1 },
    { field: 'taskName', sortable: true, filter: true, flex: 1 },
    { field: 'taskDescription', sortable: true, filter: true, flex: 1 },
    { field: 'assignedDate', sortable: true, filter: true, flex: 1 },
    { field: 'status', sortable: true, filter: true, flex: 1 },
    { field: 'assignedTo', sortable: true, filter: true, flex: 1 },
    { field: 'userRemarks', flex: 1 }
  ]);

  const triggerReset = () => {
    setResetTrigger((prev) => prev + 1);
  };

  return (
    <div>
      <Card className="Recent-Users widget-focus-lg header-info default-shadow">
        <Card.Header className=" py-2">
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="d-flex align-items-center">
              <Col md={2}>
                <h5>Task Report</h5>
              </Col>
              <Col md={2}>
                <MultiSelect
                  options={groupOption}
                  value={groupFilter}
                  onChange={handleGroupFilter}
                  overrideStrings={{
                    selectSomeItems: 'Groups'
                  }}
                  hasSelectAll={true}
                />
              </Col>
              <Col md={2}>
                <MultiSelect
                  options={projectOption}
                  value={projectFilter}
                  onChange={handleProjectFilter}
                  overrideStrings={{
                    selectSomeItems: 'Projects'
                  }}
                  hasSelectAll={true}
                />
              </Col>
              <Col md={2}>
                <MultiSelect
                  options={moduleOption}
                  value={moduleFilter}
                  onChange={handleModuleFilter}
                  overrideStrings={{
                    selectSomeItems: 'Modules'
                  }}
                  hasSelectAll={true}
                />
              </Col>
              <Col md={2}>
                <MultiSelect
                  options={statusOption}
                  value={statusFilter}
                  onChange={handleStatusFilter}
                  overrideStrings={{
                    selectSomeItems: 'Status'
                  }}
                  hasSelectAll={true}
                />
              </Col>
              <Col md={2}>
                <Form.Group className="d-flex  justify-content-between align-items-center">
                  <Button type="submit" size="sm" className="m-0 bg-primary">
                    Submit
                  </Button>
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
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Header>
        <Card.Body className="p-3 pt-0 dark-table">
          <AdvanceTable
            rowData={[]}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={15}
            paginationPageSizeSelector={[10, 15, 20, 25, 50, 100]}
            resetTrigger={resetTrigger}
            tablethemes="primary"
          />
        </Card.Body>
      </Card>
    </div>
  );
};

export default TaskReport;
