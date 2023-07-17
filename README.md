# Databot
## A Slack bot with data querying capabilities

### Installation
1. Clone the repository
```
    git clone https://github.com/rohit1kumar/slack-bot.git
```
2. To create and fill the `.env` file with the required credentials, run the following command:
```
    cp .env.example .env
```


3 Run the docker and execute the following commands to start the bot:
```
    chmod +x docker_run.sh
    ./docker_run.sh
```

### More about the bot
- Build using [Slack's Bolt Framework](https://api.slack.com/tools/bolt), send hourly message to channel since the bot joined the channel asking for the query.
- Mention the bot in the channel with the query and the bot will respond with the result.
- Welcomes the new user in the channel.

