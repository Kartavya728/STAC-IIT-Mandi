from rest_framework import serializers
from .models import MemberDetail

class MemberDetailSerializer(serializers.ModelSerializer):
    position_display = serializers.CharField(source='get_position_display', read_only=True)

    class Meta:
        model = MemberDetail
        fields = ['id', 'name', 'email', 'message', 'position', 'position_display', 'linkedin_url', 'instagram_url', 'image']