from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Question(models.Model):
    #question_id = models.BigIntegerField(null=False)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add = True)
    author = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "questions")

    def __str__(self):
        return self.title
    
class Response(models.Model):
    question = models.ForeignKey(Question, on_delete =  models.CASCADE)
    created_at = models.DateTimeField(auto_now_add = True)
    author = models.ForeignKey(User, on_delete = models.CASCADE, related_name = "responses")
    response_content = models.TextField()

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE, primary_key = True)
    profile_picture = models.URLField(blank = True)
    bio = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)