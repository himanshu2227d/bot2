# FlickZZ Minecraft Bot

This is a Minecraft bot designed to keep your server (like Aternos) online 24/7 by staying connected and performing anti-AFK actions.

## Features
- **Name:** FlickZZ
- **Pro AI Movement:** Continuous movement, sprinting, and smooth looking around to mimic an active player.
- **Block Interaction:** Simulates punching and interacting with blocks to look like it's mining or building.
- **Human-like Delays:** Random delays for login and reconnecting to bypass anti-bot systems.
- **Smart Chat:** Basic AI responses to greetings (Hi/Hello) to look like a real player.
- **Auto-Reconnect:** Automatically reconnects if the server restarts or the bot is kicked.
- **Web Server:** Includes a simple Express server on port 3000 to keep the process alive on hosting platforms.

## How to Use

1. **Install Node.js:** Make sure you have Node.js installed on your server or computer.
2. **Configure:** Open `index.js` and change the `host` and `port` to your server's details.
   ```javascript
   const config = {
       host: 'YOUR_SERVER_IP', // Change this
       port: 25565,            // Change this
       username: 'FlickZZ',
       version: '1.16.5',
       // ...
   };
   ```
3. **Install Dependencies:**
   ```bash
   npm install
   ```
4. **Run the Bot:**
   ```bash
   node index.js
   ```

## Note
If your server requires registration, uncomment the `bot.chat` lines in `index.js` and provide your password.
