import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HafezFaal.settings')
django.setup()

from faal.models import Quote, HafezGhazal

# Persian Quotes
persian_quotes = [
    {
        "text": "دوش از مسجد سوی میخانه آمد پیر ما، کز ریای صوفیان ملول گشت و از دنیا رها",
        "author": "حافظ شیرازی"
    },
    {
        "text": "خدایا خود ز عشق محنت آسای من، رهنمون شو که من از راه برون رفته‌ام",
        "author": "حافظ شیرازی"
    },
    {
        "text": "صبح صادق است و شب تیره به سر آمده، مهر بر صحیفه اسرار گذرگاه نهاد",
        "author": "حافظ شیرازی"
    },
    {
        "text": "عاقبت کار جهان است، ابدیت طرف کار، گر نباشد خیر کاری بد کند کار تو را",
        "author": "سعدی شیرازی"
    },
    {
        "text": "آنکه شد اسیر جلوه رخ زیبای تو، کی توان که باز گردد آزاد از پای تو",
        "author": "حافظ شیرازی"
    }
]

# Hafez Ghazals
hafez_ghazals = [
    {
        "ghazal_number": 1,
        "persian_text": """الا یا ایها الساقی ادر کاسا و ناولها
که عشق آسان نمود اول ولی افتاد مشکل‌ها

به بوی نافه‌ای کاین باد بینوش از عرصه جانان خیزد
کجا بود و کجا خواهد نشست این آسمان برگرد کویا""",
        "english_translation": """O cupbearer, bring forth the cup and put it to our lips
Path of love seemed easy at first, what came was many hardships

By fragrance of that Musk deer from the arena of the beloved rises
Where was it and where will it settle, this revolving firmament"""
    },
    {
        "ghazal_number": 2,
        "persian_text": """صلاح کار کجا و من خراب کجا
ببین تفاوت ره از کجاست تا به کجا

دلا به جان خریدم باده و می‌خانه و مطرب
که عاقبت همه این سوختگان را داد کجا""",
        "english_translation": """Where is righteous work and where am I in my ruin
Look at the difference of the path from where to where

O heart, I bought wine, tavern and minstrel with my soul
For in the end, what did all these burned ones receive"""
    },
    {
        "ghazal_number": 3,
        "persian_text": """سحرگه گل به بوی خوش از خواب خوش دمید
نسیم صبحگاهی محبوب از کجا رسید

ز هر طرف که می‌نگرم عالمی است در کار
درین میان عالم من چه خوابها که دیدم""",
        "english_translation": """At dawn when the rose bloomed sweetly from sweet sleep
From where did this beloved morning breeze arrive

From every direction I look, there's a world at work
In this midst of worlds, what dreams I have seen"""
    },
    {
        "ghazal_number": 4,
        "persian_text": """صبا به لطف بگو آن غزال رعنا را
که سر به کوه و بیابان تو داده‌ای ما را

شکرشکن شوند همه طوطیان هند
اگر بر این نقش نو پرده‌ای گشایند""",
        "english_translation": """O morning breeze, kindly tell that graceful gazelle
That you have driven us to mountains and deserts

All the parrots of India would be sugar-crunching
If they would open their beaks to this new melody"""
    },
    {
        "ghazal_number": 5,
        "persian_text": """کلید گنج سعادت به دست کسی نهند
که در هوای خدایان دل شکسته دارد

چو عنقا شهرت عشق تو در آفاق است
ولی نشان تو کس در دو عالم چه دیده""",
        "english_translation": """The key to the treasure of happiness is given to one
Who has a broken heart in love with the divine

Like the phoenix, the fame of your love is worldwide
But who has seen a trace of you in both worlds"""
    },
    {
        "ghazal_number": 6,
        "persian_text": """خداوندا چه غمگین است دل من در این شب
که آه من به عرش می‌رسد و لاف زهره می‌شکند

به یاد روی تو هر دم دل من می‌تپد
مثل پروانه که گرد شمع می‌سوزد و می‌چرخد""",
        "english_translation": """O Lord, how sorrowful is my heart this night
That my sigh reaches the throne and breaks Venus's pride

Remembering your face, my heart beats every moment
Like a moth that burns and circles around the candle"""
    }
]

def populate_database():
    print("شروع پر کردن پایگاه داده...")
    
    # Add Persian quotes
    print("اضافه کردن سخنان...")
    for quote_data in persian_quotes:
        quote, created = Quote.objects.get_or_create(
            text=quote_data["text"],
            defaults={
                "author": quote_data["author"],
                "is_daily_quote": False
            }
        )
        if created:
            print(f"سخن اضافه شد: {quote_data['text'][:50]}...")
        else:
            print(f"سخن از قبل موجود: {quote_data['text'][:50]}...")
    
    # Mark first quote as daily quote
    first_quote = Quote.objects.first()
    if first_quote:
        first_quote.is_daily_quote = True
        first_quote.save()
        print("اولین سخن به عنوان سخن روز انتخاب شد.")
    
    # Add Hafez ghazals
    print("\nاضافه کردن غزل‌های حافظ...")
    for ghazal_data in hafez_ghazals:
        ghazal, created = HafezGhazal.objects.get_or_create(
            ghazal_number=ghazal_data["ghazal_number"],
            defaults={
                "persian_text": ghazal_data["persian_text"],
                "english_translation": ghazal_data["english_translation"]
            }
        )
        if created:
            print(f"غزل {ghazal_data['ghazal_number']} اضافه شد.")
        else:
            print(f"غزل {ghazal_data['ghazal_number']} از قبل موجود است.")
    
    print(f"\nپایگاه داده با موفقیت پر شد!")
    print(f"تعداد سخنان: {Quote.objects.count()}")
    print(f"تعداد غزل‌ها: {HafezGhazal.objects.count()}")

if __name__ == "__main__":
    populate_database()