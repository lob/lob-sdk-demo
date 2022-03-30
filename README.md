# lob-sdk-demo

## Overview
The goal of this project is to provide interactive samples of meaningful operations with Lob's SDKs.

It consists of a single UI that interfaces with one of the backend implementations. Each demo backend provides the exact same functionality implemented using the associated Lob SDK.

### Registration

First, you will need to first create an account at [Lob.com](https://dashboard.lob.com/#/register) and obtain your Test and Live API Keys.

Once you have created an account, you can access your API Keys from the [Settings Panel](https://dashboard.lob.com/#/settings).

### Dependencies

An up-to-date version of Docker installed locally.

## Usage

### Configuration

Edit the `.env` file to include your API keys

### Launching

The following command will start the typescript sdk demo locally and a web interface in a separate container.
```bash
docker compose up typescript-demo
```

Then, to open the web interface either go to [http://localhost:8081/](http://localhost:8081/) or run the following console command
```bash
open http://localhost:8081/
```

In order to launch other demo implementations, simply run the "Docker Command" with the desired backend within the following table:

| Demo Name       | Docker Command                      | SDK Link                                                                               |
|-----------------|-------------------------------------|----------------------------------------------------------------------------------------|
| typescript-demo | `docker compose up typescript-demo` | [https://github.com/lob/lob-typescript-sdk](https://github.com/lob/lob-typescript-sdk) |
| lob-node-demo   | `docker compose up lob-node-demo`   | [https://github.com/lob/lob-node](https://github.com/lob/lob-node)                     |

**Note**: add a `-d` to any of the docker commands to detach the running instance from your active terminal.
**Note**: add a `--build` while developing locally

### Cleaning up
```bash
docker compose down all
```
