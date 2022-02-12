# lob-typescript-demo
An app which demonstrates the usage of Lob's Typescript SDK.


Launch The UI
```bash
docker run --rm -v ${PWD}:/local -w /local -e API_KEY=test_a40b96f2296e226cc21a52aa4f7425392bc node:17 /bin/bash -c "npm i & npm run run-app"  
```

ToTest the Static UI
```bash
docker compose up static-ui --build 
```