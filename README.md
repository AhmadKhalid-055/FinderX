# FinderX - Lost & Found Management System

FinderX is a modern, responsive, and dynamic full-stack MERN web application designed to help users report, search, and recover lost or found items efficiently.

## Features

- **User Authentication**: Secure Register/Login/Logout using JWT.
- **Dynamic Dashboard**: Users can manage their posts and view messages from others.
- **Post Items**: Report Lost or Found items with details like category, location, date, and image upload.
- **Search & Filter**: Find items instantly by keywords, type, and category.
- **Messaging System**: Contact item owners directly within the app.
- **Smart AI Matching**: Automatically suggests similar found/lost items based on keywords and category matching when viewing an item.
- **Modern UI**: Built with Tailwind CSS v4, featuring a clean glassmorphism aesthetic, dark/light mode toggle, smooth transitions, and responsive design.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS v4, React Router, Axios, Lucide React, Date-Fns.
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, Bcrypt.

## Project Structure

- `/frontend` - React application
- `/backend` - Node.js Express server

## Setup Instructions

### Prerequisites
Make sure you have Node.js and MongoDB installed on your machine. Ensure MongoDB is running locally on the default port `27017` or update the `MONGO_URI` in the backend `.env` file.

### 1. Setup Backend

Open a terminal in the `backend` directory:
```bash
cd backend
node server.js
```

The backend will start running on `http://localhost:5000`.

### 2. Setup Frontend

Open a new terminal in the `frontend` directory:
```bash
cd frontend
npm run dev
```
The frontend will start running on `http://localhost:5173` (or whichever port Vite allocates).

## Sample Testing Workflow

1. Register a new user account.
2. Go to the "Post Item" page and create a "Lost" report (e.g., "Lost Black Wallet", "Wallet/Keys" category).
3. Register a second user account (or use another browser/incognito).
4. Create a "Found" report with similar keywords (e.g., "Found Wallet", "Wallet/Keys").
5. View the details of the Lost item. Scroll to the bottom to see the "Smart Matches Suggested For You" section which should display the Found item.
6. As the second user, leave a message on the first user's item.
7. Login as the first user and check the "Dashboard" to see the incoming message.

## Customization

You can change the theme colors in `frontend/src/index.css` by modifying the `@theme` variables.
