from django.urls import path

from . import views

app_name = 'web'

urlpatterns = [
  # INDEX URL
  path('', views.IndexView, name='index'),
  # Auth    
  path('login/', views.LoginView.as_view(), name='login'),
  path('logout/', views.LogoutView.as_view(), name='logout'),
  path('register/', views.signup, name='register'),
#Dashboard
  path('dashboard/', views.DashboardView.as_view(), name='dashboard'),
  path('crear-bache/', views.CrearReporteBacheView.as_view(), name='crear-bache'),
  path('detalle-bache/', views.DetalleBacheView.as_view(), name='detalle-bache'),
  path('reporte-baches/', views.ReporteBachesView.as_view(), name='reporte-baches'),
]
