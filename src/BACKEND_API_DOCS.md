
# EY Steel Ecosystem Co-Pilot - Backend API Integration Guide

This document explains how to properly connect your backend API to the frontend chat functionality once it's ready.

## Chat Functionality Architecture

The chat system is designed to work with a MongoDB backend that stores:
- Chat sessions
- Messages
- User-specific contexts
- Module-specific contexts

## API Endpoints Required

The frontend expects the following API endpoints:

### Session Management

- `POST /api/v1/chat/sessions`: Create a new chat session
  - Body: `{ module?: string, agent_id?: number, metadata?: object }`
  - Returns: `{ session_id: string, messages: [], module?: string, agent_id?: number, created_at: Date, updated_at: Date }`

- `GET /api/v1/chat/sessions`: Get all user chat sessions
  - Returns: `[{ session_id: string, messages: [], module?: string, agent_id?: number, created_at: Date, updated_at: Date }]`

- `GET /api/v1/chat/sessions/{session_id}`: Get a specific chat session
  - Returns: `{ session_id: string, messages: [], module?: string, agent_id?: number, created_at: Date, updated_at: Date }`

- `DELETE /api/v1/chat/sessions/{session_id}`: Delete a chat session

### Message Handling

- `POST /api/v1/chat/{session_id}/send`: Send a message to a session
  - Body: `{ text: string }`
  - Returns: `{ text: string, isUser: boolean, timestamp: Date }`

- `GET /api/v1/chat/{session_id}/messages`: Get all messages for a session
  - Returns: `[{ text: string, isUser: boolean, timestamp: Date }]`

### Module-Specific Chat

- `GET /api/v1/chat/module/{module_name}`: Get or create a module-specific chat
  - Returns: `{ session_id: string, messages: [], module: string, created_at: Date, updated_at: Date }`

### Agent-Specific Chat

- `GET /api/v1/chat/agents/{agent_id}`: Get or create an agent-specific chat
  - Returns: `{ session_id: string, messages: [], agent_id: number, created_at: Date, updated_at: Date }`

## MongoDB Schema

The MongoDB collections should be structured as follows:

```javascript
// Chat Sessions Collection
{
  _id: String,                // UUID for the session
  user_id: String,            // User ID owning this session
  username: String,           // Username for display purposes
  module: String,             // Optional module context (e.g., "demand-planning")
  agent_id: Number,           // Optional AI agent ID
  messages: [                 // Array of messages in this session
    {
      text: String,           // Message content
      isUser: Boolean,        // True if sent by user, false if by AI
      timestamp: Date         // When the message was sent
    }
  ],
  metadata: Object,           // Additional session metadata
  created_at: Date,           // When the session was created
  updated_at: Date            // When the session was last updated
}
```

## Implementation Notes

1. **Module Contexts**: Ensure module names are normalized (lowercase with hyphens) both in the frontend and backend.

2. **Real-time Updates**: The system uses WebSockets for real-time updates. The backend should emit events when:
   - A new message is sent
   - A session is created or updated

3. **Fallback Mechanism**: The frontend includes a fallback mechanism that uses mock data when the backend is unavailable.

4. **Authentication**: All API requests include an Authorization header with a JWT token.

5. **Error Handling**: The system includes robust error handling and retries for backend connections.

## Connecting Your Backend

Once your backend is ready:

1. Set the correct API URLs in `src/services/apiConfig.ts`
2. Set the WebSocket URL in the environment (VITE_WS_URL)
3. Enable the backend connection in `src/context/ChatContext.tsx` by removing the mock-related code

## Testing Your Connection

You can test your backend connection by:

1. Using the Network tab in browser dev tools to verify API calls
2. Checking the console for WebSocket connections
3. Verifying that chat messages are properly stored and retrieved

## Troubleshooting

If you encounter issues:

1. Check that your backend is properly parsing and responding to the API requests
2. Verify that your WebSocket server is configured correctly
3. Make sure your MongoDB schema matches the expected format
