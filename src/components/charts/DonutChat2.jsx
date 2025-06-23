import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './DonutChart.scss'; // For custom styles

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DonutChart = ({ title, data }) => {
  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        label: title,
        data: data.map((d) => d.tasks),
        backgroundColor: [
          '#00c4cc', '#ff7c87', '#2b2c2c', '#c4a400', '#4ac1ff',
          '#c288d8', '#ffa66c', '#777777', '#87ceeb', '#d2691e'
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }, // Hide default legend
      title: {
        display: true,
        text: title,
        font: { size: 18 },
        padding: { top: 20 }
      },
      datalabels: {
        color: '#fff',
        font: { weight: 'bold', size: 12 },
        formatter: (value) => value
      }
    },
    cutout: '40%'
  };

  return (
    <div className="donut-container">
      <div className="chart-area">
        <Doughnut data={chartData} options={options} />
      </div>
      <div className="legend-area">
        <div className="legend-scroll">
          {data.map((d, index) => (
            <div key={index} className="legend-item">
              <span
                className="legend-color"
                style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
              ></span>
              <span className="legend-label">{d.name} ({d.tasks})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
