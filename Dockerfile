# Use the official Node.js 22.14.0 image with Alpine 3.21
FROM node:22.14.0-alpine3.21

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if you have them)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application files
COPY . .

# Expose the port your app will run on (e.g., 3000)
EXPOSE 3000

# Command to run your app (update it to your specific entry point)
CMD ["npm", "start"]

