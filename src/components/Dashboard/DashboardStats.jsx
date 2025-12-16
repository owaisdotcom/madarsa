import { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';
import toast from 'react-hot-toast';

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-soft p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-gradient-to-br from-white to-primary-50 rounded-xl shadow-soft p-6 border border-primary-100 hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-600 mb-1">Total Students</div>
            <div className="mt-2 text-4xl font-bold text-gray-900">{stats.totalStudents}</div>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-green-50 rounded-xl shadow-soft p-6 border border-green-100 hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Current Month ({monthNames[stats.currentMonth.month - 1].substring(0, 3)} {stats.currentMonth.year})
            </div>
            <div className="mt-2 text-4xl font-bold text-green-600">
              PKR{stats.currentMonth.totalFees.toLocaleString()}
            </div>
            <div className="mt-2 flex items-center space-x-4 text-xs">
              <span className="flex items-center text-green-700">
                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {stats.currentMonth.paidCount} paid
              </span>
              <span className="flex items-center text-orange-600">
                <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {stats.currentMonth.pendingCount} pending
              </span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center ml-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-soft p-6 border border-blue-100 hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Previous Month ({monthNames[stats.previousMonth.month - 1].substring(0, 3)} {stats.previousMonth.year})
            </div>
            <div className="mt-2 text-4xl font-bold text-blue-600">
              PKR{stats.previousMonth.totalFees.toLocaleString()}
            </div>
            <div className="mt-2 text-xs text-gray-600">
              {stats.previousMonth.paidCount} payments received
            </div>
          </div>
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center ml-4">
            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white to-red-50 rounded-xl shadow-soft p-6 border border-red-100 hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-600 mb-1">Overdue Fees</div>
            <div className="mt-2 text-4xl font-bold text-red-600">
              {stats.currentMonth.pendingCount}
            </div>
            <div className="mt-2 text-xs text-gray-600">students need attention</div>
          </div>
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
