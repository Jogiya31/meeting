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

    // Draw background arc
    svg
      .append('path')
      .datum({ startAngle: 0, endAngle: 2 * Math.PI })
      .attr('d', arc)
      .attr('fill', '#0d2a4d');

    // Center text
    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '14px')
      .attr('font-weight', '600')
      .text(`${percentage}%`);

    // Animated foreground arc (percentage)
    const foreground = svg
      .append('path')
      .datum({ startAngle: 0, endAngle: 0 }) // Start at 0
      .attr('d', arc)
      .attr('fill', PercentageColor);

    // Animate the percentage arc
    foreground
      .transition()
      .duration(1000)
      .attrTween('d', function (d) {
        const interpolate = d3.interpolate(0, (percentage / 100) * 2 * Math.PI);
        return function (t) {
          d.endAngle = interpolate(t);
          return arc(d);
        };
      });
  }, [percentage]);

  return <div ref={chartRef}></div>;
};

export default DonutChart;
