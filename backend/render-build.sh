#!/bin/bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Start the server
npm start 