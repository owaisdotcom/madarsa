import { useState } from 'react';
import { whatsappAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AnnouncementForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    type: 'general',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [groupLink, setGroupLink] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setLoading(true);
    setShowLinks(false);

    try {
      const response = await whatsappAPI.getAnnouncementLinks({
        ...formData,
        useGroup: true
      });
      if (response.data.success) {
        setGroupLink(response.data.data.groupLink || null);
        setShowLinks(true);
        toast.success('Generated WhatsApp group link!');
        if (onSuccess) onSuccess();
      } else {
        toast.error('Failed to generate link');
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to generate link';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = (link) => {
    window.open(link, '_blank');
  };


  const getPlaceholder = () => {
    switch (formData.type) {
      case 'holiday':
        return 'Example: Madarsa will be closed on 15th August for Independence Day.';
      case 'timing_change':
        return 'Example: New timing: Morning classes from 8:00 AM to 10:00 AM.';
      default:
        return 'Enter your announcement message here...';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
          <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Send Announcement</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Announcement Type *
          </label>
          <select
            id="type"
            name="type"
            required
            value={formData.type}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2.5 border bg-white transition-colors"
          >
            <option value="general">General Announcement</option>
            <option value="holiday">Holiday Announcement</option>
            <option value="timing_change">Timing Change</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows="6"
            value={formData.message}
            onChange={handleChange}
            placeholder={getPlaceholder()}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2.5 border bg-white transition-colors"
          />
          <p className="mt-2 text-sm text-gray-500 flex items-center">
            <svg className="h-4 w-4 mr-1.5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Click "Generate Link" to create a WhatsApp group link. Then click the link to send the message to the group.
          </p>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Generate Link</span>
              </>
            )}
          </button>
        </div>
      </form>

      {showLinks && groupLink && (
        <div className="mt-6 border-t pt-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <svg className="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>WhatsApp Group Link</span>
            </h3>
            <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <p className="text-sm text-gray-700 mb-4 flex items-center">
                <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Click the button below to open WhatsApp group with your announcement message pre-filled.
              </p>
              <button
                onClick={() => openWhatsApp(groupLink)}
                className="w-full px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>Open WhatsApp Group</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementForm;
