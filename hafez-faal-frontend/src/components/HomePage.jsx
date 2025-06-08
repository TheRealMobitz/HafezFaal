import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const [dailyQuote, setDailyQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useAuth();

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
    <div className="min-h-screen font-persian bg-gradient-to-br from-persian-cream to-persian-ivory dark:bg-dark-gradient theme-transition">
      {/* Hero Section */}
      <div className="relative">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-20 right-20 text-8xl text-persian-gold dark:text-dark-persian-gold rotate-12 animate-pulse-slow">✦</div>
          <div className="absolute bottom-20 left-20 text-6xl text-persian-blue dark:text-dark-persian-gold -rotate-12 animate-pulse-slow">❋</div>
        </div>

        <div className="relative text-center py-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Greeting */}
            <div className="mb-8">
              <p className="text-xl text-theme-accent font-medium mb-2">
                {getTimeOfDayGreeting()}
              </p>
              <p className="text-base text-theme-secondary">
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
              <h1 className="text-5xl md:text-7xl font-bold text-theme-accent mb-6 leading-tight">
                فال حافظ
              </h1>
              <p className="text-xl md:text-2xl text-theme-secondary max-w-3xl mx-auto leading-relaxed">
                با حکمت‌های جاودان حافظ شیرازی راه زندگی خود را بیابید
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="btn-primary text-lg px-8 py-3"
                  >
                    دریافت فال امروز
                  </Link>
                  <Link 
                    to="/search" 
                    className="btn-secondary text-lg px-8 py-3"
                  >
                    جستجو در غزل‌ها
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="btn-primary text-lg px-8 py-3"
                  >
                    ورود به حساب کاربری
                  </Link>
                  <Link 
                    to="/ghazals" 
                    className="btn-secondary text-lg px-8 py-3"
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
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-theme-accent mb-3">
            سخن روز
          </h2>
          <p className="text-lg text-theme-secondary">
            حکمتی از گنجینه اشعار حافظ
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-persian-gold dark:border-dark-persian-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : dailyQuote ? (
          <div className="card max-w-2xl mx-auto text-center">
            <blockquote className="text-2xl font-medium text-theme-primary mb-6 persian-text leading-relaxed">
              "{dailyQuote.text}"
            </blockquote>
            <cite className="text-lg text-theme-accent font-semibold">
              — {dailyQuote.author}
            </cite>
          </div>
        ) : (
          <div className="card max-w-lg mx-auto text-center">
            <p className="text-lg text-theme-secondary">
              امروز سخنی در دسترس نیست. فردا دوباره بازگردید.
            </p>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-theme-accent mb-3">
            ویژگی‌های برجسته
          </h2>
          <p className="text-lg text-theme-secondary">
            تجربه‌ای منحصر به فرد از شعر کلاسیک فارسی
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="card text-center group hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-4 text-persian-gold dark:text-dark-persian-gold">🎯</div>
            <h3 className="text-xl font-bold text-theme-accent mb-3">
              فال روزانه شخصی
            </h3>
            <p className="text-theme-secondary leading-relaxed">
              هر روز غزلی متناسب با شرایط روحی شما انتخاب می‌شود
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="card text-center group hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-4 text-persian-blue dark:text-dark-persian-gold">📚</div>
            <h3 className="text-xl font-bold text-theme-accent mb-3">
              مجموعه کامل دیوان
            </h3>
            <p className="text-theme-secondary leading-relaxed">
              دسترسی به تمام غزل‌های حافظ با تفسیر و معنی
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="card text-center group hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-4 text-persian-saffron dark:text-dark-persian-amber">🔍</div>
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
      <div className="max-w-4xl mx-auto px-4 mb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/ghazals" 
            className="card text-center hover:shadow-lg transition-all duration-300 group"
          >
            <div className="text-3xl mb-3 text-persian-blue dark:text-dark-persian-gold group-hover:scale-110 transition-transform">📖</div>
            <h3 className="font-semibold text-theme-accent">مطالعه غزل‌ها</h3>
            <p className="text-sm text-theme-secondary mt-2">کاوش در دیوان حافظ</p>
          </Link>

          <Link 
            to="/search" 
            className="card text-center hover:shadow-lg transition-all duration-300 group"
          >
            <div className="text-3xl mb-3 text-persian-gold dark:text-dark-persian-gold group-hover:scale-110 transition-transform">🔍</div>
            <h3 className="font-semibold text-theme-accent">جستجو</h3>
            <p className="text-sm text-theme-secondary mt-2">یافتن اشعار خاص</p>
          </Link>

          <Link 
            to="/quotes" 
            className="card text-center hover:shadow-lg transition-all duration-300 group"
          >
            <div className="text-3xl mb-3 text-persian-saffron dark:text-dark-persian-amber group-hover:scale-110 transition-transform">💬</div>
            <h3 className="font-semibold text-theme-accent">سخنان</h3>
            <p className="text-sm text-theme-secondary mt-2">حکمت‌های الهام‌بخش</p>
          </Link>

          {user ? (
            <Link 
              to="/dashboard" 
              className="card text-center hover:shadow-lg transition-all duration-300 group"
            >
              <div className="text-3xl mb-3 text-persian-blue dark:text-dark-persian-gold group-hover:scale-110 transition-transform">🎯</div>
              <h3 className="font-semibold text-theme-accent">داشبورد</h3>
              <p className="text-sm text-theme-secondary mt-2">فال شخصی شما</p>
            </Link>
          ) : (
            <Link 
              to="/register" 
              className="card text-center hover:shadow-lg transition-all duration-300 group bg-gradient-to-br from-persian-gold/10 to-persian-saffron/10 dark:from-dark-persian-gold/10 dark:to-dark-persian-amber/10"
            >
              <div className="text-3xl mb-3 text-persian-gold dark:text-dark-persian-gold group-hover:scale-110 transition-transform">✨</div>
              <h3 className="font-semibold text-theme-accent">عضویت</h3>
              <p className="text-sm text-theme-secondary mt-2">شروع تجربه شخصی</p>
            </Link>
          )}
        </div>
      </div>

      {/* Call to Action */}
      {!user && (
        <div className="bg-gradient-to-r from-persian-blue to-blue-700 dark:from-dark-persian-navy dark:to-dark-persian-midnight py-12 px-4 theme-transition">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              سفر شما در دنیای حافظ آغاز شود
            </h2>
            <p className="text-lg text-persian-cream dark:text-dark-text-medium mb-8 leading-relaxed">
              با ایجاد حساب کاربری، هر روز فال شخصی خود را دریافت کنید
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/register" 
                className="bg-persian-gold hover:bg-persian-saffron dark:bg-dark-persian-gold dark:hover:bg-dark-persian-amber text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300"
              >
                ایجاد حساب کاربری
              </Link>
              <Link 
                to="/login" 
                className="bg-white/20 hover:bg-white/30 dark:bg-dark-persian-gold/20 dark:hover:bg-dark-persian-gold/30 text-white border border-white/30 dark:border-dark-persian-gold/30 px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300"
              >
                ورود به حساب موجود
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-persian-ivory dark:bg-dark-bg-secondary py-8 px-4 theme-transition">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-theme-secondary leading-relaxed">
            این وب‌سایت با احترام به میراث فرهنگی حافظ شیرازی و با هدف نزدیک کردن 
            نسل جوان به ادبیات کلاسیک فارسی طراحی شده است.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;