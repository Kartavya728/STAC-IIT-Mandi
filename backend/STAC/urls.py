# STAC/urls.py
from django.contrib import admin
from django.urls import path, include # Make sure include is imported
from django.conf import settings
from django.conf.urls.static import static

from HomePage.views import HomePageData

# Import API views from Events app
from Events.views import (
    AstraxListAPIView,
    PleiadesListAPIView,
    ZenithListAPIView,
    UtkarshListAPIView
)

# Import API views from Alumni app
from Alumni.views import AlumniListAPIView

# Import API views from CoreTeam app
from CoreTeam.views import MemberDetailListAPIView

# Import API views from Gallery app
from Gallery.views import PhotoGalleryListAPIView, VideoGalleryListAPIView

# No need to import notification views here if we are using include('notification.urls')

urlpatterns = [
    path('admin/', admin.site.urls),
    path("reload/", include("django_browser_reload.urls")), # Project-level reload

    # --- API Endpoints ---
    path('api/homepage/', HomePageData.as_view(), name='homepage-api'),

    # Events API Endpoints
    path('api/events/astrax/', AstraxListAPIView.as_view(), name='api_event_astrax'),
    path('api/events/pleiades/', PleiadesListAPIView.as_view(), name='api_event_pleiades'),
    path('api/events/zenith/', ZenithListAPIView.as_view(), name='api_event_zenith'),
    path('api/events/utkarsh/', UtkarshListAPIView.as_view(), name='api_event_utkarsh'),

    # Alumni API Endpoint
    path('api/alumni/', AlumniListAPIView.as_view(), name='api_alumni_list'),

    # CoreTeam API Endpoint
    path('api/coreteam/', MemberDetailListAPIView.as_view(), name='api_coreteam_list'),

    # Gallery API Endpoints
    path('api/gallery/photos/', PhotoGalleryListAPIView.as_view(), name='api_gallery_photos_list'),
    path('api/gallery/videos/', VideoGalleryListAPIView.as_view(), name='api_gallery_videos_list'),

    # Notification API Endpoints
    path('api/notifications/', include('notification.urls')), # <<< THIS LINE IS NOW CORRECTLY ADDED

    # --- App Page View Includes ---
    # (These include the app-specific urls.py files for their template-based pages)
    path('', include('Events.urls')), # For /astrax, /zenith, etc. (page views)
    path('', include('Alumni.urls')), # For /alumni (page view)
    path('coreteam/', include('CoreTeam.urls')), # For /coreteam/ (page view - note the prefix)
    path('gallery/', include('Gallery.urls')),   # For /gallery/photogallery, /gallery/videogallery

    # Include other app URLs for page views as needed:
    # path('about/', include('AboutUs.urls')),
    # ...etc.
]

# Serve media and static files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) # Good to explicitly add static for dev