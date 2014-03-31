from django.conf.urls import patterns, url, include
from django.views.generic.base import TemplateView
from django.conf import settings
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('')

if settings.DEBUG:
    # static files (images, css, javascript, etc.)
    urlpatterns = patterns('', 
		(r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
	)

urlpatterns += patterns('',
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
    
    
    url(r'^$', TemplateView.as_view(template_name='mousy/economie.html'), name='mousy_economie'),
    url(r'^contact/$', TemplateView.as_view(template_name='mousy/contact.html'), name='mousy_contact'),
    
    url(r'^users/', include('mousy.urls.accounts')),
    url(r'^household/', include('mousy.urls.household'))    
)

