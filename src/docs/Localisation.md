# Localisation

Want separate templates for different languages?  
Alter medusa-config.js plugin options:

```js
// medusa config including the postmark plugin
events: {
    order: {
        placed: { nl: 1234, en: 1235 },
// rest of the events...
```

The api key and templates are pulled from env variables.  
```
POSTMARK_SERVER_API=""
POSTMARK_FROM=""
POSTMARK_ORDER_PLACED=1234
```

The `POSTMARK_FROM` email address must be a verified sender in your Postmark account.
