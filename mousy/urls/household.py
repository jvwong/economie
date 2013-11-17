from django.conf.urls import *
from django.views.generic.base import TemplateView
from mousy.views import ReceiptCreate, ReceiptUpdate, ReceiptDelete
 
urlpatterns = patterns('',
    url(r'^$', TemplateView.as_view(template_name='mousy/household.html'), name='mousy_household'),
    url(r'^receipt/add/$', ReceiptCreate.as_view(), name='mousy_receipt_add'),    
    url(r'^receipt/(?P<pk>\d+)/$', ReceiptUpdate.as_view(), name='mousy_receipt_update'),
    url(r'^receipt/(?P<pk>\d+)/delete/$', ReceiptDelete.as_view(), name='mousy_receipt_delete'),    
)


