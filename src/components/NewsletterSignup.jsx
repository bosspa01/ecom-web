import React, { useState } from "react";
import { Mail, Send } from "lucide-react";
import { toast } from "react-toastify";
import useTranslation from "../hooks/useTranslation";

const NewsletterSignup = () => {
  const t = useTranslation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success(t.thank_you_subscribe);
      setEmail("");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-6">
          <Mail className="mx-auto text-green-400 mb-4" size={48} />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t.stay_updated}
          </h2>
          <p className="text-gray-400 text-lg">
            {t.newsletter_description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.enter_email}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>{t.subscribing}</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>{t.subscribe}</span>
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-gray-500 text-sm mt-4">
          {t.privacy_text}
        </p>
      </div>
    </section>
  );
};

export default NewsletterSignup;

