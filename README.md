# lob-typescript-demo
An app which demonstrates the usage of Lob's Typescript SDK.


Launch The Demo API and UI
```bash
docker compose up typescript-demo --build
```

To Launch just the Static UI
```bash
docker compose up static-ui --build
```

To shut down a detached container, like the copy of the UI that the backend launches,
```bash
docker compose down static-ui
```