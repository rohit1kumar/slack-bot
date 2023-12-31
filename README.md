# Databot
## A Slack bot with data querying capabilities
- Built using [Slack's Bolt Framework](https://api.slack.com/tools/bolt), send hourly message to channel, (since the bot joined the channel) asking if user has any query.
- Mention the bot in the channel with the query and the bot will respond with the result.
- Welcomes the new user in the channel.
- Can be installed in any workspace using the [OAuth flow](https://api.slack.com/authentication/oauth-v2).
- Uses [OpenAI's](https://platform.openai.com/examples/default-sql-translate) API to translate natural language to SQL query.

### Try asking question in this manner:

    how many users from Lucknow use Samsung phones?

## How to Install & Use the bot in your workspace
1. Visit https://databot.onrender.com/slack/install and click on `Add to Slack` button, you will be redirected to Slack's OAuth page and accept the permissions.
2. Invite the bot to the channel you want to use it in.
3. Mention the bot in the channel with the query and the bot will respond with the result.

    eg: `@databot how many users from Lucknow use Samsung phones?`
4. Watch the video below to see how to use the bot.
[![Watch this video](https://img.youtube.com/vi/3KAf3UcZR2s/hqdefault.jpg)](https://www.youtube.com/watch?v=3KAf3UcZR2s)
---
## Installation for local development
1. Clone the repository
```
    git clone https://github.com/rohit1kumar/slack-bot.git
```
2. Create the `.env`, by running the following command:
```
    cp .env.example .env
```

3. Download and install [ngrok](https://ngrok.com/download) and run the following command:
```
    ngrok http 3000
```
4. Create a [Slack App](https://api.slack.com/start/quickstart), Copy the https url generated by ngrok and paste it in the event subscriptions page with the path `/slack/events` and subscribe to the following events:
```
    app_mention
    channel_left
    member_joined_channel
```
5. Add redirect url in Oauth & Permissions page with the path `/slack/oauth_redirect` and add these scopes:
```
	chat:write
	groups:read
	channels:join
	channels:read
	app_mentions:read
```
6. Install the app in your workspace and copy the following credentials from the app under `Basic Information` section and OpenAI keys from [OpenAI's](https://platform.openai.com/account/api-keys) and paste it in the `.env` file.
```
    SLACK_SIGNING_SECRET
    CLIENT_SECRET
    CLIENT_ID
    OPENAI_API_KEY
```
7. You can seed the SQLite database with the following command:
```
    npm run seed
```

8. Run the docker and execute the following commands to start the bot:
```
    chmod +x docker_run.sh
    ./docker_run.sh
```

**Note:** having some issue related to SQLITE while running the project in Docker, so run this locally for now.