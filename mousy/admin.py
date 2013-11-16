from django.contrib import admin
from jelly.models import JsonData, Questionnaire
from django.forms import TextInput, Textarea
from django.db import models

class JsonDataAdmin(admin.ModelAdmin):
    ordering = ['-pub_date']

class QuestionnaireAdmin(admin.ModelAdmin):
    ordering = ['-pub_date']
  
admin.site.register(JsonData, JsonDataAdmin)
admin.site.register(Questionnaire, QuestionnaireAdmin)
