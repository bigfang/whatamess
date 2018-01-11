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
        'title': d('.tHeader.tHjob .cn h1').text().strip(),
        u'工作地点': d('.tHeader.tHjob .cn .lname').text().strip(),
        u'职位月薪': d('.tHeader.tHjob .cn .lname + strong').text().strip(),
        u'联系方式': d('.tCompany_main > .tBorderTop_box:nth-child(5) > div > p').text().strip(),
        u'公司简介': d('.tCompany_main > div:nth-child(6) > div').text().strip(),
        'company': d('.tHeader.tHjob .cn .cname a').text().strip(),
        'content': d('.tCompany_main .tBorderTop_box .bmsg.job_msg.inbox').text().strip()
    }
    misc = [i.strip() for i in d('.msg.ltype').text().split('|')]
    for idx, m in enumerate(misc):
        ret[u'misc%s' % idx] = m
    misc2 = [pq(i).text().strip() for i in d('.tCompany_main .jtag.inbox .t1 .sp4')]
    for idx, m in enumerate(misc2):
        ret[u'other%s' % idx] = m

    return ret


def main():
    res = []
    with open('51job.json', 'r') as f:
        urls = json.loads(f.read())
        for url in urls:
            job = crawl(url)
            res.append(job)
    print json.dumps(res, indent=2, ensure_ascii=False)
    with open('51res.json', 'w') as o:
        o.write(json.dumps(res, indent=2))


if __name__ == '__main__':
    main()
