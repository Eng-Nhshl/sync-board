import axios from "axios";
const baseUrl = "/api/boards";

const getAll = async () => {
  const res = await axios.get(baseUrl);
  return res.data;
};

const getById = async (id) => {
  const res = await axios.get(`${baseUrl}/${id}`);
  return res.data;
};

const addTask = async (boardId, columnId, taskData) => {
  const res = await axios.post(
    `${baseUrl}/${boardId}/columns/${columnId}/tasks`,
    taskData,
  );
  return res.data;
};

const addColumn = async (boardId, title) => {
  const res = await axios.post(`${baseUrl}/${boardId}/columns`, { title });
  return res.data;
};

const create = async (title) => {
  const response = await axios.post(baseUrl, { title });
  return response.data;
};

const deleteTask = async (boardId, columnId, taskId) => {
  await axios.delete(
    `${baseUrl}/${boardId}/columns/${columnId}/tasks/${taskId}`,
  );
};

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response.data;
};

export default {
  getAll,
  getById,
  addTask,
  addColumn,
  create,
  deleteTask,
  delete: remove,
};
