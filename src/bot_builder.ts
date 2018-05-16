import { initExpressions, initIntent } from './models/utils';
import { Intent } from './models/Intent';
import * as fs from "fs";
import { RecastRequest } from './request/RecastRequest';
import { Expression } from './models/Expression';


export async function checkBotExists(RecastReq: RecastRequest, botSlug: string) {
    return new Promise((resolve, reject) => {
        RecastReq.getBot(botSlug)
            .then((data) => {
                console.log("Bot exists.");
                resolve(data);
            })
            .catch((data) => {
                reject(data);
            });
    });
}

async function checkIntentExists(RecastReq: RecastRequest, botSlug: string, intentSlug: string) {
    return await RecastReq.getIntent(botSlug, intentSlug)
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        })
}

export async function buildBotIntents(RecastReq: RecastRequest, botSlug: string, botIntents, dir: string) {
    for (let botIntent of botIntents) {
        let intentConfigDir = dir + "/" + botIntent.dir;
        let intentConfig = JSON.parse(fs.readFileSync(intentConfigDir + "/intent.json", 'utf8'));

        if (!await checkIntentExists(RecastReq, botSlug, intentConfig.name)) {
            let intentObj: Intent = await initIntent(intentConfig, intentConfigDir);
            try {
                let response = await RecastReq.createIntent(botSlug, intentObj);
                console.log(response['status'] + " Intent " + intentConfig.name + " correctly created");
            }
            catch(e) {
                console.error(e.message);
            }
        } else {
            console.log("Starting to complete expressions of intent " + intentConfig.name);
            if (!fs.existsSync(intentConfigDir + "/add")) {
                console.error("Please create a `add` folder in intent directory `" + intentConfig.name + "`");
            } else {
                let expressionsObj = {
                    expressions: await initExpressions(intentConfig, intentConfigDir + "/add")
                };
                try {
                    let response = await RecastReq.createBulkExpressions(botSlug, intentConfig.name, expressionsObj);
                    console.log(response['status'] + " Bulk expression creation for " + intentConfig.name + " correctly executed");
                } catch (e) {
                    console.error(e.message);
                }
            }
        }
    }
}