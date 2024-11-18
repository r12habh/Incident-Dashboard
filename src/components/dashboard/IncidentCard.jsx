import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Link2 } from 'lucide-react';
import { getStatusColor, getUrgencyColor, getServiceSummary } from '../utils/incidentHelpers';

const IncidentCard = ({ incident }) => {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg font-medium">
                            #{incident.incident_number || 'N/A'}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{incident.title || 'No title'}</p>
                    </div>
                    <Badge className={getStatusColor(incident.status)}>
                        {(incident.status?.charAt(0).toUpperCase() + incident.status?.slice(1)) || 'Unknown'}
                    </Badge>
                </div>
            </CardHeader>
            {/* Card content */}
            <CardContent>
                <div className="grid gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {new Date(incident.created_at).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getUrgencyColor(incident.urgency)}>
                            {(incident.urgency || 'UNKNOWN').toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{getServiceSummary(incident)}</Badge>
                        {incident.priority && (
                            <Badge variant="outline">{incident.priority.summary}</Badge>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-600 mt-2">
                        <Link2 className="w-4 h-4" />
                        <a href={incident.html_url} target="_blank" rel="noopener noreferrer">
                            View in PagerDuty
                        </a>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default IncidentCard;
