import * as fs from 'fs';
import { buildBotIntents, checkBotExists } from './bot_builder';
import { RecastRequest } from './request/RecastRequest';

let configDir = __dirname + "/bot_config";
let config = JSON.parse(fs.readFileSync(configDir + '/config.json', 'utf8'));

// BOT PARSING CONF
if (!config.user_slug) {
    console.error("Please specify user_slug in config.json");
    process.exit(1);
}
if (!config.bots || config.bots.length < 1) {
    console.error("Please specify bots in array with property `dir` in config.json");
    process.exit(1);
}

for (let botDir of config.bots) {
    if (!botDir || !botDir.dir) {
        console.error("Please specify dir variable in bots array");
        process.exit(1);
    }
    let botConfigDir = configDir + "/" + botDir.dir;
    let botConfig = JSON.parse(fs.readFileSync(botConfigDir + "/bot.json", 'utf8'));

    if (!botConfig.intents_dir) {
        console.error("Please specify intents directory variable. Ex: `intents` will be ./intents");
        process.exit(1);
    }
    if (!botConfig.name) {
        console.error("Please specify bot's name.");
        process.exit(1);
    }
    if (!botConfig.dev_token) {
        console.error("Please specify bot's development token.");
        process.exit(1);
    }
    if (!botConfig.description) {
        console.error("Please specify bot's description.");
        process.exit(1);
    }
    let BotReq = new RecastRequest(config.user_slug, botConfig.dev_token);
    checkBotExists(BotReq, botConfig.name).then(() => {
        let botIntentsConfigDir = botConfigDir + "/" + botConfig.intents_dir;
        let botIntentsConfig = JSON.parse(fs.readFileSync(botIntentsConfigDir + "/intents.json", 'utf8'));

        let route = '/bots/' + botConfig.name + '/intents';
        console.log(route);
        buildBotIntents(BotReq, botConfig.name, botIntentsConfig.intents, botIntentsConfigDir)
            .then(() => {
                console.log("Bot successfully buit");
            })
            .catch(() => {
                console.error("Intent could not be created.")
            });
    }).catch(() => console.error("program shut down"));
}
