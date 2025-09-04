# Postmark API Routes

This plugin provides API routes to proxy Postmark requests, allowing you to interact with Postmark's API through your Medusa server instead of making direct calls from the browser.

## Available Routes

### Templates

#### GET `/admin/postmark/templates`
Fetch all templates from Postmark.

**Query Parameters:**
- `count` (optional): Number of templates to fetch (default: 100)
- `offset` (optional): Number of templates to skip (default: 0)
- `templateType` (optional): Filter by template type (Standard, Layout)

**Example:**
```javascript
const response = await fetch('/admin/postmark/templates?count=50&templateType=Standard')
const data = await response.json()
```

#### POST `/admin/postmark/templates`
Create a new template in Postmark.

**Request Body:**
```json
{
  "Name": "Template Name",
  "Alias": "template-alias",
  "Subject": "Email Subject",
  "HtmlBody": "<html>...</html>",
  "TextBody": "Plain text version",
  "TemplateType": "Standard",
  "LayoutTemplate": "layout-alias"
}
```

#### GET `/admin/postmark/templates/[id]`
Get a specific template by ID.

#### PUT `/admin/postmark/templates/[id]`
Update an existing template.

#### DELETE `/admin/postmark/templates/[id]`
Delete a template.

### Layouts

#### GET `/admin/postmark/layouts`
Fetch all layout templates from Postmark.

**Query Parameters:**
- `count` (optional): Number of layouts to fetch (default: 100)
- `offset` (optional): Number of layouts to skip (default: 0)

### Email Sending

#### POST `/admin/postmark/send`
Send an email through Postmark.

**Request Body (Simple Email):**
```json
{
  "To": "recipient@example.com",
  "From": "sender@example.com",
  "Subject": "Email Subject",
  "HtmlBody": "<html>...</html>",
  "TextBody": "Plain text version"
}
```

**Request Body (Templated Email):**
```json
{
  "To": "recipient@example.com",
  "From": "sender@example.com",
  "TemplateId": 12345,
  "TemplateModel": {
    "name": "John Doe",
    "order_id": "12345"
  }
}
```

### Status

#### GET `/admin/postmark/status`
Check the connection status to Postmark and get server information.

## Configuration

The API routes use the following environment variables:

- `POSTMARK_SERVER_TOKEN` or `POSTMARK_SERVER_API`: Your Postmark server token
- `POSTMARK_FROM`: Default sender email address

## Error Handling

All routes return appropriate HTTP status codes and error messages:

- `400`: Bad Request (missing required fields, invalid data)
- `401`: Unauthorized (invalid server token)
- `404`: Not Found (template not found)
- `422`: Unprocessable Entity (invalid email data)
- `500`: Internal Server Error (server-side errors)

Error responses include a descriptive message:

```json
{
  "error": "Error type",
  "message": "Detailed error description"
}
```

## Security

- API keys are never exposed to the client
- All requests are validated server-side
- Proper error handling prevents information leakage
- CORS is handled by Medusa's built-in middleware

## Usage in Admin Interface

The admin interface uses the Medusa JS SDK to make authenticated requests to these proxy routes instead of making direct calls to Postmark's API. This ensures:

1. **Security**: API keys remain server-side
2. **Reliability**: Consistent error handling with proper authentication
3. **Performance**: Cached responses where appropriate
4. **Compliance**: No CORS issues with Postmark's API
5. **Authentication**: Automatic session-based authentication via the SDK

### SDK Configuration

The admin interface uses a configured Medusa client located at `src/admin/lib/sdk.ts`:

```typescript
import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: __BACKEND_URL__ || "/",
  auth: {
    type: "session",
  },
})
```

This configuration ensures that all API calls are properly authenticated and routed through the Medusa backend.
