import axiosClient from './axiosClient';

const todoApi = {
  getAll: (params) => axiosClient.get('/todos', { params }),
  getById: (id) => axiosClient.get(`/todos/${id}`),
  create: (data) => axiosClient.post('/todos', data),
  update: (id, data) => axiosClient.put(`/todos/${id}`, data),
  toggle: (id) => axiosClient.patch(`/todos/${id}/toggle`),
  remove: (id) => axiosClient.delete(`/todos/${id}`),
};

export default todoApi;
