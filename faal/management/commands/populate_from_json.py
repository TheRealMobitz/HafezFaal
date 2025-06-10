import json
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from faal.models import Quote, HafezGhazal
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Populate database from JSON files'

    def handle(self, *args, **options):
        """Populate database from JSON files"""
        try:
            self.stdout.write("Starting to populate database from JSON files...")
            
            # Get the base directory (where manage.py is located)
            base_dir = settings.BASE_DIR
            
            # Load ghazals data
            ghazals_file = os.path.join(base_dir, 'ghazals_data.json')
            quotes_file = os.path.join(base_dir, 'quotes_data.json')
            
            # Clear existing data to avoid duplicates
            self.stdout.write("Clearing existing data...")
            HafezGhazal.objects.all().delete()
            Quote.objects.all().delete()
            
            # Load and populate ghazals
            if os.path.exists(ghazals_file):
                self.stdout.write(f"Loading ghazals from {ghazals_file}")
                with open(ghazals_file, 'r', encoding='utf-8') as f:
                    ghazals_data = json.load(f)
                
                ghazals_created = 0
                for i, ghazal_data in enumerate(ghazals_data, 1):
                    ghazal_number = ghazal_data.get('ghazal_number', i)
                    persian_text = ghazal_data.get('persian_text', '').replace('_x000D_', '').replace('\r', '').strip()
                    english_translation = ghazal_data.get('english_translation', '').replace('_x000D_', '').replace('\r', '').strip()
                    
                    if persian_text or english_translation:
                        ghazal, created = HafezGhazal.objects.get_or_create(
                            ghazal_number=ghazal_number,
                            defaults={
                                'persian_text': persian_text,
                                'english_translation': english_translation
                            }
                        )
                        
                        if created:
                            ghazals_created += 1
                            if ghazals_created <= 5:
                                self.stdout.write(f"Created ghazal {ghazal_number}")
                
                self.stdout.write(self.style.SUCCESS(f"Successfully created {ghazals_created} ghazals"))
            else:
                self.stdout.write(self.style.ERROR(f"Ghazals file not found: {ghazals_file}"))
            
            # Load and populate quotes
            if os.path.exists(quotes_file):
                self.stdout.write(f"Loading quotes from {quotes_file}")
                with open(quotes_file, 'r', encoding='utf-8') as f:
                    quotes_data = json.load(f)
                
                quotes_created = 0
                for quote_data in quotes_data:
                    text = quote_data.get('text', '').replace('_x000D_', '').replace('\r', '').strip()
                    author = quote_data.get('author', 'حافظ شیرازی')
                    is_daily_quote = quote_data.get('is_daily_quote', False)
                    
                    if text:
                        quote, created = Quote.objects.get_or_create(
                            text=text,
                            defaults={
                                'author': author,
                                'is_daily_quote': is_daily_quote
                            }
                        )
                        
                        if created:
                            quotes_created += 1
                            if quotes_created <= 5:
                                self.stdout.write(f"Created quote: {text[:50]}...")
                
                self.stdout.write(self.style.SUCCESS(f"Successfully created {quotes_created} quotes"))
            else:
                self.stdout.write(self.style.ERROR(f"Quotes file not found: {quotes_file}"))
            
            # Create superuser if it doesn't exist
            if not User.objects.filter(is_superuser=True).exists():
                self.stdout.write("Creating superuser...")
                User.objects.create_superuser(
                    username='admin',
                    email='admin@hafezfaal.com',
                    password='admin123'
                )
                self.stdout.write(self.style.SUCCESS("Superuser created: admin/admin123"))
            
            # Verify data was loaded
            ghazal_count = HafezGhazal.objects.count()
            quote_count = Quote.objects.count()
            user_count = User.objects.count()
            
            self.stdout.write(self.style.SUCCESS("Database populated successfully!"))
            self.stdout.write(f"- Ghazals: {ghazal_count}")
            self.stdout.write(f"- Quotes: {quote_count}")
            self.stdout.write(f"- Users: {user_count}")
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error populating database: {str(e)}"))
            import traceback
            traceback.print_exc()