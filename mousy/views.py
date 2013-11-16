from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader, Context
from django.shortcuts import render_to_response

from django.views.generic.base import TemplateView, View
from jelly.models import JsonData, Questionnaire
from jelly.forms import QuestionnaireForm

import logging
import json

class HomeView(TemplateView):
    template_name = "jelly/home.html"

class BlogosphereView(View):
    def get(self, request, *args, **kwargs):
        blogs = JsonData.objects.all()[0]
        #logging.error(blogs.json)
        return HttpResponse(json.dumps(blogs.json), content_type = "application/json")    
    


    
   


