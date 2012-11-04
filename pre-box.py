#!/usr/bin/python
# -*- coding: utf-8 -*-
# Reza1615
# Distributed under the terms of the CC-BY-SA 3.0 .

import codecs,re
boxes=["%02d" % x for x in range(17)]
lines=u'\n'
for a in range(17):#boxes:
    filesample = str(a)+'.box'
    print filesample
    text = codecs.open( filesample,'r' ,'utf8' )
    text = text.read()
    for line in text.split(u'\n'):    
        if line.find(u'�')!=-1:
           continue
        else:
           lines+=line+u'\n'

with codecs.open('per.arial.exp0.box' ,mode = 'w',encoding = 'utf8' ) as f:
                    f.write( lines.strip())



