import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ReportTable() {
  const [reports, setReports] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  const fetchReport = async () => {
    try {
      const response = await axios.get('/api/admin/reports', {
        params: { month, year, start_date: startDate, end_date: endDate },
      });
      setReports(response.data.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const fetchTotalPrice = async () => {
    try {
      const response = await axios.get('/api/admin/total-price', {
        params: { month, year, start_date: startDate, end_date: endDate },
      });
      setTotalPrice(response.data.total_price);
    } catch (error) {
      console.error('Error fetching total price:', error);
    }
  };

  useEffect(() => {
    fetchReport();
    fetchTotalPrice();
  }, [month, year, startDate, endDate]);

  return (
    <div className="p-4">
      {/* Filter Section */}
      <div className="flex flex-col md:flex-row md:space-x-4 mb-4">
        <select
          className="border p-2 mb-2 md:mb-0"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          <option value="">Select Month</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <select
          className="border p-2 mb-2 md:mb-0"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">Select Year</option>
          {Array.from({ length: new Date().getFullYear() - 2000 + 1 }, (_, i) => (
            <option key={i} value={2000 + i}>
              {2000 + i}
            </option>
          ))}
        </select>
        <input
          type="date"
          className="border p-2 mb-2 md:mb-0"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="border p-2 mb-2 md:mb-0"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded"
          onClick={() => {
            fetchReport();
            fetchTotalPrice();
          }}
        >
          Filter
        </button>
      </div>

      {/* Total Price Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Total Pemasukan: Rp.{totalPrice}</h2>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border text-sm">
          <thead>
            <tr>
              <th className="border p-2">Transaction ID</th>
              <th className="border p-2">Customer ID</th>
              <th className="border p-2">Customer Name</th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Laundry Type</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Start Date</th>
              <th className="border p-2">End Date</th>
              <th className="border p-2">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.transaction_id}>
                <td className="border p-2">{report.transaction_id}</td>
                <td className="border p-2">{report.customer_id}</td>
                <td className="border p-2">{report.customer_name}</td>
                <td className="border p-2">{report.nama_produk}</td>
                <td className="border p-2">{report.laundry_type}</td>
                <td className="border p-2">{report.status_job}</td>
                <td className="border p-2">
                  {new Date(report.start_date).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  {new Date(report.end_date).toLocaleDateString()}
                </td>
                <td className="border p-2">{report.total_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportTable;