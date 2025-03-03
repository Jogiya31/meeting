import React, { useState } from 'react';
import MainCard from '../../components/Card/MainCard';
import { Button, Col, Row } from 'react-bootstrap';

const Index = () => {
  const [divisionList, setDivisionList] = useState([
    { id: '1', title: 'DAID', isEditing: false },
    { id: '2', title: 'Tejas', isEditing: false },
    { id: '3', title: 'CCBS', isEditing: false }
  ]);

  const [employmentTypeList, setEmploymentTypeList] = useState([
    { id: '1', title: 'Nic Officer', isEditing: false },
    { id: '2', title: 'Consultant', isEditing: false },
    { id: '3', title: 'Other', isEditing: false }
  ]);

  const [designationList, setDesignationList] = useState([
    { id: '1', title: 'HOG', isEditing: false },
    { id: '2', title: 'HOD', isEditing: false }
  ]);

  const handleEdit = (list, setList, id) => {
    setList(list.map((item) => (item.id === id ? { ...item, isEditing: true } : item)));
  };

  const handleChange = (list, setList, id, newValue) => {
    setList(list.map((item) => (item.id === id ? { ...item, title: newValue } : item)));
  };

  const handleBlur = (list, setList, id) => {
    setList(list.map((item) => (item.id === id ? { ...item, isEditing: false } : item)));
   // alert('API call to update the item'); // Replace with actual API call
  };

  const handleDelete = (list, setList, id) => {
    if (window.confirm('Do you want to delete this item?')) {
      setList(list.filter((item) => item.id !== id));
    }
  };

  const renderList = (list, setList) => (
    <>
      <div className="px-4 py-2 c-card-body">
        <div className="d-flex justify-content-between">
          <h6>Title</h6>
          <h6>Action</h6>
        </div>
        {list.map((item) => (
          <Row key={item.id}>
            <Col md={10}>
              <div className="d-flex justify-content-between custom-cards">
                {item.isEditing ? (
                  <input
                    type="text"
                    className="w-100 form-control bg-0 text-white p-2"
                    value={item.title}
                    onChange={(e) => handleChange(list, setList, item.id, e.target.value)}
                    onBlur={() => handleBlur(list, setList, item.id)}
                    autoFocus
                  />
                ) : (
                  <span>{item.title}</span>
                )}
              </div>
            </Col>
            <Col md={2} className="d-flex align-items-center">
              <div className="d-flex justify-content-between">
                <span className="feather icon-edit pending-bg text-white f-12 p-2" onClick={() => handleEdit(list, setList, item.id)} />
                <span
                  className="feather icon-x hold-bg text-white f-12 fw-bolder p-2 ml-1"
                  onClick={() => handleDelete(list, setList, item.id)}
                />
              </div>
            </Col>
          </Row>
        ))}
      </div>
      <hr />
      <div className="footer d-flex justify-content-between px-4">
        <input type="text" className="form-control mr-3" placeholder="Enter text here.." />
        <Button className="m-0">Add</Button>
      </div>
    </>
  );

  return (
    <div>
      <Row>
        <Col md={4}>
          <MainCard title="Division List" cardClass="info">
            {renderList(divisionList, setDivisionList)}
          </MainCard>
        </Col>
        <Col md={4}>
          <MainCard title="Employment Type List" cardClass="warning">
            {renderList(employmentTypeList, setEmploymentTypeList)}
          </MainCard>
        </Col>
        <Col md={4}>
          <MainCard title="Designation List" cardClass="success">
            {renderList(designationList, setDesignationList)}
          </MainCard>
        </Col>
      </Row>
    </div>
  );
};

export default Index;
