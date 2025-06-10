from django.urls import path
from . import api_views

urlpatterns = [
    # Health check - MUST be first for debugging
    path('health/', api_views.health_check, name='api_health'),
    
    # CSRF token endpoint
    path('csrf/', api_views.get_csrf_token, name='api_csrf'),
    
    # Public endpoints
    path('quote/', api_views.daily_quote, name='api_daily_quote'),
    path('quotes/', api_views.QuoteListView.as_view(), name='api_quotes'),
    path('ghazals/', api_views.HafezGhazalListView.as_view(), name='api_ghazals'),
    
    # Auth endpoints
    path('auth/register/', api_views.register_user, name='api_register'),
    path('auth/login/', api_views.login_user, name='api_login'),
    path('auth/logout/', api_views.logout_user, name='api_logout'),
    path('auth/user/', api_views.current_user, name='api_current_user'),
    
    # Protected endpoints
    path('dashboard/', api_views.user_dashboard, name='api_dashboard'),
]