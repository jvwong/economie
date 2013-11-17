cdfrom __future__ import with_statement
from fabric.api import *

def push():
    local("git push origin master")

env.hosts = ['jvwong@192.168.0.10']

def remote_pull():
    code_dir = '/var/www/dj_powered/'
    with cd(code_dir):
        run("git pull origin master")

def getStatus():
    run('/usr/local/bin/supervisorctl status')

def start_sup():
    sudo('/usr/local/bin/supervisord -c /etc/supervisord.conf')

def stop_sup():
    run('/usr/local/bin/supervisorctl stop all')
    run('/usr/local/bin/supervisorctl shutdown')

def restart_sup():
    run('/usr/local/bin/supervisorctl restart all')

def reboot():
    sudo('reboot')

def deploy(restart=True):
    push()
    remote_pull()
    with settings(warn_only=True):
        if restart:
            result1 = restart_sup()
    getStatus()
        
def syncdb(site=''):
    command = '.'.join(['/root/.virtualenvs/practical_dj/bin/django-admin.py syncdb --settings=config.settings',site]) 
    sudo(command)
