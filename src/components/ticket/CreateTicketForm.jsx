import React, { useState } from 'react';
import { createTicket } from '../../api/ticket';
import useEcomStore from '../../store/ecom-store';

const CreateTicketForm = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const token = useEcomStore((s) => s.token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);
      await createTicket(token, title);
      setTitle('');
      onSuccess?.();
    } catch (err) {
      console.error('Failed to create ticket:', err);
      alert('Failed to create ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Ticket Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Describe your issue"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
      >
        {loading ? 'Creating...' : 'Create Ticket'}
      </button>
    </form>
  );
};

export default CreateTicketForm;