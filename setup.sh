#!/bin/bash

# MERN Todo App Setup Script

echo "🚀 Setting up MERN Todo App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Navigate to frontend directory
# cd frontend

# # Install dependencies
# echo "📦 Installing frontend dependencies..."
# npm install

# if [ $? -eq 0 ]; then
#     echo "✅ Frontend dependencies installed successfully"
# else
#     echo "❌ Failed to install frontend dependencies"
#     exit 1
# fi

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# Next.js Environment Variables
NEXT_PUBLIC_API_URL=https://dummyjson.com

# Default session timeout in minutes
NEXT_PUBLIC_DEFAULT_TIMEOUT=10
EOF
    echo "✅ .env.local file created"
else
    echo "✅ .env.local file already exists"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "To start the development server:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
echo "Features:"
echo "  - User authentication (signup/login)"
echo "  - Todo management (create, read, update, delete)"
echo "  - Auto-logout with configurable timeout"
echo "  - Responsive design with Tailwind CSS"
echo ""
