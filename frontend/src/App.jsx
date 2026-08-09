import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import boardService from "./services/boards";
import { setAllBoards, setBoard } from "./store/boardSlice";
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

  return (
    <div className="flex flex-col h-screen bg-[#0b1120] text-white overflow-hidden">
      {/* Navigation Bar */}
      <nav className="h-16 flex items-center gap-3 px-6 bg-slate-900/40 border-b border-slate-800/60 shrink-0">
        {/* Workspace Label */}
        <div className="mr-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 shrink-0">
          Workspaces
        </div>

        {/* Scrollable Tabs & Action Section */}
        <div className="flex items-center gap-3 overflow-x-auto flex-1 min-w-0 py-2 scrollbar-none">
          {boards.map((b) => (
            <button
              key={b._id || b.id}
              onClick={() => dispatch(setBoard(b))}
              className={`px-4 py-1.5 rounded-full text-xs shrink-0 font-bold transition-all ${
                activeBoard?._id === b._id || activeBoard?.id === b.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {b.title}
            </button>
          ))}

          {/* Inline Create Board Component */}
          <div className="shrink-0">
            <CreateBoard />
          </div>
        </div>
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
