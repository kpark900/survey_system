// src/App.js
import React, { useEffect } from 'react';
import { auth } from './firebase/config.js';
import { useAuthState } from 'react-firebase-hooks';;
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Button from './components/ui/button.js';;;
import StudentSurveyView from './views/StudentSurveyView.js';;;
import AdminTools from './components/AdminTools.js';;;
import { initializeDatabase } from './firebase/fire_initialize.js';;;

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  // Database initialization
  useEffect(() => {
    const init = async () => {
      try {
        await initializeDatabase();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Database initialization failed:', error);
      }
    };

    // Only initialize if user is admin
    if (user?.email?.endsWith('@admin.edu')) {
      init();
    }
  }, [user]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
        <p className="ml-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-red-600 text-center">
          <p className="text-lg font-bold">An error occurred:</p>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-blue-50 to-blue-100">
        <h1 className="text-2xl font-bold text-blue-900">Welcome to the Student Core Competency Survey</h1>
        <p className="text-gray-700">Sign in to participate in surveys or manage the system.</p>
        <Button 
          onClick={signInWithGoogle}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
            />
          </svg>
          Sign in with Google
        </Button>
      </div>
    );
  }

  const isAdmin = user.email?.endsWith('@admin.edu');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <header className="mb-8 flex justify-between items-center border-b pb-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              {isAdmin ? 'Survey Administration' : 'Core Competency Survey'}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <Button 
                variant="outline" 
                onClick={() => auth.signOut()}
                size="sm"
                className="border px-3 py-1 rounded text-gray-800 hover:bg-gray-100"
              >
                Sign Out
              </Button>
            </div>
          </header>
          {isAdmin ? <AdminTools /> : <StudentSurveyView />}
        </div>
      </div>
    </div>
  );
};

export default App;
