import React from 'react';
import { Doughnut } from 'react-chartjs-2';

function ChartCard02() {
  // Dataset untuk Donut Chart
  const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [300, 50, 100, 80, 120], // Nilai masing-masing segmen
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)', // Warna merah
          'rgba(54, 162, 235, 0.6)', // Warna biru
          'rgba(255, 206, 86, 0.6)', // Warna kuning
          'rgba(75, 192, 192, 0.6)', // Warna hijau
          'rgba(153, 102, 255, 0.6)', // Warna ungu
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Opsi konfigurasi chart
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Posisi legend
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className=" w-full max-w-lg bg-white p-4">
      <h2 className="text-lg font-semibold mb-4">Donut Chart Example</h2>
      <Doughnut data={data} options={options} />
    </div>
  );
}

export default ChartCard02;
