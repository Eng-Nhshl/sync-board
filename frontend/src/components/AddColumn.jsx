import { useState } from "react";
import { useDispatch } from "react-redux";
import boardService from "../services/boards";
import { addColumn } from "../store/boardSlice";

const AddColumn = ({ boardId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const dispatch = useDispatch();

  const handleAdd = async () => {
    if (!title.trim()) return;
    const newCol = await boardService.addColumn(boardId, title);
    dispatch(addColumn(newCol));
    setTitle("");
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="w-80 cursor-pointer shrink-0 h-14 rounded-2xl border-2 border-dashed border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700 hover:bg-slate-800/20 transition-all font-medium text-sm"
      >
        + Add another list
      </button>
    );
  }

  return (
    <div className="w-80 shrink-0 bg-slate-900/60 p-4 rounded-2xl border border-slate-700">
      <input
        autoFocus
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
        placeholder="Enter list title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleAdd}
          className="bg-blue-600 px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
        >
          Add List
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="text-slate-400 text-xs hover:text-white cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddColumn;
