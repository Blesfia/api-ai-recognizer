import * as ApiAi from 'apiai';
import { IEntity, IIntent, IIntentRecognizerResult, IntentRecognizer, IRecognizeContext } from 'botbuilder';

export class ApiAiRecognizer extends IntentRecognizer {

  public static recognize(utterance: string, modelUrl: string, secretToken,
                          callback: (err: Error, intents?: IIntent[], entities?: IEntity[]) => void) {
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
  private static convertEntities(entities) {
    const result = [];
    // tslint:disable-next-line:forin
    for (const parameter in entities) {
      result.push({ type: parameter, entity: entities[parameter] } as IEntity);
    }
    return result;
  }

  private app;
  constructor(private secretToken: string) {
    super();
    this.app = ApiAi(secretToken);
  }

  /** Implements the actual recognition logic. */
  public onRecognize(context: IRecognizeContext, callback: (err: Error, result: IIntentRecognizerResult) => void) {
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
    } else {
      callback(null, result);
    }
  }

  private makeRequest(text, sessionId): Promise<any> {
    return new Promise<any>((resolve, reject) => {
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
