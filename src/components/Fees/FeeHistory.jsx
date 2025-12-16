import { useEffect, useState } from 'react';
import { feesAPI } from '../../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const FeeHistory = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    month: '',
    year: new Date().getFullYear(),
    status: ''
  });

  useEffect(() => {
    fetchFees();
  }, [filters]);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.month) params.month = filters.month;
      if (filters.year) params.year = filters.year;
      if (filters.status) params.status = filters.status;

      const response = await feesAPI.getAll(params);
      setFees(response.data.data);
    } catch (error) {
      toast.error('Failed to load fee history');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Fee History</h3>
        </div>
      </div>
      <div className="mb-6 flex flex-wrap gap-4 bg-gray-50 p-4 rounded-lg">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Month</label>
          <select
            value={filters.month}
            onChange={(e) => setFilters({ ...filters, month: e.target.value })}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2.5 border bg-white"
          >
            <option value="">All Months</option>
            {monthNames.map((month, index) => (
              <option key={index + 1} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Year</label>
          <input
            type="number"
            value={filters.year}
            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            min="2020"
            max={new Date().getFullYear() + 1}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2.5 border bg-white"
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2.5 border bg-white"
          >
            <option value="">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : fees.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No fee records found</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Month/Year</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Paid Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Method</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {fees.map((fee) => (
                <tr key={fee._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                        <span className="text-xs font-semibold text-primary-700">
                          {fee.studentId?.fullName?.charAt(0) || 'N'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {fee.studentId?.fullName || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-green-600">
                      PKR{fee.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {monthNames[fee.month - 1]} {fee.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {format(new Date(fee.paidDate), 'dd MMM yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      fee.status === 'paid' ? 'bg-green-100 text-green-800' :
                      fee.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {fee.status === 'paid' && (
                        <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                      {fee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {fee.paymentMethod || <span className="text-gray-400">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FeeHistory;
