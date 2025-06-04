from rest_framework import serializers
from .models import Alumni

class AlumniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alumni
        fields = ['id', 'name', 'email', 'message', 'linkedin_url', 'instagram_url', 'image']