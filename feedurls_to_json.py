#!/usr/bin/env python

import requests 
import re
import json

INPUT_FILE='URLS'
OUTPUT_FILE='app/assets/cameras.feed.json'

FEED_STRUCT = []


def get_info(r):
    try:
        m_feed = re.search(r'src=["|\'](?P<feed>http://.*?)["|\']',r.text).group('feed')
        m_city = re.search(r'City:</td><td>(?P<city>.*?).<br>', r.text).group('city')
        m_country  = re.search(r'Country:</td><td>(?P<country>.*?).<br>', r.text).group('country')
    except:
        print "Camera %s not found" % (r.url)
        m_feed = 'unknown'
        m_city = 'unknown'
        m_country = 'unknown'

    t={'country':  m_country,
        'city': m_city,
        'uri': m_feed }

    return t


src_url_f = file('URLS','r')
for uri in src_url_f:
    print "FETCHING %s" % uri
    r = requests.get( uri , headers={'user-agent': 'mozilla'})
    t = get_info(r)
    print t
    FEED_STRUCT.append(t)

out_f = file(OUTPUT_FILE,'w')
out_f.write( json.dumps( FEED_STRUCT ) )
out_f.close()
