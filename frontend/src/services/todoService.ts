import axios from 'axios';

const API_BASE_URL = 'https://dummyjson.com';

export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface CreateTodoData {
  todo: string;
  completed?: boolean;
  userId: number;
}

export interface UpdateTodoData {
  todo?: string;
  completed?: boolean;
}

class TodoService {
  private getHeaders() {
    return {
      'Content-Type': 'application/json',
    };
  }

  async getTodos(userId: number): Promise<Todo[]> {
    try {
      console.log('Fetching todos for user ID:', userId);
      
      // For DummyJSON users (ID 1), get both API data and localStorage data
      if (userId === 1) {
        const url = `${API_BASE_URL}/todos/user/${userId}`;
        console.log('API URL:', url);
        
        const response = await axios.get(url, {
          headers: this.getHeaders(),
        });
        console.log('DummyJSON API response:', response.data);
        
        // Get todos from API
        const apiTodos = response.data.todos || [];
        
        // Get todos from localStorage
        const localTodos = JSON.parse(localStorage.getItem(`mockTodos_${userId}`) || '[]');
        console.log('LocalStorage todos:', localTodos);
        
        // Combine both (localStorage todos will have higher IDs)
        const allTodos = [...apiTodos, ...localTodos];
        console.log('Combined todos:', allTodos);
        
        return allTodos;
      }
      
      // For other users, try API first
      const url = `${API_BASE_URL}/todos/user/${userId}`;
      console.log('API URL:', url);
      
      const response = await axios.get(url, {
        headers: this.getHeaders(),
      });
      console.log('Todos response:', response.data);
      return response.data.todos || [];
    } catch (error) {
      console.error('Error fetching todos from DummyJSON:', error);
      
      // Fallback to mock todos for registered users
      if (userId > 1000) { // Mock users have IDs > 1000
        console.log('Using mock todos for user ID:', userId);
        const mockTodos = JSON.parse(localStorage.getItem(`mockTodos_${userId}`) || '[]');
        return mockTodos;
      }
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }

  async createTodo(todoData: CreateTodoData): Promise<Todo> {
    try {
      // For DummyJSON users (ID 1), also store in localStorage since DummyJSON doesn't persist
      if (todoData.userId === 1) {
        const mockTodos = JSON.parse(localStorage.getItem(`mockTodos_${todoData.userId}`) || '[]');
        const newTodo: Todo = {
          id: Date.now(),
          todo: todoData.todo,
          completed: todoData.completed || false,
          userId: todoData.userId,
        };
        mockTodos.push(newTodo);
        localStorage.setItem(`mockTodos_${todoData.userId}`, JSON.stringify(mockTodos));
        console.log('Stored todo in localStorage for DummyJSON user:', newTodo);
        return newTodo;
      }
      
      // For other mock users, store in localStorage
      if (todoData.userId > 1000) {
        const mockTodos = JSON.parse(localStorage.getItem(`mockTodos_${todoData.userId}`) || '[]');
        const newTodo: Todo = {
          id: Date.now(),
          todo: todoData.todo,
          completed: todoData.completed || false,
          userId: todoData.userId,
        };
        mockTodos.push(newTodo);
        localStorage.setItem(`mockTodos_${todoData.userId}`, JSON.stringify(mockTodos));
        return newTodo;
      }
      
      // For DummyJSON users, use API (but this won't persist)
      const response = await axios.post(`${API_BASE_URL}/todos/add`, todoData, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  }

  async updateTodo(id: number, updateData: UpdateTodoData): Promise<Todo> {
    try {
      // For mock todos (IDs > 1000000), update in localStorage
      if (id > 1000000) {
        // Find which user this todo belongs to
        const userIds = Object.keys(localStorage).filter(key => key.startsWith('mockTodos_'));
        for (const userIdKey of userIds) {
          const todos = JSON.parse(localStorage.getItem(userIdKey) || '[]');
          const todoIndex = todos.findIndex((todo: Todo) => todo.id === id);
          if (todoIndex !== -1) {
            todos[todoIndex] = { ...todos[todoIndex], ...updateData };
            localStorage.setItem(userIdKey, JSON.stringify(todos));
            return todos[todoIndex];
          }
        }
        throw new Error('Todo not found');
      }
      
      // For DummyJSON todos, try localStorage first (for user-added todos)
      const userIds = Object.keys(localStorage).filter(key => key.startsWith('mockTodos_'));
      for (const userIdKey of userIds) {
        const todos = JSON.parse(localStorage.getItem(userIdKey) || '[]');
        const todoIndex = todos.findIndex((todo: Todo) => todo.id === id);
        if (todoIndex !== -1) {
          todos[todoIndex] = { ...todos[todoIndex], ...updateData };
          localStorage.setItem(userIdKey, JSON.stringify(todos));
          return todos[todoIndex];
        }
      }
      
      // For original DummyJSON todos, use API
      const response = await axios.put(`${API_BASE_URL}/todos/${id}`, updateData, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  }

  async deleteTodo(id: number): Promise<boolean> {
    try {
      // For mock todos (IDs > 1000000), delete from localStorage
      if (id > 1000000) {
        const userIds = Object.keys(localStorage).filter(key => key.startsWith('mockTodos_'));
        for (const userIdKey of userIds) {
          const todos = JSON.parse(localStorage.getItem(userIdKey) || '[]');
          const todoIndex = todos.findIndex((todo: Todo) => todo.id === id);
          if (todoIndex !== -1) {
            todos.splice(todoIndex, 1);
            localStorage.setItem(userIdKey, JSON.stringify(todos));
            return true;
          }
        }
        throw new Error('Todo not found');
      }
      
      // For DummyJSON todos, try localStorage first (for user-added todos)
      const userIds = Object.keys(localStorage).filter(key => key.startsWith('mockTodos_'));
      for (const userIdKey of userIds) {
        const todos = JSON.parse(localStorage.getItem(userIdKey) || '[]');
        const todoIndex = todos.findIndex((todo: Todo) => todo.id === id);
        if (todoIndex !== -1) {
          todos.splice(todoIndex, 1);
          localStorage.setItem(userIdKey, JSON.stringify(todos));
          return true;
        }
      }
      
      // For original DummyJSON todos, use API
      await axios.delete(`${API_BASE_URL}/todos/${id}`, {
        headers: this.getHeaders(),
      });
      return true;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  }
}

export const todoService = new TodoService();
