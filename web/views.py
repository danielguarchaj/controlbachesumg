from django.shortcuts import redirect, render
from django.urls import reverse_lazy

from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import views as auth_views

from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm

from django.views.generic import TemplateView, DetailView, View 

def IndexView(request):
    if request.user.is_authenticated:
        return redirect(reverse_lazy('web:dashboard'))
    else:
        return redirect(reverse_lazy('web:login'))

def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect(reverse_lazy('web:dashboard'))
    else:
        form = UserCreationForm()
    return render(request, 'register.html', {'form': form})

class LoginView(auth_views.LoginView):
    template_name = 'login.html'

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect(reverse_lazy('web:dashboard'))
        return super(LoginView, self).dispatch(request, *args, **kwargs)


class LogoutView(auth_views.LogoutView):
    pass


class DashboardView(LoginRequiredMixin, TemplateView):
  template_name = 'dashboard.html'

class CrearReporteBacheView(LoginRequiredMixin, TemplateView):
  template_name = 'crear_bache.html'

class DetalleBacheView(LoginRequiredMixin, TemplateView):
  template_name = 'detalle_bache.html'

class ReporteBachesView(LoginRequiredMixin, TemplateView):
  template_name = 'reporte_baches.html'