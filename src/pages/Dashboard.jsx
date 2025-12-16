import DashboardStats from '../components/Dashboard/DashboardStats';
import MonthlyFeesChart from '../components/Dashboard/MonthlyFeesChart';
import RecentPayments from '../components/Dashboard/RecentPayments';
import PendingReminders from '../components/Dashboard/PendingReminders';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50/30 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 flex items-center space-x-4 animate-fade-in">
          <div className="relative">
            <img 
              src="/logo.jpg" 
              alt="Madarsa Logo" 
              className="h-20 w-20 rounded-full object-cover shadow-soft-lg border-4 border-white hidden sm:block"
            />
            <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-primary-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-600">Welcome back! Here's your Madarsa overview</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="animate-slide-up">
            <DashboardStats />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <MonthlyFeesChart />
            <RecentPayments />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <PendingReminders />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
