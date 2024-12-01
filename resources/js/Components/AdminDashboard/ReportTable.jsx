import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import IonIcon from '@reacticons/ionicons';

function ReportTable() {
  const [reports, setReports] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState('');
  const [statuspayment, setStatusPayment] = useState('');
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
        params: { month, year, start_date: startDate, end_date: endDate, status_job: status, status_payment: statuspayment },
      });
      console.log('API Response:', response.data);
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
      { header: 'Status Payment', key: 'status_payment', width: 10 },
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
        status_payment: report.status_payment,
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
        params: { month, year, start_date: startDate, end_date: endDate, status_job: status, status_payment: statuspayment },
      });
      setTotalPrice(response.data.total_price);
    } catch (error) {
      console.error('Error fetching total price:', error);
    }
  };

  useEffect(() => {
    fetchReport();
    fetchTotalPrice();
  }, [month, year, startDate, endDate, status, statuspayment]);

  return (
    <div className="p-4">
      {/* Filter Section */}
      <div className="flex flex-col lg:flex-row lg:space-x-6 mb-6 items-start lg:items-center">
        {/* Select Month */}
        <div className="flex flex-col w-full lg:w-auto">
          <label className="text-sm font-medium mb-1">Select Month</label>
          <select
            className="border border-gray-300 rounded-md p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Select Year */}
        <div className="flex flex-col w-full lg:w-auto">
          <label className="text-sm font-medium mb-1">Select Year</label>
          <select
            className="border border-gray-300 rounded-md p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Start Date */}
        <div className="flex flex-col w-full lg:w-auto">
          <label className="text-sm font-medium mb-1">Start Date</label>
          <input
            type="date"
            className="border border-gray-300 rounded-md p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col w-full lg:w-auto">
          <label className="text-sm font-medium mb-1">End Date</label>
          <input
            type="date"
            className="border border-gray-300 rounded-md p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        {/* Select Status */}
        <div className="flex flex-col w-full lg:w-auto">
          <label className="text-sm font-medium mb-1">Select Status</label>
          <select
            className="border border-gray-300 rounded-md p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="ongoing">Ongoing</option>
            <option value="pending">Pending</option>
            <option value="done">Done</option>
            <option value="cancel">Cancel</option>
          </select>
        </div>
        <div className="flex flex-col w-full lg:w-auto">
          <label className="text-sm font-medium mb-1">Select Status Payment</label>
          <select
            className="border border-gray-300 rounded-md p-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statuspayment}
            onChange={(e) => setStatusPayment(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
        <div className="mt-3 lg:mt-6 lg:w-auto w-full">
          <button
            className="bg-blue-500 text-white py-3 px-6 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            onClick={() => {
              fetchReport();
              fetchTotalPrice();
            }}
          >
            <span className='flex items-center space-x-3'>
              <IonIcon name='filter'></IonIcon>
            </span>
          </button>
        </div>
      </div>
      <div className="mt-5">
        <button
          className="bg-green-500 hover:bg-green-600 scale-100 hover:scale-110 transition-all ease-in-out duration-300 text-white p-2 rounded"
          onClick={downloadExcel}
        >
          <span className='flex flex-row items-center space-x-3'>
            <IonIcon className='text-lg' name='download'></IonIcon>
            <p>Download Excel</p>
          </span>
        </button>
      </div>
      {/* Total Price Section */}
      <div className="my-4">
        <h2 className="text-lg font-semibold">Total Pemasukan: Rp.{formatNumber(totalPrice)}</h2>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border text-sm">
          <thead>
            <tr>
              <th className="border p-2">Customer ID</th>
              <th className="border p-2">Customer Name</th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Laundry Type</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Status Payment</th>
              <th className="border p-2">Start Date</th>
              <th className="border p-2">End Date</th>
              <th className="border p-2">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((report) => (
              <tr key={report.transaction_id}>
                <td className="border p-2">{report.customer_id}</td>
                <td className="border p-2">{report.customer_name}</td>
                <td className="border p-2">{report.nama_produk}</td>
                <td className="border p-2">{report.laundry_type}</td>
                <td
                  className={`border p-2 text-white ${report.status_job === 'ongoing'
                    ? 'bg-blue-500'
                    : report.status_job === 'pending'
                      ? 'bg-yellow-500'
                      : report.status_job === 'done'
                        ? 'bg-green-500'
                        : report.status_job === 'cancel'
                          ? 'bg-red-500'
                          : 'bg-transparent'
                    }`}>{report.status_job}</td>
                <td
                  className={`border p-2 text-white ${report.status_payment === 'paid'
                    ? 'bg-green-500'
                    : report.status_payment === 'unpaid'
                      ? 'bg-red-500'
                          : 'bg-transparent'
                    }`}>{report.status_payment}</td>
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