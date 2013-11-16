from django.conf.urls import *
from django.views.generic.base import TemplateView
 
urlpatterns = patterns('',
    url(r'^$', TemplateView.as_view(template_name='mousy/household.html'), name='mousy_household'),
    url(r'^receipt/$', TemplateView.as_view(template_name='mousy/receipt.html'), name='mousy_receipt'),    
)


