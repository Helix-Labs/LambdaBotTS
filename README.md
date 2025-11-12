<div align="center">
   <h1>LambdaBotTS</h1>
   <p>A rewrite of the Lambda Discord bot in TypeScript using SapphireJS and modern Discord.js v14.</p>
   <p><a href="https://github.com/Zone-Infinity/LambdaBot">Original project and code written by</a> @Zone-Infinity</p>
</div>


## Setup

### Prerequisites

- Node.js 20.x or higher
- MongoDB (local or cloud instance)
- A Discord bot token from [Discord Developer Portal](https://discord.com/developers/applications)

### Installation

1. Clone or navigate to the project directory.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` file with the required values:
   ```env
   # Required
   DISCORD_TOKEN=your_discord_bot_token_here
   OWNER_ID=your_discord_user_id_here
   MONGODB_URI=mongodb://localhost:27017/lambdabot

   # Optional
   OWNER_IDS=your_discord_user_id_here,another_owner_id_here
   BETA_TOKEN=your_beta_bot_token_here
   DEFAULT_PREFIX=!
   DEFAULT_WELCOME_MESSAGE=Welcome {user} to {guild}!
   TOPGG_TOKEN=your_topgg_token_here
   DISCORD_BOATS_TOKEN=your_discord_boats_token_here
   INFINITY_BOT_LIST_TOKEN=your_infinity_bot_list_token_here
   BOT_STATUS_CHANNEL_ID=your_status_channel_id_here
   ```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_TOKEN` | ✅ | Your Discord bot token |
| `OWNER_ID` | ✅ | Primary bot owner Discord ID |
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `OWNER_IDS` | ❌ | Comma-separated list of bot owner IDs |
| `BETA_TOKEN` | ❌ | Token for beta bot instance |
| `DEFAULT_PREFIX` | ❌ | Default command prefix (default: `!`) |
| `DEFAULT_WELCOME_MESSAGE` | ❌ | Default welcome message template |
| `TOPGG_TOKEN` | ❌ | Top.gg API token for bot statistics |
| `DISCORD_BOATS_TOKEN` | ❌ | Discord Boats API token |
| `INFINITY_BOT_LIST_TOKEN` | ❌ | Infinity Bot List API token |
| `BOT_STATUS_CHANNEL_ID` | ❌ | Channel ID for bot status logging |

### Running the Bot

Build the project:
```bash
npm run build
```

Start the bot:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Contributing

1. Follow TypeScript strict mode guidelines
2. Use modern Discord.js 14.20+ patterns
3. Maintain SapphireJS framework conventions
4. Add proper error handling and logging
5. Update documentation for new features

## License

ISC License
