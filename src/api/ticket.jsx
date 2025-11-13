import axios from '../config/axios';

// Create new ticket (accepts { title, message })
export const createTicket = async (token, data) => {
  return axios.post('/ticket', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get user's tickets
export const getUserTickets = async (token) => {
  return axios.get('/user/tickets', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get all tickets (admin)
export const getAdminTickets = async (token) => {
  return axios.get('/admin/tickets', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get messages for a specific ticket
export const getTicketMessages = async (token, ticketId) => {
  return axios.get(`/ticket/${ticketId}/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get single ticket details
export const getTicket = async (token, ticketId) => {
  return axios.get(`/ticket/${ticketId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Add message to ticket
export const addMessage = async (token, ticketId, content) => {
  return axios.post('/ticket/message', { ticketId, content }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Close ticket (admin)
export const closeTicket = async (token, ticketId) => {
  return axios.put(`/admin/ticket/${ticketId}/close`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};