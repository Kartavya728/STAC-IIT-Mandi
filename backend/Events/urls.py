# Events/urls.py (Modified)
from django.urls import path
# Remove imports for API views if they are no longer used here
from .views import (
    astrax_page_view, # Or views.astrax if you kept original names for page views
    zenith_page_view,
    utkarsh_page_view,
    pleiades_page_view,
    # AstraxListAPIView, # No longer needed here
    # PleiadesListAPIView, # No longer needed here
    # ZenithListAPIView, # No longer needed here
    # UtkarshListAPIView # No longer needed here
)

urlpatterns = [
    # Page View URLs (these will be accessible at /astrax, /zenith, etc.
    # because of the `path('', include('Events.urls'))` in STAC/urls.py)
    path("astrax", astrax_page_view, name="astrax_page"),
    path("zenith", zenith_page_view, name="zenith_page"),
    path("utkarsh", utkarsh_page_view, name="utkarsh_page"),
    path("pleiades", pleiades_page_view, name="pleiades_page"),

    # --- API Endpoints are NO LONGER DEFINED HERE ---
    # They are now in STAC/urls.py
    # path("api/astrax/", AstraxListAPIView.as_view(), name="api_astrax_list"), # REMOVE
    # path("api/pleiades/", PleiadesListAPIView.as_view(), name="api_pleiades_list"), # REMOVE
    # path("api/zenith/", ZenithListAPIView.as_view(), name="api_zenith_list"), # REMOVE
    # path("api/utkarsh/", UtkarshListAPIView.as_view(), name="api_utkarsh_list"), # REMOVE
]