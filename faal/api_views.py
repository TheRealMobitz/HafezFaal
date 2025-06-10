from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.conf import settings
from datetime import time
import json
import sys
import os
from .models import Quote, HafezGhazal, UserDailyFaal
from .serializers import (
    QuoteSerializer, HafezGhazalSerializer, 
    UserDailyFaalSerializer, UserSerializer, UserRegistrationSerializer
)

# Helper function to ensure database is populated before accessing
def ensure_database_populated():
    """Populate database if empty to handle Vercel serverless environment"""
    from faal.models import Quote, HafezGhazal
    from django.contrib.auth.models import User
    from django.db import connection
    
    try:
        # Test if tables exist
        with connection.cursor() as cursor:
            # Check if auth_user table exists
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='auth_user';")
            if not cursor.fetchone():
                print("User tables don't exist, running migrations...")
                from django.core.management import execute_from_command_line
                execute_from_command_line(['manage.py', 'migrate', '--run-syncdb'])
        
        # Check if content data exists and populate if needed
        if HafezGhazal.objects.count() == 0 or Quote.objects.count() == 0:
            from api.index import populate_from_excel_data
            populate_from_excel_data()
            
        print(f"Database status: {User.objects.count()} users, {HafezGhazal.objects.count()} ghazals, {Quote.objects.count()} quotes")
            
    except Exception as e:
        print(f"Database population error: {e}")
        # Create minimal fallback data directly
        try:
            HafezGhazal.objects.get_or_create(
                ghazal_number=1,
                defaults={
                    'persian_text': "الا یا ایها الساقی ادر کاسا و ناولها\nکه عشق آسان نمود اول ولی افتاد مشکل‌ها",
                    'english_translation': "O Saki, pass around and offer the bowl\nFor love at first appeared easy, but difficulties arose"
                }
            )
            Quote.objects.get_or_create(
                text="الا یا ایها الساقی ادر کاسا و ناولها",
                defaults={
                    'author': "حافظ شیرازی",
                    'is_daily_quote': True
                }
            )
        except Exception as fallback_error:
            print(f"Fallback data creation failed: {fallback_error}")

            
