from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Quote, HafezGhazal, UserDailyFaal

class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = ['id', 'text', 'author', 'added_date']

class HafezGhazalSerializer(serializers.ModelSerializer):
    class Meta:
        model = HafezGhazal
        fields = ['id', 'ghazal_number', 'persian_text', 'english_translation']

class UserDailyFaalSerializer(serializers.ModelSerializer):
    ghazal = HafezGhazalSerializer(read_only=True)
    
    class Meta:
        model = UserDailyFaal
        fields = ['id', 'ghazal', 'date']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user