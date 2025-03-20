import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../../contexts/DataContext';

const TaskCalendar = ({ extra, eventsData, handleEvets, handleSelectedEvent }) => {
  const navigate = useNavigate();
  const { addInStore } = useStore();
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
    // navigate('/meetings/new')
    setSelectedDate(info.dateStr);
    addInStore({ MeetingDate: info.dateStr });
    // setTask('');
    // setEventColor('#098a30');
    // setSelectedEvent(null); // Reset for new task
    setShowModal(true);
  };

  // Save or Update Task
  const handleSaveOrUpdateTask = () => {
    // if (!task.trim()) return;
    // if (selectedEvent) {
    //   // Update existing task
    //   setEvents((prevEvents) =>
    //     prevEvents.map((event) => (event.id === selectedEvent.id ? { ...event, title: task, backgroundColor: eventColor } : event))
    //   );
    // } else {
    //   // Add new task
    //   handleEvets([...events, { id: Date.now().toString(), title: task, start: selectedDate, backgroundColor: eventColor }]);
    //   // setEvents([...events, { id: Date.now().toString(), title: task, start: selectedDate, backgroundColor: eventColor }]);
    // }
    navigate('/meetings/new');
    setShowModal(false);
  };

  // Handle event click (Edit Task)
  const handleEventClick = (info) => {
    setSelectedEvent({ id: info.event.id, title: info.event.title });
    handleSelectedEvent(info.event.id);
    // setTask(info.event.title);
    // setEventColor(info.event.backgroundColor || '#098a30');
    // setSelectedDate(info.event.startStr);
    // setShowModal(true);
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
          <div
            style={{
              backgroundColor: eventInfo.event.backgroundColor,
              padding: '3px',
              borderRadius: '3px',
              width: 'fit-content',
              fontSize: '11px',
              cursor: 'pointer'
            }}
          >
            {eventInfo.event.title}
          </div>
        )}
        eventBorderColor="transparent"
      />

      {/* Dynamic Add/Edit Task Modal */}
      {/* <Modal show={showModal} onHide={() => setShowModal(false)}>
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
      </Modal> */}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Body>
          <Row className="mt-4 d-flex justify-content-center">
            <Col md={8} className="d-flex flex-column justify-content-center align-items-center">
              <motion.i
                className="feather icon-alert-circle text-c-yellow f-80"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
              <p className="f-w-600 text-center mt-3">Do you want to create a new meeting on {selectedDate} </p>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col className="d-flex justify-content-center">
              <Button className="btn btn-sm btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button className="btn btn-sm btn-primary" onClick={handleSaveOrUpdateTask}>
                Create
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TaskCalendar;
