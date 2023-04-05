from django.urls import include, path
from django.contrib import admin
from rest_framework import routers
from rest_api import views
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('rest_api.urls')),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
