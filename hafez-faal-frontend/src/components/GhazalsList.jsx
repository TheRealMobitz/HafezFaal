import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';

const GhazalsList = () => {
  const [ghazals, setGhazals] = useState([]);
  const [displayedGhazals, setDisplayedGhazals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage] = useState(12); // Show 12 ghazals per page
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchGhazals();
  }, []);

  useEffect(() => {
    updateDisplayedGhazals();
  }, [ghazals, currentPage]);

  const fetchGhazals = async () => {
    try {
      const response = await apiService.getGhazals();
      setGhazals(response.data);
    } catch (error) {
      console.error('Error fetching ghazals:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayedGhazals = () => {
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    setDisplayedGhazals(ghazals.slice(startIndex, endIndex));
  };

  const handleShowMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const hasMoreGhazals = displayedGhazals.length < ghazals.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-theme-accent animate-pulse font-persian">
          در حال بارگذاری غزل‌ها...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-theme-accent mb-4">
          غزل‌های حافظ شیرازی
        </h1>
        <p className="text-xl text-theme-secondary">
          مجموعه کامل {ghazals.length} غزل از استاد بزرگ شعر فارسی
        </p>
        <div className="mt-4">
          <span className="inline-flex items-center bg-persian-gold/20 dark:bg-dark-persian-gold/20 px-4 py-2 rounded-full text-theme-accent font-semibold">
            نمایش {displayedGhazals.length} از {ghazals.length} غزل
          </span>
        </div>
      </div>

      {/* Ghazals Grid */}
      {displayedGhazals.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedGhazals.map((ghazal) => (
              <div key={ghazal.id} className="card group hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-bold text-theme-accent mb-4 text-center">
                  غزل شماره {ghazal.ghazal_number}
                </h3>
                
                <div className="persian-text text-lg text-theme-primary mb-6" dir="rtl">
                  <p className="leading-relaxed">
                    {truncateText(ghazal.persian_text)}
                  </p>
                </div>
                
                <div className="text-center pt-4 border-t border-theme">
                  <Link 
                    to={`/ghazal/${ghazal.ghazal_number}`} 
                    className="btn-primary inline-block group-hover:scale-105 transition-transform duration-200"
                  >
                    مطالعه کامل
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Show More Button */}
          {hasMoreGhazals && (
            <div className="text-center mt-12">
              <button 
                onClick={handleShowMore}
                className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2 space-x-reverse mx-auto hover:scale-105 transition-transform duration-200"
              >
                <span>📖</span>
                <span>نمایش بیشتر</span>
                <span className="text-sm opacity-75">
                  ({ghazals.length - displayedGhazals.length} غزل باقی‌مانده)
                </span>
              </button>
            </div>
          )}

          {/* Progress Indicator */}
          {ghazals.length > itemsPerPage && (
            <div className="mt-8">
              <div className="bg-persian-ivory/50 dark:bg-dark-bg-secondary/50 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-persian-gold to-persian-saffron dark:from-dark-persian-gold dark:to-dark-persian-amber h-full transition-all duration-500"
                  style={{ width: `${(displayedGhazals.length / ghazals.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-sm text-theme-secondary mt-2">
                {displayedGhazals.length} از {ghazals.length} غزل نمایش داده شده
              </p>
            </div>
          )}

          {/* Quick Navigation */}
          <div className="mt-12 text-center">
            <div className="card max-w-md mx-auto">
              <h3 className="text-lg font-bold text-theme-accent mb-4">دسترسی سریع</h3>
              <div className="flex flex-wrap justify-center gap-2">
                <Link 
                  to="/search" 
                  className="btn-secondary text-sm flex items-center space-x-2 space-x-reverse"
                >
                  <span>🔍</span>
                  <span>جستجو در غزل‌ها</span>
                </Link>
                <Link 
                  to="/dashboard" 
                  className="btn-secondary text-sm flex items-center space-x-2 space-x-reverse"
                >
                  <span>🎯</span>
                  <span>فال امروز</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="card max-w-md mx-auto">
            <div className="text-6xl mb-6">📚</div>
            <h3 className="text-2xl font-bold text-theme-accent mb-4">
              غزلی یافت نشد
            </h3>
            <p className="text-theme-secondary">
              در حال حاضر هیچ غزلی در دسترس نیست.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GhazalsList;