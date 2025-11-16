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
    <section className="py-12 sm:py-16 px-3 sm:px-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-4 sm:mb-6">
          <Mail className="mx-auto text-green-400 mb-3 sm:mb-4" size={40} className="sm:w-12 sm:h-12" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4">
            {t.stay_updated}
          </h2>
          <p className="text-gray-400 text-sm sm:text-lg">
            {t.newsletter_description}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto px-2">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} className="sm:w-5 sm:h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.enter_email}
                className="w-full pl-10 pr-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 sm:h-5 w-4 sm:w-5 border-b-2 border-white"></div>
                  <span className="hidden sm:inline">{t.subscribing}</span>
                </>
              ) : (
                <>
                  <Send size={16} className="sm:w-5 sm:h-5" />
                  <span>{t.subscribe}</span>
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-gray-500 text-xs sm:text-sm mt-3 sm:mt-4 px-2">
          {t.privacy_text}
        </p>
      </div>
    </section>
  );
};

export default NewsletterSignup;

