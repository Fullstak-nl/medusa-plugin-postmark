# Variables

In the template you can use variables. These are replaced by the plugin with the correct value.  
To use a variable, use the following syntax: `{{ variable_name }}`, for example `{{ order.customer.first_name }}`.  
Order item variables are available inside the `itemLoop` and `itemLoopEnd` elements, for example `{{ item.title }}`.  
If you want to include (simple) if statements, use the following syntax: `{{ if variable_name }}...{{ endif }}`, or as a negative `{{ if not variable_name }}...{{ endif }}`.  
**Possible variables depend on your notification system.**
You can use the `options` object and every template has his own `data` object.   
Depending on the plugin you use, _(almost)_ every plugin **that supports attachments** based on `medusa-plugin-sendgrid` has the same variable `order` after the `options` variable which holds all the plugin variables.  
More information on the possible values that `order` can have can be found [here](https://docs.medusajs.com/add-plugins/sendgrid/#template-reference).

## Variable functions

At the moment the only variable you can use functions with is dates and currency.   
- **Dates** are formatted using the `toLocaleDateString` function and can be used like this: `{{ order.placed_at | date('en-US',{'year': 'numeric', 'month': 'long', 'day': 'numeric'}) }}`.  
- **Currency** is formatted using the `new Intl.NumberFormat()` function and can be used like this: `{{ order.total_price | currency('en-US') }}`.
- **Country** can be formatted from ISO to the full country name and can be used like this: `{{ order.shipping_address.country_code | country }}`.  
**Please make sure that the options are wrapped in single quotes.**
