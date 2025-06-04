from rest_framework import serializers
from .models import PhotoGallery, VideoGallery

class PhotoGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = PhotoGallery
        fields = ['id', 'name', 'image', 'description']

class VideoGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoGallery
        fields = ['id', 'videoname', 'link', 'description']