import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

function ReportTable() {
  const [reports, setReports] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const itemsPerPage = 15;

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

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

  const downloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reports');

    // Header
    worksheet.columns = [
      { header: 'Transaction ID', key: 'transaction_id', width: 15 },
      { header: 'Customer ID', key: 'customer_id', width: 15 },
      { header: 'Customer Name', key: 'customer_name', width: 20 },
      { header: 'Product', key: 'nama_produk', width: 15 },
      { header: 'Laundry Type', key: 'laundry_type', width: 15 },
      { header: 'Status', key: 'status_job', width: 10 },
      { header: 'Start Date', key: 'start_date', width: 15 },
      { header: 'End Date', key: 'end_date', width: 15 },
      { header: 'Total Price', key: 'total_price', width: 15 },
    ];

    reports.forEach((report) => {
      worksheet.addRow({
        transaction_id: report.transaction_id,
        customer_id: report.customer_id,
        customer_name: report.customer_name,
        nama_produk: report.nama_produk,
        laundry_type: report.laundry_type,
        status_job: report.status_job,
        start_date: new Date(report.start_date).toLocaleDateString(),
        end_date: new Date(report.end_date).toLocaleDateString(),
        total_price: formatNumber(report.total_price),
      });
    });

    // Styling (optional)
    worksheet.getRow(1).font = { bold: true };
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, `Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const currentData = reports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
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
      <div className="flex flex-col lg:flex-row lg:space-x-4 mb-4 items-center">
        <div className='flex flex-col'>
          <label>Select Mount</label>
          <select
            className="border h-[20%] p-2 mb-2 lg:mb-0"
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
        </div>
        <div className='flex flex-col'>
          <label>Select Year</label>
          <select
            className="border h-[20%] p-2 mb-2 lg:mb-0"
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
        </div>
        <div className='lg:w-[20%] w-full'>
          <label>Start date:</label>
          <input
            type="date"
            className="border p-2 mb-2 lg:mb-0 w-full"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className='lg:w-[20%] w-full'>
          <label>End date:</label>
          <input
            type="date"
            className="border p-2 mb-2 lg:mb-0 w-full"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className='mt-5 lg:w-[10%] w-full'>
          <button
            className="bg-blue-500  w-full text-white p-2 rounded "
            onClick={() => {
              fetchReport();
              fetchTotalPrice();
            }}
          >
            Filter
          </button>
        </div>
        <div className="mt-5">
          <button
            className="bg-green-500 text-white p-2 rounded"
            onClick={downloadExcel}
          >
            Download Excel
          </button>
        </div>

      </div>

      {/* Total Price Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Total Pemasukan: Rp.{formatNumber(totalPrice)}</h2>
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
            {currentData.map((report) => (
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
                <td className="border px-4 py-2">Rp.{formatNumber(report.total_price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          className="bg-gray-300 p-2 rounded"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="bg-gray-300 p-2 rounded"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ReportTable;