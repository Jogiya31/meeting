import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import moment from 'moment';
export const capitalizeWords = (str) => {
  if (!str) return ''; // Handle empty or null strings

  return str
    .split(' ') // Split the string into an array of words
    .map((word) => {
      if (word.length === 0) return ''; // Handle empty strings within the split
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize first letter, lowercase rest
    })
    .join(' '); // Join the words back into a single string
};

export const exportcustomJsonToExcel = (data, fileName, headerMapping) => {
  // Prepare data with custom headers
  const formattedData = data.map((row) => {
    const rowData = {};
    headerMapping.forEach((header) => {
      rowData[header.label] = row[header.id] ?? '';
    });
    return rowData;
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '');

  // Generate timestamp
  const timestamp = moment().format('DD-MM-YYYY hh:mm a');

  // Export file
  XLSX.writeFile(workbook, `${fileName} ${timestamp}.xlsx`);
};

export const exportcustomJsonToExcelwithHeader = (data, fileName, headerMapping, options = {}) => {
  const { headerLines = [], footerLines = [] } = options;

  // Prepare data with custom headers
  const formattedData = data.map((row) => {
    const rowData = {};
    headerMapping.forEach((header) => {
      rowData[header.label] = row[header.id] ?? '';
    });
    return rowData;
  });

  // Create worksheet with dynamic header & footer
  const jsonHeader = headerMapping.map((h) => h.label);
  const worksheetData = [
    ...headerLines.map((line) => [line]),
    [],
    jsonHeader,
    ...formattedData.map((row) => jsonHeader.map((h) => row[h])),
    [],
    ...footerLines.map((line) => [line])
  ];

  // Create worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Export file
  const timestamp = moment().format('DD-MM-YYYY hhmm A');
  XLSX.writeFile(workbook, `${fileName} ${timestamp}.xlsx`);
};

export const exportJsonToExcel = async (jsonData, fileName, headerLines = [], footerLines = []) => {
  if (!jsonData || jsonData.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // Add header lines
  headerLines.forEach(line => {
    worksheet.addRow([line]);
  });

  worksheet.addRow([]); // Empty row

  // Add table headers with bold style
  const columnHeaders = Object.keys(jsonData[0]);
  const headerRow = worksheet.addRow(columnHeaders);
  headerRow.eachCell(cell => {
    cell.font = { bold: true, size: 12 };
  });

  // Add data rows
  jsonData.forEach(row => {
    worksheet.addRow(columnHeaders.map(col => row[col]));
  });

  worksheet.addRow([]); // Empty row

  // Add footer lines
  footerLines.forEach(line => {
    worksheet.addRow([line]);
  });

  // Generate and trigger download
  const buffer = await workbook.xlsx.writeBuffer();
  const timestamp = moment().format('DD-MM-YYYY hhmm A');
  saveAs(new Blob([buffer]), `${fileName} ${timestamp}.xlsx`);
};
export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
