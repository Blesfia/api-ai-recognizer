# Api.ai recognizer for botbuilder

This library allows the use of api.ai on botbuilder through a recognizer just like LuisRecognizer

## Example of use:

### Typescript
```typescript
import { ApiAiRecognizer } from 'api-ai-recognizer';
const bot = new UniversalBot(connector);
const TOKEN_APIAI = 'insert here the token of api ai';
bot.recognizer(new ApiAiRecognizer(TOKEN_APIAI));
```

Then just make the dialogs like LuisRecognizer works
