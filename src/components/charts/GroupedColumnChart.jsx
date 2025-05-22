import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GroupedColumnChart = () => {
  const labels = ['CCBS', 'DAID', 'PRAYAS', 'TEJAS'];

  const data = {
    labels,
    datasets: [
      {
        label: 'CCBS - Total Tasks',
        data: [40, 0, 0, 0],
        backgroundColor: '#00C9A7'
      },
      {
        label: 'CCBS - Pending Task',
        data: [12, 0, 0, 0],
        backgroundColor: '#333'
      },
      {
        label: 'DAID - Total Tasks',
        data: [0, 10, 0, 0],
        backgroundColor: '#ff5b5b'
      },
      {
        label: 'DAID - Pending Task',
        data: [0, 5, 0, 0],
        backgroundColor: '#f5c518'
      },
      {
        label: 'PRAYAS - Total Tasks',
        data: [0, 0, 25, 0],
        backgroundColor: '#444'
      },
      {
        label: 'PRAYAS - Pending Task',
        data: [0, 0, 90, 0],
        backgroundColor: '#8ed6fb'
      },
      {
        label: 'TEJAS - Total Tasks',
        data: [0, 0, 0, 45],
        backgroundColor: '#ff9c6e'
      },
      {
        label: 'TEJAS - Pending Task',
        data: [0, 0, 0, 3],
        backgroundColor: '#b478c2'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12
        }
      },
      title: {
        display: true,
        text: 'Total Tasks/Pending Tasks By group',
        font: {
          size: 18
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default GroupedColumnChart;
