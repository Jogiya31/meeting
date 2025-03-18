import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Modal, Button, Form } from 'react-bootstrap';

const TaskCalendar = ({ extra }) => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [task, setTask] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Handle date click (Add Task)
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setTask('');
    setShowModal(true);
  };

  // Save new task
  const handleSaveTask = () => {
    if (task.trim() !== '') {
      setEvents([...events, { id: Date.now(), title: task, start: selectedDate }]);
    }
    setShowModal(false);
  };

  // Handle event click (Edit Task)
  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setTask(info.event.title);
    setShowEditModal(true);
  };

  // Save edited task
  const handleUpdateTask = () => {
    setEvents(events.map((event) => (event.id === selectedEvent.id ? { ...event, title: task } : event)));
    setShowEditModal(false);
  };

  // Delete task
  const handleDeleteTask = () => {
    setEvents(events.filter((event) => event.id !== selectedEvent.id));
    setShowEditModal(false);
  };

  return (
    <div className={`${extra}`}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
      />

      {/* Add Task Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h5>Add Task for {selectedDate}</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control type="text" placeholder="Enter task..." value={task} onChange={(e) => setTask(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className='btn btn-sm' onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" className='btn btn-sm' onClick={handleSaveTask}>
            Save Task
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Task Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control type="text" placeholder="Edit task..." value={task} onChange={(e) => setTask(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteTask}>
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleUpdateTask}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TaskCalendar;
