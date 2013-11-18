from django.conf.urls import *
from django.views.generic.base import TemplateView
from mousy.views import user_login, user_logout, user_signup
from django.views.generic.detail import DetailView
from django.contrib.auth.admin import User

urlpatterns = patterns('',
      
   url(r'^signup/$',
       user_signup,
       name='mousy_users_signup'),
   
   url(r'^login/$',
       user_login,
       name='mousy_users_login'),
   
   url(r'^logout/$',
       user_logout,
       name='mousy_users_logout'),
   
   url(r'^profile/$',
       TemplateView.as_view(template_name = 'accounts/profile.html'),
       name='mousy_users_profile'),   
)

