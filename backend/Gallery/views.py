from django.shortcuts import render
from .models import PhotoGallery, VideoGallery

# For API
from rest_framework import generics
from .serializers import PhotoGallerySerializer, VideoGallerySerializer

# Existing page views
def photogallery(request):
    photos = PhotoGallery.objects.all() # Renamed for clarity
    return render(request, "photogallery.html", {'photos': photos})

def videogallery(request):
    videos = VideoGallery.objects.all() # Renamed for clarity
    return render(request, "videogallery.html", {"videos": videos})

# API Views
class PhotoGalleryListAPIView(generics.ListAPIView):
    queryset = PhotoGallery.objects.all()
    serializer_class = PhotoGallerySerializer

class VideoGalleryListAPIView(generics.ListAPIView):
    queryset = VideoGallery.objects.all()
    serializer_class = VideoGallerySerializer