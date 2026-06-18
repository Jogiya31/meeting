import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const DataContext = createContext(null);
export const useStore = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [store, setStore] = useState(null);
  const [currentMeetingId, setcurrentMeetingId] = useState(null);
  const [filterValue, setFilterValue] = useState(null);
  const meetingData = useSelector((state) => state.meetings.meetingData);

  const addInStore = (data) => {
    setStore(data);
  };
  const filterWith = (data) => {
    setFilterValue(data);
  };
  const handleMeetingId = (data) => {
    setcurrentMeetingId(data);
  };
  useEffect(() => {
    if (meetingData) handleMeetingId(meetingData?.MeetingId);
  }, [meetingData]);

  return <DataContext.Provider value={{ store, filterValue, currentMeetingId, addInStore, filterWith }}>{children}</DataContext.Provider>;
};

export default DataProvider;
