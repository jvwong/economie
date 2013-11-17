from django.contrib.auth.decorators import login_required
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.contrib.auth.admin import User
from django.views.generic import TemplateView

from mousy.forms import ReceiptForm, UserCreateForm
from mousy.models import Receipt

import logging

###create, modify, and delete Receipts
class ReceiptCreate(CreateView):
    form_class = ReceiptForm
    model = Receipt

    @login_required
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
    
###Create a new user
#from django.views.generic.edit import FormView
#
#class SignupView(FormView):
#    form_class = SignupForm
#    success_url = '/'
#    
#    def form_valid(self, form):
#        new_user = form.save()
#        return super(SignupView, self).form_valid(form)


###create, modify, and delete User
class UserCreate(CreateView):
    form_class = UserCreateForm
    model = User

    def form_valid(self, form):
        return super(UserCreate, self).form_valid(form)


from django.contrib.auth import logout
from django.http import HttpResponseRedirect

def logout_user(request):
    logout(request)
    return HttpResponseRedirect('/accounts/login/')
    
   


