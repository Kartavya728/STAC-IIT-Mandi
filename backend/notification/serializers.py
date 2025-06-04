# notification/serializers.py
from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'link', 'is_active', 'timestamp']
        # If you want to format the timestamp in a specific way:
        # timestamp = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)