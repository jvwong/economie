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




    
    
    
        
