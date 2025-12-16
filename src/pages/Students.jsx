import { useState } from 'react';
import StudentRegistration from '../components/Student/StudentRegistration';
import StudentList from '../components/Student/StudentList';

const Students = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRegistrationSuccess = () => {
    setShowRegistration(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Students
            </h1>
            <p className="mt-2 text-sm text-gray-600">Manage student registrations and information</p>
          </div>
          <button
            onClick={() => setShowRegistration(!showRegistration)}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-md hover:shadow-lg transition-all duration-200 font-medium flex items-center space-x-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>{showRegistration ? 'Hide Form' : 'Add New Student'}</span>
          </button>
        </div>

        {showRegistration && (
          <div className="mb-8">
            <StudentRegistration onSuccess={handleRegistrationSuccess} />
          </div>
        )}

        <StudentList key={refreshKey} />
      </div>
    </div>
  );
};

export default Students;
