import { useState } from "react";
import boardService from "../services/boards";

const AddTask = ({ boardId, columnId }) => {
  const [text, setText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    // We send the object matching what the backend expects { content: text }
    await boardService.addTask(boardId, columnId, { content: text });

    setText("");
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-full text-left p-2 mt-2 text-slate-400 hover:bg-slate-700 hover:text-slate-200 rounded-lg transition-colors text-sm font-medium"
      >
        + Add a card
      </button>
    );
  }

  return (
    <form onSubmit={handleAdd} className="mt-2">
      <textarea
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter a title for this card..."
        className="w-full bg-slate-700 text-slate-100 p-3 rounded-lg border border-blue-500 outline-none text-sm resize-none shadow-inner"
        rows="3"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            handleAdd(e);
          }
        }}
      />
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm font-bold transition-colors"
        >
          Add card
        </button>
        <button
          type="button"
          onClick={() => setIsAdding(false)}
          className="text-slate-400 hover:text-slate-200 px-3 py-1.5 text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddTask;
