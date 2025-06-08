from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import random

class Quote(models.Model):
    text = models.TextField()
    author = models.CharField(max_length=200)
    is_daily_quote = models.BooleanField(default=False)
    added_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.text[:50]}... - {self.author}"
    
    @classmethod
    def get_daily_quote(cls):
        daily_quote = cls.objects.filter(is_daily_quote=True).first()
        if daily_quote:
            return daily_quote
        return cls.objects.order_by('?').first()

class HafezGhazal(models.Model):
    ghazal_number = models.IntegerField(unique=True)
    persian_text = models.TextField()
    english_translation = models.TextField(blank=True)
    
    class Meta:
        ordering = ['ghazal_number']
    
    def __str__(self):
        return f"Ghazal {self.ghazal_number}"
    
    @classmethod
    def get_random_ghazal(cls):
        return cls.objects.order_by('?').first()

class UserDailyFaal(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ghazal = models.ForeignKey(HafezGhazal, on_delete=models.CASCADE)
    date = models.DateField()
    
    class Meta:
        unique_together = ('user', 'date')
    
    def __str__(self):
        return f"{self.user.username} - {self.date} - Ghazal {self.ghazal.ghazal_number}"