# Sync Board

A real-time collaborative Kanban board built with the MERN stack and Socket.io. Multiple users can create boards, manage tasks, and see changes instantly across all connected clients.

## Features

- **Real-time Collaboration**: Changes sync instantly across all connected users using Socket.io
- **Drag & Drop Interface**: Intuitive task management with smooth drag and drop functionality
- **Multiple Boards**: Create and manage multiple Kanban boards
- **Task Management**: Add, edit, and organize tasks across different columns
- **Responsive Design**: Modern UI built with Tailwind CSS that works on all devices
- **State Management**: Efficient state management with Redux Toolkit
- **Data Persistence**: MongoDB database for reliable data storage

## Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast development server and build tool
- **Redux Toolkit** - State management
- **React Query** - Server state management and caching
- **Socket.io Client** - Real-time communication
- **Tailwind CSS** - Utility-first CSS framework
- **@hello-pangea/dnd** - Drag and drop functionality
- **React Router DOM** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Socket.io** - Real-time bidirectional communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing

## Project Structure

```
sync-board/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API services
│   │   ├── store/           # Redux store configuration
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Node.js backend application
│   ├── controllers/         # Route controllers
│   ├── models/             # MongoDB models
│   ├── utils/              # Backend utilities
│   ├── requests/           # HTTP request handlers
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local instance or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sync-board
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   - Create a `.env` file in the `backend` directory
   - Add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb://localhost:27017/sync-board
   PORT=3001
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The server will run on `http://localhost:3001`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The application will open on `http://localhost:5173`

## Usage

1. **Create a Board**: Click "Create New Board" to start organizing your tasks
2. **Add Tasks**: Create tasks in different columns (To Do, In Progress, Done)
3. **Drag & Drop**: Move tasks between columns by dragging them
4. **Real-time Sync**: Open the app in multiple browser tabs to see real-time synchronization
5. **Manage Boards**: Switch between different boards or delete boards you no longer need

## API Endpoints

- `GET /api/boards` - Get all boards
- `POST /api/boards` - Create a new board
- `GET /api/boards/:id` - Get a specific board
- `PUT /api/boards/:id` - Update a board
- `DELETE /api/boards/:id` - Delete a board

## Socket Events

- `connection` - User connects to the server
- `join_board` - User joins a specific board room
- `move_task` - Task is moved between columns
- `board_updated` - Board data is updated and broadcasted

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
