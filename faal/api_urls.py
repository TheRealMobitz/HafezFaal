from django.urls import path
from . import api_views

urlpatterns = [
    path('quote/', api_views.daily_quote, name='api_daily_quote'),
    path('dashboard/', api_views.user_dashboard, name='api_dashboard'),
    path('quotes/', api_views.QuoteListView.as_view(), name='api_quotes'),
    path('ghazals/', api_views.HafezGhazalListView.as_view(), name='api_ghazals'),
    path('auth/register/', api_views.register_user, name='api_register'),
    path('auth/login/', api_views.login_user, name='api_login'),
    path('auth/logout/', api_views.logout_user, name='api_logout'),
    path('auth/user/', api_views.current_user, name='api_current_user'),
]