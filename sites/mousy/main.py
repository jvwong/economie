#! /usr/bin/env python
import os
import tornado.httpserver
import tornado.ioloop
import tornado.wsgi
import tornado.web
import sys
import django.core.handlers.wsgi
import logging

APP_NAME = "jeffreyvwong"

APP_DIR = os.path.abspath(os.path.dirname(__file__)) 
SITE_DIR = os.path.abspath(os.path.join(APP_DIR, "..")) 
PARENT_DIR = os.path.abspath(os.path.join(SITE_DIR, "..")) 
STATIC_PATH = os.path.abspath(os.path.join(PARENT_DIR, "static"))
#logging.error(STATIC_PATH)

from tornado.options import define, options
define("port", default=9000, help="run on the given port", type=int)

def main():
    ENVIRON_MODULE = ".".join(["config.settings", APP_NAME])
    
    tornado.options.parse_command_line()
        
    os.environ['DJANGO_SETTINGS_MODULE'] = ENVIRON_MODULE 
    wsgi_app = tornado.wsgi.WSGIContainer(django.core.handlers.wsgi.WSGIHandler())
    
    application = tornado.web.Application([
            (r"/static/(.*)", tornado.web.StaticFileHandler, {"path": STATIC_PATH}),
            (r".*", tornado.web.FallbackHandler, dict(fallback=wsgi_app)),
        ])
    
    server = tornado.httpserver.HTTPServer(application)
    server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()
    
   
    
