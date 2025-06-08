import os
import django
import pandas as pd

# Setup Django environment FIRST
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HafezFaal.settings')
django.setup()

# NOW import Django models after setup
from faal.models import Quote, HafezGhazal

def populate_from_excel():
    """
    Populate database from Faal.xlsx file
    Expected Excel structure:
    - Sheet 'falhafez' with columns: شناسه, شعر, معنی
    """
    
    excel_file = 'Faal.xlsx'
    
    if not os.path.exists(excel_file):
        print(f"خطا: فایل {excel_file} پیدا نشد!")
        return
    
    try:
        print("شروع خواندن فایل اکسل...")
        
        # Read Excel file with all sheets
        excel_data = pd.read_excel(excel_file, sheet_name=None)
        
        print(f"شیت‌های موجود: {list(excel_data.keys())}")
        
        # Process all sheets
        for sheet_name, df in excel_data.items():
            print(f"\n📋 پردازش شیت: {sheet_name}")
            print(f"   تعداد سطرها: {len(df)}")
            print(f"   ستون‌ها: {list(df.columns)}")
            
            quotes_added = 0
            ghazals_added = 0
            
            for index, row in df.iterrows():
                try:
                    # Get data from your specific columns
                    ghazal_id = row.get('شناسه', None)
                    poetry_text = row.get('شعر', None)
                    meaning_text = row.get('معنی', None)
                    
                    # Debug: Show first few rows
                    if index < 5:
                        print(f"   سطر {index + 2}:")
                        print(f"     شناسه: {ghazal_id}")
                        print(f"     شعر: {str(poetry_text)[:100] if poetry_text else 'None'}...")
                        print(f"     معنی: {str(meaning_text)[:100] if meaning_text else 'None'}...")
                        print()
                    
                    # Clean and process the data
                    if pd.notna(ghazal_id) and pd.notna(poetry_text):
                        try:
                            ghazal_number = int(float(ghazal_id))
                        except:
                            print(f"   خطا در تبدیل شناسه {ghazal_id} به عدد")
                            continue
                        
                        # Clean the poetry text
                        clean_poetry = str(poetry_text).strip()
                        # Remove the _x000D_ artifacts that appear in your data
                        clean_poetry = clean_poetry.replace('_x000D_', '')
                        clean_poetry = clean_poetry.replace('\n\n', '\n')
                        clean_poetry = clean_poetry.strip()
                        
                        # Clean the meaning text
                        clean_meaning = str(meaning_text).strip() if pd.notna(meaning_text) else ''
                        clean_meaning = clean_meaning.replace('_x000D_', '')
                        
                        # Add as HafezGhazal
                        if clean_poetry and len(clean_poetry) > 10:
                            ghazal, created = HafezGhazal.objects.get_or_create(
                                ghazal_number=ghazal_number,
                                defaults={
                                    'persian_text': clean_poetry,
                                    'english_translation': clean_meaning  # Using meaning as translation
                                }
                            )
                            
                            if created:
                                ghazals_added += 1
                                print(f"✓ غزل {ghazal_number} اضافه شد")
                            else:
                                print(f"- غزل {ghazal_number} موجود است")
                        
                        # Also add first line as a quote
                        first_line = clean_poetry.split('\n')[0].strip() if clean_poetry else ''
                        if first_line and len(first_line) > 10:
                            quote, created = Quote.objects.get_or_create(
                                text=first_line,
                                defaults={
                                    'author': 'حافظ شیرازی',
                                    'is_daily_quote': False
                                }
                            )
                            
                            if created:
                                quotes_added += 1
                                if index < 5:  # Only print for first few
                                    print(f"✓ سخن اضافه شد: {first_line[:50]}...")
                            
                except Exception as e:
                    print(f"خطا در سطر {index + 2}: {e}")
                    continue
            
            print(f"\n📊 خلاصه شیت {sheet_name}:")
            print(f"   سخنان اضافه شده: {quotes_added}")
            print(f"   غزل‌های اضافه شده: {ghazals_added}")
        
        # Set first quote as daily quote if none exists
        daily_quote = Quote.objects.filter(is_daily_quote=True).first()
        if not daily_quote:
            first_quote = Quote.objects.first()
            if first_quote:
                first_quote.is_daily_quote = True
                first_quote.save()
                print("\n✓ اولین سخن به عنوان سخن روز انتخاب شد")
        
        # Final statistics
        print(f"\n🎉 پایگاه داده با موفقیت پر شد!")
        print(f"📖 تعداد کل سخنان: {Quote.objects.count()}")
        print(f"🌙 تعداد کل غزل‌ها: {HafezGhazal.objects.count()}")
        print(f"⭐ سخن روز: {Quote.objects.filter(is_daily_quote=True).count()}")
        
    except Exception as e:
        print(f"خطای کلی: {e}")
        print("لطفاً ساختار فایل اکسل را بررسی کنید.")

