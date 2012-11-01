#!/usr/bin/python
# -*- coding: utf-8 -*-
# Reza1615
# Distributed under the terms of the CC-BY-SA 3.0 .

import codecs
from collections import defaultdict
filesample = 'Dehkhoda.txt'
text = codecs.open( filesample,'r' ,'utf8' )
text = text.read()
text=text.replace(u'‌',u' ').replace(u'\r',u'').replace( u'ك', u'ک').replace( u'ي', u'ی').replace(ur'ى', u'ی')
text=text.replace(u'ٔ',u' ').replace(u':',u' ')
for i in u':,|?!/\\;#@$%^&*()_+}{][~`'+u'،.؟؛«»-='+u'"'+u"'":
     text=text.replace(i,u' ')
for i in u'0123456789۱__?|.,`!؟$%^‍۱۲۳۴۵۶۷۸۹۰-=><«»؛~:+ـ()*،×٪﷼٫٬~÷÷‍!ًٌٍَُِّْ{}[]َِّ'+u'"'+u"'"+u'﻿ٰ‌qwertyuioٔpasdfghjkl;\\zxcvbnm,./QWERTYUIOPASDFGHJKLZXCVBNM@#$%^&':     
     text=text.replace(i,u'')
text=text.replace(u' ',u'\n').replace(u'\t',u'\n').replace(u'\n\n\n',u'\n').replace(u'\n\n',u'\n').replace(u'\n\n',u'\n').replace(u'\n\n',u'\n').replace(u'\n\n',u'\n').replace(u'\n\n',u'\n')

with codecs.open('Dehkhoda+moin2.txt' ,mode = 'w',encoding = 'utf8' ) as f:
                    f.write( text)
