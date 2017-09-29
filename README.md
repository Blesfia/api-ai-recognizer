# Api.ai recognizer for botbuilder

This library allows the use of api.ai on botbuilder through a recognizer just like LuisRecognizer

## Example of use:

### Typescript
```typescript
import { ApiAiRecognizer } from 'apiai-recognizer-botbuilder';
const bot = new UniversalBot(connector);
const TOKEN_APIAI = 'insert here the token of api ai';
bot.recognizer(new ApiAiRecognizer(TOKEN_APIAI, 'en'));
```

Then just make the dialogs like LuisRecognizer works
