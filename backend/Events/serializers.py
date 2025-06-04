from rest_framework import serializers
from .models import Astrax, Pleiades, Zenith, Utkarsh

class AstraxSerializer(serializers.ModelSerializer):
    # image = serializers.ImageField(use_url=True) # use_url=True is default for ImageField with context
    
    class Meta:
        model = Astrax
        fields = ['id', 'name', 'image', 'description']
        # To get full URLs for images, the serializer needs the request context.
        # Generic views (like ListAPIView) provide this context automatically.

class PleiadesSerializer(serializers.ModelSerializer):
    # image = serializers.ImageField(use_url=True)

    class Meta:
        model = Pleiades
        fields = ['id', 'name', 'image', 'description', 'problem_statement']

class ZenithSerializer(serializers.ModelSerializer):
    # image = serializers.ImageField(use_url=True)

    class Meta:
        model = Zenith
        fields = ['id', 'name', 'image', 'description', 'problem_statement']

class UtkarshSerializer(serializers.ModelSerializer):
    # image = serializers.ImageField(use_url=True)

    class Meta:
        model = Utkarsh
        fields = ['id', 'name', 'image', 'description', 'problem_statement']