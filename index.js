const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// --- CONFIGURATION ---
const config = {
    host: 'domainsmp.indernos.in', 
    port: 25565,            
    username: 'Naturo',    
    version: '1.16.5',      
    password: 'password123'
};

// --- WEB SERVER (Keep-Alive Fix) ---
app.get('/', (req, res) => res.send('FlickZZ Pro AI BOT is Active!'));

// 
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`[Keep-Alive] Server running on port ${PORT}`);
});

// 
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`[Keep-Alive] Port ${PORT} already in use! Trying port ${PORT + 1}...`);
        server.listen(PORT + 1);
    } else {
        console.error('[Keep-Alive] Server error:', err.message);
    }
});

// 
process.on('uncaughtException', (err) => {
    console.error('[Global] Uncaught Exception:', err.message);
});
process.on('unhandledRejection', (reason) => {
    console.error('[Global] Unhandled Promise Rejection:', reason);
});

// --- BOT LOGIC ---
let botActive = false;

function createBot() {
    // 
    if (botActive) return;
    botActive = true;

    console.log('[Bot] Connecting to server...');

    const bot = mineflayer.createBot({
        host: config.host,
        port: config.port,
        username: config.username,
        version: config.version,
        hideErrors: true
    });

    bot.on('spawn', () => {
        console.log(`[Pro AI] ${config.username} is now active.`);
        
        // Human-like login delay
        setTimeout(() => {
            bot.chat(`/register ${config.password} ${config.password}`);
            bot.chat(`/login ${config.password}`);
        }, Math.random() * 3000 + 2000);

        startProAI(bot);
    });

    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        const greetings = ['hi', 'hello', 'hey', 'yo', 'flickzz'];
        if (greetings.some(g => message.toLowerCase().includes(g))) {
            setTimeout(() => {
                const responses = ['Yo!', 'Hey', 'Working on my base lol', 'Sup', 'o/'];
                bot.chat(responses[Math.floor(Math.random() * responses.length)]);
            }, Math.random() * 4000 + 2000);
        }
    });

    // 
    bot.on('error', (err) => {
        console.error('[Bot] Error:', err.message);
        botActive = false;
    });

    // 
    bot.on('kicked', (reason) => {
        console.log('[Bot] Kicked from server. Reason:', reason);
        botActive = false;
        const delay = Math.random() * 10000 + 5000;
        console.log(`[Bot] Reconnecting in ${Math.round(delay / 1000)}s...`);
        setTimeout(createBot, delay);
    });

    bot.on('end', (reason) => {
        console.log('[Bot] Disconnected. Reason:', reason);
        botActive = false;
        const delay = Math.random() * 10000 + 5000;
        console.log(`[Bot] Reconnecting in ${Math.round(delay / 1000)}s...`);
        setTimeout(createBot, delay);
    });
}

// --- ADVANCED HUMAN BEHAVIORS ---
function startProAI(bot) {
    // 1. Continuous Looking Around (Smooth & Natural)
    setInterval(() => {
        const yaw = bot.entity.yaw + (Math.random() - 0.5) * 2;
        const pitch = (Math.random() - 0.5) * 1;
        bot.look(yaw, pitch, false);
    }, 2000);

    // 2. Active Movement Loop
    setInterval(() => {
        const rand = Math.random();
        if (rand < 0.6) { // 60% chance to walk
            const actions = ['forward', 'back', 'left', 'right'];
            const action = actions[Math.floor(Math.random() * actions.length)];
            bot.setControlState(action, true);
            if (Math.random() > 0.5) bot.setControlState('jump', true);
            
            setTimeout(() => {
                bot.clearControlStates();
            }, Math.random() * 3000 + 1000);
        }
    }, 10000);

    // 3. Simulated Block Interaction (Breaking/Placing)
    setInterval(() => {
        const block = bot.blockAtCursor(4);
        if (block && Math.random() > 0.5) {
            // Simulate "punching" a block
            bot.swingArm('right');
            console.log(`[Pro AI] Interacting with ${block.name}`);
            
            // Randomly "sneak" while interacting
            if (Math.random() > 0.7) {
                bot.setControlState('sneak', true);
                setTimeout(() => bot.setControlState('sneak', false), 1000);
            }
        }
    }, 15000);

    // 4. Random Sprinting
    setInterval(() => {
        if (Math.random() > 0.8) {
            bot.setControlState('sprint', true);
            bot.setControlState('forward', true);
            setTimeout(() => bot.clearControlStates(), 2000);
        }
    }, 30000);
}

createBot();
