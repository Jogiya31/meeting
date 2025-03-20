import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext(null);
export const useStore = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [store, setStore] = useState(null);
  const [filterValue, setFilterValue] = useState(null);

  const addInStore = (data) => {
    setStore(data);
  };
  const filterWith = (data) => {
    setFilterValue(data);
  };

  return <DataContext.Provider value={{ store, filterValue, addInStore, filterWith }}>{children}</DataContext.Provider>;
};

export default DataProvider;
