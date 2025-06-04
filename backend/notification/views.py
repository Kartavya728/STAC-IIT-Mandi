# notification/views.py
from rest_framework import generics
from .models import Notification
from .serializers import NotificationSerializer

class NotificationListAPIView(generics.ListAPIView):
    """
    API endpoint that allows all notifications to be viewed.
    """
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

class ActiveNotificationListAPIView(generics.ListAPIView):
    """
    API endpoint that allows only active notifications to be viewed.
    """
    queryset = Notification.objects.filter(is_active=True)
    serializer_class = NotificationSerializer