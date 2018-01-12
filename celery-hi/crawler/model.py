#!/usr/bin/env python
# -*- coding: utf-8 -*-


from peewee import *


try:
    import psycopg2
    from playhouse.pool import PooledPostgresqlExtDatabase

    db = PooledPostgresqlExtDatabase(
        'postgres',
        max_connections=8,
        stale_timeout=300,
        user='fang',
        autorollback=True,
        register_hstore=False)
except ImportError:
    db = SqliteDatabase('log/db.sqlite')


class BaseModel(Model):
    class Meta:
        database = db


class GGUJ(BaseModel):
    pass