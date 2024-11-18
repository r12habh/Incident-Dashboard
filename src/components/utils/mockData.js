// Configurations for mock data
export const MOCK_DATA_CONFIG = {
    services: [
        { id: "PIJ90N7", summary: "Mail Service" },
        { id: "PIJ90N8", summary: "Database Service" },
        { id: "PIJ90N9", summary: "Authentication Service" },
        { id: "PIJ91N0", summary: "Payment Processing" },
        { id: "PIJ91N1", summary: "API Gateway" }
    ],
    titles: [
        "High CPU Usage Detected",
        "Memory Leak in Production",
        "Database Connection Timeout",
        "API Response Latency Spike",
        "SSL Certificate Expiring",
        "Disk Space Critical",
        "Network Connectivity Issues",
        "Cache Service Unresponsive",
        "Load Balancer Failed",
        "Authentication Service Down"
    ],
    teams: [
        { id: "PQ9K7I8", summary: "Engineering" },
        { id: "PQ9K7I9", summary: "DevOps" },
        { id: "PQ9K7J0", summary: "Infrastructure" }
    ],
    priorities: [
        { id: "P53ZZH5", summary: "P1" },
        { id: "P53ZZH6", summary: "P2" },
        { id: "P53ZZH7", summary: "P3" }
    ]
};

// Helper function to get a random element from an array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Helper function to generate a random date within the last 180 days
const generateRandomDate = () => {
    const maxDays = 180;
    const randomDays = Math.floor(Math.random() * maxDays);
    return new Date(Date.now() - (randomDays * 24 * 3600000));
};

// Generate mock incidents
export const generateMockIncidents = () => {
    const { services, titles, teams, priorities } = MOCK_DATA_CONFIG;

    return Array.from({ length: 40 }, (_, index) => {
        const date = generateRandomDate(); // Get a random creation date
        const status = getRandomElement(['triggered', 'acknowledged', 'resolved']); // Random status
        const service = getRandomElement(services); // Random service
        const priority = getRandomElement(priorities); // Random priority
        const team = getRandomElement(teams); // Random team

        return {
            id: `PT${Math.random().toString(36).substr(2, 6).toUpperCase()}`, // Unique ID
            type: "incident",
            summary: `[#${1000 + index}] ${getRandomElement(titles)}`, // Random title with an index
            self: `https://api.pagerduty.com/incidents/PT${Math.random().toString(36).substr(2, 6)}`, // Self URL
            html_url: `https://subdomain.pagerduty.com/incidents/PT${Math.random().toString(36).substr(2, 6)}`, // HTML URL
            incident_number: 1000 + index, // Incremental incident number
            title: getRandomElement(titles), // Random title
            created_at: date.toISOString(), // Created date
            updated_at: new Date(date.getTime() + 3600000).toISOString(), // Updated date (1 hour later)
            status,
            service,
            teams: [team], // Assign the team
            priority,
            urgency: Math.random() > 0.5 ? "high" : "low", // Random urgency
            alert_counts: {
                all: Math.floor(Math.random() * 5) + 1, // Random total alerts
                triggered: 0, // Triggered alerts set to 0
                resolved: Math.floor(Math.random() * 3) // Random resolved alerts
            }
        };
    });
};
