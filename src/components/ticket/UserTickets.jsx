import React, { useState, useEffect } from 'react';
import { getUserTickets, createTicket } from '../../api/ticket';
import useEcomStore from '../../store/ecom-store';
import useTranslation from '../../hooks/useTranslation';
import TicketChat from '../ticket/TicketChat';

const UserTickets = () => {
  const t = useTranslation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [newTicketMessage, setNewTicketMessage] = useState('');
  const token = useEcomStore((s) => s.token);
  const user = useEcomStore((s) => s.user);

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

  const handleCreateTicket = async (e) => {
    e.preventDefault();

    if (!newTicketTitle.trim() || !newTicketMessage.trim()) {
      alert(t.please_fill_all_fields);
      return;
    }

    try {
      await createTicket(token, {
        title: newTicketTitle,
        message: newTicketMessage,
      });
      setNewTicketTitle('');
      setNewTicketMessage('');
      setShowNewTicketForm(false);
      fetchTickets();
    } catch (err) {
      console.error('Failed to create ticket:', err);
      alert(t.failed_create_ticket);
    }
  };

  if (loading) {
    return <div className="text-center py-4">{t.loading_tickets}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t.support_tickets}</h2>
        {!showNewTicketForm && !selectedTicket && user?.role !== 'superadmin' && (
          <button
            onClick={() => setShowNewTicketForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t.new_ticket}
          </button>
        )}
      </div>

      {showNewTicketForm && user?.role !== 'superadmin' && (
        <div className="mb-6 bg-white p-4 rounded border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{t.create_new_ticket}</h3>
            <button
              onClick={() => setShowNewTicketForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              {t.cancel}
            </button>
          </div>
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t.title}
              </label>
              <input
                type="text"
                value={newTicketTitle}
                onChange={(e) => setNewTicketTitle(e.target.value)}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder={t.issue_about}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t.message}
              </label>
              <textarea
                value={newTicketMessage}
                onChange={(e) => setNewTicketMessage(e.target.value)}
                className="mt-1 block w-full rounded border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="4"
                placeholder={t.describe_issue}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {t.submit_ticket}
            </button>
          </form>
        </div>
      )}

      {selectedTicket ? (
        <div>
          <button
            onClick={() => setSelectedTicket(null)}
            className="text-blue-600 hover:underline mb-4"
          >
            {t.back_to_tickets}
          </button>
          <TicketChat
            ticket={selectedTicket}
            onUpdate={fetchTickets}
          />
        </div>
      ) : (
        !showNewTicketForm && (
          <div className="space-y-4">
            {tickets.length === 0 ? (
              <p className="text-center text-gray-500">
                {t.no_tickets_yet}
              </p>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{ticket.title}</h3>
                      <p className="text-sm text-gray-500">
                        {t.created}: {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                      <div className="mt-1 text-sm text-gray-600">
                        {ticket.messages.length} {t.messages}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        ticket.status === 'OPEN'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {ticket.status === 'OPEN' ? t.open : t.closed}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )
      )}
    </div>
  );
};

export default UserTickets;