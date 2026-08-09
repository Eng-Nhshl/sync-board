import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteBoard,
  moveTask,
  removeTask,
  setBoard,
  updateBoard,
} from "../store/boardSlice";
import boardService from "../services/boards";
import { io } from "socket.io-client";
import AddTask from "./AddTask";
import AddColumn from "./AddColumn";

const socket = io("http://localhost:3001");

const Board = ({ boardId }) => {
  const dispatch = useDispatch();
  const board = useSelector((state) => state.board.data);
  const activeBoard = useSelector((state) => state.board.data);

  useEffect(() => {
    boardService.getById(boardId).then((data) => {
      dispatch(setBoard(data));
    });

    socket.emit("join_board", boardId);
    socket.on("board_updated", (updatedBoard) => {
      dispatch(updateBoard(updatedBoard));
    });

    return () => {
      socket.off("board_updated");
    };
  }, [boardId, dispatch]);

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    dispatch(moveTask({ source, destination }));

    socket.emit("move_task", {
      boardId,
      source,
      destination,
    });
  };

  const handleDeleteTask = async (columnId, taskId) => {
    if (window.confirm("Delete this task?")) {
      await boardService.deleteTask(board._id || board.id, columnId, taskId);
      dispatch(removeTask({ columnId, taskId }));
      socket.emit("task_deleted", { boardId: board._id, columnId, taskId });
    }
  };

  const handleDeleteBoard = async () => {
    if (!activeBoard) return;

    const boardTitle = activeBoard.title;
    const boardId = activeBoard._id || activeBoard.id;

    if (window.confirm(`Are you sure you want to delete "${boardTitle}"?`)) {
      try {
        await boardService.delete(boardId);
        dispatch(deleteBoard(boardId));
      } catch (error) {
        console.error("Error deleting board:", error);
        alert("Failed to delete board.");
      }
    }
  };

  if (!board)
    return <div className="p-8 text-slate-400">Loading your workspace...</div>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col h-full w-full bg-transparent overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-md shrink-0">
          <h1 className="text-xl font-bold bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            {board.title}
          </h1>
          {activeBoard && (
            <button
              onClick={handleDeleteBoard}
              className="shrink-0 ml-2 p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all group cursor-pointer"
              title="Delete current board"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </header>

        {/* Main Board Area */}
        <main className="flex-1 overflow-x-auto min-h-0">
          {/* FIXED: items-stretch ensures columns inherit full main height */}
          <div className="flex h-full p-6 gap-6 items-stretch min-w-max">
            {board.columns.map((column, colIndex) => {
              const colId = column._id || column.id || `temp-col-${colIndex}`;

              return (
                /* FIXED: Removed max-h-full, added h-full min-h-0 to lock column frame */
                <div
                  key={colId}
                  className="w-80 flex flex-col h-full min-h-0 shrink-0 bg-slate-800/60 rounded-2xl border border-slate-700/50 shadow-2xl"
                >
                  {/* Column Title */}
                  <div className="p-4 flex justify-between items-center shrink-0">
                    <h2 className="font-bold text-xs uppercase tracking-widest text-slate-400">
                      {column.title}
                    </h2>
                    <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-300">
                      {column.tasks.length}
                    </span>
                  </div>

                  {/* Droppable Task List */}
                  <Droppable droppableId={colId.toString()}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex-1 overflow-y-auto px-4 pb-2 space-y-3 custom-scrollbar min-h-0"
                      >
                        {column.tasks.map((task, index) => (
                          <Draggable
                            key={task._id || task.id}
                            draggableId={(task._id || task.id).toString()}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="relative p-4 rounded-xl border bg-slate-800/80 border-slate-700/50 group"
                              >
                                <p className="text-sm text-slate-200 pr-6">
                                  {task.content}
                                </p>
                                <button
                                  onClick={() =>
                                    handleDeleteTask(
                                      column._id || column.id,
                                      task._id || task.id,
                                    )
                                  }
                                  className="absolute cursor-pointer top-3 right-3 group-hover:opacity-100 text-slate-500 hover:text-red-500 transition-all"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))}

                        {provided.placeholder}

                        <AddTask
                          boardId={board._id || board.id}
                          columnId={column._id || column.id}
                        />
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}

            <AddColumn boardId={board._id || board.id} />
          </div>
        </main>
      </div>
    </DragDropContext>
  );
};

export default Board;
