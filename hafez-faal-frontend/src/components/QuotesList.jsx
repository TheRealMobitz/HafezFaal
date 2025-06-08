import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const QuotesList = () => {
  const [quotes, setQuotes] = useState([]);
  const [displayedQuotes, setDisplayedQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage] = useState(6); // Show 6 quotes per page
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    updateDisplayedQuotes();
  }, [quotes, currentPage]);

  const fetchQuotes = async () => {
    try {
      const response = await apiService.getQuotes();
      setQuotes(response.data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayedQuotes = () => {
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    setDisplayedQuotes(quotes.slice(startIndex, endIndex));
  };

  const handleShowMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const hasMoreQuotes = displayedQuotes.length < quotes.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-theme-accent animate-pulse font-persian">
          در حال بارگذاری سخنان...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-theme-accent mb-4">
          سخنان و حکمت‌های حافظ
        </h1>
        <p className="text-xl text-theme-secondary">
          مجموعه‌ای از گفته‌های ماندگار استاد بزرگ ادب فارسی
        </p>
        <div className="mt-4">
          <span className="inline-flex items-center bg-persian-gold/20 dark:bg-dark-persian-gold/20 px-4 py-2 rounded-full text-theme-accent font-semibold">
            {quotes.length} سخن حکیمانه
          </span>
        </div>
      </div>

      {displayedQuotes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayedQuotes.map((quote) => (
              <div key={quote.id} className="card group hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-white/40 dark:bg-black/40 border border-white/30 dark:border-black/30">
                <div className="mb-6">
                  <blockquote className="text-xl font-medium text-theme-primary mb-4 persian-text leading-relaxed relative">
                    <span className="text-6xl text-persian-gold dark:text-dark-persian-gold opacity-20 absolute -top-4 -right-2">"</span>
                    <span className="relative z-10">{quote.text}</span>
                    <span className="text-6xl text-persian-gold dark:text-dark-persian-gold opacity-20 absolute -bottom-8 -left-2">"</span>
                  </blockquote>
                  <cite className="text-theme-accent font-semibold text-base flex items-center space-x-2 space-x-reverse">
                    <span>✨</span>
                    <span>— {quote.author}</span>
                  </cite>
                  <div className="text-sm text-theme-secondary mt-3 flex items-center space-x-2 space-x-reverse">
                    <span>📅</span>
                    <span>{new Date(quote.added_date).toLocaleDateString('fa-IR')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {hasMoreQuotes && (
            <div className="text-center mt-12">
              <button 
                onClick={handleShowMore}
                className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2 space-x-reverse mx-auto hover:scale-105 transition-transform duration-200"
              >
                <span>💬</span>
                <span>نمایش بیشتر</span>
                <span className="text-sm opacity-75">
                  ({quotes.length - displayedQuotes.length} سخن باقی‌مانده)
                </span>
              </button>
            </div>
          )}

          {/* Progress Indicator */}
          {quotes.length > itemsPerPage && (
            <div className="mt-8">
              <div className="bg-persian-ivory/50 dark:bg-dark-bg-secondary/50 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-persian-gold to-persian-saffron dark:from-dark-persian-gold dark:to-dark-persian-amber h-full transition-all duration-500"
                  style={{ width: `${(displayedQuotes.length / quotes.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-theme-secondary mt-2">
                {displayedQuotes.length} از {quotes.length} سخن نمایش داده شده
              </p>
            </div>
          )}

          {/* Quick Navigation */}
          <div className="mt-12 text-center">
            <div className="card max-w-md mx-auto backdrop-blur-sm bg-white/30 dark:bg-black/30 border border-white/20 dark:border-black/20">
              <h3 className="text-lg font-bold text-theme-accent mb-4">دسترسی سریع</h3>
              <div className="flex flex-wrap justify-center gap-2">
                <a 
                  href="/search" 
                  className="btn-secondary text-sm flex items-center space-x-2 space-x-reverse"
                >
                  <span>🔍</span>
                  <span>جستجو در غزل‌ها</span>
                </a>
                <a 
                  href="/dashboard" 
                  className="btn-secondary text-sm flex items-center space-x-2 space-x-reverse"
                >
                  <span>🎯</span>
                  <span>فال امروز</span>
                </a>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="card max-w-md mx-auto backdrop-blur-sm bg-white/30 dark:bg-black/30 border border-white/20 dark:border-black/20">
            <div className="text-6xl mb-6">💭</div>
            <h3 className="text-2xl font-bold text-theme-accent mb-4">
              سخنی یافت نشد
            </h3>
            <p className="text-theme-secondary">
              در حال حاضر هیچ سخنی در دسترس نیست.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotesList;