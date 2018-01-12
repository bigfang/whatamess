# -*- coding: utf-8 -*-

from __future__ import absolute_import

import time, json, copy

import requests
from pyquery import PyQuery as pq
from celery.utils.log import get_task_logger

from crawler.celery import app

logger = get_task_logger(__name__)

headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/45.0.2454.101 Chrome/45.0.2454.101 Safari/537.36',
    'Host': 'data.zjzwfw.gov.cn',
    'Origin': 'http://data.zjzwfw.gov.cn',
    'Referer': 'http://data.zjzwfw.gov.cn/toCate.action',
}
TIMEOUT = 15
BASE_URL = 'http://data.zjzwfw.gov.cn'
FILE_PATH = 'file.down?fileRoot=uploads&fileName='


@app.task()
def fetch(url):
    time.sleep(1)
    logger.info(url)
    try:
        resp = requests.get(url, headers=headers, timeout=TIMEOUT)
    except Exception as err:
        logger.exception(err)
    return resp.content


@app.task()
def parse_list(page):
    d = pq(page).make_links_absolute(base_url=BASE_URL)
    links = d('.sjtop2rttop2_3R a')
    return [link.get('href') for link in links]
    # subtask = group(fetch.s(link.get('href')) for link in links)
    # subtask()


@app.task()
def parse_detail(page):
    d = pq(page).make_links_absolute(base_url=BASE_URL)
    items = d('.wftop2lftop3')
    info = {}
    ret = []
    for item in items:
        key_l = pq(item)('.wftop2lftop3_1.sj14')
        val_l = pq(item)('.wftop2lftop3_2.sjjk12')
        if key_l and val_l:
            key = key_l[0].text_content().strip(u'： ')
            val = val_l[0].text_content().strip()
            info.update({key: val})

    category_node = d('.cy3d3')
    if category_node:
        category = category_node[-1].text_content().strip()
        info.update({'category': category})

    down_nodes = d('.wftop2lftop2rt_2 a')
    if down_nodes:
        for node in down_nodes:
            name = node.get('href').split("'")[-2]
            info.update({'file': name})
            tmp = copy.copy(info)
            ret.append(tmp)
    else:
        ret = [info]

    return ret


@app.task(ignore_result=True)
def store(data, url):
    no = url.split('/')[-1].split('&')[0]
    for idx, info in enumerate(data):
        name = info.get('file')
        if name:
            with open('data/%s-%s-%s.json' % (info['category'], no, idx), 'w') as f:
                f.write(json.dumps(info, ensure_ascii=False).encode('utf8'))
            path = '%s/%s%s' % (BASE_URL, FILE_PATH, name)
            try:
                resp = requests.get(path, headers=headers.update({'Referer': url}), timeout=TIMEOUT, stream=True)
            except Exception as err:
                logger.exception(err)

            try:
                f = open('files/%s' % name, 'wb')
                for chunk in resp.iter_content(chunk_size=1024):
                    if chunk:
                        f.write(chunk)
                logger.info('Download Complete: %s' % name)
            except Exception, err:
                logger.exception(err)
            finally:
                f.close()
        else:
            with open('failure/%s-%s-%s.json' % (info['category'], no, idx), 'w') as f:
                f.write(json.dumps(info, ensure_ascii=False).encode('utf8'))


def crawl(url):
    chain = fetch.s(url) | parse_detail.s() | store.s(url)
    chain()


def gen_url():
    seed = 'http://data.zjzwfw.gov.cn/toCate?pageNum=1&numPerPage=500&catecode=SJLY%s'
    return [seed % str(i).zfill(3) for i in range(1, 11)]


def run():
    urls = gen_url()
    for url in urls:
        html = fetch(url)
        links = parse_list(html)
        for link in links:
            crawl(link)
            # break
        # break
