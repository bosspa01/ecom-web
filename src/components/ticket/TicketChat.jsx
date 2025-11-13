import React, { useState, useEffect, useRef } from 'react';
import { addMessage, getTicketMessages, getTicket } from '../../api/ticket';
import useEcomStore from '../../store/ecom-store';
import useTranslation from '../../hooks/useTranslation';

const TicketChat = ({ ticket, onUpdate }) => {
  const t = useTranslation();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState(ticket.messages || []);
  const [currentTicket, setCurrentTicket] = useState(ticket);
  const messagesEndRef = useRef(null);
  const token = useEcomStore((s) => s.token);
  const user = useEcomStore((s) => s.user);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  const fetchMessages = async () => {
    try {
      const res = await getTicketMessages(token, ticket.id);
      setMessages(res.data);
      
      // Also fetch ticket details to get updated status
      const ticketRes = await getTicket(token, ticket.id);
      setCurrentTicket(ticketRes.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    }
  };

  useEffect(() => {
    // Update currentTicket when ticket prop changes
    setCurrentTicket(ticket);
    fetchMessages();
    // Scroll to bottom only on initial load
    setTimeout(() => scrollToBottom(), 100);

    // Poll for new messages every 3 seconds for real-time updates
    const interval = setInterval(() => {
      fetchMessages();
    }, 3000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [ticket.id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setSending(true);
      await addMessage(token, ticket.id, message);
      setMessage('');
      await fetchMessages();
      onUpdate?.();
    } catch (err) {
      console.error('Failed to send message:', err);
      alert(t.failed_send_message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border border-gray-700 rounded-lg bg-gray-800">
      <div className="p-4 border-b border-gray-700 bg-gray-900">
        <h3 className="font-medium text-gray-200">{currentTicket.title}</h3>
        <p className="text-sm text-gray-400">
          {t.status}: {currentTicket.status === 'OPEN' ? t.open : t.closed}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.user.id === user.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                msg.user.id === user.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              <div className="text-sm font-medium mb-1">
                {msg.user.name || msg.user.email}
                {(msg.user.role === 'admin' || msg.user.role === 'superadmin') && ` (${t.admin})`}
              </div>
              <div>{msg.content}</div>
              <div className="text-xs mt-1 opacity-75">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {currentTicket.status === 'OPEN' && (
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 bg-gray-900">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.type_message}
              className="flex-1 rounded-md bg-gray-800 border-gray-700 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {sending ? t.sending : t.send}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TicketChat;