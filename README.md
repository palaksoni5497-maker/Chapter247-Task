# MERN Todo App with Auto-Logout

A full-stack todo application built with Next.js and integrated with DummyJSON API for authentication and todo management. Features include user authentication, todo CRUD operations, and an auto-logout system with configurable timeout.

## Features

- **User Authentication**: Sign up and login using JWT tokens
- **Todo Management**: Create, read, update, and delete todos
- **Auto-Logout**: Configurable session timeout with warning popup
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Real-time Activity Tracking**: Monitors user interactions to reset timeout

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Authentication**: JWT tokens via DummyJSON API
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Cookie Management**: js-cookie

## Project Structure

```
mern-todo-app/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   └── services/        # API services
│   ├── package.json
│   └── README.md
└── README.md                # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mern-todo-app
```

2. Navigate to the frontend directory:
```bash
cd frontend
```

3. Install dependencies:
```bash
npm install
```

4. Create environment file:
```bash
cp .env.example .env.local
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Authentication

1. **Sign Up**: Create a new account with username, email, password, and name
2. **Login**: Sign in with your credentials
3. **Auto-Logout**: The app will automatically log you out after 10 minutes of inactivity (configurable)

### Todo Management

1. **Create Todo**: Use the form on the left to add new todos
2. **View Todos**: All your todos are displayed in the main area
3. **Update Todo**: Click the checkbox to mark todos as complete/incomplete
4. **Delete Todo**: Click the delete button to remove todos

### Settings

1. **Access Settings**: Click the settings icon in the top-right corner
2. **Configure Timeout**: Choose your preferred session timeout duration (5 minutes to 1 hour)
3. **User Info**: View your account information
4. **Logout**: Manually log out from the settings

## Auto-Logout Feature

The application includes a sophisticated auto-logout system:

- **Activity Tracking**: Monitors mouse movements, clicks, keyboard input, and scrolling
- **Configurable Timeout**: Users can set timeout duration from 5 minutes to 1 hour
- **Warning System**: Shows a 60-second countdown popup before logout
- **User Control**: Options to "Stay Logged In" or "Logout Now"
- **Automatic Reset**: Timer resets on any user activity

## API Integration

The app uses the DummyJSON API for:
- User authentication (`/auth/login`)
- User registration (`/users/add`)
- Todo operations (`/todos/*`)

## Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=https://dummyjson.com
NEXT_PUBLIC_DEFAULT_TIMEOUT=10
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Structure

- **Contexts**: `AuthContext` for authentication, `AutoLogoutContext` for session management
- **Components**: Reusable UI components for forms, lists, and modals
- **Services**: API service layer for HTTP requests
- **Types**: TypeScript interfaces for type safety

## Challenges and Solutions

### Challenge 1: Auto-Logout Implementation
**Problem**: Implementing a reliable auto-logout system that tracks user activity and provides a good UX.

**Solution**: 
- Created a custom React context to manage timeout state
- Implemented event listeners for multiple user interaction types
- Added a warning modal with countdown timer
- Made timeout duration configurable by users

### Challenge 2: API Integration
**Problem**: Integrating with DummyJSON API while handling authentication and error states.

**Solution**:
- Created a service layer to abstract API calls
- Implemented proper error handling and loading states
- Used Axios interceptors for automatic token management
- Stored JWT tokens in secure HTTP-only cookies

### Challenge 3: State Management
**Problem**: Managing complex state across authentication, todos, and auto-logout features.

**Solution**:
- Used React Context API for global state management
- Separated concerns into different contexts
- Implemented proper cleanup and memory leak prevention
- Used TypeScript for type safety

## Future Enhancements

- [ ] Add todo categories and tags
- [ ] Implement todo search and filtering
- [ ] Add due dates and reminders
- [ ] Implement offline support with local storage
- [ ] Add dark mode theme
- [ ] Implement real-time collaboration features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
