# WebSocket API Documentation

## Overview

This application uses WebSocket connections for real-time chat functionality. The WebSocket API handles messages between clients and the server for both group and direct messaging.

## Connection

### WebSocket URL
```
ws://localhost:3200?channelId=<any_value>
```

### Authentication
WebSocket connections require JWT authentication via cookies:
- **Cookie Name**: `X-Token`
- **Token Type**: JWT
- **Required**: Yes

### Connection Flow
1. Client includes JWT token in `X-Token` cookie
2. Server validates token and extracts user ID
3. WebSocket connection is established with user data
4. Client is automatically subscribed to:
   - Default group channel
   - Personal user channel (for direct messages)

## Message Types

### Client → Server Messages

All messages from client should be JSON strings with the following structure:

```typescript
interface ClientMessage {
  type: string;
  payload: any;
}
```

#### Available Message Types

1. **GET_GROUP_MESSAGES**
   ```json
   {
     "type": "GET_GROUP_MESSAGES",
     "payload": {
       "groupId": "optional-group-id"
     }
   }
   ```

2. **SEND_GROUP_MESSAGE**
   ```json
   {
     "type": "SEND_GROUP_MESSAGE",
     "payload": {
       "content": "Hello group!",
       "groupId": "optional-group-id"
     }
   }
   ```

3. **GET_DIRECT_MESSAGES**
   ```json
   {
     "type": "GET_DIRECT_MESSAGES",
     "payload": {
       "receiverId": "user-uuid",
       "senderId": "user-uuid"
     }
   }
   ```

4. **SEND_DIRECT_MESSAGE**
   ```json
   {
     "type": "SEND_DIRECT_MESSAGE",
     "payload": {
       "content": "Hello!",
       "receiverId": "user-uuid"
     }
   }
   ```

5. **GET_CONNECTED_USERS**
   ```json
   {
     "type": "GET_CONNECTED_USERS",
     "payload": {}
   }
   ```

### Server → Client Messages

#### Response Types

1. **SEND_GROUP_MESSAGES_RESPONSE**
   ```json
   {
     "type": "SEND_GROUP_MESSAGES_RESPONSE",
     "payload": {
       "groupId": "group-uuid",
       "messages": [
         {
           "id": "message-uuid",
           "content": "Message content",
           "createdAt": 1640995200000,
           "sender": {
             "id": "user-uuid",
             "name": "User Name",
             "email": "user@example.com"
           }
         }
       ]
     }
   }
   ```

2. **SEND_DIRECT_MESSAGES_RESPONSE**
   ```json
   {
     "type": "SEND_DIRECT_MESSAGES_RESPONSE",
     "payload": {
       "receiverId": "user-uuid",
       "messages": [
         {
           "id": "message-uuid",
           "content": "Message content",
           "createdAt": 1640995200000,
           "receiverId": "user-uuid",
           "sender": {
             "id": "user-uuid",
             "name": "User Name",
             "email": "user@example.com"
           }
         }
       ]
     }
   }
   ```

3. **SEND_CONNECTED_USERS_RESPONSE**
   ```json
   {
     "type": "SEND_CONNECTED_USERS_RESPONSE",
     "payload": {
       "users": [
         {
           "id": "user-uuid",
           "name": "User Name",
           "email": "user@example.com"
         }
       ]
     }
   }
   ```

4. **ERROR**
   ```json
   {
     "type": "ERROR",
     "payload": {
       "error": "Error message description"
     }
   }
   ```

## Message Flow Examples

### Group Chat Example

1. **Client joins and automatically receives recent messages:**
   ```
   Server → Client: SEND_GROUP_MESSAGES_RESPONSE (with last 30 messages)
   ```

2. **Client sends group message:**
   ```
   Client → Server: SEND_GROUP_MESSAGE
   Server → Client: SEND_GROUP_MESSAGES_RESPONSE (with new message)
   Server → All Clients: SEND_GROUP_MESSAGES_RESPONSE (broadcast)
   ```

### Direct Message Example

1. **Client requests conversation history:**
   ```
   Client → Server: GET_DIRECT_MESSAGES
   Server → Client: SEND_DIRECT_MESSAGES_RESPONSE
   ```

2. **Client sends direct message:**
   ```
   Client → Server: SEND_DIRECT_MESSAGE
   Server → Client: SEND_DIRECT_MESSAGES_RESPONSE (confirmation)
   Server → Target User: SEND_DIRECT_MESSAGES_RESPONSE (delivery)
   ```

## Error Handling

- All errors are returned with `type: "ERROR"`
- Error messages are human-readable descriptions
- Common errors include:
  - Authentication failures
  - User not found
  - Invalid message format
  - Database errors

## Rate Limiting

- Messages are limited to 30 most recent per conversation
- No explicit rate limiting implemented (consider adding for production)

## Data Types

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}
```

### Message
```typescript
interface Message {
  id: string;
  content: string;
  createdAt: number;
  sender: User;
  groupId?: string;
  receiverId?: string;
}
```

## Testing

Use WebSocket testing tools like:
- WebSocket King Client (browser extension)
- Postman WebSocket testing
- Custom WebSocket client scripts

Example connection:
```javascript
const ws = new WebSocket('ws://localhost:3200?channelId=test');
ws.onopen = () => {
  console.log('Connected');
  ws.send(JSON.stringify({
    type: 'GET_GROUP_MESSAGES',
    payload: {}
  }));
};
ws.onmessage = (event) => {
  console.log('Received:', JSON.parse(event.data));
};
```
