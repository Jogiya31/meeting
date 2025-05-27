import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ClientSideRowModelModule, ModuleRegistry, NumberFilterModule, PaginationModule, TextFilterModule } from 'ag-grid-community';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { useTheme } from '../../contexts/themeContext';
import './style.scss';

ModuleRegistry.registerModules([ClientSideRowModelModule, NumberFilterModule, TextFilterModule, PaginationModule]);

const AdvanceTable = ({ tablethemes ,rowData, columnDefs, pagination, paginationPageSize, paginationPageSizeSelector }) => {
  const { mode } = useTheme();
  // const [rowData] = useState([
  //   { name: 'John', age: 24, country: 'USA' },
  //   { name: 'Anna', age: 30, country: 'Canada' },
  //   { name: 'Kyle', age: 27, country: 'UK' },
  //   { name: 'Linda', age: 22, country: 'Germany' },
  //   { name: 'James', age: 29, country: 'Australia' }
  // ]);

  // const columnDefs = [
  //   { field: 'name', sortable: true, filter: 'agTextColumnFilter', flex: 1 },
  //   { field: 'age', sortable: true, filter: 'agNumberColumnFilter', flex: 1 },
  //   { field: 'country', sortable: true, filter: 'agTextColumnFilter', flex: 1 }
  // ];

  return (
    <div className={`AG-table ${mode === 'dark' ? 'ag-theme-material-dark' : 'ag-theme-material'}`} style={{ width: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector || [5, 10, 20, 50, 100]}
        theme="legacy"
      />
    </div>
  );
};

export default AdvanceTable;
