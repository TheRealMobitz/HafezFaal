from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login
from django.contrib.auth.forms import UserCreationForm
from django.utils import timezone
from datetime import datetime, time
from .models import Quote, HafezGhazal, UserDailyFaal

def homepage(request):
    daily_quote = Quote.get_daily_quote()
    return render(request, 'faal/homepage.html', {'quote': daily_quote})

@login_required
def dashboard(request):
    today = timezone.now().date()
    current_time = timezone.now().time()
    faal_time = time(8, 0)  # 8:00 AM
    
    # Check if user already has a faal for today
    try:
        user_faal = UserDailyFaal.objects.get(user=request.user, date=today)
        assigned_ghazal = user_faal.ghazal
        faal_available = True
        message = None
    except UserDailyFaal.DoesNotExist:
        if current_time >= faal_time:
            # Assign new faal
            random_ghazal = HafezGhazal.get_random_ghazal()
            if random_ghazal:
                UserDailyFaal.objects.create(
                    user=request.user,
                    ghazal=random_ghazal,
                    date=today
                )
                assigned_ghazal = random_ghazal
                faal_available = True
                message = "Your personal Hafez Faal for today has been assigned!"
            else:
                assigned_ghazal = None
                faal_available = False
                message = "No ghazals available."
        else:
            assigned_ghazal = None
            faal_available = False
            message = "Your personal Hafez Faal for today will be available after 8 A.M."
    
    context = {
        'ghazal': assigned_ghazal,
        'faal_available': faal_available,
        'message': message,
    }
    return render(request, 'faal/dashboard.html', context)

def ghazals_list(request):
    ghazals = HafezGhazal.objects.all()
    return render(request, 'faal/ghazals.html', {'ghazals': ghazals})

def quotes_list(request):
    quotes = Quote.objects.all()
    return render(request, 'faal/quotes.html', {'quotes': quotes})

def register_view(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('dashboard')
    else:
        form = UserCreationForm()
    return render(request, 'registration/register.html', {'form': form})