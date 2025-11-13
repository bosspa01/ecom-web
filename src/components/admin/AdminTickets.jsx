import React, { useState, useEffect } from 'react';
import { getAdminTickets, closeTicket } from '../../api/ticket';
import useEcomStore from '../../store/ecom-store';
import TicketChat from '../ticket/TicketChat';

const AdminTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const token = useEcomStore((s) => s.token);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await getAdminTickets(token);
      setTickets(res.data);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [token]);

  const handleCloseTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to close this ticket?')) return;

    try {
      await closeTicket(token, ticketId);
      fetchTickets();
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(null);
      }
    } catch (err) {
      console.error('Failed to close ticket:', err);
      alert('Failed to close ticket. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-400">Loading tickets...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 ">Support Tickets</h2>

      {selectedTicket ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setSelectedTicket(null)}
              className="text-blue-400 hover:text-blue-300 hover:underline"
            >
              ← Back to tickets
            </button>
            {selectedTicket.status === 'OPEN' && (
              <button
                onClick={() => handleCloseTicket(selectedTicket.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Close Ticket
              </button>
            )}
          </div>
          <TicketChat
            ticket={selectedTicket}
            onUpdate={fetchTickets}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <p className="text-center text-gray-400">No tickets found.</p>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700/50"
              >
                <div className="flex justify-between items-start">
                  <div
                    onClick={() => setSelectedTicket(ticket)}
                    className="flex-1 cursor-pointer"
                  >
                    <h3 className="font-medium text-gray-200">{ticket.title}</h3>
                    <p className="text-sm text-gray-400">
                      From: {ticket.user.email}
                    </p>
                    <p className="text-sm text-gray-400">
                      Created: {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                    <div className="mt-1 text-sm text-gray-500">
                      {ticket.messages.length} messages
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-2 py-1 rounded text-sm border ${
                        ticket.status === 'OPEN'
                          ? 'bg-green-900/50 text-green-400 border-green-800'
                          : 'bg-gray-700 text-gray-300 border-gray-600'
                      }`}
                    >
                      {ticket.status}
                    </span>
                    {ticket.status === 'OPEN' && (
                      <button
                        onClick={() => handleCloseTicket(ticket.id)}
                        className="text-sm text-red-400 hover:text-red-300 hover:underline"
                      >
                        Close
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminTickets;