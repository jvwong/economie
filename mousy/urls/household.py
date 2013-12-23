from django.conf.urls import *
from django.views.generic.base import TemplateView
from mousy.views import ReceiptCreate, ReceiptUpdate, ReceiptDelete, HybridListView
from mousy.models import Receipt
from django.contrib.auth.decorators import login_required, permission_required
from django.views.generic.dates import ArchiveIndexView, YearArchiveView, MonthArchiveView, DayArchiveView, DateDetailView


urlpatterns = patterns('',
    url(r'^$', TemplateView.as_view(template_name='household/household.html'), name='mousy_household'),
    
    url(r'^receipt/json/$', HybridListView.as_view(model = Receipt), name='mousy_receipt_json'),    
    
    url(r'^receipt/add/$', login_required(ReceiptCreate.as_view()), name='mousy_receipt_add'),    
    url(r'^receipt/update/(?P<pk>\d+)/$', login_required(ReceiptUpdate.as_view()), name='mousy_receipt_update'),
    url(r'^receipt/(?P<pk>\d+)/delete/$', login_required(ReceiptDelete.as_view()), name='mousy_receipt_delete'),
    url(r'^receipt/all/$', ArchiveIndexView.as_view( queryset = Receipt.objects.all(),
                                         date_field = 'date',
                                         allow_empty = True,
                                         paginate_by = 10,
                                         template_name='household/receipt_archive.html'
                                        ), name='mousy_receipt_archive_index'),
    url(r'^receipt/(?P<year>\d{4})/$', YearArchiveView.as_view(queryset = Receipt.objects.all(),
                                                       date_field='date',
                                                       allow_empty = True,
                                                       make_object_list=True,
                                                       template_name='household/receipt_archive_year.html'
                                                       ), name='mousy_receipt_archive_year'), 
    url(r'^receipt/(?P<year>\d{4})/(?P<month>\w{3})/$', MonthArchiveView.as_view(queryset = Receipt.objects.all(),
                                                                         date_field = 'date',
                                                                         allow_empty = True,
                                                                         paginate_by = 5,
                                                                         template_name='household/receipt_archive_month.html'
                                                                         ), name='mousy_receipt_archive_month'), 
    url(r'^receipt/(?P<year>\d{4})/(?P<month>\w{3})/(?P<day>\d{2})/$', DayArchiveView.as_view(queryset = Receipt.objects.all(),
                                                                                      date_field = 'date',
                                                                                      allow_empty = True,
                                                                                      paginate_by = 5,
                                                                                      template_name='household/receipt_archive_day.html'
                                                                                      ), name='mousy_receipt_archive_day'), 
    url(r'^receipt/(?P<year>\d{4})/(?P<month>\w{3})/(?P<day>\d{2})/(?P<pk>[\d]+)/$', DateDetailView.as_view(queryset = Receipt.objects.all(),
                                                                                                       date_field = 'date',
                                                                                                       template_name='household/receipt_detail.html'
                                                                                                       ), name='mousy_receipt_detail'),
        
)


