#!/usr/bin/env python

import requests 
import re
import json

INPUT_FILE='URLS'
OUTPUT_FILE='app/assets/cameras.feed.json'


FEED_STRUCT = []

src_url_f = file('URLS','r')
for uri in src_url_f:
    print 'Downloading %s' % uri
    r = requests.get( uri , headers={'user-agent': 'mozilla'})
    #m_feed = re.search(r'src=',r.text)
    m_feed = re.search(r'src=["|\'](?P<feed>http://.*?)["|\']',r.text)
    m_city = re.search(r'City:</td><td>(?P<city>.*?).<br>', r.text)
    m_country  = re.search(r'Country:</td><td>(?P<country>.*?).<br>', r.text)

    t={'country':  m_country.group('country'),
        'city': m_city.group('city'),
        'uri': m_feed.group('feed') }
    print t
    FEED_STRUCT.append(t)

out_f = file(OUTPUT_FILE,'w')
out_f.write( json.dumps( FEED_STRUCT ) )
out_f.close()
