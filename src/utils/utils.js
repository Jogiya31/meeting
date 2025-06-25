import * as XLSX from 'xlsx';
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

export const exportJsonToExcel = (jsonData, fileName) => {
  const worksheet = XLSX.utils.json_to_sheet(jsonData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, fileName || 'data.xlsx');
};


export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};