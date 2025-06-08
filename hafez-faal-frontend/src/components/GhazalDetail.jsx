import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const GhazalDetail = () => {
  const { ghazalNumber } = useParams();
  const navigate = useNavigate();
  const [ghazal, setGhazal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [showFullText, setShowFullText] = useState(false);

  useEffect(() => {
    fetchGhazal();
  }, [ghazalNumber]);

  const fetchGhazal = async () => {
    try {
      setLoading(true);
      const response = await apiService.getGhazals();
      const foundGhazal = response.data.find(g => g.ghazal_number === parseInt(ghazalNumber));
      
      if (foundGhazal) {
        setGhazal(foundGhazal);
      } else {
        setError('غزل مورد نظر یافت نشد.');
      }
    } catch (error) {
      console.error('Error fetching ghazal:', error);
      setError('خطا در بارگذاری غزل');
    } finally {
      setLoading(false);
    }
  };

  const getPreviewText = (text) => {
    const lines = text.split('\n');
    return lines.slice(0, 3).join('\n');
  };

  const hasMoreLines = ghazal && ghazal.persian_text.split('\n').length > 3;

  const goToPrevious = () => {
    const prevNumber = parseInt(ghazalNumber) - 1;
    if (prevNumber >= 1) {
      navigate(`/ghazal/${prevNumber}`);
    }
  };

  const goToNext = () => {
    const nextNumber = parseInt(ghazalNumber) + 1;
    navigate(`/ghazal/${nextNumber}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-theme-accent animate-pulse font-persian">
          در حال بارگذاری غزل...
        </div>
      </div>
    );
  }

  if (error || !ghazal) {
    return (
      <div className="text-center py-16">
        <div className="card max-w-md mx-auto">
          <div className="text-6xl mb-6">😔</div>
          <h2 className="text-2xl font-bold text-theme-accent mb-4">خطا</h2>
          <p className="text-theme-secondary mb-6">{error || 'غزل یافت نشد'}</p>
          <Link to="/ghazals" className="btn-primary">
            بازگشت به فهرست غزل‌ها
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center text-sm text-theme-secondary mb-4 space-x-2 space-x-reverse">
          <Link to="/" className="hover:text-theme-accent transition-colors">خانه</Link>
          <span>/</span>
          <Link to="/ghazals" className="hover:text-theme-accent transition-colors">غزل‌ها</Link>
          <span>/</span>
          <span>غزل {ghazal.ghazal_number}</span>
        </div>
        
        <h1 className="text-4xl font-bold text-theme-accent text-center">
          غزل شماره {ghazal.ghazal_number}
        </h1>
      </div>

      {/* Content */}
      <div className="mb-8">
        <div className="card relative overflow-hidden">
          {/* Decorative border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-persian-gold to-persian-saffron dark:from-dark-persian-gold dark:to-dark-persian-amber"></div>
          
          {/* Persian Text */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-theme-accent mb-6 text-center">
              متن فارسی
            </h3>
            <div className="bg-persian-ivory/30 dark:bg-dark-bg-secondary/30 p-6 rounded-xl">
              {(showFullText ? ghazal.persian_text : getPreviewText(ghazal.persian_text))
                .split('\n').map((line, index) => (
                <p 
                  key={index} 
                  className="text-xl leading-loose text-center text-theme-primary mb-4 persian-text font-medium tracking-wider"
                  dir="rtl"
                >
                  {line.trim()}
                </p>
              ))}
              
              {hasMoreLines && (
                <div className="text-center pt-6 border-t border-theme">
                  <button 
                    className="btn-secondary flex items-center justify-center space-x-2 space-x-reverse mx-auto min-w-[200px]"
                    onClick={() => setShowFullText(!showFullText)}
                  >
                    <span>
                      {showFullText ? 'نمایش کمتر' : 'نمایش کامل'}
                    </span>
                    <span className={`transform transition-transform ${showFullText ? 'rotate-180' : ''}`}>
                      ↓
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Interpretation Toggle */}
            {ghazal.english_translation && (
              <div className="border-t border-theme pt-6">
                <button 
                  className="btn-secondary w-full flex justify-center items-center space-x-2 space-x-reverse"
                  onClick={() => setShowInterpretation(!showInterpretation)}
                >
                  <span>
                    {showInterpretation ? 'پنهان کردن تفسیر' : 'نمایش تفسیر و معنی'}
                  </span>
                  <span className={`transform transition-transform ${showInterpretation ? 'rotate-180' : ''}`}>
                    ↓
                  </span>
                </button>
                
                {showInterpretation && (
                  <div className="bg-persian-ivory/50 dark:bg-dark-bg-secondary/50 p-6 rounded-xl border border-theme slide-down mt-6">
                    <h4 className="text-xl font-semibold text-theme-accent mb-4 text-center">
                      تفسیر و معنی
                    </h4>
                    {ghazal.english_translation.split('\n').map((line, index) => (
                      <p 
                        key={index} 
                        className="text-lg leading-relaxed text-theme-primary mb-3 persian-text"
                        dir="rtl"
                      >
                        {line.trim()}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mb-8">
        <button 
          onClick={goToPrevious}
          disabled={parseInt(ghazalNumber) <= 1}
          className="btn-secondary flex items-center space-x-2 space-x-reverse disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>←</span>
          <span>غزل قبلی</span>
        </button>

        <Link to="/ghazals" className="btn-primary">
          فهرست غزل‌ها
        </Link>

        <button 
          onClick={goToNext}
          className="btn-secondary flex items-center space-x-2 space-x-reverse"
        >
          <span>غزل بعدی</span>
          <span>→</span>
        </button>
      </div>

      {/* Additional Actions */}
      <div className="text-center">
        <div className="card max-w-lg mx-auto">
          <h3 className="text-lg font-bold text-theme-accent mb-4">
            بیشتر از حافظ
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/search" className="btn-secondary text-sm">
              جستجو در غزل‌ها
            </Link>
            <Link to="/dashboard" className="btn-secondary text-sm">
              فال امروز
            </Link>
            <Link to="/quotes" className="btn-secondary text-sm">
              سخنان حکیمانه
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GhazalDetail;