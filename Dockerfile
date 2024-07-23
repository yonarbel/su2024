# Dockerfile
# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to work directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Bundle app source inside Docker image
COPY . .

# Build app for production with minification
RUN npm run build

# Install serve to serve the static files
RUN npm install -g serve

# Command to run the app
CMD ["serve", "-s", "dist"]