'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { todoService } from '@/services/todoService';

interface TodoFormProps {
  onTodoAdded: () => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ onTodoAdded }) => {
  const { user } = useAuth();
  const [todoText, setTodoText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoText.trim() || !user) return;

    try {
      setLoading(true);
      setError('');
      const newTodo = await todoService.createTodo({
        todo: todoText.trim(),
        completed: false,
        userId: user.id,
      });
      console.log('Todo created successfully:', newTodo);
      setTodoText('');
      console.log('Calling onTodoAdded callback');
      onTodoAdded();
    } catch (error) {
      setError('Failed to create todo');
      console.error('Error creating todo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Todo</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="todo" className="block text-sm font-medium text-gray-700">
            Todo Description
          </label>
          <input
            type="text"
            id="todo"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
            placeholder="Enter your todo..."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading || !todoText.trim()}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Add Todo'}
        </button>
      </form>
    </div>
  );
};

export default TodoForm;
