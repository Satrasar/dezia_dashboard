# n8n Workflow CORS Header Fix

## Problem
Your n8n workflow is sending an invalid HTTP header: `"Access-Control-Allow-Origin "` (with trailing space) instead of `"Access-Control-Allow-Origin"`.

## Solution
In your n8n workflow, find the **"Respond to Webhook"** node and update the response headers configuration:

### Current (Incorrect) Configuration:
```json
{
  "responseHeaders": {
    "entries": [
      {
        "name": "Access-Control-Allow-Origin ",  // ← TRAILING SPACE HERE
        "value": "*"
      },
      {
        "name": "Access-Control-Allow-Methods",
        "value": "GET, POST, OPTIONS"
      },
      {
        "name": "Access-Control-Allow-Headers",
        "value": "Content-Type"
      }
    ]
  }
}
```

### Correct Configuration:
```json
{
  "responseHeaders": {
    "entries": [
      {
        "name": "Access-Control-Allow-Origin",  // ← NO TRAILING SPACE
        "value": "*"
      },
      {
        "name": "Access-Control-Allow-Methods",
        "value": "GET, POST, OPTIONS"
      },
      {
        "name": "Access-Control-Allow-Headers",
        "value": "Content-Type"
      }
    ]
  }
}
```

## Steps to Fix:

1. Open your n8n workflow editor
2. Find the **"Respond to Webhook"** node (currently disabled)
3. Click on the node to edit it
4. Go to the **"Options"** section
5. Find **"Response Headers"**
6. Look for the header name **"Access-Control-Allow-Origin "**
7. Remove the trailing space so it becomes **"Access-Control-Allow-Origin"**
8. Save the workflow
9. Enable the **"Respond to Webhook"** node (set disabled: false)
10. Enable the **"Dashboard Data"** node (set disabled: false)

## Alternative: Complete Header Configuration
If you want to ensure all headers are correct, replace the entire responseHeaders section with:

```json
{
  "responseHeaders": {
    "entries": [
      {
        "name": "Content-Type",
        "value": "application/json"
      },
      {
        "name": "Access-Control-Allow-Origin",
        "value": "*"
      },
      {
        "name": "Access-Control-Allow-Methods",
        "value": "GET, POST, PUT, DELETE, OPTIONS"
      },
      {
        "name": "Access-Control-Allow-Headers",
        "value": "Content-Type, Authorization"
      }
    ]
  }
}
```

After making this change, your React application should be able to successfully fetch data from the n8n webhook.