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
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    setEvents(eventsData);
  }, [eventsData]);

  // Handle date click (Add Task)
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    addInStore({ MeetingDate: info.dateStr });
    setShowModal(true);
  };

  // Save or Update Task
  const handleSaveOrUpdateTask = () => {
    navigate('/meetings/new');
    setShowModal(false);
  };

  // Handle event click (Edit Task)
  const handleEventClick = (info) => {
    const selectedEvents = info.event.extendedProps.events; // Access stored events
    setSelectedEvent(selectedEvents); // Store full list for display
    handleSelectedEvent(selectedEvents);
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
            className="C_event"
            style={{
              backgroundColor: eventInfo.event.backgroundColor,
              padding: '3px',
              borderRadius: '3px',
              fontSize: '11px',
              cursor: 'pointer',
              textOverflow: 'ellipsis',
              overflow:'hidden'
            }}
            title={eventInfo.event.title}
          >
            {eventInfo.event.title}
          </div>
        )}
        eventBorderColor="transparent"
      />

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
