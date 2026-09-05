# Architecture Document

## 1. Technology Stack
- **Frontend:** React (Vite), Tailwind CSS, Lucide React (Icons), Socket.io-client, i18next.
- **Backend:** Node.js, Express.js, Socket.io, JWT for Auth.
- **Database:** MongoDB (Mongoose ODM).
- **Cloud/External Services:** Firebase (Storage/Auth), Payment Gateways (to be confirmed).

## 2. Folder Structure
### Client (`/client`)
- `src/app`: Core application setup and routing.
- `src/components`: Reusable UI components (layout, shared).
- `src/context`: React Context providers for global state (Auth, Cart, Chat, Notifications).
- `src/features`: Domain-specific logic and components (Auth, Cart, Products, etc.).
- `src/pages`: Top-level page components.
- `src/utils`: Helper functions and utilities.

### Server (`/server`)
- `controllers`: Logic for handling API requests.
- `models`: Mongoose schemas for data persistence.
- `routes`: API endpoint definitions.
- `middleware`: Custom Express middlewares (Auth, Roles).
- `sockets`: Socket.io event handlers for real-time features.
- `utils`: Server-side utility functions.

## 3. Application Flow
1. **Frontend Request:** React components trigger API calls or socket events.
2. **Middleware:** Backend verifies JWT and user roles.
3. **Controller:** Processes logic, interacts with MongoDB models.
4. **Response:** Backend sends data back to frontend.
5. **Real-time:** Socket.io handles bidirectional communication for chat and notifications.
