import { useState, useEffect } from 'react';
import { feesAPI, studentsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const FeePayment = ({ onSuccess }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    paymentMethod: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [whatsappLink, setWhatsappLink] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      const student = students.find(s => s._id === selectedStudent);
      if (student) {
        setFormData(prev => ({
          ...prev,
          studentId: selectedStudent,
          amount: student.monthlyFee
        }));
      }
    }
  }, [selectedStudent, students]);

  const fetchStudents = async () => {
    try {
      const response = await studentsAPI.getAll({ isActive: 'true' });
      setStudents(response.data.data);
    } catch (error) {
      toast.error('Failed to load students');
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setWhatsappLink(null);

    try {
      const data = {
        ...formData,
        studentId: selectedStudent,
        amount: parseFloat(formData.amount),
        month: parseInt(formData.month),
        year: parseInt(formData.year)
      };

      const response = await feesAPI.create(data);
      toast.success('Fee payment recorded successfully!');
      
      if (response.data.data.whatsappLink) {
        setWhatsappLink(response.data.data.whatsappLink);
      }
      
      setFormData({
        studentId: '',
        amount: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        paymentMethod: '',
        notes: ''
      });
      setSelectedStudent('');
      if (onSuccess) onSuccess();
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to record fee payment';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    if (whatsappLink) {
      window.open(whatsappLink, '_blank');
    }
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="bg-white rounded-xl shadow-soft p-6 border border-gray-100">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
          <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Record Fee Payment</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">
            Student *
          </label>
          {loadingStudents ? (
            <div className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-3 py-2 border bg-gray-100">
              Loading students...
            </div>
          ) : (
            <select
              id="studentId"
              name="studentId"
              required
              value={selectedStudent}
              onChange={handleStudentChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2.5 border bg-white transition-colors"
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.fullName} - {student.phone} (PKR{student.monthlyFee})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount (PKR) *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              required
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2.5 border bg-white transition-colors"
            />
          </div>

          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700">
              Month *
            </label>
            <select
              id="month"
              name="month"
              required
              value={formData.month}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2.5 border bg-white transition-colors"
            >
              {monthNames.map((month, index) => (
                <option key={index + 1} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Year *
            </label>
            <input
              type="number"
              id="year"
              name="year"
              required
              min="2020"
              max={new Date().getFullYear() + 1}
              value={formData.year}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2.5 border bg-white transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
            Payment Method
          </label>
          <input
            type="text"
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            placeholder="Cash, UPI, Bank Transfer, etc."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            value={formData.notes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-3 py-2 border"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          {whatsappLink && (
            <button
              type="button"
              onClick={openWhatsApp}
              className="px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition-all duration-200 flex items-center space-x-2 font-medium"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span>Send WhatsApp</span>
            </button>
          )}
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
                <span>Recording...</span>
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Record Payment</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeePayment;
