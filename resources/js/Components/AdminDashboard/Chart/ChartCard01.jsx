import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function ChartCard01() {
  const chartRef = useRef(null); 

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d'); 
    const chart = new Chart(ctx, {
      type: 'bar', 
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'], // Label sumbu X
        datasets: [
          {
            label: 'Sales (in USD)', // Label dataset
            data: [500, 1000, 750, 900, 1200, 1100], // Data untuk sumbu Y
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(153, 102, 255, 0.5)',
              'rgba(255, 159, 64, 0.5)',
            ], // Warna batang
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ], // Warna border batang
            borderWidth: 1, // Ketebalan border
          },
        ],
      },
      options: {
        responsive: true, // Grafik responsif
        plugins: {
          legend: {
            display: true, // Tampilkan legenda
            position: 'top', // Posisi legenda
          },
        },
      },
    });
    return () => {
      chart.destroy();
    };
  }, []);
  return (
    <div className="p-4 bg-white w-[70%] items-center h-auto shadow rounded">
      <canvas ref={chartRef} />
    </div>
  );
}

export default ChartCard01;
