import { useEffect, useState } from 'react';
import { whatsappAPI } from '../../services/api';
import toast from 'react-hot-toast';

const PendingReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupLink, setGroupLink] = useState(null);
  const [loadingGroupLink, setLoadingGroupLink] = useState(false);

  useEffect(() => {
    fetchPendingReminders();
  }, []);

  const fetchPendingReminders = async () => {
    try {
      const now = new Date();
      const response = await whatsappAPI.getPendingReminders({
        month: now.getMonth() + 1,
        year: now.getFullYear()
      });
      if (response.data.success) {
        setReminders(response.data.data.reminders || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = (link) => {
    window.open(link, '_blank');
  };

  const openAllReminders = () => {
    reminders.forEach((reminder, index) => {
      setTimeout(() => {
        window.open(reminder.link, '_blank');
      }, index * 500);
    });
    toast.success(`Opening ${reminders.length} reminder links...`);
  };

  const fetchGroupReminderLink = async () => {
    if (reminders.length === 0) {
      toast.error('No overdue students to send group reminder');
      return;
    }

    setLoadingGroupLink(true);
    try {
      const now = new Date();
      const response = await whatsappAPI.getGroupReminderLink({
        month: now.getMonth() + 1,
        year: now.getFullYear()
      });
      if (response.data.success) {
        setGroupLink(response.data.data.link);
        window.open(response.data.data.link, '_blank');
        toast.success('Opened WhatsApp group reminder link!');
      } else {
        toast.error(response.data.error || 'Failed to generate group reminder link');
      }
    } catch (error) {
      toast.error('Failed to generate group reminder link');
      console.error(error);
    } finally {
      setLoadingGroupLink(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-5">
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (reminders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-soft p-8 border border-gray-100 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">All Clear!</h3>
        <p className="text-gray-600">No overdue fees for this month. All students have paid or are within their due date!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
            <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Overdue Fee Reminders
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {reminders.length} {reminders.length === 1 ? 'student' : 'students'} need attention
            </p>
          </div>
        </div>
        {reminders.length > 0 && (
          <div className="flex space-x-2">
            <button
              onClick={fetchGroupReminderLink}
              disabled={loadingGroupLink}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center space-x-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{loadingGroupLink ? 'Loading...' : 'Group Reminder'}</span>
            </button>
            <button
              onClick={openAllReminders}
              className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>Send All</span>
            </button>
          </div>
        )}
      </div>
      <div className="max-h-96 overflow-y-auto space-y-3">
        {reminders.map((reminder) => (
          <div
            key={reminder.studentId}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-bold text-red-700">
                  {reminder.studentName.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="font-semibold text-gray-900 truncate">{reminder.studentName}</div>
                  <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full whitespace-nowrap">
                    Overdue
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-0.5">
                  <div className="flex items-center space-x-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    <span>PKR{reminder.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>Due: {reminder.feeDueDate || 10}th each month</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => openWhatsApp(reminder.link)}
              className="ml-4 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2 whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>Send</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingReminders;
