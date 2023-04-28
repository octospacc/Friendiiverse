#!/usr/bin/env python3
import os
from base64 import b64encode
from mimetypes import guess_type
from pathlib import Path

os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.makedirs('./Dist', exist_ok=True)

os.chdir('./Build')

with open(f'./Friendiiverse.html', 'r') as Base:
	Base = Base.read()

def FragReplace(Find, Replace, Pattern='*.*'):
	global Base
	for File in Path('./').rglob(Pattern):
		File = str(File)
		with open(File, 'r') as Frag:
			Frag = Frag.read()
			#if Pattern.endswith('*.js') and not File.startswith('Lib/'):
			#	Frag = MinifyJs(Frag)
			Frag = Replace.format(File=File, Frag=Frag)
			for Prefix in ('', './'):
				Name = Prefix + File
				Base = Base.replace(Find.format(File=Name), Frag)

BaseNew = ''
Split = '<script data-build-json="true">'
Frags = Base.split(Split)
BaseNew += Frags[0] + Split
Split = '</script>'
Frags = Frags[1].split(Split)
for File in Path('./Assets').rglob('*.*'):
	File = str(File)
	Mime = guess_type(File)
	Mime = (Mime[0] if Mime else 'application/octet-stream')
	with open(File, 'rb') as Frag:
		Frag = b64encode(Frag.read()).decode()
		for Prefix in ('', './'):
			Name = Prefix + '/'.join(File.split('/')[1:])
			Frags[0] = Frags[0].replace(f'"{Name}"', f'"data:{Mime};base64,{Frag}"')
BaseNew += Split.join(Frags)
Base = BaseNew

FragReplace('<link rel="stylesheet" href="{File}"/>', '<style data-source="{File}">{Frag}</style>',   '*.css')
FragReplace('<script src="{File}"></script>',         '<script data-source="{File}">{Frag}</script>', '*.js')

ScriptFrags = ''
for File in Path('./Polyfill').rglob('*.js'):
	File = str(File)
	#Folder = '/'.join(File.split('/')[:-1])
	#File = File.split('/')[-1]
	ScriptFrags += f'<script>{open(File, "r").read()}</script>'
Base = Base.replace('<script folder="./Polyfill"></script>', ScriptFrags)

os.chdir('..')

with open('./Dist/Friendiiverse.html', 'w') as Build:
	Build.write(Base)
