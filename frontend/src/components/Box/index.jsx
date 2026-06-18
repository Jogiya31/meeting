import React from 'react';
import { Card } from 'react-bootstrap';
import './style.scss';

const Box = ({ title, customHeader, action, children, extra }) => {
  return (
    <Card style={{ width: '100%', margin: '1rem' }} className={extra}>
      {customHeader ? (
        <Card.Header>{customHeader}</Card.Header>
      ) : (
        title && (
          <Card.Header>
            <div className="box-head">
              <Card.Title>{title}</Card.Title>
              {action}
            </div>
          </Card.Header>
        )
      )}
      <Card.Body>{children}</Card.Body>
    </Card>
  );
};

export default Box;
