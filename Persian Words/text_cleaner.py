#!/usr/bin/python
# -*- coding: utf-8 -*-
# Reza1615
# Distributed under the terms of the CC-BY-SA 3.0 .

import codecs
from collections import defaultdict
filesample = 'total.txt'
text = codecs.open( filesample,'r' ,'utf8' )
text = text.read()
text=text.replace(u'‌',u' ').replace(u'\r',u'').replace( u'ك', u'ک').replace( u'ي', u'ی').replace(ur'ى', u'ی').replace(ur'‎ى', u'ی')
text=text.replace(u'ٔ',u' ').replace(u':',u' ')
for i in u'|/\\;#@$%^&*_+}{~`'+u'-='+u'"'+u"'":
     text=text.replace(i,u' ').replace(u'\t',u'\n').replace(u'\n',u' ').replace(u'  ',u' ')
for i in u'0123456789__|,`$%^‍-=><~+ـ()*×~÷‍!ًٌٍَُِّْ{}َِّ'+u'"'+u"'"+u'›…®©﻿ٰ‌qwertyuioٔpasdfghjkl;\\zxcvbnm,/QWERTYUIOPASDFGHJKLZXCVBNüç○M@#$%^&'+u'áíАрсеналКовалеваЛюдмилакотражениесамых'+u'۱۲۳۴۵۶۷۸۹۰'+u'[]?؟.،)(»«!'+u'٩٣٠‎﻿–…”°“‏‬üç○١٢٤٥’٧':     
     text=text.replace(i,u'')

'''
count=0
text2=u' '

dict=text.split(u' ')

for i in range(0,len(dict),1):
    count+=1
    if count<0:
        continue
    text_i=dict[i]
    if count>5000:
        break
    text2+=text_i+u' '
'''
with codecs.open('total2.txt' ,mode = 'w',encoding = 'utf8' ) as f:
                    f.write( text.strip())

    