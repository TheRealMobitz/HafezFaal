from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from datetime import time
from .models import Quote, HafezGhazal, UserDailyFaal
from .serializers import (
    QuoteSerializer, HafezGhazalSerializer, 
    UserDailyFaalSerializer, UserSerializer, UserRegistrationSerializer
)

@api_view(['GET'])
@permission_classes([AllowAny])
def daily_quote(request):
    quote = Quote.get_daily_quote()
    if quote:
        serializer = QuoteSerializer(quote)
        return Response(serializer.data)
    return Response({'message': 'No quotes available'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_dashboard(request):
    today = timezone.now().date()
    current_time = timezone.now().time()
    faal_time = time(8, 0)  # 8:00 AM
    
    try:
        user_faal = UserDailyFaal.objects.get(user=request.user, date=today)
        serializer = UserDailyFaalSerializer(user_faal)
        return Response({
            'faal': serializer.data,
            'faal_available': True,
            'message': None
        })
    except UserDailyFaal.DoesNotExist:
        if current_time >= faal_time:
            random_ghazal = HafezGhazal.get_random_ghazal()
            if random_ghazal:
                user_faal = UserDailyFaal.objects.create(
                    user=request.user,
                    ghazal=random_ghazal,
                    date=today
                )
                serializer = UserDailyFaalSerializer(user_faal)
                return Response({
                    'faal': serializer.data,
                    'faal_available': True,
                    'message': 'Your personal Hafez Faal for today has been assigned!'
                })
            else:
                return Response({
                    'faal': None,
                    'faal_available': False,
                    'message': 'No ghazals available.'
                })
        else:
            return Response({
                'faal': None,
                'faal_available': False,
                'message': 'Your personal Hafez Faal for today will be available after 8 A.M.'
            })

class QuoteListView(generics.ListAPIView):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer
    permission_classes = [AllowAny]

class HafezGhazalListView(generics.ListAPIView):
    queryset = HafezGhazal.objects.all()
    serializer_class = HafezGhazalSerializer
    permission_classes = [AllowAny]

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message': 'User created successfully'}, status=201)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    if user:
        login(request, user)
        serializer = UserSerializer(user)
        return Response({
            'user': serializer.data,
            'message': 'Login successful'
        })
    return Response({'message': 'Invalid credentials'}, status=401)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def logout_user(request):
    logout(request)
    return Response({'message': 'Logout successful'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)