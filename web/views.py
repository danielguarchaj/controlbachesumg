from django.shortcuts import redirect
from django.urls import reverse_lazy

from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import views as auth_views

from django.views.generic import TemplateView, DetailView, View 

# from loans.models import Agency, Installment, Client, Loan, Payment, Expense

# from users.models import User, Profile

# from loans.views import block_loans

def IndexView(request):
    if request.user.is_authenticated:
        return redirect(reverse_lazy('web:dashboard'))
    else:
        return redirect(reverse_lazy('web:login'))


class LoginView(auth_views.LoginView):
    template_name = 'login.html'

    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect(reverse_lazy('web:dashboard'))
        return super(LoginView, self).dispatch(request, *args, **kwargs)


class LogoutView(auth_views.LogoutView):
    pass


#dashboard
class DashboardView(LoginRequiredMixin, TemplateView):
  template_name = 'dashboard.html'