
# EY Steel Ecosystem Co-Pilot

An AI-powered platform for steel operations analytics, providing insights and management tools for various aspects of the steel industry.

## Features

- **Enterprise-Grade Analytics**: Real-time insights into steel manufacturing processes
- **AI-Powered Optimization**: Machine learning algorithms to improve efficiency and reduce costs
- **Predictive Maintenance**: Detect equipment issues before they cause downtime
- **Secure Authentication**: Role-based access control with multi-layer security

## Security Features

- Role-based access control with specific module and agent permissions
- Session timeout and automatic logout for inactive users
- Single-session enforcement (prevents multiple logins with the same account)
- Cross-tab session synchronization
- Persistent user preferences and selections
- Secure token storage and validation
- Access restriction visualizations and clear permission boundaries

## Modules

- Demand Planning
- Supply Planning
- Order Promising
- Factory Planning
- Inventory Optimization
- Risk Management
- and more...

## AI Agents

The platform includes specialized AI agents that provide domain-specific assistance with:
- Supply chain optimization
- Demand forecasting
- Production scheduling
- Risk assessment
- and more...

## Getting Started

### Prerequisites

- Node.js v16 or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies: `npm install` or `yarn install`
3. Start the development server: `npm run dev` or `yarn dev`

### Access Control

The application uses role-based access control to determine which modules and AI agents a user can access. The following roles are available:

- **Admin**: Full access to all modules and agents
- **User**: Access determined by their specific permission sets

Each user is assigned:
- A list of allowed modules (e.g., 'demand-planning', 'supply-planning')
- A list of allowed agent IDs they can interact with

### Authentication

For the demo, the application uses a mock authentication system with predefined users:

- **Admin**: admin@example.com / admin123
- **Regular User**: user@example.com / user123
- **Manager**: manager@example.com / manager123
- **Analyst**: analyst@example.com / analyst123
- **Planner**: planner@example.com / planner123

In a production environment, this would be replaced with a real authentication backend.

## Session Management

The application implements several security measures for session management:

1. **Session Timeout**: Users are automatically logged out after 30 minutes of inactivity
2. **Single Session Enforcement**: Users can only be logged in from one browser/tab at a time
3. **Cross-Tab Synchronization**: Logging out in one tab logs out all tabs
4. **Persistent User Preferences**: User selections are saved between sessions

## Development

### Folder Structure

```
src/
├── components/     # UI components
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── pages/          # Page components
├── services/       # API and service functions
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

### Technologies

- React
- TypeScript
- React Router
- Axios
- TailwindCSS
- shadcn/ui components
- Lucide React icons
- Framer Motion for animations

## Backend Integration

The application is designed to work with a RESTful backend API. In development mode, it uses mock data and services, but these can be replaced with actual API calls when deploying to production.

## License

Proprietary - All Rights Reserved
