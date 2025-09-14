'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Button } from './ui/button';
import { QuietBlockForm } from './QuietBlockForm.jsx';
import { QuietBlocksList } from './QuietBlocksList.jsx';
import { LogOut, User, Settings } from 'lucide-react';

export function Dashboard() {
  const { user, logout } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const testCronEndpoint = async () => {
    try {
      const cronSecret = process.env.NEXT_PUBLIC_CRON_SECRET || 'your-cron-secret';
      const response = await fetch('/api/cron/email-notifications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${cronSecret}`,
        },
      });
      
      const result = await response.json();
      alert(`CRON Test Result: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      alert(`CRON Test Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-xl">🔕</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Quiet Hours
              </h1>
              <p className="text-sm text-gray-600">Focus • Study • Achieve</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>Welcome, {user?.name}</span>
            </div>
            
            {/* Test CRON button for development */}
            {process.env.NODE_ENV === 'development' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={testCronEndpoint}
                className="text-gray-600 hover:text-blue-600"
              >
                <Settings className="w-4 h-4 mr-2" />
                Test CRON
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-600 hover:text-red-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">
              Ready for focused study time?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Schedule your quiet blocks and receive email reminders 10 minutes before each session starts. 
              Create distraction-free time for deep work and focused learning.
            </p>
          </div>

          {/* Form and List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <QuietBlockForm onSuccess={handleSuccess} />
            <QuietBlocksList refreshTrigger={refreshTrigger} />
          </div>

          {/* Tips Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border-0">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              💡 Tips for Effective Quiet Sessions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="space-y-2">
                <p className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">•</span>
                  Set specific, achievable goals for each session
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  Turn off notifications on all devices
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-purple-500 font-bold">•</span>
                  Have all materials ready before starting
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex items-start gap-2">
                  <span className="text-orange-500 font-bold">•</span>
                  Choose a comfortable, well-lit space
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  Stay hydrated and take breaks when needed
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-teal-500 font-bold">•</span>
                  Review and celebrate your progress afterward
                </p>
              </div>
            </div>
          </div>

          {/* CRON Setup Instructions */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4">
              📧 Email Notifications Setup
            </h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p>
                <strong>For Production:</strong> Set up a CRON job to call the email notification endpoint every minute:
              </p>
              <code className="block bg-blue-100 p-2 rounded text-xs font-mono">
                * * * * * curl -X GET "https://your-domain.com/api/cron/email-notifications" -H "Authorization: Bearer your-cron-secret"
              </code>
              <p className="mt-3">
                <strong>Environment Variables Required:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><code>CRON_SECRET</code> - Secret key for CRON authentication</li>
                <li><code>MONGODB_URI</code> - MongoDB connection string</li>
                <li><code>JWT_SECRET</code> - JWT signing secret</li>
                <li>Email service credentials (SendGrid, AWS SES, etc.)</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}