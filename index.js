const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const { GoalNear } = goals;

const config = {
  host: 'domainsmp.indernos.in', // Your server IP
  port: 25565,                       // Your server port
  username: 'BatMan',
  version: '1.20.1',                 // Set your exact server version
  password: 'password123',
  minBreakTimeMinutes: 3,
  maxBreakTimeMinutes: 8,
  sessionDurationHours: 2.5
};

let bot = null;
let actionTimeout = null;
let sessionTimeout = null;

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function createBot() {
  console.log('[System] Initializing connection to server...');

  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    username: config.username,
    version: config.version,
    hideErrors: false
  });

  bot.loadPlugin(pathfinder);

  bot.once('spawn', () => {
    console.log(`[Bot] Spawned as ${bot.username}. Initializing human routines.`);

    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);
    defaultMove.canDig = false;
    defaultMove.allowParkour = false;
    bot.pathfinder.setMovements(defaultMove);

    // Authentication delay
    setTimeout(() => {
      bot.chat(`/login ${config.password}`);
    }, randomRange(1500, 3500));

    // Start natural behaviors
    startDynamicRoutine();

    // Schedule human break session
    const sessionLength = config.sessionDurationHours * 60 * 60 * 1000 + randomRange(-15 * 60 * 1000, 15 * 60 * 1000);
    sessionTimeout = setTimeout(() => {
      takeHumanBreak();
    }, sessionLength);
  });

  // Chat handling
  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    const msg = message.toLowerCase();
    if (msg.includes(bot.username.toLowerCase()) || msg.includes('afk') || msg.includes('bot')) {
      const responses = ['im tabbed out 1 sec', 'cooking food rn', 'afk at base', 'yeah?'];
      setTimeout(() => {
        bot.chat(responses[Math.floor(Math.random() * responses.length)]);
      }, randomRange(3000, 7000));
    }
  });

  // Reconnection logic
  bot.on('kicked', (reason) => {
    console.warn('[Bot] Disconnected/Kicked:', reason);
    cleanupAndReconnect(randomRange(15000, 30000));
  });

  bot.on('error', (err) => {
    console.error('[Bot] Socket error:', err.message);
    cleanupAndReconnect(randomRange(10000, 20000));
  });

  bot.on('end', () => {
    console.log('[Bot] Connection ended.');
    cleanupAndReconnect(randomRange(10000, 20000));
  });
}

function startDynamicRoutine() {
  if (!bot || !bot.entity) return;

  const actions = ['wander', 'lookAround', 'idle', 'sneak'];
  const nextAction = actions[Math.floor(Math.random() * actions.length)];

  switch (nextAction) {
    case 'wander': {
      // Pick a reachable block within a 4-8 block radius
      const currentPos = bot.entity.position;
      const targetX = currentPos.x + randomRange(-6, 6);
      const targetZ = currentPos.z + randomRange(-6, 6);
      bot.pathfinder.setGoal(new GoalNear(targetX, currentPos.y, targetZ, 1));
      break;
    }
    case 'lookAround': {
      const yaw = bot.entity.yaw + (Math.random() - 0.5) * 1.5;
      const pitch = (Math.random() - 0.5) * 0.8;
      bot.look(yaw, pitch, true);
      break;
    }
    case 'sneak': {
      bot.setControlState('sneak', true);
      setTimeout(() => {
        if (bot) bot.setControlState('sneak', false);
      }, randomRange(800, 2500));
      break;
    }
    case 'idle':
    default:
      // Real players often do nothing for 10-30 seconds
      break;
  }

  // Next action scheduled with dynamic jitter (prevents fixed-cadence detection)
  const nextDelay = randomRange(4000, 14000);
  actionTimeout = setTimeout(startDynamicRoutine, nextDelay);
}

function takeHumanBreak() {
  console.log('[System] Simulating player break. Logging out...');
  clearTimeout(actionTimeout);
  if (bot) {
    bot.quit();
  }
  const breakDuration = randomRange(config.minBreakTimeMinutes, config.maxBreakTimeMinutes) * 60 * 1000;
  console.log(`[System] Reconnecting in ${(breakDuration / 1000 / 60).toFixed(1)} minutes.`);
  setTimeout(createBot, breakDuration);
}

function cleanupAndReconnect(delay) {
  clearTimeout(actionTimeout);
  clearTimeout(sessionTimeout);
  bot = null;
  setTimeout(createBot, delay);
}

createBot();
