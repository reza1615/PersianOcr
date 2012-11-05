#! /bin/bash
tesseract per.arial.exp0.tif per.arial.exp0 nobatch box.train.stderr
unicharset_extractor per.arial.exp0.box
convertor.py
mftraining -F font_properties -U unicharset -O per.unicharset per.arial.exp0.tr
cntraining per.arial.exp0.tr
ren Microfeat per.Microfeat
ren normproto per.normproto
ren pffmtable per.pffmtable
ren inttemp per.inttemp
ren shapetable per.shapetable
combine_tessdata per.
#copy C:\Program Files_(x86)\Tesseract-OCR\per.traineddata C:\Program Files_(x86)\Tesseract-OCR\tessdata\per.traineddata
#tesseract per.arial.exp0.tif output -l per