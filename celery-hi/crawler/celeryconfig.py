# -*- coding: utf-8 -*-

BROKER_URL = 'redis://localhost:6379/9'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/9'

CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TIMEZONE = 'Asia/Shanghai'
CELERY_ENABLE_UTC = True
