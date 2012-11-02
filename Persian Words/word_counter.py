#!/usr/bin/python
# -*- coding: utf-8 -*-
# Reza1615
# Distributed under the terms of the CC-BY-SA 3.0 .

import codecs
from collections import defaultdict
filesample = 'Dehkhoda+moin dictionary+many texts from internet 2.txt'
text = codecs.open( filesample,'r' ,'utf8' )
text = text.read()
dict={}
for i in text.split(u'\n'):     
        try:
            if i in dict:
               dict[i]=int(dict[i])+1
            else:
               dict[i]=1
        except:
             continue
count=0
inverse= defaultdict( list )
for k, v in dict.items():
    inverse[int(v)].append( k )
text2=u'\n'
for k in sorted(inverse, reverse=True):
    for i in range(0,len(inverse[k])):
         text2+= inverse[k][i]+u' '+str(k)+u'\n'

with codecs.open('Persian_frequent_words.txt' ,mode = 'w',encoding = 'utf8' ) as f:
                    f.write( text2)
                    