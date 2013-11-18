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
            return HttpResponseRedirect("/")        
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
    template_name = "receipt_form.html"

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        return super(ReceiptCreate, self).form_valid(form)

class ReceiptUpdate(UpdateView):
     form_class = ReceiptForm
     model = Receipt
    
class ReceiptDelete(UpdateView):
    form_class = ReceiptForm
    model = Receipt
    success_url = "/household/receipt"






