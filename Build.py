#!/usr/bin/env python3
import os
from pathlib import Path

os.makedirs('./Dist', exist_ok=True)

with open('./Friendiiverse.html', 'r') as Base:
	Base = Base.read()

def FragReplace(Find, Replace, Pattern='*.*', Folder='./'):
	global Base
	for File in Path('./').rglob(Pattern):
		with open(File, 'r') as Frag:
			Frag = Replace[0] + Frag.read() + Replace[1]
			for Prefix in ('', './'):
				Base = Base.replace(Find[0] + Prefix + str(File) + Find[1], Frag)

FragReplace(('<link rel="stylesheet" href="', '"/>'), ('<style>', '</style>'),   '*.css')
FragReplace(('<script src="', '"></script>'),         ('<script>', '</script>'), '*.js')

with open('./Dist/Friendiiverse.html', 'w') as Build:
	Build.write(Base)

