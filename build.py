#!/usr/bin/env python
import os
import sys
import django
from django.core.management import execute_from_command_line

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'HafezFaal.settings')
    django.setup()
    
    # Run migrations
    execute_from_command_line(['manage.py', 'migrate'])
    
    # Load initial data if needed
    # execute_from_command_line(['manage.py', 'loaddata', 'initial_data.json'])