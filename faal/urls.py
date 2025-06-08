from django.urls import path
from . import views

urlpatterns = [
    path('', views.homepage, name='homepage'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('ghazals/', views.ghazals_list, name='ghazals_list'),
    path('quotes/', views.quotes_list, name='quotes_list'),
    path('register/', views.register_view, name='register'),
]