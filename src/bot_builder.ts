import { initExpressions, initIntent } from './models/utils';
import { Intent } from './models/Intent';
import * as fs from "fs";
import { RecastRequest } from './request/RecastRequest';
import { Expression } from './models/Expression';


export async function checkBotExists(RecastReq: RecastRequest, botSlug: string) {
    await RecastReq.getBot(botSlug)
        .then(() => console.log("Bot exists."))
        .catch(() => console.error("Create bot first."));
}

async function checkIntentExists(RecastReq: RecastRequest, botSlug: string, intentSlug: string) {
    return await RecastReq.getIntent(botSlug, intentSlug)
        .then(() => { return true; })
        .catch(() => { return false; })
}

export async function buildBotIntents(RecastReq: RecastRequest, botSlug: string, botIntents, dir: string) {
    for (let botIntent of botIntents) {
        let intentConfigDir = dir + "/" + botIntent.dir;
        let intentConfig = JSON.parse(fs.readFileSync(intentConfigDir + "/intent.json", 'utf8'));

        if (!await checkIntentExists(RecastReq, botSlug, intentConfig.name)) {
            let intentObj: Intent = await initIntent(intentConfig, intentConfigDir);
            if (await RecastReq.createIntent(botSlug, intentObj) != 200) {
                process.exit(1);
            }
            console.log("Intent " + intentConfig.name + " correctly created");
        } else {
            console.log("Starting to complete expressions of intent " + intentConfig.name);
            if (!fs.existsSync(intentConfigDir + "/add")) {
                console.error("Please create a `add` folder in intent directory `" + intentConfig.name + "`");
                process.exit(1);
            }
            let expressionsObj = {
                expressions: await initExpressions(intentConfig, intentConfigDir + "/add")
            };
            console.log(JSON.stringify(expressionsObj));
            if (await RecastReq.createBulkExpressions(botSlug, intentConfig.name, expressionsObj) != 200) {
                process.exit(1)
            }
        }
    }
}