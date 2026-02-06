const boardsRouter = require("express").Router();
const Board = require("../models/board");

boardsRouter.get("/", async (req, res) => {
  const boards = await Board.find({});
  res.json(boards);
});

boardsRouter.get("/:id", async (req, res) => {
  const board = await Board.findById(req.params.id);
  if (board) {
    res.json(board);
  } else {
    res.status(404).json({ error: "Board not found" });
  }
});

boardsRouter.post("/", async (request, response) => {
  const { title } = request.body;

  if (!title) {
    return response.status(400).json({ error: "title missing" });
  }

  const board = new Board({
    title: title,
    columns: [
      { title: "To Do", tasks: [] },
      { title: "In Progress", tasks: [] },
      { title: "Done", tasks: [] },
    ],
  });

  const savedBoard = await board.save();
  response.status(201).json(savedBoard);
});

boardsRouter.post("/:id/columns", async (request, response) => {
  const { title } = request.body;
  const board = await Board.findById(request.params.id);

  if (!board) return response.status(404).json({ error: "Board not found" });

  const newColumn = {
    title,
    tasks: [],
  };

  board.columns.push(newColumn);
  await board.save();

  // Return the newly created column (the last one in the array)
  response.status(201).json(board.columns[board.columns.length - 1]);
});

// adding a task to a column
boardsRouter.post("/:id/columns/:columnId/tasks", async (req, res) => {
  const { content, priority } = req.body;
  const board = await Board.findById(req.params.id);
  if (!board) return res.status(404).json({ error: "board not found" });

  const column = board.columns.id(req.params.columnId);

  if (!column) return res.status(404).json({ error: "column not found" });

  column.tasks.push({ content, priority });

  await board.save();

  // REAL-TIME: Tell everyone a task was added
  req.io.to(req.params.id).emit("board_updated", board);

  res.status(201).json(board);
});

boardsRouter.put("/:id", async (req, res) => {
  const { columns } = req.body;

  const updatedBoard = await Board.findByIdAndUpdate(
    req.params.id,
    { columns },
    { new: true, runValidators: true, context: "query" },
  );

  // REAL-TIME: Broadcast the movement to other users
  req.io.to(req.params.id).emit("board_updated", updatedBoard);

  res.json(updatedBoard);
});

boardsRouter.delete(
  "/:boardId/columns/:columnId/tasks/:taskId",
  async (req, res) => {
    const { boardId, columnId, taskId } = req.params;

    const board = await Board.findById(boardId);
    if (!board) return res.status(404).json({ error: "Board not found" });

    const column = board.columns.id(columnId);
    if (!column) return res.status(404).json({ error: "Column not found" });

    // Remove the task by its ID
    column.tasks.pull(taskId);
    await board.save();

    res.status(204).end();
  },
);

boardsRouter.delete("/:id", async (request, response) => {
  await Board.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

module.exports = boardsRouter;
