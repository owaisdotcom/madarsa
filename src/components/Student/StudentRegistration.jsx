import { useState } from 'react';
import { studentsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const StudentRegistration = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    flatName: '',
    flatNo: '',
    monthlyFee: '',
    feeDueDate: '10'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        monthlyFee: parseFloat(formData.monthlyFee),
        feeDueDate: parseInt(formData.feeDueDate)
      };

      await studentsAPI.create(data);
      toast.success('Student registered successfully!');
      setFormData({
        fullName: '',
        phone: '',
        flatName: '',
        flatNo: '',
        monthlyFee: '',
        feeDueDate: '10'
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to register student';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary-100 flex items-center justify-center">
          <svg className="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Register New Student</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2.5 border bg-white transition-colors"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1234567890"
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2.5 border bg-white transition-colors"
            />
          </div>

          <div>
            <label htmlFor="flatName" className="block text-sm font-medium text-gray-700">
              Flat Name *
            </label>
            <input
              type="text"
              id="flatName"
              name="flatName"
              required
              value={formData.flatName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2.5 border bg-white transition-colors"
            />
          </div>

          <div>
            <label htmlFor="flatNo" className="block text-sm font-medium text-gray-700">
              Flat Number *
            </label>
            <input
              type="text"
              id="flatNo"
              name="flatNo"
              required
              value={formData.flatNo}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2.5 border bg-white transition-colors"
            />
          </div>

          <div>
            <label htmlFor="monthlyFee" className="block text-sm font-medium text-gray-700">
              Monthly Fee (PKR) *
            </label>
            <input
              type="number"
              id="monthlyFee"
              name="monthlyFee"
              required
              min="0"
              step="0.01"
              value={formData.monthlyFee}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2.5 border bg-white transition-colors"
            />
          </div>

          <div>
            <label htmlFor="feeDueDate" className="block text-sm font-medium text-gray-700">
              Monthly Fee Due Date (Day) *
            </label>
            <input
              type="number"
              id="feeDueDate"
              name="feeDueDate"
              required
              min="1"
              max="31"
              value={formData.feeDueDate}
              onChange={handleChange}
              placeholder="e.g., 10 (for 10th of each month)"
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2.5 border bg-white transition-colors"
            />
            <p className="mt-1 text-xs text-gray-500">Day of the month when fee is due (1-31)</p>
          </div>
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
                <span>Registering...</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Register Student</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentRegistration;
