// DonutChart.jsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// Register chart plugins
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DonutChart = ({ title, data }) => {
  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        label: title,
        data: data.map((d) => d.tasks),
        backgroundColor: ['#00c4cc', '#ff7c87', '#2b2c2c', '#c4a400', '#4ac1ff', '#c288d8', '#ffa66c', '#777777', '#87ceeb', '#d2691e'],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 10,
          padding: 15
        }
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 18
        },
        padding: {
          top: 20,
        }
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold',
          size: 12
        },
        maintainAspectRatio: false, // 💡 Important to allow full control of height/width
        formatter: (value) => value
      }
    },
    cutout: '40%'
  };

  return (
      <Doughnut data={chartData} options={options} />
  );
};

export default DonutChart;
