
# Inventory Management System

## Setup

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file in the root directory based on `.env.example`
4. Add your MongoDB Atlas connection string to the `.env` file:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string_here
   ```
5. Start the development server with `npm run dev`

## MongoDB Atlas Configuration

1. Create an account on MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user with read/write permissions
4. Get your connection string from the MongoDB Atlas dashboard
5. Add it to your `.env` file

## Running the Application

1. Start the backend server: `node src/server/server.js` (or use a tool like nodemon)
2. Start the frontend development server: `npm run dev`
3. Access the application at http://localhost:8080
