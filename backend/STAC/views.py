from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Projects, ClubActivity, Achievements, Fests
from ..HomePage.serializers import ProjectsSerializer, ClubActivitySerializer, AchievementsSerializer, FestsSerializer

class HomePageData(APIView):
    def get(self, request):
        data = {
            'projects': ProjectsSerializer(Projects.objects.all(), many=True).data,
            'clubactivity': ClubActivitySerializer(ClubActivity.objects.all(), many=True).data,
            'achievements': AchievementsSerializer(Achievements.objects.all(), many=True).data,
            'fests': FestsSerializer(Fests.objects.all(), many=True).data,
        }
        return Response(data)
