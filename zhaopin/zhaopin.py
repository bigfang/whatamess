#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
import requests
from pyquery import PyQuery as pq

HEADERs = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36'
}

def crawl(url):
    print url
    resp = requests.get(url, headers=HEADERs)
    html = resp.content
    d = pq(html)
    ret = {
        'title': d('.inner-left.fl h1')[0].text.strip(),
        'company': d('.company-name-t a').text().strip(),
        'content': d('.terminalpage-main .tab-cont-box > .tab-inner-cont:nth-child(1)').text().strip()
    }
    details = d('.terminal-ul li')
    for item in details:
        ret.update({pq(item)('span').text().strip(u'：'): pq(item)('strong').text().strip()})

    return ret


def main():
    res = []
    with open('zhaopin.json', 'r') as f:
        urls = json.loads(f.read())
        for url in urls:
            job = crawl(url)
            res.append(job)
    print json.dumps(res, indent=2, ensure_ascii=False)
    with open('zpres.json', 'w') as o:
        o.write(json.dumps(res, indent=2))


if __name__ == '__main__':
    main()
