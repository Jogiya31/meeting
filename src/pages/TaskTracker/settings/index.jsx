import React, { useEffect, useState } from 'react';
import MainCard from '../../../components/Card/MainCard';
import { Button, Col, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { settingsActions } from 'store/settings/settingSlice';
import Swal from 'sweetalert2';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useTheme } from '../../../contexts/themeContext';

const Index = () => {
  const dispatch = useDispatch();
  const { mode } = useTheme();
  const Role = localStorage.getItem('role');

  const priorityDataList = useSelector((state) => state.settings.priorityData);

  const [priorityList, setPriorityList] = useState([]);

  useEffect(() => {
    dispatch(settingsActions.getPriorityInfo());
  }, []);

  useEffect(() => {
    if (Array.isArray(priorityDataList?.Result)) {
      const list = priorityDataList.Result.map((item) => ({
        id: item.PriorityOrderId,
        title: item.PriorityOrderTitle,
        status: Number(item.Status),
        isEditing: false
      }));
      setPriorityList(list);
    }
  }, [priorityDataList]);

  const handleEdit = (list, setList, id) => {
    Swal.fire({
      title: 'Update',
      text: `Click on proceed button, If you want yo update the information`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Proceed',
      theme: mode
    }).then((result) => {
      if (result.isConfirmed) {
        setList(list.map((item) => (item.id === id ? { ...item, isEditing: true } : item)));
      }
    });
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
      Status: updatedItem.status
    };

    try {
      await dispatch(updateAction(payload));
      setList(list.map((item) => (item.id === id ? { ...item, isEditing: false } : item)));
    } catch (error) {}
  };

  const handleDelete = async (list, setList, updateAction, id, fieldName) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to change status for this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, change it!',
      theme: mode
    }).then(async (result) => {
      if (result.isConfirmed) {
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
        } catch (error) {}
        Swal.fire({
          title: 'Updated!',
          text: 'Selected item status has been updated.',
          icon: 'success',
          theme: mode
        });
      }
    });
    // if (window.confirm('Do you want to change status for this item?')) {
    //   const updatedItem = list.find((item) => item.id === id);
    //   if (!updatedItem) return;

    //   const payload = {
    //     [fieldName + 'Id']: updatedItem.id,
    //     [fieldName + 'Title']: updatedItem.title,
    //     ModifyBy: Role,
    //     Status: updatedItem.status === 1 ? '0' : '1' // Ensure it's a string
    //   };

    //   try {
    //     await dispatch(updateAction(payload));

    //     // Create a new array reference to trigger re-render
    //     setList((prevList) => prevList.map((item) => (item.id === id ? { ...item, status: updatedItem.status === 1 ? 0 : 1 } : item)));
    //   } catch (error) {
    //   }
    // }
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
    } catch (error) {}
  };

  const renderList2 = (list, setList, apiAction, fetchAction, updateAction, fieldName) => {
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
              <Col md={9} sm={9}>
                <div className={`d-flex justify-content-between custom-cards ${item.status ? '' : 'op-5'}`}>
                  {item.isEditing ? (
                    <input
                      type="text"
                      className="w-100 form-control bg-0 p-2"
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
                      className={`feather icon-check theme-bg2 text-white f-14 p-2 pointer`}
                      onClick={() => handleSaveChange(list, setList, updateAction, item.id, fieldName)}
                    />
                  ) : (
                    <span
                      title="Edit"
                      className={`feather icon-edit theme-bg2 text-white f-14 p-2 pointer`}
                      onClick={() => handleEdit(list, setList, item.id)}
                    />
                  )}
                  {item.status ? (
                    <span
                      title="Visible"
                      className="d-flex theme-bg text-white f-16 fw-bolder p-2 ml-1 pointer"
                      onClick={() => handleDelete(list, setList, updateAction, item.id, fieldName)}
                    >
                      <FaCheckCircle />
                    </span>
                  ) : (
                    <span
                      title="Not Visible"
                      className="d-flex hold-bg text-white f-16 fw-bolder p-2 ml-1 pointer"
                      onClick={() => handleDelete(list, setList, updateAction, item.id, fieldName)}
                    >
                      <FaTimesCircle />
                    </span>
                  )}
                </div>
              </Col>
            </Row>
          ))}
        </div>
        <hr />
        <div className="footer d-flex justify-content-between px-4">
          <Button variant='secondary' className="m-0">List</Button>
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
          <MainCard title="Group List" cardClass="success">
            {renderList2(
              priorityList,
              setPriorityList,
              settingsActions.addPriorityInfo,
              settingsActions.getPriorityInfo,
              settingsActions.updatePriorityInfo,
              'PriorityOrder'
            )}
          </MainCard>
        </Col>

        <Col sm={12} md={12} xl={6} xxl={4}>
          <MainCard title="Project List" cardClass="info">
            {renderList2(
              priorityList,
              setPriorityList,
              settingsActions.addPriorityInfo,
              settingsActions.getPriorityInfo,
              settingsActions.updatePriorityInfo,
              'PriorityOrder'
            )}
          </MainCard>
        </Col>
        <Col sm={12} md={12} xl={6} xxl={4}>
          <MainCard title="Module List" cardClass="warning">
            {renderList2(
              priorityList,
              setPriorityList,
              settingsActions.addPriorityInfo,
              settingsActions.getPriorityInfo,
              settingsActions.updatePriorityInfo,
              'PriorityOrder'
            )}
          </MainCard>
        </Col>
      </Row>
      
    </div>
  );
};

export default Index;
