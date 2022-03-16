# lob-typescript-demo
The goal of this project is to provide interactive samples of meaningful operations with Lob's SDKs.


## Overview

## Usage

### Configuration
Edit the `.env` file to include your API keys

### Launching
Each of the following demos starts the demo backend locally as well as a web interface

| Demo Name       | Docker Command                    | SDK Link                                  |
|-----------------|-----------------------------------|-------------------------------------------|
| typescript-demo | docker compose up typescript-demo | https://github.com/lob/lob-typescript-sdk |
| lob-node-demo   | docker compose up lob-node-demo   | https://github.com/lob/lob-node           |

**Note**: add a `-d` to any of the docker commands to detach the running instance from your active terminal.
**Note**: add a `--build` while developing locally

Then, to launch the web interface either go to [http://localhost:8081/](http://localhost:8081/) or run the following console command
```bash
open http://localhost:8081/
```

### Cleaning up
```bash
docker compose down all
```
