import { IntentRecognizer, IRecognizeContext, IIntentRecognizerResult, IIntent, IEntity } from 'botbuilder';
import * as ApiAi from 'apiai';

export class ApiAiRecognizer extends IntentRecognizer {

    private app;
    constructor(private secretToken: string) {
        super();
        this.app = ApiAi(secretToken);
    }

    private makeRequest(text, sessionId): Promise<any> {
        return new Promise( (resolve, reject) => {
            const request = this.app.textRequest(text, {
                sessionId: sessionId
            });
            request.on('response', function(response) {
                // console.log(response);
                resolve(response);
            });
            request.on('error', function(error) {
                console.error(error);
                reject(error);
            });
            request.end();
        });
    }
    /** Implements the actual recognition logic. */
    onRecognize(context: IRecognizeContext, callback: (err: Error, result: IIntentRecognizerResult) => void): void {
        const result = { score: 0.0, intent: null, entities: [] };
        if (context && context.message && context.message.text) {
            const utterance = context.message.text;
            this.makeRequest(utterance, context.message.address.user.id + '|' + context.message.address.channelId).then( (data) => {
                result.intent = data.result.metadata.intentName;
                console.log(data.result.parameters);
                // tslint:disable-next-line:forin
                for (const parameter in data.result.parameters) {
                    result.entities.push({type: parameter, entity:  data.result.parameters[parameter] } as IEntity);
                }
                result.score = data.result.score;
                callback(null, result);
            }).catch((error) => {
                callback(error, null);
            });
        } else {
            callback(null, result);
        }
    }

    static recognize(utterance: string, modelUrl: string, secretToken, callback: (err: Error, intents?: IIntent[], entities?: IEntity[]) => void) {
        const request = ApiAi(secretToken).textRequest(utterance, {
            sessionId: '-1'
        });
        request.on('response', function(response) {
            const result = { score: 0.0, intents: [], entities: [] };
            result.intents.push(response.result.metadata.intentName);
            // tslint:disable-next-line:forin
            for (const parameter in response.result.parameters) {
                result.entities.push({type: parameter, entity:  response.result.parameters[parameter] } as IEntity);
            }
            callback(null, result.intents, result.entities);
        });

        request.on('error', function(error) {
            console.error(error);
            callback(error, null);
        });
        request.end();
    }
}
