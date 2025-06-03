# HomePage/serializers.py
from rest_framework import serializers
from .models import Projects, ClubActivity, Achievements, Fests # Assuming these are your models in HomePage/models.py

class ProjectsSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Projects
        fields = ['id', 'topic', 'description', 'image_url'] # Add other fields as needed

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        return None

class ClubActivitySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ClubActivity
        fields = ['id', 'activity', 'content', 'image_url'] # Add other fields as needed

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        return None

class AchievementsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievements
        fields = ['id', 'achievement', 'link'] # Adjust if you have an image field

class FestsSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Fests
        fields = ['id', 'festname', 'description', 'link', 'image_url'] # Add other fields as needed

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url)
        return None