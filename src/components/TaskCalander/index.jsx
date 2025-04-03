import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../contexts/DataContext';
import Swal from 'sweetalert2';

const TaskCalendar = ({ extra, eventsData, handleEvets, handleSelectedEvent }) => {
  const navigate = useNavigate();
  const { addInStore } = useStore();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setEvents(eventsData);
  }, [eventsData]);

  // Handle date click (Add Task)
  const handleDateClick = (info) => {
    addInStore({ MeetingDate: info.dateStr });
    Swal.fire({
      title: 'New Meeting',
      text: `Do you want to create a new meeting on ${info.dateStr}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Create'
    }).then((result) => {
      if (result.isConfirmed) {
        handleSaveOrUpdateTask();
      }
    });
  };

  // Save or Update Task
  const handleSaveOrUpdateTask = () => {
    navigate('/meetings/new');
  };

  // Handle event click (Edit Task)
  const handleEventClick = (info) => {
    const selectedEvents = info.event.extendedProps.events; // Access stored events
    handleSelectedEvent(selectedEvents);
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
              overflow: 'hidden'
            }}
            title={eventInfo.event.title}
          >
            {eventInfo.event.title}
          </div>
        )}
        eventBorderColor="transparent"
      />
    </div>
  );
};

export default TaskCalendar;
