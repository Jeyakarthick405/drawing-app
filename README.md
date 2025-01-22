# Real-Time Collaborative Drawing App

Welcome to the Real-Time Collaborative Drawing App! This application allows multiple users to draw on a shared canvas in real time. It uses WebSocket technology to synchronize the drawing updates across all connected clients, ensuring that everyone can see the same drawing instantly. 

In this project, the backend is built using **Node.js** with WebSocket support, while the frontend uses **Next.js**.

## Features

- **Live Drawing Sync**: All users connected to the app can see drawing updates in real time.
- **User Connection Handling**: Displays notifications when a user joins or disconnects.
- **Brush Tools**: Allows users to draw with different brush sizes and colors.
- **Reset Canvas**: A button to clear the canvas for all users.
- **Responsive Design**: The app is designed to work on both desktop and mobile devices.
- **Scalability**: The backend is optimized to handle multiple users without performance issues.

## Technologies Used

- **Backend**: Node.js, Socket.IO, Express.js
- **Frontend**: Next.js, HTML5, CSS3
- **Communication**: WebSocket via Socket.IO for real-time updates

## Installation

### Cloning the Repo

To get started, clone the repository using the following command:

```bash
git clone https://github.com/Jeyakarthick405/drawing-app.git
```

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Run the backend server:
   ```bash
   node server.js
   ```

   The backend server will be running on `http://localhost:8000`.

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Run the frontend development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`.

## Running the App

1. Ensure that both the backend and frontend servers are running.
2. Open the frontend URL (`http://localhost:3000`) in your browser.
3. Open multiple tabs or browsers to see the collaborative drawing in action.

