#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import absolute_import

from celery import Celery

app = Celery()
app.config_from_object('crawler.celeryconfig')


if __name__ == '__main__':
    app.start()
