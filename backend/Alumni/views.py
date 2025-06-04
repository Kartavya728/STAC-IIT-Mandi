from django.shortcuts import render
from .models import Alumni

# For API
from rest_framework import generics
from .serializers import AlumniSerializer

# Existing page view
def alumni(request):
    alumni_list = Alumni.objects.all() # Renamed variable for clarity
    return render(request, 'alumni.html',{'alumni_list': alumni_list}) # Use consistent naming

# API View
class AlumniListAPIView(generics.ListAPIView):
    queryset = Alumni.objects.all()
    serializer_class = AlumniSerializer