# STAC/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from HomePage.views import HomePageData

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/homepage/', HomePageData.as_view(), name='homepage-api'),
    path("reload/", include("django_browser_reload.urls")),
    # Add other app URLs here
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)