from django.conf.urls import *
from django.contrib import flatpages

from django.views.generic.base import TemplateView
from jelly.views import BlogosphereView
 
from django.contrib import admin
admin.autodiscover()
 
urlpatterns = patterns('',
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    
    url(r'^$', TemplateView.as_view(template_name='mousy/home.html'), name='jelly_home'),
)

