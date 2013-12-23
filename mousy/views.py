import logging

from django.contrib.auth.decorators import login_required
from django.template import RequestContext
from django.contrib.auth.admin import User
from django.views.generic.edit import CreateView, UpdateView, DeleteView


from django.contrib.auth.admin import User
from django.contrib.auth.forms import UserCreationForm
  
def user_signup(request):
    if request.method == 'POST':
        form = UserCreationForm(data = request.POST)
        
        if form.is_valid():
            new_user = form.save()
            new_user = authenticate(username = request.POST['username'],
                                    password = request.POST['password1'])
            if new_user is not None:
                login(request, new_user)
                return HttpResponseRedirect("/")        
    else:        
        form = UserCreationForm()
    return render_to_response('accounts/signup_form.html',
                                { 'form': form },
                                context_instance = RequestContext(request))

###Signup user
from django.http import HttpResponseRedirect
from django.shortcuts import render_to_response
from django.contrib.auth import login, authenticate
from mousy.forms import LoginForm

def user_login(request):
    if request.method == 'POST':
        form = LoginForm(data = request.POST)
        usernm = request.POST['username']
        passwd = request.POST['password']
        user = authenticate(username = usernm, password = passwd)
        if user is not None:
            login(request, user)
            return HttpResponseRedirect("/household")        
    else:        
        form = LoginForm()
    return render_to_response('accounts/login_form.html',
                                { 'form': form },
                                context_instance = RequestContext(request))
        
        
from django.contrib.auth import logout
def user_logout(request):
    logout(request)
    return HttpResponseRedirect('/users/login/')
            

###create, modify, and delete Receipts
from mousy.forms import ReceiptForm
from mousy.models import Receipt

class ReceiptCreate(CreateView):
    form_class = ReceiptForm
    model = Receipt
    success_url = "/household"
    template_name = "household/receipt_form.html"

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        return super(ReceiptCreate, self).form_valid(form)

class ReceiptUpdate(UpdateView):
     form_class = ReceiptForm
     model = Receipt
     template_name = 'household/receipt_form.html'
    
class ReceiptDelete(DeleteView):
    form_class = ReceiptForm
    model = Receipt
    template_name = 'household/receipt_confirm_delete.html'
    success_url = "/household"



###Return JSON receipts
from django.http import HttpResponse
from django.utils import simplejson
from django.views.generic.detail import View, BaseDetailView, SingleObjectTemplateResponseMixin
from django.views.generic.list import ListView, MultipleObjectTemplateResponseMixin

class JSONResponseMixin(object):
    def render_to_response(self, context):
        return self.get_json_response(self.convert_context_to_json(context))
    def get_json_response(self, content, **httpresponse_kwargs):
        return HttpResponse(content, content_type='application/json', **httpresponse_kwargs)
    def convert_context_to_json(self, context):
        return simplejson.dumps(context)

class HybridListView(JSONResponseMixin, ListView):
    def render_to_response(self, context):
        if self.request.is_ajax():
            o_list = context['object_list']
            j_list = [o.as_dict() for o in o_list]
            return JSONResponseMixin.render_to_response(self, j_list)
        return MultipleObjectTemplateResponseMixin.render_to_response(self, context)
    
class HybridDetailView(JSONResponseMixin, SingleObjectTemplateResponseMixin, BaseDetailView):
    def render_to_response(self, context):
        if self.request.is_ajax():
            logging.error("Ajax Request Logged")
            obj = context['object'].as_dict()
            return JSONResponseMixin.render_to_response(self, obj)
        else:
            return SingleObjectTemplateResponseMixin.render_to_response(self, context)





