#!/bin/bash

# Start MySQL
service mysql start

# Create database if it doesn't exist
mysql -e "CREATE DATABASE IF NOT EXISTS portfolio;"
mysql -e "CREATE USER IF NOT EXISTS 'user'@'localhost' IDENTIFIED BY 'password';"
mysql -e "GRANT ALL PRIVILEGES ON portfolio.* TO 'user'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# Run migrations
npx prisma migrate deploy

# Start application
npm start