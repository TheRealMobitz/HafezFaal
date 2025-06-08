import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ghazals, setGhazals] = useState([]);
  const [filteredGhazals, setFilteredGhazals] = useState([]);
  const [displayedGhazals, setDisplayedGhazals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [itemsPerPage] = useState(9); // Show 9 items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    searchIn: 'all',
    sortBy: 'number',
    ghazalRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchGhazals();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchTerm, ghazals, filters]);

  useEffect(() => {
    updateDisplayedGhazals();
  }, [filteredGhazals, currentPage]);

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

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredGhazals([]);
      setDisplayedGhazals([]);
      setCurrentPage(1);
      return;
    }

    setSearchLoading(true);
    
    let filtered = ghazals.filter(ghazal => {
      let matchesSearch = false;
      
      if (filters.searchIn === 'persian' || filters.searchIn === 'all') {
        matchesSearch = matchesSearch || ghazal.persian_text.includes(searchTerm);
      }
      
      if (filters.searchIn === 'interpretation' || filters.searchIn === 'all') {
        matchesSearch = matchesSearch || (ghazal.english_translation && 
          ghazal.english_translation.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      
      matchesSearch = matchesSearch || ghazal.ghazal_number.toString().includes(searchTerm);
      
      return matchesSearch;
    });

    if (filters.ghazalRange !== 'all') {
      const [min, max] = filters.ghazalRange.split('-').map(Number);
      filtered = filtered.filter(ghazal => 
        ghazal.ghazal_number >= min && ghazal.ghazal_number <= max
      );
    }

    if (filters.sortBy === 'number') {
      filtered.sort((a, b) => a.ghazal_number - b.ghazal_number);
    } else if (filters.sortBy === 'relevance') {
      filtered.sort((a, b) => {
        const countA = (a.persian_text.match(new RegExp(searchTerm, 'gi')) || []).length;
        const countB = (b.persian_text.match(new RegExp(searchTerm, 'gi')) || []).length;
        return countB - countA;
      });
    }
    
    setFilteredGhazals(filtered);
    setCurrentPage(1);
    setSearchLoading(false);
  };

  const updateDisplayedGhazals = () => {
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    setDisplayedGhazals(filteredGhazals.slice(startIndex, endIndex));
  };

  const handleShowMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      searchIn: 'all',
      sortBy: 'number',
      ghazalRange: 'all'
    });
    setCurrentPage(1);
  };

  const highlightText = (text, searchTerm) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className="bg-persian-gold dark:bg-dark-persian-gold text-white dark:text-dark-bg-primary px-1 rounded font-semibold">{part}</mark> : 
        part
    );
  };

  const truncateText = (text, maxLength = 200) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const suggestionWords = ['عشق', 'دل', 'جان', 'می', 'گل', 'ساقی', 'خداوند', 'آسمان'];

  const hasMoreResults = displayedGhazals.length < filteredGhazals.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-persian-cream to-persian-ivory dark:bg-dark-gradient theme-transition">
        <div className="text-xl text-theme-accent animate-pulse font-persian">
          در حال بارگذاری غزل‌ها...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-persian bg-gradient-to-br from-persian-cream to-persian-ivory dark:bg-dark-gradient theme-transition">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-theme-accent mb-4">
            جستجو در غزل‌های حافظ
          </h1>
          <p className="text-xl text-theme-secondary">
            در میان {ghazals.length} غزل حافظ جستجو کنید
          </p>
        </div>

        {/* Search Container */}
        <div className="max-w-2xl mx-auto mb-8">
          {/* Search Box */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="متن مورد نظر خود را جستجو کنید..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pr-12 text-lg border-2 border-theme rounded-3xl bg-white/70 dark:bg-dark-bg-secondary/70 font-persian text-right transition-all duration-300 focus:outline-none focus:border-persian-gold dark:focus:border-dark-persian-gold focus:ring-4 focus:ring-persian-gold/20 dark:focus:ring-dark-persian-gold/20 text-theme-primary"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-theme-accent text-xl">
              🔍
            </div>
          </div>

          {/* Filters */}
          <div className="border border-theme rounded-2xl overflow-hidden bg-white/70 dark:bg-dark-bg-secondary/70 backdrop-blur-sm">
            <button 
              className="w-full bg-persian-ivory/70 dark:bg-dark-bg-tertiary/70 px-6 py-4 cursor-pointer font-semibold text-theme-accent flex justify-between items-center transition-all duration-300 hover:bg-persian-gold hover:text-white dark:hover:bg-dark-persian-gold"
              onClick={() => setShowFilters(!showFilters)}
            >
              <span>فیلترها</span>
              <span className={`transform transition-transform text-xl ${showFilters ? 'rotate-180' : ''}`}>
                ↓
              </span>
            </button>

            {showFilters && (
              <div className="p-6 bg-white/50 dark:bg-dark-bg-tertiary/50 border-t border-theme grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
                <div className="flex flex-col space-y-2">
                  <label className="font-semibold text-theme-accent text-sm">جستجو در:</label>
                  <select 
                    value={filters.searchIn}
                    onChange={(e) => handleFilterChange('searchIn', e.target.value)}
                    className="px-3 py-2 border-2 border-theme rounded-lg font-persian text-right bg-white/70 dark:bg-dark-bg-secondary/70 text-theme-primary transition-all duration-300 focus:outline-none focus:border-persian-gold dark:focus:border-dark-persian-gold focus:ring-2 focus:ring-persian-gold/20 dark:focus:ring-dark-persian-gold/20"
                  >
                    <option value="all">همه موارد</option>
                    <option value="persian">متن فارسی</option>
                    <option value="interpretation">تفسیر و معنی</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="font-semibold text-theme-accent text-sm">مرتب‌سازی:</label>
                  <select 
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="px-3 py-2 border-2 border-theme rounded-lg font-persian text-right bg-white/70 dark:bg-dark-bg-secondary/70 text-theme-primary transition-all duration-300 focus:outline-none focus:border-persian-gold dark:focus:border-dark-persian-gold focus:ring-2 focus:ring-persian-gold/20 dark:focus:ring-dark-persian-gold/20"
                  >
                    <option value="number">شماره غزل</option>
                    <option value="relevance">میزان تطابق</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="font-semibold text-theme-accent text-sm">بازه غزل‌ها:</label>
                  <select 
                    value={filters.ghazalRange}
                    onChange={(e) => handleFilterChange('ghazalRange', e.target.value)}
                    className="px-3 py-2 border-2 border-theme rounded-lg font-persian text-right bg-white/70 dark:bg-dark-bg-secondary/70 text-theme-primary transition-all duration-300 focus:outline-none focus:border-persian-gold dark:focus:border-dark-persian-gold focus:ring-2 focus:ring-persian-gold/20 dark:focus:ring-dark-persian-gold/20"
                  >
                    <option value="all">همه غزل‌ها</option>
                    <option value="1-100">غزل‌های ۱ تا ۱۰۰</option>
                    <option value="101-200">غزل‌های ۱۰۱ تا ۲۰۰</option>
                    <option value="201-300">غزل‌های ۲۰۱ تا ۳۰۰</option>
                    <option value="301-400">غزل‌های ۳۰۱ تا ۴۰۰</option>
                    <option value="401-500">غزل‌های ۴۰۱ تا ۵۰۰</option>
                  </select>
                </div>

                <div className="md:col-span-3 flex justify-center">
                  <button 
                    className="btn-secondary text-sm"
                    onClick={clearFilters}
                  >
                    پاک کردن فیلترها
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {searchTerm && (
            <div className="text-center mt-4">
              {searchLoading ? (
                <p className="text-theme-secondary animate-pulse">در حال جستجو...</p>
              ) : (
                <p className="text-theme-secondary">
                  <span className="font-semibold text-theme-accent">{filteredGhazals.length}</span> نتیجه برای "{searchTerm}" یافت شد
                  {displayedGhazals.length < filteredGhazals.length && (
                    <span> - نمایش {displayedGhazals.length} مورد اول</span>
                  )}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div>
          {searchTerm && !searchLoading && (
            <>
              {displayedGhazals.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedGhazals.map((ghazal) => (
                      <Link 
                        key={ghazal.id} 
                        to={`/ghazal/${ghazal.ghazal_number}`} 
                        className="card hover:shadow-lg group transition-all duration-300"
                      >
                        <h3 className="text-xl font-semibold text-theme-accent mb-4 text-center">
                          غزل شماره {ghazal.ghazal_number}
                        </h3>
                        
                        <div className="persian-text text-lg leading-relaxed text-theme-primary mb-4">
                          <p>
                            {highlightText(
                              truncateText(ghazal.persian_text), 
                              searchTerm
                            )}
                          </p>
                        </div>
                        
                        <div className="text-center pt-4 border-t border-theme">
                          <span className="text-theme-accent font-semibold group-hover:text-persian-gold dark:group-hover:text-dark-persian-gold transition-colors">
                            مطالعه کامل
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  {/* Show More Button */}
                  {hasMoreResults && (
                    <div className="text-center mt-12">
                      <button 
                        onClick={handleShowMore}
                        className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2 space-x-reverse mx-auto hover:scale-105 transition-transform duration-200"
                      >
                        <span>📚</span>
                        <span>نمایش بیشتر</span>
                        <span className="text-sm opacity-75">
                          ({filteredGhazals.length - displayedGhazals.length} مورد باقی‌مانده)
                        </span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="card max-w-lg mx-auto">
                    <h3 className="text-2xl font-bold text-theme-accent mb-4">نتیجه‌ای یافت نشد</h3>
                    <p className="text-theme-secondary mb-2">متأسفانه هیچ غزلی با عبارت "{searchTerm}" یافت نشد.</p>
                    <p className="text-theme-secondary">لطفاً کلمات کلیدی دیگری امتحان کنید یا فیلترها را تغییر دهید.</p>
                  </div>
                </div>
              )}
            </>
          )}

          {!searchTerm && (
            <div className="text-center py-12">
              <h3 className="text-2xl font-bold text-theme-accent mb-8">پیشنهادات جستجو</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {suggestionWords.map((word) => (
                  <button 
                    key={word}
                    className="btn-secondary text-lg hover:scale-105 transition-transform duration-200"
                    onClick={() => setSearchTerm(word)}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;