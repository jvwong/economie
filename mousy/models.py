import datetime

from json_field import JSONField
from django.db import models

class JsonData(models.Model):
    #Core fields
    title = models.CharField(max_length=250) 
    json = JSONField(blank = False)
    
    #Auto populated 
    pub_date = models.DateTimeField(auto_now_add = True)
     
    class Meta:
        verbose_name_plural = "JsonData"
    
    def __unicode__(self):
        return self.title   



class Questionnaire(models.Model):
    name = models.CharField(max_length = 30)
    email = models.CharField(max_length = 30)   
    location = models.CharField(max_length = 30, blank = True)
    background = models.CharField(max_length = 30, blank = True)
    aptitude = models.CharField(max_length = 30, blank = True)
    
    interest = models.CharField(max_length = 30, blank = True)
    commitment = models.CharField(max_length = 30, blank = True)
    
    previous = models.TextField(blank = False)
    obstacles = models.TextField(blank = False)        
    goals = models.TextField(blank = True)
    include = models.TextField(blank = True)
    avoid = models.TextField(blank = True)
    
    comments = models.TextField(blank = True)   
    
    pub_date = models.DateTimeField(auto_now_add = True)
    
    class Meta:
        ordering = ['-pub_date']
        verbose_name_plural = "Questionnaires"
    
    def __unicode__(self):
        return self.name  



    
    
    
        
