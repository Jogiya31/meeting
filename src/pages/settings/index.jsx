import MainCard from '../../components/Card/MainCard';
import React from 'react';
import { Button, Col, Row } from 'react-bootstrap';

const index = () => {
  const divisionList = [
    { id: '1', title: 'DAID' },
    { id: '2', title: 'Tejas' },
    { id: '3', title: 'CCBS' },
    { id: '4', title: 'DAID' },
    { id: '5', title: 'Tejas' },
    { id: '6', title: 'CCBS' },
    { id: '7', title: 'DAID' },
    { id: '8', title: 'Tejas' },
    { id: '9', title: 'CCBS' }
  ];
  const employeementTypeList = [
    { id: '1', title: 'Nic Officer' },
    { id: '2', title: 'Consultant' },
    { id: '3', title: 'Other' }
  ];
  const designationList = [
    { id: '1', title: 'HOG' },
    { id: '2', title: 'HOD' }
  ];

  const handleDivisionDelete = (id) => {
    console.log('id', id);
  };
  const handleEmployementDelete = (id) => {
    console.log('id', id);
  };
  const handleDesignationDelete = (id) => {
    console.log('id', id);
  };

  return (
    <div>
      <Row>
        <Col md={4}>
          <MainCard title="Division List" cardClass="info">
            <div className="px-4 py-2 c-card-body">
              <div className="d-flex justify-content-between">
                <h6>Title</h6>
                <h6> Action</h6>
              </div>
              {divisionList?.map((item, idx) => (
                <div className="d-flex justify-content-between custom-cards">
                  <span>{item.title}</span>
                  <div>
                    <span className="feather icon-x m-0 text-black pointer fs-6"  onClick={() => handleDivisionDelete(item.id)}/>
                  </div>
                </div>
              ))}
            </div>
            <hr />
            <div className="footer d-flex justify-content-between px-4">
              <input type="text" className="form-control mr-3" placeholder="Enter text here.." />
              <Button className="m-0">Add</Button>
            </div>
          </MainCard>
        </Col>
        <Col md={4}>
          <MainCard title="Employement Type List" cardClass="warning">
            <div className="px-4 py-2 c-card-body">
              <div className="d-flex justify-content-between">
                <h6>Title</h6>
                <h6> Action</h6>
              </div>
              {employeementTypeList?.map((item, idx) => (
                <div className="d-flex justify-content-between custom-cards">
                  <span>{item.title}</span>
                  <div>
                    <span className="feather icon-x m-0 text-black pointer fs-6" onClick={() => handleEmployementDelete(item.id)} />
                  </div>
                </div>
              ))}
            </div>
            <hr />
            <div className="footer d-flex justify-content-between px-4">
              <input type="text" className="form-control mr-3" placeholder="Enter text here.." />
              <Button className="m-0">Add</Button>
            </div>
          </MainCard>
        </Col>
        <Col md={4}>
          <MainCard title="Designation List" cardClass="success">
            {' '}
            <div className="px-4 py-2 c-card-body">
              <div className="d-flex justify-content-between">
                <h6>Title</h6>
                <h6> Action</h6>
              </div>
              {designationList?.map((item, idx) => (
                <div className="d-flex justify-content-between custom-cards">
                  <span>{item.title}</span>
                  <div>
                    <span className="feather icon-x m-0 text-black pointer fs-6" onClick={() => handleDesignationDelete(item.id)} />
                  </div>
                </div>
              ))}
            </div>
            <hr />
            <div className="footer d-flex justify-content-between px-4">
              <input type="text" className="form-control mr-3" placeholder="Enter text here.." />
              <Button className="m-0">Add</Button>
            </div>
          </MainCard>
        </Col>
      </Row>
    </div>
  );
};

export default index;
