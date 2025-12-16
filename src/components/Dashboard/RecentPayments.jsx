import { useEffect, useState } from 'react';
import { feesAPI } from '../../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const RecentPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentPayments();
  }, []);

  const fetchRecentPayments = async () => {
    try {
      const response = await feesAPI.getAll({ status: 'paid' });
      const sorted = response.data.data
        .sort((a, b) => new Date(b.paidDate) - new Date(a.paidDate))
        .slice(0, 10);
      setPayments(sorted);
    } catch (error) {
      toast.error('Failed to load recent payments');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-5">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100 hover:shadow-soft-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Recent Payments</h3>
          <p className="text-sm text-gray-500 mt-1">Latest fee transactions</p>
        </div>
        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
          <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Student
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Month
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {payments.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center">
                  <div className="flex flex-col items-center">
                    <svg className="h-12 w-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500">No payments found</p>
                  </div>
                </td>
              </tr>
            ) : (
              payments.map((payment, index) => (
                <tr key={payment._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                        <span className="text-xs font-semibold text-primary-700">
                          {payment.studentId?.fullName?.charAt(0) || 'N'}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {payment.studentId?.fullName || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-green-600">
                      PKR{payment.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {payment.month}/{payment.year}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {format(new Date(payment.paidDate), 'dd MMM yyyy')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentPayments;
