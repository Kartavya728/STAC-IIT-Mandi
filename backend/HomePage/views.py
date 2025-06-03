# HomePage/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Projects, ClubActivity, Achievements, Fests
from .serializers import (
    ProjectsSerializer,
    ClubActivitySerializer,
    AchievementsSerializer,
    FestsSerializer
)
# Optional: for better logging in production
# import logging
# logger = logging.getLogger(__name__)

class HomePageData(APIView):
    def get_serializer_context(self):
        """
        Extra context provided to the serializer class.
        Ensures 'request' is available to serializers for building absolute URLs.
        """
        return {
            'request': self.request,
            'format': self.format_kwarg,
            'view': self
        }

    def get(self, request, *args, **kwargs):
        try:
            projects_data = Projects.objects.all()
            club_activity_data = ClubActivity.objects.all()
            achievements_data = Achievements.objects.all()
            fests_data = Fests.objects.all()

            # Get serializer context which includes the request
            context = self.get_serializer_context()

            # Pass context to serializers
            projects_serializer = ProjectsSerializer(projects_data, many=True, context=context)
            club_activity_serializer = ClubActivitySerializer(club_activity_data, many=True, context=context)
            # Context might not be strictly needed for AchievementsSerializer if it doesn't use request,
            # but it's good practice for consistency if you might add it later.
            achievements_serializer = AchievementsSerializer(achievements_data, many=True, context=context)
            fests_serializer = FestsSerializer(fests_data, many=True, context=context)

            response_data = {
                "projects": projects_serializer.data,
                "clubactivity": club_activity_serializer.data,
                "achievements": achievements_serializer.data,
                "fests": fests_serializer.data,
            }
            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            # logger.error(f"Error fetching homepage data: {e}", exc_info=True) # Production logging
            print(f"Error in HomePageData view: {str(e)}") # For development debugging
            return Response(
                {"error": "An error occurred while fetching homepage data.", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )