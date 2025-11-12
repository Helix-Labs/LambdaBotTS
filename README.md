# LambdaBotTS

A Discord bot remake of LambdaBot in TypeScript using SapphireJS framework.

## Setup

1. Clone or navigate to the project directory.

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your bot token and owner ID:
   ```
   DISCORD_TOKEN=your_bot_token_here
   OWNER_ID=your_owner_id_here
   ```

4. Build the project:
   ```
   npm run build
   ```

5. Run the bot:
   ```
   npm start
   ```

For development:
```
npm run dev
```

## Features

- Basic bot initialization with SapphireJS
- Command handler for text and slash commands
- Bot events: ready (with status rotation), reconnect, disconnect, guild join/leave/ban, member join, voice state update, message create, interaction create
- Admin commands: guilds, close
- Common commands: echo, random, color, advice, genpass, lmgtfy, poll
- Fun commands: say, coin, flip, joke
