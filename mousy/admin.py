from django.contrib import admin
from django.db import models
from mousy.models import Receipt

class ReceiptAdmin(admin.ModelAdmin):
    ordering = ['-created']
    
admin.site.register(Receipt, ReceiptAdmin)