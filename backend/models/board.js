const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const columnSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "New Column",
  },
  tasks: [taskSchema],
});

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  columns: {
    type: [columnSchema],
    default: [
      { title: "To Do", tasks: [] },
      { title: "In Progress", tasks: [] },
      { title: "Done", tasks: [] },
    ],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const transform = (document, returnedObject) => {
  returnedObject.id = returnedObject._id.toString();
  delete returnedObject._id;
  delete returnedObject.__v;
};

taskSchema.set("toJSON", { transform });
columnSchema.set("toJSON", { transform });
boardSchema.set("toJSON", { transform });

module.exports = mongoose.model("Board", boardSchema);
