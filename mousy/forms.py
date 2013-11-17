from django import forms
import logging
from django.contrib.auth.admin import User
#
#class SignupForm(forms.Form):
#    username = forms.CharField(max_length = 30)
#    email = forms.EmailField()
#    password1 = forms.CharField(max_length = 30,
#                                widget = forms.PasswordInput(render_value = False))
#    password2 = forms.CharField(max_length = 30,
#                                widget = forms.PasswordInput(render_value = False))
#    
#    def clean_username(self):
#        try:
#            User.objects.get(username = self.cleaned_data['username'])
#        except User.DoesNotExist:
#            return self.cleaned_data['username']
#        
#        raise forms.ValidationError("Username already exists")
#    
#    
#    def clean(self):
#        if 'password1' in self.cleaned_data and 'password2' in self.cleaned_data:
#            if self.cleaned_data['password1'] !=  self.cleaned_data['password2']:
#                raise forms.ValidationError("You must type the same password")
#        return self.cleaned_data
#    
#    
#    def save(self):
#        new_user = User.objects.create(username = self.cleaned_data['username'],
#                                       email =  self.cleaned_data['email'],
#                                       password = self.cleaned_data['password1'])
#        return new_user
#        

from django.contrib.auth.forms import UserCreationForm

class UserCreateForm(UserCreationForm):
    email = forms.EmailField(required=True)
    
    class Meta:
        model = User
        fields = ( "username", "email" ) 
        

from mousy.models import Receipt 

class ReceiptForm(forms.ModelForm):
    class Meta:
        model = Receipt
        exclude = ('created_by',)