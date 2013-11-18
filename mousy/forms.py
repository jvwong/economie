import logging

from django import forms
from django.contrib.auth.admin import User

from mousy.models import Receipt 

class ReceiptForm(forms.ModelForm):
    class Meta:
        model = Receipt
        exclude = ('created_by',)
   
   
class LoginForm(forms.Form):
    username = forms.CharField(max_length = 30)
    password = forms.CharField(max_length = 30,
                               widget = forms.PasswordInput(render_value = False))
        
    def clean(self):
        if 'username' in self.cleaned_data and 'password' in self.cleaned_data:
            try:
                User.objects.get(username = self.cleaned_data['username'],
                                 password = self.cleaned_data['password'])
            except User.DoesNotExist:
                raise forms.ValidationError("User does not exist")            
        return self.cleaned_data 
        

        
    