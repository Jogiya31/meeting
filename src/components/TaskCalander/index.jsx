import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Modal, Button, Form, Row, Col, Dropdown } from 'react-bootstrap';

const TaskCalendar = ({ extra, eventsData, handleEvets }) => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [task, setTask] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventColor, setEventColor] = useState('#098a30');

  useEffect(() => {
    setEvents(eventsData);
  }, [eventsData]);

  // Handle date click (Add Task)
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setTask('');
    setEventColor('#098a30');
    setSelectedEvent(null); // Reset for new task
    setShowModal(true);
  };

  // Save or Update Task
  const handleSaveOrUpdateTask = () => {
    if (!task.trim()) return;

    if (selectedEvent) {
      // Update existing task
      setEvents((prevEvents) =>
        prevEvents.map((event) => (event.id === selectedEvent.id ? { ...event, title: task, backgroundColor: eventColor } : event))
      );
    } else {
      // Add new task
      handleEvets([...events, { id: Date.now().toString(), title: task, start: selectedDate, backgroundColor: eventColor }]);
      // setEvents([...events, { id: Date.now().toString(), title: task, start: selectedDate, backgroundColor: eventColor }]);
    }

    setShowModal(false);
  };

  // Handle event click (Edit Task)
  const handleEventClick = (info) => {
    setSelectedEvent({ id: info.event.id, title: info.event.title });
    setTask(info.event.title);
    setEventColor(info.event.backgroundColor || '#098a30');
    setSelectedDate(info.event.startStr);
    setShowModal(true);
  };

  // Delete Task
  const handleDeleteTask = () => {
    if (selectedEvent) {
      setEvents(events.filter((event) => event.id !== selectedEvent.id));
    }
    setShowModal(false);
  };

  const colorOptions = [
    { color: '#098a30', label: 'Green' },
    { color: '#991c1c', label: 'Red' },
    { color: '#12429d', label: 'Blue' },
    { color: '#f4a100', label: 'Yellow' }
  ];

  return (
    <div className={`${extra}`}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventContent={(eventInfo) => (
          <div style={{ backgroundColor: eventInfo.event.backgroundColor, padding: '5px', borderRadius: '5px' }}>
            {eventInfo.event.title}
          </div>
        )}
        eventBorderColor="transparent"
      />

      {/* Dynamic Add/Edit Task Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h5>{selectedEvent ? 'Edit Task' : `Add Event on ${selectedDate}`}</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={10}>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" placeholder="Enter task..." value={task} onChange={(e) => setTask(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdown-basic" className="color-dropdown">
                  <span
                    style={{
                      backgroundColor: eventColor,
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      display: 'inline-block',
                      border: '1px solid #ccc'
                    }}
                  ></span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {colorOptions.map((option) => (
                    <Dropdown.Item
                      key={option.color}
                      onClick={() => setEventColor(option.color)}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <span
                        style={{
                          backgroundColor: option.color,
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          marginRight: 8
                        }}
                      ></span>
                      {option.label}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          {selectedEvent && (
            <Button className="btn btn-sm btn-danger fs-12" onClick={handleDeleteTask}>
              Delete
            </Button>
          )}
          <Button className="btn btn-sm btn-secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button className="btn btn-sm btn-primary" onClick={handleSaveOrUpdateTask}>
            {selectedEvent ? 'Update Task' : 'Save Task'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TaskCalendar;
