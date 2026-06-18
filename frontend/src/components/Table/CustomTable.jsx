import { useTable, useRowSelect } from 'react-table';
import moment from 'moment';

function CustomTable({ data, columns, headerStyle, extra }) {
  const { getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data }, useRowSelect);

  return (
    <div> 
      <div className={`${extra} dynamicTable table-responsive`}>
        <table className="table table-bordered">
          <thead>
            {headerGroups.map((headerGroup, idx) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={`--${idx}`}>
                <th className={`w-[100px] text-center font-semibold ${headerStyle}`}>#</th>
                {headerGroup.headers.map((column) => {
                  return (
                    <th
                      {...column.getHeaderProps()}
                      className={`table-head ${headerStyle} ${column && !column.show ? 'hidden' : ''} 
                    `}
                    >
                      {column.render('header')}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={i + moment()}>
                  <td className="w-[100px] text-center">{i + 1}</td>
                  {row.cells.map((cell, idx) => {
                    return (
                      <td key={idx + cell.column.id} {...cell.getCellProps()} className={` ${cell.column.show ? '' : 'hidden'}`}>
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default CustomTable;
