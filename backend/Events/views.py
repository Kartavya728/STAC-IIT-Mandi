from django.shortcuts import render # Or HttpResponse, etc., for your existing views

# --- Existing Page Views (ensure these are defined if used by your current urls.py) ---
# Example placeholder if you have template-based views:
def astrax_page_view(request): # Renamed to avoid potential naming conflicts
    # Your logic for the Astrax page (e.g., fetching data for a template)
    # from .models import Astrax
    # context = {'events': Astrax.objects.all()}
    # return render(request, 'events/astrax_template.html', context)
    return render(request, 'placeholder.html', {'event_name': 'Astrax Page'}) # Placeholder

def zenith_page_view(request):
    return render(request, 'placeholder.html', {'event_name': 'Zenith Page'}) # Placeholder

def utkarsh_page_view(request):
    return render(request, 'placeholder.html', {'event_name': 'Utkarsh Page'}) # Placeholder

def pleiades_page_view(request):
    return render(request, 'placeholder.html', {'event_name': 'Pleiades Page'}) # Placeholder


# --- New API Views ---
from rest_framework import generics
from .models import Astrax, Pleiades, Zenith, Utkarsh
from .serializers import (
    AstraxSerializer,
    PleiadesSerializer,
    ZenithSerializer,
    UtkarshSerializer
)

class AstraxListAPIView(generics.ListAPIView):
    queryset = Astrax.objects.all()
    serializer_class = AstraxSerializer

class PleiadesListAPIView(generics.ListAPIView):
    queryset = Pleiades.objects.all()
    serializer_class = PleiadesSerializer

class ZenithListAPIView(generics.ListAPIView):
    queryset = Zenith.objects.all()
    serializer_class = ZenithSerializer

class UtkarshListAPIView(generics.ListAPIView):
    queryset = Utkarsh.objects.all()
    serializer_class = UtkarshSerializer