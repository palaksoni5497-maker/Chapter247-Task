'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import Settings from './Settings';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTodoAdded = () => {
    console.log('Dashboard: handleTodoAdded called, refreshing TodoList');
    setRefreshKey(prev => {
      const newKey = prev + 1;
      console.log('Dashboard: refreshKey updated to:', newKey);
      return newKey;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Todo App</h1>
              <p className="text-sm text-gray-600">
                Welcome back, {user?.firstName}!
              </p>
            </div>
            <Settings />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Todo Form */}
            <div className="lg:col-span-1">
              <TodoForm onTodoAdded={handleTodoAdded} />
            </div>

            {/* Todo List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Todos</h2>
                <TodoList key={refreshKey} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
