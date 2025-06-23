import React, { useEffect, useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ClientSideRowModelModule, ModuleRegistry, NumberFilterModule, PaginationModule, TextFilterModule } from 'ag-grid-community';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { useTheme } from '../../contexts/themeContext';
import './style.scss';

ModuleRegistry.registerModules([ClientSideRowModelModule, NumberFilterModule, TextFilterModule, PaginationModule]);

const AdvanceTable = ({
  resetTrigger,
  tablethemes,
  rowData,
  columnDefs,
  pagination,
  paginationPageSize,
  paginationPageSizeSelector,
  reference
}) => {
  const { mode } = useTheme();
  const [gridKey, setGridKey] = useState(0);

  const importRowData = useMemo(() => rowData, [rowData]);
  const importColumnDefs = useMemo(() => columnDefs, [columnDefs]);

  useEffect(() => {
    // Whenever resetTrigger changes, remount grid by changing key
    setGridKey((k) => k + 1);
  }, [resetTrigger]);

  return (
    <div className={`AG-table ${mode === 'dark' ? 'ag-theme-material-dark' : 'ag-theme-material'}`} style={{ width: '100%' }}>
      <AgGridReact
        ref={reference}
        className={tablethemes}
        key={gridKey}
        rowData={importRowData}
        columnDefs={importColumnDefs}
        pagination={pagination}
        paginationPageSize={paginationPageSize}
        paginationPageSizeSelector={paginationPageSizeSelector || [5, 10, 20, 50, 100]}
        theme="legacy"
      />
    </div>
  );
};

export default AdvanceTable;
