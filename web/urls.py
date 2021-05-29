from django.urls import path

from . import views

app_name = 'web'

urlpatterns = [
  # INDEX URL
  path('', views.IndexView, name='index'),
  # Auth    
  path('login/', views.LoginView.as_view(), name='login'),
  path('logout/', views.LogoutView.as_view(), name='logout'),
#Dashboard
  path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
]
