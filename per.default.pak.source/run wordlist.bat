@echo ! /bin/bash
wordlist2dawg -r 1 per.freq per.freq-dawg per.unicharset
wordlist2dawg -r 1 per.number per.number-dawg per.unicharset
wordlist2dawg -r 1 per.punc per.punc-dawg per.unicharset
wordlist2dawg -r 1 per.word per.word-dawg per.unicharset
