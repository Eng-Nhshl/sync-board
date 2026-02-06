const app = require("./app");
const http = require("http");
const config = require("./utils/config");
const { Server } = require("socket.io");
const { socketMiddleware } = require("./utils/middleware");
const Board = require("./models/board");

const server = http.createServer(app);

// 1. Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// 2. Inject Socket.io into Express request object
app.use(socketMiddleware(io));

// 3. Routes
const boardsRouter = require("./controllers/boards");
app.use("/api/boards", boardsRouter);

// 4. Socket.io Event Logic
io.on("connection", (socket) => {
  console.log("user connected:", socket.id);

  // User enters a specific board page
  socket.on("join_board", (boardId) => {
    socket.join(boardId);
    console.log(`User joined board: ${boardId}`);
  });

  // Real-time Drag and Drop synchronization
  socket.on("move_task", async ({ boardId, source, destination }) => {
    try {
      const board = await Board.findById(boardId);
      if (!board) return;

      const sourceCol = board.columns.id(source.droppableId);
      const destCol = board.columns.id(destination.droppableId);

      if (sourceCol && destCol) {
        // Remove task from the old position
        const [movedTask] = sourceCol.tasks.splice(source.index, 1);
        // Add task to the new position
        destCol.tasks.splice(destination.index, 0, movedTask);

        await board.save();

        // Broadcast the updated board to everyone in that room
        io.to(boardId).emit("board_updated", board);
      }
    } catch (error) {
      console.error("Socket Move Task Error:", error.message);
      // Optional: emit an error back to the user
      socket.emit("error", { message: "Failed to move task" });
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// 5. Post-route Middlewares
const middleware = require("./utils/middleware");
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

// 6. Start Server
server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
