// Helper function to get status-related colors
const getColorForStatus = (status, colors) => {
    const statusLower = status?.toLowerCase();
    return colors[statusLower] || colors.default;
};

// Get status color based on incident status
export const getStatusColor = (status) => {
    const statusColors = {
        'triggered': 'bg-red-500 hover:bg-red-600',
        'acknowledged': 'bg-yellow-500 hover:bg-yellow-600',
        'resolved': 'bg-green-500 hover:bg-green-600',
        default: 'bg-gray-500 hover:bg-gray-600'
    };
    return getColorForStatus(status, statusColors);
};

// Get urgency color based on incident urgency
export const getUrgencyColor = (urgency) => {
    const urgencyColors = {
        'high': 'bg-red-500 hover:bg-red-600',
        'low': 'bg-blue-500 hover:bg-blue-600',
        default: 'bg-gray-500 hover:bg-gray-600'
    };
    return getColorForStatus(urgency, urgencyColors);
};

// Get service summary from incident or return a default message
export const getServiceSummary = (incident) => incident.service?.summary || 'Unknown Service';

// Helper function to check if incident matches the date range filter
const matchesDateRange = (incident, dateRange) => {
    const incidentDate = new Date(incident.created_at);
    const now = new Date();
    const dayInMs = 24 * 60 * 60 * 1000;

    switch (dateRange) {
        case 'past_day': return now - incidentDate <= dayInMs;
        case 'past_week': return now - incidentDate <= 7 * dayInMs;
        case 'past_month': return now - incidentDate <= 30 * dayInMs;
        default: return true;
    }
};

// Filter incidents based on search term, service, status, urgency, and date range
export const filterIncidents = (incidents, filters, searchTerm, selectedService) => {
    return incidents.filter(incident => {
        const serviceSummary = getServiceSummary(incident);

        // Check if incident matches all filters
        const matchesSearch = !searchTerm || 
            incident.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            serviceSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
            incident.status?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesService = selectedService === 'all' || serviceSummary === selectedService;
        const matchesStatus = !filters.status?.length || filters.status.includes(incident.status);
        const matchesUrgency = !filters.urgency?.length || filters.urgency.includes(incident.urgency);
        const matchesDateRangeFilter = filters.dateRange === 'all' || matchesDateRange(incident, filters.dateRange);

        return matchesSearch && matchesService && matchesStatus && matchesUrgency && matchesDateRangeFilter;
    });
};

// Helper function to compare incident fields during sorting
const compareIncidents = (a, b, field) => {
    let comparison = 0;

    switch (field) {
        case 'created_at':
            comparison = new Date(a.created_at) - new Date(b.created_at);
            break;
        case 'incident_number':
            comparison = (a.incident_number || 0) - (b.incident_number || 0);
            break;
        case 'urgency':
            comparison = (a.urgency || '').localeCompare(b.urgency || '');
            break;
        default:
            comparison = 0;
    }

    return comparison;
};

// Sort incidents based on a field and direction
export const sortIncidents = (incidents, sortBy) => {
    const [field, direction] = sortBy.split(':');

    return [...incidents].sort((a, b) => {
        const comparison = compareIncidents(a, b, field);
        return direction === 'desc' ? -comparison : comparison;
    });
};