# Health Check endpoint - MUST BE FIRST
@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint for deployment debugging"""
    try:
        # Ensure database is populated
        ensure_database_populated()
        
        # Check database connectivity
        ghazal_count = HafezGhazal.objects.count()
        quote_count = Quote.objects.count()
        
        return Response({
            'status': 'healthy',
            'debug': settings.DEBUG,
            'python_version': sys.version,
            'environment': 'vercel' if os.environ.get('VERCEL') else 'local',
            'cors_origins': list(settings.CORS_ALLOWED_ORIGINS),
            'allowed_hosts': settings.ALLOWED_HOSTS,
            'data': {
                'ghazals': ghazal_count,
                'quotes': quote_count,
            }
        })
    except Exception as e:
        return Response({
            'status': 'error',
            'error': str(e),
            'debug': settings.DEBUG,
        }, status=500)

# CSRF Token endpoint
@api_view(['GET'])
@permission_classes([AllowAny])
@ensure_csrf_cookie
def get_csrf_token(request):
    """Get CSRF token for API requests"""
    return Response({
        'csrf_token': get_token(request),
        'message': 'CSRF token generated successfully'
    })

# Daily Quote endpoint
@api_view(['GET'])
@permission_classes([AllowAny])
def daily_quote(request):
    """Get daily quote - accessible to all users"""
    try:
        # Ensure database is populated
        ensure_database_populated()
        
        # Get a random quote
        quote = Quote.objects.order_by('?').first()
        if quote:
            serializer = QuoteSerializer(quote)
            return Response(serializer.data)
        else:
            return Response({
                'text': 'امروز سخنی در دسترس نیست',
                'author': 'حافظ شیرازی',
                'message': 'فردا دوباره بازگردید'
            })
    except Exception as e:
        return Response({
            'error': str(e),
            'text': 'خطا در دریافت سخن روز',
            'author': 'سیستم'
        }, status=500)

# User Dashboard endpoint
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_dashboard(request):
    """Get user dashboard with daily faal"""
    try:
        # Ensure database is populated
        ensure_database_populated()
        
        user = request.user
        today = timezone.now().date()
        
        # Check if user already has a faal for today
        try:
            user_faal = UserDailyFaal.objects.get(user=user, date=today)
            serializer = UserDailyFaalSerializer(user_faal)
            return Response({
                'faal_available': True,
                'faal': serializer.data,
                'message': f'فال شما برای امروز آماده است، {user.username}!'
            })
        except UserDailyFaal.DoesNotExist:
            # Check time constraints (after 8 AM)
            current_time = timezone.now().time()
            if current_time < time(8, 0):
                return Response({
                    'faal_available': False,
                    'message': 'فال شما هنوز آماده نیست. لطفاً بعد از ساعت 8 صبح مراجعه کنید.'
                })
            
            # Create new faal
            random_ghazal = HafezGhazal.objects.order_by('?').first()
            if random_ghazal:
                user_faal = UserDailyFaal.objects.create(
                    user=user,
                    ghazal=random_ghazal,
                    date=today
                )
                serializer = UserDailyFaalSerializer(user_faal)
                return Response({
                    'faal_available': True,
                    'faal': serializer.data,
                    'message': f'فال جدید شما آماده شد، {user.username}!'
                })
            else:
                return Response({
                    'faal_available': False,
                    'message': 'متأسفانه در حال حاضر غزلی در دسترس نیست.'
                })
    except Exception as e:
        return Response({
            'error': str(e),
            'faal_available': False,
            'message': 'خطا در دریافت فال روزانه'
        }, status=500)

# List Views with database population check
class QuoteListView(generics.ListAPIView):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        # Ensure database is populated before querying
        ensure_database_populated()
        return Quote.objects.all()

class HafezGhazalListView(generics.ListAPIView):
    queryset = HafezGhazal.objects.all().order_by('ghazal_number')
    serializer_class = HafezGhazalSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        # Ensure database is populated before querying
        ensure_database_populated()
        return HafezGhazal.objects.all().order_by('ghazal_number')

# Authentication endpoints
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Register a new user with improved persistence"""
    try:
        # Ensure database is populated first
        ensure_database_populated()
        
        print(f"Registration attempt with data: {request.data}")
        
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            # Create user with explicit transaction
            from django.db import transaction
            
            with transaction.atomic():
                user = serializer.save()
                
                # Force save and verify persistence
                user.save()
                
                # Double-check the user was actually saved
                try:
                    saved_user = User.objects.get(pk=user.pk)
                    print(f"User verified in database: {saved_user.username} (ID: {saved_user.pk})")
                    
                    # Login the user
                    login(request, user)
                    
                    # Serialize user data
                    user_serializer = UserSerializer(user)
                    
                    return Response({
                        'user': user_serializer.data,
                        'message': 'ثبت نام با موفقیت انجام شد'
                    }, status=status.HTTP_201_CREATED)
                    
                except User.DoesNotExist:
                    print(f"ERROR: User {user.username} was not saved to database!")
                    return Response({
                        'error': 'خطا در ذخیره اطلاعات کاربر',
                        'message': 'کاربر ایجاد شد ولی ذخیره نشد'
                    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            print(f"Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        print(f"Registration error: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({
            'error': str(e),
            'message': 'خطا در ثبت نام'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """Login user with enhanced database checking"""
    try:
        # Ensure database is ready
        ensure_database_populated()
        
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({
                'error': 'نام کاربری و رمز عبور الزامی است'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        print(f"Attempting login for user: {username}")
        
        # Check if user exists
        from django.contrib.auth.models import User
        try:
            user_obj = User.objects.get(username=username)
            print(f"User found: {user_obj.username}")
        except User.DoesNotExist:
            print(f"User not found: {username}")
            return Response({
                'error': 'این نام کاربری وجود ندارد. لطفاً ابتدا ثبت نام کنید.'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Authenticate user
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            user_serializer = UserSerializer(user)
            print(f"Login successful for user: {username}")
            return Response({
                'user': user_serializer.data,
                'message': 'ورود موفقیت‌آمیز'
            })
        else:
            print(f"Invalid password for user: {username}")
            return Response({
                'error': 'رمز عبور اشتباه است'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
    except Exception as e:
        print(f"Login error: {e}")
        return Response({
            'error': str(e),
            'message': 'خطا در ورود'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """Logout user"""
    try:
        logout(request)
        return Response({
            'message': 'خروج موفقیت‌آمیز'
        })
    except Exception as e:
        return Response({
            'error': str(e),
            'message': 'خطا در خروج'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """Get current user info"""
    try:
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    except Exception as e:
        return Response({
            'error': str(e),
            'message': 'خطا در دریافت اطلاعات کاربر'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Random quote endpoint for better API coverage
@api_view(['GET'])
@permission_classes([AllowAny])
def random_quote(request):
    """Get a random quote"""
    try:
        # Ensure database is populated
        ensure_database_populated()
        
        # Get a random quote
        quotes = Quote.objects.all()
        if not quotes.exists():
            return Response({
                'text': 'No quotes available',
                'author': 'System'
            }, status=404)
            
        quote = quotes.order_by('?').first()
        serializer = QuoteSerializer(quote)
        return Response(serializer.data)
    except Exception as e:
        return Response({
            'error': str(e),
            'text': 'Error retrieving quote',
            'author': 'System'
        }, status=500)