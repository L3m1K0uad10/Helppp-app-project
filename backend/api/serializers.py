from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Question, Response, Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User 
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user 
    
class QuestionSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['author'] = {
            'id': instance.author.id,  # Include author's ID
            'username': instance.author.username
        }
        return data    
    class Meta:
        model = Question
        fields = ["id", "description", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}

class ResponseSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['author'] = {
            'id': instance.author.id,  # Include author's ID
            'username': instance.author.username
        }
        return data
    class Meta:
        model = Response
        fields = ["id", "question", "created_at", "author", "response_content"]
        extra_kwargs = {"author": {"read_only": True}}

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["user", "profile_picture", "bio", "location"]
