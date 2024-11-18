import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Visualization component using Recharts
const IncidentChart = ({ chartData }) => {
    // Responsive container ensures chart fits parent dimensions
    return (
        <Card>
            <CardHeader>
                <CardTitle>Incident Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        {/* Bar chart configuration */}
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="incidents" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default IncidentChart;
