from django.conf.urls import *
from django.views.generic.base import TemplateView
 
from django.contrib import admin
admin.autodiscover()
 
urlpatterns = patterns('',
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    
    
    url(r'^$', TemplateView.as_view(template_name='mousy/economie.html'), name='mousy_economie'),
    url(r'^contact/$', TemplateView.as_view(template_name='mousy/contact.html'), name='mousy_contact'),
    
    url(r'^users/', include('mousy.urls.accounts')),
    url(r'^household/', include('mousy.urls.household'))    
)

