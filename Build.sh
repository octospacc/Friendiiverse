#!/bin/sh
rm -rf ./Build || true && \
cp -r ./App ./Build && \
npx babel ./App -d ./Build && \
python3 ./Bundle.py
