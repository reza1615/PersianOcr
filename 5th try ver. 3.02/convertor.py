#!/usr/bin/python
# -*- coding: utf-8 -*-
# BY: ÑÖÇ (User:reza1615 on fa.wikipedia)
# Distributed under the terms of the CC-BY-SA 3.0 .  
import codecs,string,pprint
filesample = 'unicharset'
text = codecs.open( filesample,'r' ,'utf8' )
text = text.read()
line=u'\n'
for i in text.split(u'\n'):    
    ih=i.split(u' ')
    count=-1
    ab=u' '
    for a in ih:
        count+=1
        if count==3:
            ab+=a.replace(u'NULL',u'Arabic ')
            continue
        if count==5:
            ab+=u'13 '
            continue
        if count==6:
            ab+=ih[4]+u' '
            continue
        ab+=a+u' '
    line+=ab.strip()+u'\n'
with codecs.open(filesample ,mode = 'w',encoding = 'utf8' ) as f:
                    f.write( line.strip())
                    