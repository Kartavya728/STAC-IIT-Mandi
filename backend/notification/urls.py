# notification/urls.py
from django.urls import path
from .views import NotificationListAPIView, ActiveNotificationListAPIView

urlpatterns = [
    path('all/', NotificationListAPIView.as_view(), name='notification-list-all'),
    path('active/', ActiveNotificationListAPIView.as_view(), name='notification-list-active'),
    # You could also have a detail view if needed:
    # path('<int:pk>/', NotificationDetailAPIView.as_view(), name='notification-detail'),
]