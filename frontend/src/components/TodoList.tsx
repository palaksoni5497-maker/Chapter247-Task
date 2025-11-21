'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { todoService, Todo } from '@/services/todoService';

const TodoList: React.FC = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTodos = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      console.log('TodoList: User object:', user);
      console.log('TodoList: User ID:', user.id);
      const userTodos = await todoService.getTodos(user.id);
      setTodos(userTodos);
    } catch (error) {
      setError('Failed to fetch todos');
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    console.log('TodoList useEffect triggered, user:', user);
    if (user) {
      fetchTodos();
    }
  }, [user, fetchTodos]);

  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      const updatedTodo = await todoService.updateTodo(id, { completed });
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    } catch (error) {
      setError('Failed to update todo');
      console.error('Error updating todo:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-4">
        {error}
        <button 
          onClick={fetchTodos}
          className="ml-2 text-indigo-600 hover:text-indigo-500"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todos.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No todos found. Create your first todo!
        </div>
      ) : (
        todos.map((todo) => (
          <div
            key={todo.id}
            className={`flex items-center justify-between p-4 bg-white rounded-lg shadow border-l-4 ${
              todo.completed ? 'border-green-500 bg-green-50' : 'border-blue-500'
            }`}
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={(e) => handleToggleComplete(todo.id, e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span
                className={`text-sm font-medium ${
                  todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}
              >
                {todo.todo}
              </span>
            </div>
            <button
              onClick={() => handleDelete(todo.id)}
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default TodoList;
