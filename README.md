# FORKED to customize commands and enable redis as storage (heroku-addon)

Only required env variable is BOT_TOKEN (telegram bot token) , REDISGOTO url is set automatically after a succesful redistogo addon setup
Deployed on heroku as a worker + redis addon 
https://devcenter.heroku.com/articles/redistogo

# Telegram Counter Bot
This bot aims to be a simple counter bot to keep a counter in a group / private chat.  
The uses are simply endless.  
It's the second generation, innovation, it's absolutely amazing!

It is currently online on http://t.me/countrBot

## Installation
- copy the `config.js.sample` to `config.js` and enter your bot token
- `npm install`
- start the bot with the app.js (either use `node app.js` or use a manager like pm2)

## Current project state
Current project state: Limbo

Like many other projects, it is still running, but does not get much attention other than keeping it running on my server
