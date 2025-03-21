
# Backend Integration Guide for EY Steel Ecosystem Chat

This document outlines how to connect your backend API to the EY Steel Ecosystem chat functionality.

## API Routes

The frontend expects the following API routes to be implemented:

### Chat Sessions

- `GET /api/v1/chat/module/:moduleName` - Get or create a module-specific chat session
- `GET /api/v1/chat/agents/:agentId` - Get or create an agent-specific chat session
- `POST /api/v1/chat/sessions` - Create a new general chat session
- `GET /api/v1/chat/sessions` - Get all chat sessions for the current user
- `GET /api/v1/chat/sessions/:sessionId` - Get a specific chat session
- `POST /api/v1/chat/:sessionId/send` - Send a message to a chat session
- `DELETE /api/v1/chat/sessions/:sessionId` - Delete a chat session

### Expected Response Format

#### Chat Session Response

```json
{
  "session_id": "unique-session-id",
  "messages": [
    {
      "text": "Hello! I'm your EY Steel Ecosystem Co-Pilot. How can I help you with steel operations today?",
      "isUser": false,
      "timestamp": "2025-03-21T10:27:26.839Z"
    }
  ],
  "module": "demand-planning",
  "agent_id": null,
  "created_at": "2025-03-21T10:27:26.839Z",
  "updated_at": "2025-03-21T10:27:26.839Z"
}
```

#### Message Response

```json
{
  "text": "Based on our analysis, here's a summary of your inventory levels...",
  "isUser": false,
  "timestamp": "2025-03-21T10:27:26.839Z"
}
```

## Markdown Support in AI Responses

The chat interface supports Markdown formatting in AI responses, including tables. For example:

```markdown
| Month | Forecasted Demand (tons) | Actual Demand (tons) | Variance (%) |
|-------|-------------------------|---------------------|-------------|
| Jan   | 12,500                  | 11,980              | -4.2%       |
| Feb   | 13,200                  | 13,450              | +1.9%       |
| Mar   | 14,800                  | 14,620              | -1.2%       |
| Apr   | 15,300                  | 15,780              | +3.1%       |

Based on the demand forecasting data, we're seeing generally accurate predictions with minor variances...
```

## WebSocket Integration

For real-time, streaming responses, implement WebSocket connections:

1. The frontend connects to a WebSocket server on initialization
2. Messages are sent and received on module-specific channels:
   - General chat: `chat`
   - Module-specific chat: `chat-{module-name}` (e.g., `chat-demand-planning`)
   - Agent-specific chat: `chat-agent-{agent-id}` (e.g., `chat-agent-123`)

3. Message format for WebSocket:
```json
{
  "text": "User message or AI response",
  "isUser": true/false,
  "sessionId": "session-123456",
  "moduleContext": "demand-planning",
  "agentId": 123,
  "timestamp": "2025-03-21T10:27:26.839Z"
}
```

## Implementation Guide

1. Use the provided mock implementations in `mockChatService.ts` as a reference
2. Implement the API routes described above
3. Connect your AI model to generate responses with tables and text
4. For streaming responses, send the table data first, then stream the summary text

## Error Handling

The frontend includes built-in fallbacks for:
- Network errors (falls back to WebSockets)
- Backend unavailability (uses mock data)
- Missing authentication (prompts for login)

Ensure your backend returns appropriate HTTP status codes and error messages.

## Extending the Chat

To add support for new modules or features:
1. Add any new API routes
2. Update the module tables and summaries in `mockChatService.ts` for testing
3. Implement backend logic for the new features
