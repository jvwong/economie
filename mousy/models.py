import datetime
from json_field import JSONField
from django.db import models
from django.contrib.auth.models import User

class Receipt(models.Model):
    #Core fields
    date = models.DateField(blank = False)
    amount = models.DecimalField(max_digits = 6, decimal_places = 2, blank = False)
    detail = models.CharField(max_length = 250, blank = False)
    created_by = models.ForeignKey(User)
    
    #Auto populated 
    created = models.DateTimeField(auto_now_add = True)
     
    class Meta:
        verbose_name_plural = "Receipts"
        ordering = ['-created']
    
    def __unicode__(self):
        return self.detail    
    
    def save(self, force_insert = False, force_update = False):
        super(Receipt, self).save(force_insert, force_update)
        
    @models.permalink    
    def get_absolute_url(self):
        return ('mousy_receipt_detail', (), {'date':  self.date.strftime("%Y-%b-%d"),
                                             'amount': self.amount,
                                             'detail': self.detail
                                             }) 




    
    
    
        
