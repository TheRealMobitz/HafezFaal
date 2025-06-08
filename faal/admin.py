from django.contrib import admin
from .models import Quote, HafezGhazal, UserDailyFaal

@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display = ['text', 'author', 'is_daily_quote', 'added_date']
    list_filter = ['is_daily_quote', 'author']
    search_fields = ['text', 'author']

@admin.register(HafezGhazal)
class HafezGhazalAdmin(admin.ModelAdmin):
    list_display = ['ghazal_number', 'persian_text']
    ordering = ['ghazal_number']
    search_fields = ['ghazal_number', 'persian_text']

@admin.register(UserDailyFaal)
class UserDailyFaalAdmin(admin.ModelAdmin):
    list_display = ['user', 'ghazal', 'date']
    list_filter = ['date']
    readonly_fields = ['user', 'ghazal', 'date']