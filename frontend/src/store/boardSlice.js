import { createSlice } from "@reduxjs/toolkit";

const boardSlice = createSlice({
  name: "board",
  initialState: {
    allBoards: [],
    data: null,
  },
  reducers: {
    setAllBoards: (state, action) => {
      state.allBoards = action.payload;
    },
    setBoard: (state, action) => {
      state.data = action.payload;
    },
    addBoard: (state, action) => {
      state.allBoards.push(action.payload);
      state.data = action.payload;
    },
    moveTask: (state, action) => {
      const { source, destination } = action.payload;
      const board = state.data;

      if (!board) return;

      const sourceCol = board.columns.find(
        (c) => (c._id || c.id).toString() === source.droppableId,
      );
      const destCol = board.columns.find(
        (c) => (c._id || c.id).toString() === destination.droppableId,
      );

      if (sourceCol && destCol) {
        const [movedTask] = sourceCol.tasks.splice(source.index, 1);
        destCol.tasks.splice(destination.index, 0, movedTask);
      }
    },
    removeTask: (state, action) => {
      const { columnId, taskId } = action.payload;
      const column = state.data.columns.find(
        (c) => (c._id || c.id) === columnId,
      );
      if (column) {
        column.tasks = column.tasks.filter((t) => (t._id || t.id) !== taskId);
      }
    },
    updateBoard: (state, action) => {
      state.data = action.payload;
    },
    deleteBoard: (state, action) => {
      const deletedId = action.payload;
      // Remove from the sidebar/list
      state.allBoards = state.allBoards.filter(
        (b) => (b._id || b.id) !== deletedId,
      );

      // If we just deleted the board, switch to the first available one
      if (state.data && (state.data._id || state.data.id) === deletedId) {
        state.data = state.allBoards.length > 0 ? state.allBoards[0] : null;
      }
    },
    addColumn: (state, action) => {
      if (state.data) {
        state.data.columns.push(action.payload);
      }
    },
  },
});

export const {
  setAllBoards,
  setBoard,
  addBoard,
  moveTask,
  removeTask,
  updateBoard,
  deleteBoard,
  addColumn,
} = boardSlice.actions;
export default boardSlice.reducer;
