from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.hello_world, name="hello"),
    path('gdrive-rag-answer/', views.gdrive_rag_answer, name="gdrive-rag-answer"),
]