import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DonutChart = ({ percentage, PercentageColor }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const width = 100;
    const height = 100;
    const thickness = 20;
    const radius = Math.min(width, height) / 2;

    // Clear previous chart
    d3.select(chartRef.current).select('svg').remove();

    const svg = d3
      .select(chartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const arc = d3
      .arc()
      .innerRadius(radius - thickness)
      .outerRadius(radius);

    const pie = d3
      .pie()
      .value((d) => d.value)
      .sort(null);

    const data = [
      { value: percentage, color: PercentageColor }, // Orange
      { value: 100 - percentage, color: '#0d2a4d' } // Dark Blue
    ];

    // Draw arcs
    svg
      .selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => d.data.color);

    // Center text
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .text(`${percentage}%`);
  }, [percentage]);

  return <div ref={chartRef}></div>;
};

export default DonutChart;
