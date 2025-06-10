from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Quote, HafezGhazal, UserDailyFaal

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2']
        extra_kwargs = {
            'email': {'required': True},
            'username': {'required': True},
        }
    
    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("ایمیل الزامی است")
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("این ایمیل قبلاً استفاده شده است")
        return value
    
    def validate_username(self, value):
        if not value:
            raise serializers.ValidationError("نام کاربری الزامی است")
        if len(value) < 3:
            raise serializers.ValidationError("نام کاربری باید حداقل ۳ کاراکتر باشد")
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("این نام کاربری قبلاً گرفته شده است")
        return value
    
    def validate_password(self, value):
        if not value:
            raise serializers.ValidationError("رمز عبور الزامی است")
        if len(value) < 6:
            raise serializers.ValidationError("رمز عبور باید حداقل ۶ کاراکتر باشد")
        return value
    
    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password2'):
            raise serializers.ValidationError({"password2": "رمز عبور و تکرار آن یکسان نیستند"})
        return attrs
    
    def create(self, validated_data):
        # Remove password2 as it's not needed for user creation
        validated_data.pop('password2', None)
        
        try:
            # Create user with proper password hashing and explicit transaction
            from django.db import transaction
            
            with transaction.atomic():
                # Create user with create_user method (handles password hashing)
                user = User.objects.create_user(
                    username=validated_data['username'],
                    email=validated_data['email'],
                    password=validated_data['password']
                )
                
                # Force save to ensure persistence
                user.save()
                
                # Verify user was actually saved
                if not User.objects.filter(pk=user.pk).exists():
                    raise Exception("User was not properly saved to database")
                
                print(f"User created and verified in serializer: {user.username} (ID: {user.pk})")
                return user
                
        except Exception as e:
            print(f"Error creating user in serializer: {str(e)}")
            raise serializers.ValidationError(f"خطا در ایجاد کاربر: {str(e)}")
        
class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = '__all__'

class HafezGhazalSerializer(serializers.ModelSerializer):
    class Meta:
        model = HafezGhazal
        fields = '__all__'

class UserDailyFaalSerializer(serializers.ModelSerializer):
    ghazal = HafezGhazalSerializer(read_only=True)
    
    class Meta:
        model = UserDailyFaal
        fields = '__all__'