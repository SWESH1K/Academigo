from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.hello_world, name="hello"),
    path('get-response', views.get_response, name="get-response")
]