# Templates

Templates are managed through the Postmark integration and are used to render the content of abandoned cart and other notification emails. The plugin provides CRUD operations for templates and supports validation to ensure all required variables are provided.

## Features
- **List Templates**: Fetch all templates from Postmark.
- **Create Template**: Add a new template to Postmark.
- **Update Template**: Modify an existing template.
- **Delete Template**: Remove a template from Postmark.
- **Layout Templates**: Support for layout templates in Postmark.
- **Validation**: Check that all required variables are present in the template model before sending.

## Template Association
Each reminder schedule is linked to a specific template by `template_id`. Templates can be standard or layout types, and are validated before use in workflows.