import { useState, useEffect } from 'react';
import AnnouncementForm from '../components/WhatsApp/AnnouncementForm';
import { whatsappAPI } from '../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchAnnouncements();
  }, [refreshKey]);

  const fetchAnnouncements = async () => {
    try {
      const response = await whatsappAPI.getAnnouncements();
      setAnnouncements(response.data.data);
    } catch (error) {
      toast.error('Failed to load announcements');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'holiday':
        return 'Holiday';
      case 'timing_change':
        return 'Timing Change';
      default:
        return 'General';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'holiday':
        return 'bg-blue-100 text-blue-800';
      case 'timing_change':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 md:py-8">
        <div className="mb-4 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            Announcements
          </h1>
          <p className="mt-1 md:mt-2 text-sm text-gray-600">Send WhatsApp announcements to all students</p>
        </div>

        <div className="mb-8">
          <AnnouncementForm onSuccess={handleSuccess} />
        </div>

        <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Announcement History</h2>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-500">Loading announcements...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-500 text-lg">No announcements sent yet</p>
              <p className="text-gray-400 text-sm mt-2">Create your first announcement above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-gray-50/50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${getTypeColor(announcement.type)}`}>
                        {getTypeLabel(announcement.type)}
                      </span>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{format(new Date(announcement.sentAt), 'dd MMM yyyy, hh:mm a')}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 px-3 py-1.5 bg-primary-50 rounded-full">
                      <svg className="h-4 w-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="text-xs font-semibold text-primary-700">
                        {announcement.sentTo?.length || 0} {announcement.sentTo?.length === 1 ? 'recipient' : 'recipients'}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{announcement.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
