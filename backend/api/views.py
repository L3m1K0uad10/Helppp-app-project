from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, QuestionSerializer, ResponseSerializer, ProfileSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Question, Response, Profile


# creating and deleting question views
class QuestionListCreate(generics.ListCreateAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): 
        user_id = self.request.query_params.get('user_id')
        if user_id:
            try:
                user = User.objects.get(pk = user_id) # Validate user exists
                return Question.objects.filter(author = user)
            except User .DoesNotExist:
                return Question.objects.none() # Returning empty queryset if user not found
        else:
            return Question.objects.all() # Returning all questions if no user_id provided
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author = self.request.user)
        else:
            print(serializer.errors)

class QuestionDelete(generics.DestroyAPIView):
    serializer_class = QuestionSerializer
    permission_classes =[IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Question.objects.filter(author = user)
    
# creating and deleting response views
class ResponseListCreate(generics.ListCreateAPIView):
    serializer_class = ResponseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): 
        question_id = self.request.query_params.get('question')
        if question_id:
            try:
                return Response.objects.filter(question = question_id)
            except User .DoesNotExist:
                return Response.objects.none() # Returning empty queryset if user not found
        else:
            return Response.objects.all() # Returning all Responses if no user_id provided

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author = self.request.user)
        else:
            print(serializer.errors)

class ResponseDelete(generics.DestroyAPIView):
    serializer_class = ResponseSerializer
    permission_classes =[IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Response.objects.filter(author = user)


# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserProfileDetailView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]  # Example permission, adjust as needed

    def get_object(self):
        user = self.request.user
        return get_object_or_404(Profile, user=user)