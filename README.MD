# PWNBot

A slack bot which alerts the members of a channel if they have been PWN'd (haveibeenpwnd.com)

#### Set up:

##### 1) Install Pwnbot into your slack workspace


##### 2) OAuth Token

Generate an `OAUTH` token for the pwn bot and set this as an environment variable named `SLACK_OAUTH_TOKEN`

It needs to have `users:read`, `users:read.email`, `chat:write:bot` and `incoming-webhook` permissions.


##### 3) Web-hook Configuration

Generate a webhook to your channel and set this as an environment variable named `SLACK_WEBHOOK` 

e.g. for a web hook URL `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`.

Set this as: `SLACK_WEBHOOK=T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`

##### 4) Give it a test

Run `node index.js`