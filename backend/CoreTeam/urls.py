from django.urls import path
from . import views

urlpatterns = [
    # The path '' implies that CoreTeam/urls.py will be included with a prefix in STAC/urls.py
    # e.g., path('coreteam/', include('CoreTeam.urls'))
    path('', views.CoreTeam, name='coreteam_page'), # Page view
    # API endpoint will be defined in STAC/urls.py
]