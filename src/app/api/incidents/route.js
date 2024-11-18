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
            offset: (value) => !isNaN(value),
            total: (value) => value === 'true' || value === 'false',
            date_range: (value) => value === 'all',
            incident_key: () => true,
            'include[]': (value) => [
                'acknowledgers', 'agents', 'assignees', 'conference_bridge',
                'escalation_policies', 'first_trigger_log_entries', 'priorities',
                'services', 'teams', 'users'
            ].includes(value),
            'service_ids[]': () => true,
            since: () => true,
            'sort_by': (value) => {
                const allowedFields = ['incident_number', 'created_at', 'resolved_at', 'urgency'];
                const [field, direction] = value.split(':');
                return allowedFields.includes(field) && (!direction || ['asc', 'desc'].includes(direction));
            },
            'statuses[]': (value) => ['triggered', 'acknowledged', 'resolved'].includes(value),
            'team_ids[]': () => true,
            time_zone: () => true,
            until: () => true,
            'urgencies[]': (value) => ['high', 'low'].includes(value),
            'user_ids[]': () => true
        };

        // Build validated parameters
        const validatedParams = new URLSearchParams();
        
        // Always include these base parameters
        validatedParams.append('total', 'true');
        ['services', 'teams', 'priorities'].forEach(include => {
            validatedParams.append('include[]', include);
        });

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

        // Ensure date range is set if no temporal parameters are present
        if (!searchParams.has('since') && !searchParams.has('until') && !searchParams.has('date_range')) {
            validatedParams.append('date_range', 'all');
        }

        const headers = {
            'Accept': 'application/vnd.pagerduty+json;version=2',
            'Content-Type': 'application/json',
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
        return NextResponse.json(data.incidents, {
            headers: {
                'Cache-Control': 'no-store, must-revalidate',
                'Expires': '0',
            },
        });

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