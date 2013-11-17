from django.conf.urls import *
from django.views.generic.base import TemplateView

urlpatterns = patterns('',
   url(r'^login/$', 'django.contrib.auth.views.login'),
   url(r'^logout/$', 'mousy.views.logout_user'),
   url(r'^profile/$', TemplateView.as_view(template_name = 'registration/profile.html'), name = 'mousy_profile'),
   
)


