import React, { useEffect, useState } from 'react';
import MainCard from '../../components/Card/MainCard';
import { Button, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { settingsActions } from 'store/settings/settingSlice';
import { toast } from 'react-toastify';

const Index = () => {
  const dispatch = useDispatch();
  const Role = localStorage.getItem('role');
  const designationDataList = useSelector((state) => state.settings.designationData);
  const divisionDataList = useSelector((state) => state.settings.divisionData);
  const employeementDataList = useSelector((state) => state.settings.employeementData);
  const organizationDataList = useSelector((state) => state.settings.organizationData);
  const statusDataList = useSelector((state) => state.settings.statusData);

  const [divisionList, setDivisionList] = useState([]);
  const [employmentTypeList, setEmploymentTypeList] = useState([]);
  const [organisationList, setOrganisationList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [statusList, setStatusList] = useState([]);

  useEffect(() => {
    dispatch(settingsActions.getDesignationInfo());
    dispatch(settingsActions.getDivisionInfo());
    dispatch(settingsActions.getEmployeementInfo());
    dispatch(settingsActions.getOrganizationInfo());
    dispatch(settingsActions.getStatusInfo());
  }, []);

  useEffect(() => {
    if (Array.isArray(designationDataList?.Result)) {
      const list = designationDataList?.Result?.map((item) => ({
        id: item.DesignationId,
        title: item.DesignationTitle,
        status: Number(item.Status),
        isEditing: false
      }));
      setDesignationList(list);
    }
    if (Array.isArray(divisionDataList?.Result)) {
      const list = divisionDataList?.Result?.map((item) => ({
        id: item.DivisionId,
        title: item.DivisionTitle,
        status: Number(item.Status),
        isEditing: false
      }));
      setDivisionList(list);
    }
    if (Array.isArray(employeementDataList?.Result)) {
      const list = employeementDataList?.Result?.map((item) => ({
        id: item.EmployeementId,
        title: item.EmployeementTitle,
        status: Number(item.Status),
        isEditing: false
      }));
      setEmploymentTypeList(list);
    }
    if (Array.isArray(organizationDataList?.Result)) {
      const list = organizationDataList.Result.map((item) => ({
        id: item.OrganisationId,
        title: item.OrganisationTitle,
        status: Number(item.Status),
        isEditing: false
      }));
      setOrganisationList(list);
    }
    if (Array.isArray(statusDataList?.Result)) {
      const list = statusDataList.Result.map((item) => ({
        id: item.StatusId,
        title: item.StatusTitle,
        status: Number(item.Status),
        isEditing: false
      }));
      setStatusList(list);
    }
  }, [designationDataList, divisionDataList, employeementDataList, organizationDataList, statusDataList]);

  const handleEdit = (list, setList, id) => {
    alert('Caution! Updating this information may alter its original meaning. Proceed carefully.');
    setList(list.map((item) => (item.id === id ? { ...item, isEditing: true } : item)));
  };

  const handleChange = (list, setList, id, newValue) => {
    setList(list.map((item) => (item.id === id ? { ...item, title: newValue } : item)));
  };

  const handleSaveChange = async (list, setList, updateAction, id, fieldName) => {
    const updatedItem = list.find((item) => item.id === id);
    if (!updatedItem) return;
    const payload = {
      [fieldName + 'Id']: updatedItem.id, // Dynamically setting the ID field
      [fieldName + 'Title']: updatedItem.title,
      ModifyBy: Role,
      Status: updatedItem.status.toString()
    };

    try {
      await dispatch(updateAction(payload));
      setList(list.map((item) => (item.id === id ? { ...item, isEditing: false } : item)));
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  const handleDelete = async (list, setList, updateAction, id, fieldName) => {
    if (window.confirm('Do you want to change status for this item?')) {
      const updatedItem = list.find((item) => item.id === id);
      if (!updatedItem) return;

      const payload = {
        [fieldName + 'Id']: updatedItem.id,
        [fieldName + 'Title']: updatedItem.title,
        ModifyBy: Role,
        Status: updatedItem.status === 1 ? '0' : '1' // Ensure it's a string
      };

      try {
        await dispatch(updateAction(payload));

        // Create a new array reference to trigger re-render
        setList((prevList) => prevList.map((item) => (item.id === id ? { ...item, status: updatedItem.status === 1 ? 0 : 1 } : item)));
      } catch (error) {
        console.error('Failed to update item:', error);
      }
    }
  };

  const handleAddItem = async (newItem, setNewItem, apiAction, fetchAction, fieldName) => {
    if (!newItem.trim()) return; // Prevent empty input

    try {
      const payload = {
        [fieldName + 'Title']: newItem,
        CreatedBy: Role,
        Status: '1'
      };

      // Dispatch action to add new item
      await dispatch(apiAction(payload));

      // Wait for Redux state to update before re-fetching
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Fetch updated list
      await dispatch(fetchAction());

      // Reset input field
      setNewItem('');
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const renderList = (list, setList, apiAction, fetchAction, updateAction, fieldName) => {
    const [newItem, setNewItem] = useState('');

    return (
      <>
        <div className="px-4 py-2 c-card-body">
          <div className="d-flex justify-content-between">
            <h6>Title</h6>
            <h6>Action</h6>
          </div>
          {list?.map((item) => (
            <Row key={item.id}>
              <Col md={10} sm={10}>
                <div className={`d-flex justify-content-between custom-cards ${item.status ? '' : 'op-5'}`}>
                  {item.isEditing ? (
                    <input
                      type="text"
                      className="w-100 form-control bg-0 text-white p-2"
                      value={item.title}
                      onChange={(e) => handleChange(list, setList, item.id, e.target.value)}
                      autoFocus
                    />
                  ) : (
                    <span>{item.title}</span>
                  )}
                </div>
              </Col>
              <Col md={2} sm={2} className="d-flex align-items-center">
                <div className="d-flex justify-content-between">
                  {item.isEditing ? (
                    <span
                      title="Save"
                      className={`feather icon-check theme-bg text-white f-14 p-2 pointer`}
                      onClick={() => handleSaveChange(list, setList, updateAction, item.id, fieldName)}
                    />
                  ) : (
                    <span
                      title="Edit"
                      className={`feather icon-edit pending-bg text-white f-14 p-2 pointer`}
                      onClick={() => handleEdit(list, setList, item.id)}
                    />
                  )}
                  {item.status ? (
                    <span
                      title="Visible"
                      className="feather icon-eye success-bg text-white f-14 fw-bolder p-2 ml-1 pointer"
                      onClick={() => handleDelete(list, setList, updateAction, item.id, fieldName)}
                    />
                  ) : (
                    <span
                      title="Not Visible"
                      className="feather icon-eye-off hold-bg text-white f-14 fw-bolder p-2 ml-1 pointer"
                      onClick={() => handleDelete(list, setList, updateAction, item.id, fieldName)}
                    />
                  )}
                </div>
              </Col>
            </Row>
          ))}
        </div>
        <hr />
        <div className="footer d-flex justify-content-between px-4">
          <input
            type="text"
            className="form-control mr-3"
            placeholder="Enter text here.."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
          <Button className="m-0" onClick={() => handleAddItem(newItem, setNewItem, apiAction, fetchAction, fieldName)}>
            Add
          </Button>
        </div>
      </>
    );
  };

  return (
    <div>
      <Row>
        <Col sm={12} md={12} xl={6} xxl={4}>
          <MainCard title="Division List" cardClass="info">
            {renderList(
              divisionList,
              setDivisionList,
              settingsActions.addDivisionInfo,
              settingsActions.getDivisionInfo,
              settingsActions.updateDivisionInfo,
              'Division'
            )}
          </MainCard>
        </Col>

        <Col sm={12} md={12} xl={6} xxl={4}>
          <MainCard title="Employment Type" cardClass="warning">
            {renderList(
              employmentTypeList,
              setEmploymentTypeList,
              settingsActions.addEmployeementInfo,
              settingsActions.getEmployeementInfo,
              settingsActions.updateEmployeementInfo,
              'Employeement'
            )}
          </MainCard>
        </Col>

        <Col sm={12} md={12} xl={6} xxl={4}>
          <MainCard title="Designation List" cardClass="success">
            {renderList(
              designationList,
              setDesignationList,
              settingsActions.addDesignationInfo,
              settingsActions.getDesignationInfo,
              settingsActions.updateDesignationInfo,
              'Designation'
            )}
          </MainCard>
        </Col>

        <Col sm={12} md={12} xl={6} xxl={4}>
          <MainCard title="Company List" cardClass="purple">
            {renderList(
              organisationList,
              setOrganisationList,
              settingsActions.addOrganizationInfo,
              settingsActions.getOrganizationInfo,
              settingsActions.updateOrganizationInfo,
              'Organisation'
            )}
          </MainCard>
        </Col>
        <Col sm={12} md={12} xl={6} xxl={4}>
          <MainCard title="Tasks Status" cardClass="danger">
            {renderList(
              statusList,
              setStatusList,
              settingsActions.addStatusInfo,
              settingsActions.getStatusInfo,
              settingsActions.updateStatusInfo,
              'Status'
            )}
          </MainCard>
        </Col>
      </Row>
    </div>
  );
};

export default Index;
