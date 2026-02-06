import { useState } from "react";
import { useDispatch } from "react-redux";
import boardService from "../services/boards";
import { addBoard } from "../store/boardSlice";

const CreateBoard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const newBoard = await boardService.create(title);
      dispatch(addBoard(newBoard));
      setTitle("");
      setIsEditing(false);
    } catch (error) {
      console.error("Error creating board:", error);
    }
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="ml-4 px-3 py-1.5 border border-dashed border-slate-700 rounded-lg text-xs text-slate-500 hover:border-blue-500/50 hover:text-blue-400 hover:bg-blue-500/5 transition-all flex items-center gap-2"
      >
        <span className="text-lg leading-none">+</span>
        New Board
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="ml-4 flex items-center gap-2">
      <input
        autoFocus
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Board name..."
        className="bg-slate-800 border border-slate-700 text-white text-xs rounded-md px-2 py-1.5 focus:outline-none focus:border-blue-500 w-32"
        onBlur={() => !title && setIsEditing(false)}
      />
      <div className="flex gap-1">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-2 py-1.5 rounded uppercase"
        >
          Create
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="text-slate-500 hover:text-slate-300 px-1"
        >
          ✕
        </button>
      </div>
    </form>
  );
};

export default CreateBoard;
