from django.conf.urls import *
from django.views.generic.base import TemplateView
from mousy.views import ReceiptCreate, ReceiptUpdate, ReceiptDelete
from django.contrib.auth.decorators import login_required, permission_required

urlpatterns = patterns('',
    url(r'^$', TemplateView.as_view(template_name='mousy/household.html'), name='mousy_household'),
    url(r'^receipt/add/$', login_required(ReceiptCreate.as_view()), name='mousy_receipt_add'),    
    url(r'^receipt/(?P<pk>\d+)/$', login_required(ReceiptUpdate.as_view()), name='mousy_receipt_update'),
    url(r'^receipt/(?P<pk>\d+)/delete/$', login_required(ReceiptDelete.as_view()), name='mousy_receipt_delete'),    
)


