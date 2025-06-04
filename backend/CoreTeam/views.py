from django.shortcuts import render
from .models import MemberDetail

# For API
from rest_framework import generics
from .serializers import MemberDetailSerializer

# Existing page view
def CoreTeam(request): # Function name typically starts with lowercase (e.g., core_team_view)
    team_members = MemberDetail.objects.all()
    # Group members by position for the template
    # Using a dictionary comprehension for conciseness
    # And ensuring all position keys exist even if empty
    grouped_members = {
        pos_key: team_members.filter(position=pos_key)
        for pos_key, _ in MemberDetail.POSITIONS
    }
    # Original grouping (works fine too):
    # members = {
    #     'A': team_members.filter(position='A'), # Coordinators
    #     'B': team_members.filter(position='B'), # Co-coordinators
    #     'C': team_members.filter(position='C'), # Core Team
    #     'D': team_members.filter(position='D'), # Mentors
    # }
    return render(request, 'CoreTeam.html', {'grouped_members': grouped_members}) # Use more descriptive context variable name

# API View
class MemberDetailListAPIView(generics.ListAPIView):
    queryset = MemberDetail.objects.all()
    serializer_class = MemberDetailSerializer