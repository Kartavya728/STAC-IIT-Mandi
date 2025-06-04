from django.urls import path
# from django.conf import settings # No longer needed here
# from django.conf.urls.static import static # No longer needed here
from . import views

urlpatterns = [
    path('photogallery', views.photogallery, name='photogallery_page'), # Page view
    path('videogallery', views.videogallery, name='videogallery_page'), # Page view
    # API endpoints will be defined in STAC/urls.py
    # path("__reload__", include("django_browser_reload.urls")), # Remove, handled in STAC/urls.py
]
# Remove: +static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)