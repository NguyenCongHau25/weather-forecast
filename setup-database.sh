#!/bin/bash

echo "🚀 Starting Weather Forecast Database Setup..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    echo "📌 Please start Docker Desktop and run this script again."
    echo ""
    echo "Steps:"
    echo "1. Open Docker Desktop application"
    echo "2. Wait for Docker to start"
    echo "3. Run: ./setup-database.sh"
    exit 1
fi

echo "✅ Docker is running"
echo ""

# Start PostgreSQL with Docker Compose
echo "🐘 Starting PostgreSQL database..."
docker-compose up -d

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Check if container is running
if docker ps | grep -q "weather-forecast-db"; then
    echo "✅ Database is running!"
    echo ""
    echo "📊 Database Info:"
    echo "   Host: localhost"
    echo "   Port: 5432"
    echo "   Database: weather_forecast"
    echo "   Username: postgres"
    echo "   Password: postgres123"
    echo ""
    echo "🔐 Test Accounts:"
    echo "   Admin: admin@weather.com / password123"
    echo "   User: user@weather.com / password123"
    echo ""
    echo "🎉 Setup complete! You can now run: yarn dev"
else
    echo "❌ Failed to start database"
    echo "Run 'docker-compose logs' to see errors"
    exit 1
fi
