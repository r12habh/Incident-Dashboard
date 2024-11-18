import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Clock, CheckCircle } from 'lucide-react';

// Dashboard metrics display using card layout
const Stats = ({ stats }) => {
    // Grid layout for key metrics with consistent styling
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Metric cards */}

            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-blue-500" />
                        <div>
                            <p className="text-sm font-medium">Total Incidents</p>
                            <p className="text-2xl font-bold">{stats.total}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-yellow-500" />
                        <div>
                            <p className="text-sm font-medium">High Urgency</p>
                            <p className="text-2xl font-bold">{stats.highUrgency}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-red-500" />
                        <div>
                            <p className="text-sm font-medium">P1 Incidents</p>
                            <p className="text-2xl font-bold">{stats.p1Count}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Stats;