def show_excel_structure():
    """Show the structure of the Excel file for debugging"""
    excel_file = 'Faal.xlsx'
    
    if not os.path.exists(excel_file):
        print(f"فایل {excel_file} پیدا نشد!")
        return
    
    try:
        # Read all sheets
        excel_data = pd.read_excel(excel_file, sheet_name=None)
        
        print("🔍 ساختار فایل اکسل:")
        print("=" * 50)
        
        for sheet_name, df in excel_data.items():
            print(f"\n📋 شیت: {sheet_name}")
            print(f"   تعداد سطرها: {len(df)}")
            print(f"   ستون‌ها: {list(df.columns)}")
            
            # Show first few rows
            print("   نمونه داده‌ها:")
            for i, (index, row) in enumerate(df.head(5).iterrows()):
                row_data = {}
                for col, val in row.items():
                    if pd.notna(val) and str(val).strip():
                        val_str = str(val)[:100] + ("..." if len(str(val)) > 100 else "")
                        row_data[col] = val_str
                print(f"   سطر {index + 2}: {row_data}")
                if i >= 4:  # Show first 5 rows
                    break
            
            # Show column analysis
            print("\n   تحلیل ستون‌ها:")
            for col in df.columns:
                non_empty = df[col].notna().sum()
                print(f"   - {col}: {non_empty} مقدار غیر خالی")
                    
    except Exception as e:
        print(f"خطا در خواندن فایل: {e}")

def clear_database():
    """Clear all data from database (use with caution!)"""
    print("⚠️  هشدار: این عملیات تمام داده‌ها را پاک می‌کند!")
    confirm = input("برای ادامه 'YES' تایپ کنید: ")
    
    if confirm == 'YES':
        Quote.objects.all().delete()
        HafezGhazal.objects.all().delete()
        print("✓ تمام داده‌ها پاک شدند")
    else:
        print("عملیات لغو شد")

def test_random_selection():
    """Test if we can get random ghazals and quotes"""
    print("\n🧪 تست انتخاب تصادفی:")
    print("=" * 30)
    
    # Test random ghazal
    random_ghazal = HafezGhazal.get_random_ghazal()
    if random_ghazal:
        print(f"✓ غزل تصادفی: شماره {random_ghazal.ghazal_number}")
        print(f"  متن: {random_ghazal.persian_text[:100]}...")
    else:
        print("❌ هیچ غزلی یافت نشد")
    
    # Test random quote
    random_quote = Quote.objects.order_by('?').first()
    if random_quote:
        print(f"✓ سخن تصادفی: {random_quote.text[:100]}...")
        print(f"  شاعر: {random_quote.author}")
    else:
        print("❌ هیچ سخنی یافت نشد")

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        if sys.argv[1] == 'show':
            show_excel_structure()
        elif sys.argv[1] == 'clear':
            clear_database()
        elif sys.argv[1] == 'test':
            test_random_selection()
        else:
            print("استفاده: python populate_from_excel.py [show|clear|test]")
    else:
        populate_from_excel()