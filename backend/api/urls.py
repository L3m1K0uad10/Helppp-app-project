from django.urls import path
from . import views

urlpatterns = [
    path("questions/", views.QuestionListCreate.as_view(), name = "question-list"),
    path("questions/delete/<int:pk>/", views.QuestionDelete.as_view(), name = "delete-question"),
    path("responses/", views.ResponseListCreate.as_view(), name = "response-list"),
    path("responses/delete/<int:pk>/", views.ResponseDelete.as_view(), name = "delete-response"),
]