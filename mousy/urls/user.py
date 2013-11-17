from django.conf.urls import *
from mousy.views import UserCreate 

urlpatterns = patterns('',
    url(r'^$', UserCreate.as_view(template_name = 'registration/signup_form.html'), name='mousy_signup'),    
)


