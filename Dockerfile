# Use the official Node.js 14 image as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for installing dependencies
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the dist folder and server folder from your project into the container
COPY dist/ ./dist
COPY server/ ./server

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["node", "server/index.js"]