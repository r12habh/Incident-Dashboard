# PagerDuty Incident Dashboard

A React-based dashboard for monitoring and managing PagerDuty incidents. Built with Next.js and modern React practices.

## Features

- Real-time incident monitoring
- Advanced filtering and search capabilities
- Interactive data visualization
- Responsive design for all device sizes
- Mock data support for development and testing

## Key Components

- **IncidentDashboard**: Main dashboard component displaying incident overview
- **FilterBar**: Advanced filtering interface for incidents
- **IncidentCard**: Individual incident display cards
- **IncidentChart**: Data visualization for incident statistics
- **Stats**: Quick overview of key metrics

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Configure environment variables:
   Create a `.env.local` file with:

```env
PAGERDUTY_API_KEY=your_api_key_here

```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Development Modes

### Live API Mode
By default, the dashboard connects to the PagerDuty API. Ensure you have proper API credentials configured.

### Mock Data Mode
For development without API access, append `?mock=true` to the URL:
```
http://localhost:3000?mock=true
```

## Architecture

### Frontend Components
- **IncidentDashboard.jsx**: Main container component
- **FilterBar.jsx**: Handles all filtering logic
- **useIncidents.js**: Custom hook for incident data management
- **incidentHelpers.js**: Utility functions for incident data processing

### Key Features
1. **Incident Management**
   - Real-time incident display
   - Status tracking
   - Urgency levels
   - Service categorization

2. **Filtering Capabilities**
   - Status filters
   - Urgency filters
   - Date range selection
   - Service-based filtering
   - Text search

3. **Data Visualization**
   - Service-based incident distribution
   - Status breakdowns
   - Urgency level statistics

## Error Handling

The application includes comprehensive error handling:
- API connection failures
- Data loading states
- Empty state handling
- Invalid filter combinations


## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [PagerDuty API Reference](https://developer.pagerduty.com/api-reference/)
- [React Documentation](https://reactjs.org/docs)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
