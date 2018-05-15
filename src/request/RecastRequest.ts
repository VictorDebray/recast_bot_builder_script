import axios from 'axios';
import { AxiosInstance } from 'axios';
import { Intent } from '../models/Intent';
import { Expression } from '../models/Expression';

export class RecastRequest {
    axiosInstance: AxiosInstance;

    constructor(userSlug: string, token: string) {
        this.axiosInstance = axios.create({
            baseURL: 'https://api.recast.ai/v2/users/' + userSlug,
            timeout: 1000,
            headers: {'Authorization': 'Token ' + token}
        });
    }

    getIntent(botSlug: string, intentSlug: string) {
        return new Promise((resolve, reject) => {
            this.axiosInstance.get("/bots/" + botSlug + "/intents/" + intentSlug)
                .then(() => resolve())
                .catch(() => reject())
        })
    }

    getBot(botSlug: string) {
        return new Promise((resolve, reject) => {
            this.axiosInstance.get("/bots/" + botSlug)
                .then(() => resolve())
                .catch(() => reject());
        });
    }

    createIntent(botSlug: string, intentObj: Intent) {
        return new Promise((resolve, reject) => {
            this.axiosInstance.post("/bots/" + botSlug + "/intents", intentObj)
                .then((data) => resolve(data.status))
                .catch((data) => {
                    console.error(data.message);
                    reject(data.status);
                });
        });
    }

    createBulkExpressions(botSlug: string, intentSlug: string, expressions) {
        return new Promise((resolve, reject) => {
            this.axiosInstance.post("/bots/" + botSlug + "/intents/" + intentSlug
                + "/expressions/bulk_create", expressions)
                .then((data) => resolve(data.status))
                .catch((data) => {
                    console.error(data.message);
                    reject(data.status);
                });
        });
    }
}