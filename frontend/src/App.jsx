import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import boardService from "./services/boards";
import { setAllBoards, setBoard, deleteBoard } from "./store/boardSlice";
import Board from "./components/Board";
import CreateBoard from "./components/CreateBoard";
import EmptyState from "./components/EmptyState";

const App = () => {
  const dispatch = useDispatch();

  const boards = useSelector((state) => state.board.allBoards);
  const activeBoard = useSelector((state) => state.board.data);

  useEffect(() => {
    boardService.getAll().then((data) => {
      dispatch(setAllBoards(data));
      if (data.length > 0 && !activeBoard) {
        dispatch(setBoard(data[0]));
      }
    });
  }, [dispatch, activeBoard]);

  useEffect(() => {
    if (activeBoard) {
      document.title = `${activeBoard.title} | Atomic Kanban`;
    } else {
      document.title = "Atomic Kanban";
    }
  }, [activeBoard]);

  // 3. Logic to delete the currently viewed board
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

  return (
    <div className="flex flex-col h-screen bg-[#0b1120] text-white overflow-hidden">
      {/* Navigation Bar */}
      <nav className="h-16 flex items-center gap-3 px-6 bg-slate-900/40 border-b border-slate-800/60 shrink-0">
        <div className="mr-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          Workspaces
        </div>

        {/* Board Tabs */}
        {boards.map((b) => (
          <button
            key={b._id || b.id}
            onClick={() => dispatch(setBoard(b))}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeBoard?._id === b._id || activeBoard?.id === b.id
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            {b.title}
          </button>
        ))}

        {/* Create Board Component (Inline input) */}
        <CreateBoard />

        {/* Delete Board Button (Pushed to the right) */}
        {activeBoard && (
          <button
            onClick={handleDeleteBoard}
            className="ml-auto p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all group"
            title="Delete current board"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        {activeBoard ? (
          <Board boardId={activeBoard._id || activeBoard.id} />
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
};

export default App;
