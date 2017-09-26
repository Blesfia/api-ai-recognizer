"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApiAi = require("apiai");
const botbuilder_1 = require("botbuilder");
class ApiAiRecognizer extends botbuilder_1.IntentRecognizer {
    constructor(secretToken) {
        super();
        this.secretToken = secretToken;
        this.app = ApiAi(secretToken);
    }
    static recognize(utterance, modelUrl, secretToken, callback) {
        const request = ApiAi(secretToken).textRequest(utterance, {
            sessionId: '-1',
        });
        request.on('response', (response) => {
            const result = { score: 0.0, intents: [], entities: [], data: response };
            result.intents.push(response.result.metadata.intentName);
            result.entities = ApiAiRecognizer.convertEntities(response.result.parameters);
            callback(null, result.intents, result.entities);
        });
        request.on('error', (error) => {
            callback(error, null);
        });
        request.end();
    }
    static convertEntities(entities) {
        const result = [];
        // tslint:disable-next-line:forin
        for (const parameter in entities) {
            result.push({ type: parameter, entity: entities[parameter] });
        }
        return result;
    }
    /** Implements the actual recognition logic. */
    onRecognize(context, callback) {
        const result = { score: 0.0, intent: null, entities: [], data: {} };
        if (context && context.message && context.message.text) {
            const utterance = context.message.text;
            this.makeRequest(utterance, `${context.message.address.user.id}|${context.message.address.channelId}`)
                .then((data) => {
                result.intent = data.result.metadata.intentName;
                result.data = data;
                result.entities = ApiAiRecognizer.convertEntities(data.result.parameters);
                result.score = data.result.score;
                callback(null, result);
            }).catch((error) => {
                callback(error, null);
            });
        }
        else {
            callback(null, result);
        }
    }
    makeRequest(text, sessionId) {
        return new Promise((resolve, reject) => {
            const request = this.app.textRequest(text, {
                sessionId,
            });
            // Request OK
            request.on('response', (response) => {
                resolve(response);
            });
            // Request ERROR
            request.on('error', (error) => {
                reject(error);
            });
            request.end();
        });
    }
}
exports.ApiAiRecognizer = ApiAiRecognizer;
