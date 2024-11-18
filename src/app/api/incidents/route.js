import { NextResponse } from 'next/server';

export async function GET(request) {
    const apiKey = process.env.PAGERDUTY_API_KEY;

    if (!apiKey) {
        console.error('API key not configured');
        return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    try {
        const { searchParams } = new URL(request.url);

        // Define allowed parameters and their validation rules
        const allowedParams = {
            limit: (value) => !isNaN(value) && value <= 100,
            date_range: (value) => value === 'all',
            'statuses[]': (value) => ['triggered', 'acknowledged', 'resolved'].includes(value),
            'urgencies[]': (value) => ['high', 'low'].includes(value),
        };

        // Build validated parameters
        const validatedParams = new URLSearchParams();

        // Process and validate all other parameters
        for (const [key, value] of searchParams.entries()) {
            if (allowedParams[key] && allowedParams[key](value)) {
                // Handle array parameters properly
                if (key.endsWith('[]')) {
                    validatedParams.append(key, value);
                } else {
                    validatedParams.set(key, value);
                }
            }
        }

        const headers = {
            'Accept': 'application/vnd.pagerduty+json;version=2',
            'Authorization': `Token token=${apiKey}`
        };

        const requestUrl = `https://api.pagerduty.com/incidents?${validatedParams.toString()}`;

        const response = await fetch(requestUrl, { headers });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('PagerDuty API Error Response:', errorData);
            return NextResponse.json({
                error: errorData.error?.message || 'Failed to fetch incidents from PagerDuty',
                status: response.status,
                details: errorData
            }, { status: response.status || 500 });
        }

        const data = await response.json();
        return NextResponse.json(data.incidents);

    } catch (error) {
        console.error('PagerDuty API Error:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch incidents',
                details: error.message
            },
            { status: 500 }
        );
    }
}