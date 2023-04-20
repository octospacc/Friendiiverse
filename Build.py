#!/usr/bin/env python3
import os
from pathlib import Path

os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.makedirs('./Dist', exist_ok=True)

os.chdir('./Source')

with open(f'./Friendiiverse.html', 'r') as Base:
	Base = Base.read()

def FragReplace(Find, Replace, Pattern='*.*'):
	global Base
	for File in Path('./').rglob(Pattern):
		File = str(File)
		with open(File, 'r') as Frag:
			Frag = Replace.format(File=File, Frag=Frag.read())
			for Prefix in ('', './'):
				File = Prefix + File
				Base = Base.replace(Find.format(File=File), Frag)

FragReplace('<link rel="stylesheet" href="{File}"/>', '<style data-source="{File}">{Frag}</style>',   '*.css')
FragReplace('<script src="{File}"></script>',         '<script data-source="{File}">{Frag}</script>', '*.js')

os.chdir('..')

with open('./Dist/Friendiiverse.html', 'w') as Build:
	Build.write(Base)
