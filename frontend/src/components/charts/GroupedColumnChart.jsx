import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GroupedColumnChart = ({ data, title, labels }) => {
  const bardata = {
    labels,
    datasets: data
  };

  const options = {
  responsive: true,
  plugins: {
    datalabels: {
      display: false
    },
    legend: {
      position: 'top',
      labels: {
        boxWidth: 12
      }
    },
    title: {
      display: true,
      text: title,
      font: {
        size: 18
      },
      padding: {
        top: 20
      }
    },
    tooltip: {
      enabled: true
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,   // Ensure only whole number steps
        precision: 0   // Remove decimal points from labels
      }
    }
  }
};


  return (
    <div className="w-100" style={{ minHeight: '300px' }}>
      <Bar data={bardata} options={{ ...options, maintainAspectRatio: false }} />
    </div>
  );
};

export default GroupedColumnChart;
