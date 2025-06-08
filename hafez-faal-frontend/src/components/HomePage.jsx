import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const HomePage = () => {
  const [dailyQuote, setDailyQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useAuth();
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchDailyQuote();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchDailyQuote = async () => {
    try {
      const response = await apiService.getDailyQuote();
      setDailyQuote(response.data);
    } catch (error) {
      console.error('Error fetching daily quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeOfDayGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 6) return 'شب بخیر';
    if (hour < 12) return 'صبح بخیر';
    if (hour < 18) return 'روز بخیر';
    return 'عصر بخیر';
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative">
        {/* Light overlay for better text readability */}
        <div className="absolute inset-0 bg-white/15 dark:bg-black/15 backdrop-blur-[1px]"></div>
        
        <div className="relative text-center py-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Greeting */}
            <div className="mb-8">
              <p className="text-xl text-theme-accent font-medium mb-2 drop-shadow-sm">
                {getTimeOfDayGreeting()}
              </p>
              <p className="text-base text-theme-secondary drop-shadow-sm">
                {currentTime.toLocaleDateString('fa-IR', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            {/* Main Title */}
            <div className="mb-12">
              <h1 className="text-5xl md:text-7xl font-bold text-theme-accent mb-6 leading-tight drop-shadow-lg">
                فال حافظ
              </h1>
              <p className="text-xl md:text-2xl text-theme-secondary max-w-3xl mx-auto leading-relaxed bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-black/20">
                با حکمت‌های جاودان حافظ شیرازی راه زندگی خود را بیابید
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="btn-primary text-lg px-8 py-3 backdrop-blur-sm shadow-lg"
                  >
                    دریافت فال امروز
                  </Link>
                  <Link 
                    to="/search" 
                    className="btn-secondary text-lg px-8 py-3 backdrop-blur-sm shadow-lg"
                  >
                    جستجو در غزل‌ها
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="btn-primary text-lg px-8 py-3 backdrop-blur-sm shadow-lg"
                  >
                    ورود به حساب کاربری
                  </Link>
                  <Link 
                    to="/ghazals" 
                    className="btn-secondary text-lg px-8 py-3 backdrop-blur-sm shadow-lg"
                  >
                    مطالعه غزل‌ها
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Quote Section */}
      <div className="max-w-4xl mx-auto px-4 mb-16 relative">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-theme-accent mb-3 drop-shadow-sm">
            سخن روز
          </h2>
          <p className="text-lg text-theme-secondary drop-shadow-sm">
            حکمتی از گنجینه اشعار حافظ
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="loading-persian w-8 h-8"></div>
          </div>
        ) : dailyQuote ? (
          <div className="card max-w-2xl mx-auto text-center backdrop-blur-sm bg-white/30 dark:bg-black/30 border border-white/20 dark:border-black/20">
            <blockquote className="text-2xl font-medium text-theme-primary mb-6 persian-text leading-relaxed">
              "{dailyQuote.text}"
            </blockquote>
            <cite className="text-lg text-theme-accent font-semibold">
              — {dailyQuote.author}
            </cite>
          </div>
        ) : (
          <div className="card max-w-lg mx-auto text-center backdrop-blur-sm bg-white/30 dark:bg-black/30 border border-white/20 dark:border-black/20">
            <p className="text-lg text-theme-secondary">
              امروز سخنی در دسترس نیست. فردا دوباره بازگردید.
            </p>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 mb-16 relative">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-theme-accent mb-3 drop-shadow-sm">
            ویژگی‌های برجسته
          </h2>
          <p className="text-lg text-theme-secondary drop-shadow-sm">
            تجربه‌ای منحصر به فرد از شعر کلاسیک فارسی
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="card text-center group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-white/25 dark:bg-black/25 border border-white/20 dark:border-black/20">
            <div className="text-4xl mb-4 text-persian-gold dark:text-dark-persian-gold drop-shadow-sm">🎯</div>
            <h3 className="text-xl font-bold text-theme-accent mb-3">
              فال روزانه شخصی
            </h3>
            <p className="text-theme-secondary leading-relaxed">
              هر روز غزلی متناسب با شرایط روحی شما انتخاب می‌شود
            </p>
          </div>
          
          <div className="card text-center group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-white/25 dark:bg-black/25 border border-white/20 dark:border-black/20">
            <div className="text-4xl mb-4 text-blue-600 dark:text-dark-persian-gold drop-shadow-sm">📚</div>
            <h3 className="text-xl font-bold text-theme-accent mb-3">
              مجموعه کامل دیوان
            </h3>
            <p className="text-theme-secondary leading-relaxed">
              دسترسی به تمام غزل‌های حافظ با تفسیر و معنی
            </p>
          </div>
          
          <div className="card text-center group hover:shadow-lg transition-all duration-300 backdrop-blur-sm bg-white/25 dark:bg-black/25 border border-white/20 dark:border-black/20">
            <div className="text-4xl mb-4 text-persian-saffron dark:text-dark-persian-amber drop-shadow-sm">🔍</div>
            <h3 className="text-xl font-bold text-theme-accent mb-3">
              جستجوی هوشمند
            </h3>
            <p className="text-theme-secondary leading-relaxed">
              جستجو در متن و معانی با فیلترهای پیشرفته
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="max-w-4xl mx-auto px-4 mb-16 relative">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/ghazals" 
            className="card text-center hover:shadow-lg transition-all duration-300 group backdrop-blur-sm bg-white/25 dark:bg-black/25 border border-white/20 dark:border-black/20"
          >
            <div className="text-3xl mb-3 text-blue-600 dark:text-dark-persian-gold group-hover:scale-110 transition-transform drop-shadow-sm">📖</div>
            <h3 className="font-semibold text-theme-accent">مطالعه غزل‌ها</h3>
            <p className="text-sm text-theme-secondary mt-2">کاوش در دیوان حافظ</p>
          </Link>

          <Link 
            to="/search" 
            className="card text-center hover:shadow-lg transition-all duration-300 group backdrop-blur-sm bg-white/25 dark:bg-black/25 border border-white/20 dark:border-black/20"
          >
            <div className="text-3xl mb-3 text-persian-gold dark:text-dark-persian-gold group-hover:scale-110 transition-transform drop-shadow-sm">🔍</div>
            <h3 className="font-semibold text-theme-accent">جستجو</h3>
            <p className="text-sm text-theme-secondary mt-2">یافتن اشعار خاص</p>
          </Link>

          <Link 
            to="/quotes" 
            className="card text-center hover:shadow-lg transition-all duration-300 group backdrop-blur-sm bg-white/25 dark:bg-black/25 border border-white/20 dark:border-black/20"
          >
            <div className="text-3xl mb-3 text-persian-saffron dark:text-dark-persian-amber group-hover:scale-110 transition-transform drop-shadow-sm">💬</div>
            <h3 className="font-semibold text-theme-accent">سخنان</h3>
            <p className="text-sm text-theme-secondary mt-2">حکمت‌های الهام‌بخش</p>
          </Link>

          {user ? (
            <Link 
              to="/dashboard" 
              className="card text-center hover:shadow-lg transition-all duration-300 group backdrop-blur-sm bg-white/25 dark:bg-black/25 border border-white/20 dark:border-black/20"
            >
              <div className="text-3xl mb-3 text-blue-600 dark:text-dark-persian-gold group-hover:scale-110 transition-transform drop-shadow-sm">🎯</div>
              <h3 className="font-semibold text-theme-accent">داشبورد</h3>
              <p className="text-sm text-theme-secondary mt-2">فال شخصی شما</p>
            </Link>
          ) : (
            <Link 
              to="/register" 
              className="card text-center hover:shadow-lg transition-all duration-300 group backdrop-blur-sm bg-gradient-to-br from-persian-gold/20 to-persian-saffron/20 dark:from-dark-persian-gold/20 dark:to-dark-persian-amber/20 border border-persian-gold/30 dark:border-dark-persian-gold/30"
            >
              <div className="text-3xl mb-3 text-persian-gold dark:text-dark-persian-gold group-hover:scale-110 transition-transform drop-shadow-sm">✨</div>
              <h3 className="font-semibold text-theme-accent">عضویت</h3>
              <p className="text-sm text-theme-secondary mt-2">شروع تجربه شخصی</p>
            </Link>
          )}
        </div>
      </div>

      {/* Call to Action */}
      {!user && (
        <div className="bg-gradient-to-r from-blue-700/90 to-blue-800/90 dark:from-dark-persian-navy/90 dark:to-dark-persian-midnight/90 py-12 px-4 theme-transition relative backdrop-blur-sm">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
              سفر شما در دنیای حافظ آغاز شود
            </h2>
            <p className="text-lg text-white/90 mb-8 leading-relaxed drop-shadow-sm">
              با ایجاد حساب کاربری، هر روز فال شخصی خود را دریافت کنید
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/register" 
                className="bg-persian-gold hover:bg-persian-saffron dark:bg-dark-persian-gold dark:hover:bg-dark-persian-amber text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg"
              >
                ایجاد حساب کاربری
              </Link>
              <Link 
                to="/login" 
                className="bg-white/20 hover:bg-white/30 dark:bg-white/20 dark:hover:bg-white/30 text-white border border-white/30 px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 backdrop-blur-sm"
              >
                ورود به حساب موجود
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-white/40 dark:bg-black/40 py-8 px-4 theme-transition backdrop-blur-md relative border-t border-white/20 dark:border-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-theme-secondary leading-relaxed drop-shadow-sm">
            این وب‌سایت با احترام به میراث فرهنگی حافظ شیرازی و با هدف نزدیک کردن 
            نسل جوان به ادبیات کلاسیک فارسی طراحی شده است.
          </p>
        </div>
      </div>
    </>
  );
};

export default HomePage;