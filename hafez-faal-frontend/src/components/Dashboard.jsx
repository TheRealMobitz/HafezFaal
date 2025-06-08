import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const [faalData, setFaalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDashboard();
      setFaalData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-persian-cream to-persian-ivory dark:bg-dark-gradient theme-transition">
        <div className="text-xl text-theme-accent animate-pulse font-persian">
          در حال بارگذاری فال شما...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-persian bg-gradient-to-br from-persian-cream to-persian-ivory dark:bg-dark-gradient theme-transition">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-theme-accent mb-4">
            خوش برگشتید، {user?.username}!
          </h1>
          <p className="text-xl text-theme-secondary">
            راهنمایی شخصی شما برای امروز
          </p>
        </div>

        {/* Message Section */}
        {faalData?.message && (
          <div className={`mb-8 p-6 rounded-2xl border-2 text-center ${
            faalData.faal_available 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-600 text-green-800 dark:text-green-400' 
              : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-600 text-blue-800 dark:text-blue-400'
          }`}>
            <p className="text-lg font-medium">{faalData.message}</p>
          </div>
        )}

        {/* Faal Section */}
        {faalData?.faal_available && faalData.faal ? (
          <div className="mb-8">
            <div className="card relative overflow-hidden">
              {/* Decorative border */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-persian-gold to-persian-saffron dark:from-dark-persian-gold dark:to-dark-persian-amber"></div>
              
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-theme-accent mb-2">
                  فال شما برای امروز
                </h2>
                <div className="inline-flex items-center bg-persian-gold/20 dark:bg-dark-persian-gold/20 px-4 py-2 rounded-full">
                  <span className="text-theme-accent font-semibold">
                    غزل شماره {faalData.faal.ghazal.ghazal_number}
                  </span>
                </div>
              </div>

              {/* Persian Text */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-theme-accent mb-6 text-center">
                  متن فارسی:
                </h4>
                <div className="bg-persian-ivory/50 dark:bg-dark-bg-secondary/50 p-6 rounded-xl border border-theme">
                  {faalData.faal.ghazal.persian_text.split('\n').map((line, index) => (
                    <p 
                      key={index} 
                      className="text-lg leading-loose text-center text-theme-primary mb-3 persian-text font-medium"
                      dir="rtl"
                    >
                      {line.trim()}
                    </p>
                  ))}
                </div>
              </div>

              {/* Interpretation */}
              {faalData.faal.ghazal.english_translation && (
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-theme-accent mb-6 text-center">
                    تفسیر و معنی:
                  </h4>
                  <div className="bg-white/50 dark:bg-dark-bg-tertiary/50 p-6 rounded-xl border border-theme">
                    {faalData.faal.ghazal.english_translation.split('\n').map((line, index) => (
                      <p 
                        key={index} 
                        className="text-lg leading-relaxed text-theme-primary mb-3 persian-text"
                        dir="rtl"
                      >
                        {line.trim()}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Date */}
              <div className="text-center pt-6 border-t border-theme">
                <p className="text-sm text-theme-secondary">
                  تاریخ: {new Date(faalData.faal.date).toLocaleDateString('fa-IR')}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="card max-w-lg mx-auto">
              <div className="text-6xl mb-6">🌅</div>
              <h2 className="text-2xl font-bold text-theme-accent mb-4">
                فال شما هنوز آماده نیست
              </h2>
              <p className="text-theme-secondary text-lg leading-relaxed">
                لطفاً بعد از ساعت 8 صبح برای دریافت فال روزانه خود مراجعه کنید.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={fetchDashboard} 
            className="btn-secondary flex items-center justify-center space-x-2 space-x-reverse"
          >
            <span>🔄</span>
            <span>تازه‌سازی</span>
          </button>
          
          <Link 
            to="/ghazals" 
            className="btn-primary text-center"
          >
            مطالعه سایر غزل‌ها
          </Link>
          
          <Link 
            to="/search" 
            className="btn-secondary text-center"
          >
            جستجو در غزل‌ها
          </Link>
        </div>

        {/* Additional Info */}
        {faalData?.faal_available && faalData.faal && (
          <div className="mt-12 text-center">
            <div className="card max-w-2xl mx-auto bg-gradient-to-br from-persian-gold/10 to-persian-saffron/10 dark:from-dark-persian-gold/10 dark:to-dark-persian-amber/10">
              <h3 className="text-xl font-bold text-theme-accent mb-4">
                درباره فال امروز شما
              </h3>
              <p className="text-theme-secondary leading-relaxed">
                این غزل به عنوان راهنمای روحانی شما برای امروز انتخاب شده است. 
                در طول روز بر معنای آن تأمل کنید و از حکمت‌های حافظ الهام بگیرید.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;