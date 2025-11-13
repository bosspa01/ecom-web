import React, { useState, useEffect } from 'react';
import { getUserTickets } from '../../api/ticket';
import useEcomStore from '../../store/ecom-store';
import TicketChat from './TicketChat';
import CreateTicketForm from './CreateTicketForm';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const token = useEcomStore((s) => s.token);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await getUserTickets(token);
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

  if (loading) {
    return <div className="text-center py-4">Loading tickets...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Support Tickets</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          New Ticket
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6">
          <CreateTicketForm
            onSuccess={() => {
              setShowCreateForm(false);
              fetchTickets();
            }}
          />
        </div>
      )}

      {selectedTicket ? (
        <div>
          <button
            onClick={() => setSelectedTicket(null)}
            className="mb-4 text-blue-600 hover:underline"
          >
            ← Back to tickets
          </button>
          <TicketChat
            ticket={selectedTicket}
            onUpdate={fetchTickets}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.length === 0 ? (
            <p className="text-center text-gray-500">No tickets found.</p>
          ) : (
            tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="p-4 border rounded cursor-pointer hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{ticket.title}</h3>
                    <p className="text-sm text-gray-500">
                      Created: {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      ticket.status === 'OPEN'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {ticket.messages.length} messages
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TicketList;