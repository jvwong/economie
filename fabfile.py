from __future__ import with_statement
from fabric.api import *


def push():
    local("git push origin master")

env.hosts = ['jvwong@192.168.0.10']


def remote_pull():
    code_dir = '/home/jvwong/projects/economie/'
    with cd(code_dir):
        run("git pull origin master")


def remote_collectstatic():
    code_dir = '/home/jvwong/projects/economie/'
    with cd(code_dir):
        run("/home/jvwong/.virtualenvs/economie_env/bin/python2.7 manage.py collectstatic")

def remote_restart_apache2():
    sudo('service apache2 reload')

def reboot():
    sudo('reboot')

def deploy(restart=True):
    push()
    remote_pull()
    remote_collectstatic()
    with settings(warn_only=True):
        if restart:
            result = remote_restart_apache2()
