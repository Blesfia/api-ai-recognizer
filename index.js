"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const botbuilder_1 = require("botbuilder");
const ApiAi = require("apiai");
class ApiAiRecognizer extends botbuilder_1.IntentRecognizer {
    constructor(secretToken) {
        super();
        this.secretToken = secretToken;
        this.app = ApiAi(secretToken);
    }
    makeRequest(text, sessionId) {
        return new Promise((resolve, reject) => {
            const request = this.app.textRequest(text, {
                sessionId: sessionId
            });
            request.on('response', function (response) {
                // console.log(response);
                resolve(response);
            });
            request.on('error', function (error) {
                console.log(error);
                reject(error);
            });
            request.end();
        });
    }
    /** Implements the actual recognition logic. */
    onRecognize(context, callback) {
        const result = { score: 0.0, intent: null, entities: [] };
        if (context && context.message && context.message.text) {
            const utterance = context.message.text;
            this.makeRequest(utterance, '1').then((data) => {
                result.intent = data.result.metadata.intentName;
                console.log(data.result.parameters);
                // tslint:disable-next-line:forin
                for (const parameter in data.result.parameters) {
                    result.entities.push({ type: parameter, entity: data.result.parameters[parameter] });
                }
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
    static recognize(utterance, modelUrl, callback) {
        console.log('recognize', utterance, modelUrl);
        /*try {
            var uri = url.parse(modelUrl, true);
            uri.query['q'] = utterance || '';
            if (uri.search) {
                delete uri.search;
            }
            request.get(url.format(uri), function (err, res, body) {
                var result;
                try {
                    if (res && res.statusCode === 200) {
                        result = JSON.parse(body);
                        result.intents = result.intents || [];
                        result.entities = result.entities || [];
                        result.compositeEntities = result.compositeEntities || [];
                        if (result.topScoringIntent && result.intents.length == 0) {
                            result.intents.push(result.topScoringIntent);
                        }
                        if (result.intents.length == 1 && typeof result.intents[0].score !== 'number') {
                            result.intents[0].score = 1.0;
                        }
                    }
                    else {
                        err = new Error(body);
                    }
                }
                catch (e) {
                    err = e;
                }
                try {
                    if (!err) {
                        callback(null, result.intents, result.entities, result.compositeEntities);
                    }
                    else {
                        var m = err.toString();
                        callback(err instanceof Error ? err : new Error(m));
                    }
                }
                catch (e) {
                    console.error(e.toString());
                }
            });
        }
        catch (err) {
            callback(err instanceof Error ? err : new Error(err.toString()));
        }*/
    }
}
exports.ApiAiRecognizer = ApiAiRecognizer;
