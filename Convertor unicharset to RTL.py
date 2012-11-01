#!/usr/bin/python
# -*- coding: utf-8 -*-
# Reza1615
# Distributed under the terms of the CC-BY-SA 3.0 .

import codecs,re

filesample = 'unicharset'
lang=u'Arabic' # for Persian also uses Arabic
lines=u'\n'
couple={}
couple_ch={u"<":u">",u">":u"<",u"(":u")",u")":u"(",u"[":u"]",u"]":u"[",u"{":u"}",u"}":u"{",u"«":u"»",u"»":u"«"}

text = codecs.open( filesample,'r' ,'utf8' )
text = text.read()

for line in text.split(u'\n'):    
    column=line.split(u' ')
    count=-1
    new_line=u' '
    for item in column: # Changing items in Columns
        count+=1
        if count==3:
            if column[0].strip() in u"~#@“'\/<>()[]}{.,?!$*+-_&0123456789،؛؟٠١٢٣٤٥٦٧٨٩«»،؛۱۲۳۴۵۶۷۸۹۰﷼":
                new_line+=item.replace(u'NULL',u'Common ')
            else:
                new_line+=item.replace(u'NULL',lang+u' ')
            continue
        if count==5:
            if column[0].strip() in u"0123456789":
                new_line+=u'2 '
            elif column[0].strip() in u"+-":
                new_line+=u'3 '
            elif column[0].strip() in u"#$﷼":
                new_line+=u'4 '
            elif column[0].strip() in u"٠١٢٣٤٥٦٧٨٩۱۲۳۴۵۶۷۸۹۰":
                new_line+=u'5 '
            elif column[0].strip() in u"/.,،،":
                new_line+=u'6 '
            elif column[0].strip() in u"~@“'\<>()[]}{?!*_&«»":
                new_line+=u'10 '
            else:
                new_line+=u'13 '
            continue
        if count==6:
            if column[0].strip() in u"<>()[]}{«»":
                couple[column[0].strip()]=column[4].strip()
                new_line+=u'[$['+column[0].strip()+u']$] '
            else:
                new_line+=column[4].strip()+u' '
            continue
        new_line+=item+u' '
    lines+=new_line.strip()+u'\n'

# Changing paired charcters column number

total_couples=re.findall(ur"\[\$\[.*?\]\$\]",lines, re.S)
if total_couples:
    for i in total_couples:
                i=i.replace(u'[$[',u'').replace(u']$]',u'').strip()
                try:
                    lines=lines.replace(u'[$['+i+u']$]',couple[couple_ch[i]])
                except:
                    lines=lines.replace(u'[$['+i+u']$]',couple[i])
                    print i + u' is not paired! please add '+couple_ch[i] +u' to your Box'
else:
    print "It couldn't find couple characters like <>()[]}{«» "

# Work is finished
print "Now your unicharset is set for RTL languages (Arnew_lineic, Persian)!"

with codecs.open(filesample ,mode = 'w',encoding = 'utf8' ) as f:
                    f.write( lines.strip())
                    