import { NextResponse } from 'next/server';

export async function GET(request) {
    const apiKey = process.env.PAGERDUTY_API_KEY;
    console.log(process);
    console.log(process.env);
    console.log(process.env.PAGERDUTY_API_KEY);

    if (!apiKey) {
        // Log the missing API key for debugging purposes
        console.error('API key not configured');
        return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    try {
        const { searchParams } = new URL(request.url);

        // Set up base parameters for the PagerDuty request
        const baseParams = {
            total: 'true',
            'include[]': ['services', 'teams', 'priorities']
        };

        // Create the search params object and append custom query parameters
        const params = new URLSearchParams(baseParams);
        searchParams.forEach((value, key) => {
            if (value) {
                params.append(key, value);
            }
        });

        // Ensure that a date range is set if none of the 'since', 'until', or 'date_range' are present
        if (!searchParams.has('since') && !searchParams.has('until') && !searchParams.has('date_range')) {
            params.append('date_range', 'all');
        }

        // Set the request headers with authorization token
        const headers = {
            'Accept': 'application/vnd.pagerduty+json;version=2',
            'Content-Type': 'application/json',
            'Authorization': `Token token=${apiKey}`
        };

        // Build the request URL for the PagerDuty API
        const requestUrl = `https://api.pagerduty.com/incidents?${params.toString()}`;
        console.log('Request URL:', requestUrl); // Optional: Log for debugging

        // Fetch incidents from the PagerDuty API
        const response = await fetch(requestUrl, { headers });

        // Handle non-OK responses from the API
        if (!response.ok) {
            const errorData = await response.json();
            const errorMessage = errorData.error?.message || 'Failed to fetch incidents from PagerDuty';
            throw new Error(errorMessage);
        }

        // Parse and return the data from PagerDuty
        const data = await response.json();
        return NextResponse.json(data.incidents, {
            headers: {
                'Cache-Control': 'no-store, must-revalidate',
                'Expires': '0',
            },
        });

    } catch (error) {
        // Log error details for debugging
        console.error('PagerDuty API Error:', error);

        // Return a 500 response with the error message
        return NextResponse.json(
            { error: error.message || 'Failed to fetch incidents' },
            { status: 500 }
        );
    }
}
