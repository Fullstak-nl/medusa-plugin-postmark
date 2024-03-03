# Events

Events can be specified statically, as they are in the above example, or they can be specified dynamically using an `async` function.

For example, if you have an entity tracking email templates created in Postmark, you may use something like this:

```js
// get-event-mappings.js
export async function getEventMappings() {
  const emailTemplateRepo = getRepository(EmailTemplate);
  const templates = await emailTemplateRepo.find();

  const mappings = {};
  for (const template of templates) {
    if (template.event) {
      mappings[template.event] = template.id;
    }
  }

  return mappings;
}
```

```js
import { getEventMappings } from './get-event-mappings';

{
  // ...
  events: getEventMappings,
}
```
