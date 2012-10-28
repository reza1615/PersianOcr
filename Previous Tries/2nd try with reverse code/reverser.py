#!/usr/bin/python
# -*- coding: utf-8 -*-
# BY: ÑÖÇ (User:reza1615 on fa.wikipedia)
# Distributed under the terms of the CC-BY-SA 3.0 .  
import codecs,string,pprint
filesample = 'output.txt'
text = codecs.open( filesample,'r' ,'utf8' )
text = text.read()
text2='\n'
for i in text.split(u'\n'):    
    i=i[::-1]
    text2+=i+u'\n'
with codecs.open(filesample ,mode = 'w',encoding = 'utf8' ) as f:
                    f.write( text2.strip())
                    