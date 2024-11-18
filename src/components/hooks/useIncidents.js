import { useState, useEffect } from 'react';
import { generateMockIncidents } from '../utils/mockData';

export const useIncidents = (filters, selectedService) => {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dataSource, setDataSource] = useState('api');  // Tracks whether data is from mock or API

    // Build the API URL with filters
    const buildApiUrl = () => {
        const params = new URLSearchParams();

        // Add common parameters
        params.append('limit', 30);
        params.append('total', 'true');
        params.append('include[]', 'services,teams,priorities');

        // Add filters (status, urgency, date range, sort)
        addFiltersToParams(params, filters);

        return `/api/incidents?${params.toString()}`;
    };

    // Add filters to URL parameters
    const addFiltersToParams = (params, filters) => {
        // Status filter
        filters?.status?.forEach(status => params.append('statuses[]', status));

        // Urgency filter
        filters?.urgency?.forEach(urgency => params.append('urgencies[]', urgency));

        // Date range filter
        if (filters?.dateRange) {
            params.append('date_range', filters.dateRange === 'all' ? 'all' : getDateRange(filters.dateRange));
        }

        // Sort filter
        if (filters?.sortBy) {
            params.append('sort_by', filters.sortBy);
        }
    };

    // Get date range based on selected filter
    const getDateRange = (dateRange) => {
        const now = new Date();
        let since = new Date();

        switch (dateRange) {
            case 'past_month':
                since.setMonth(now.getMonth() - 1);
                break;
            case 'past_week':
                since.setDate(now.getDate() - 7);
                break;
            case 'past_day':
                since.setDate(now.getDate() - 1);
                break;
            default:
                return 'all';
        }

        return { since: since.toISOString(), until: now.toISOString() };
    };

    useEffect(() => {
        // Fetch incidents based on selected filters and data source
        const fetchIncidents = async () => {
            const useMockData = new URLSearchParams(window.location.search).get('mock') === 'true';

            if (useMockData) {
                setMockIncidents();
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(buildApiUrl());

                if (!response.ok) throw new Error('Failed to fetch incidents');

                const fetchedIncidents = await response.json();
                setIncidents(fetchedIncidents);
                setDataSource('api');
            } catch (err) {
                handleFetchError(err);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch data if it's not mock data
        if (dataSource !== 'mock') {
            fetchIncidents();
        }
    }, [filters, dataSource]);  // Re-run on filter or data source change

    // Set mock data when mock mode is enabled
    const setMockIncidents = () => {
        setLoading(true);
        const mockIncidents = generateMockIncidents();
        setIncidents(mockIncidents);
        setDataSource('mock');
        setLoading(false);
    };

    // Handle fetch errors
    const handleFetchError = (err) => {
        console.error('Error fetching incidents:', err);
        setError(err.message);
        setIncidents([]); // No fallback to mock data on error
    };

    return { incidents, loading, error, dataSource };
};
