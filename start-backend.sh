#!/bin/bash

# Start MongoDB (make sure MongoDB is installed and running)
echo "🔄 Starting MongoDB..."
brew services start mongodb-community@7.0 2>/dev/null || echo "⚠️  MongoDB might already be running or not installed via brew"

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Start the backend server
echo "🚀 Starting backend server..."
npm run dev