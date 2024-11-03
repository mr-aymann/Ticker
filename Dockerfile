# Use an official Node.js image as the base
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port the app will run on (use the PORT env variable)
EXPOSE ${PORT}

# Run the application
CMD ["node", "server.js"]
