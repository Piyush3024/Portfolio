FROM node:18

# Install MySQL
RUN apt-get update && apt-get install -y default-mysql-server default-mysql-client

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Set up MySQL and start app
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 3000
CMD ["/start.sh"]