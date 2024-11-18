import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from 'lucide-react';

const FilterBar = ({ filters, setFilters, selectedService, setSelectedService, services = [] }) => {
    return (
        // Card wrapper for the filter section
        <Card className="mb-4">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Grid layout for the filter items */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Service filter */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Service</label>
                        <Select
                            value={selectedService}
                            onValueChange={(value) => setSelectedService(value)} // Update selected service
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select service" />
                            </SelectTrigger>
                            <SelectContent>
                                {/* Map over services to create dropdown items */}
                                {services.map(service => (
                                    <SelectItem key={service} value={service}>
                                        {service === 'all' ? 'All Services' : service}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status filter */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Status</label>
                        <Select
                            value={filters.status === null || filters.status.length === 0 ? 'all' : filters.status[0]} // Default to 'all' if no status is selected
                            onValueChange={(value) => setFilters(prev => ({
                                ...prev,
                                status: value === 'all' ? [] : [value] // Set status based on selection
                            }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="triggered">Triggered</SelectItem>
                                <SelectItem value="acknowledged">Acknowledged</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Urgency filter */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Urgency</label>
                        <Select
                            value={filters.urgency === null || filters.urgency.length === 0 ? 'all' : filters.urgency[0]} // Default to 'all' if no urgency is selected
                            onValueChange={(value) => setFilters(prev => ({
                                ...prev,
                                urgency: value === 'all' ? [] : [value] // Set urgency based on selection
                            }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select urgency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date range filter */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Date Range</label>
                        <Select
                            value={filters.dateRange}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))} // Update date range
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select date range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="past_month">Past Month</SelectItem>
                                <SelectItem value="past_week">Past Week</SelectItem>
                                <SelectItem value="past_day">Past 24 Hours</SelectItem>
                                <SelectItem value="all">All Time</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort by filter */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Sort By</label>
                        <Select
                            value={filters.sortBy}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))} // Update sort order
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select sort order" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="created_at:desc">Newest First</SelectItem>
                                <SelectItem value="created_at:asc">Oldest First</SelectItem>
                                <SelectItem value="incident_number:desc">Incident Number (High to Low)</SelectItem>
                                <SelectItem value="incident_number:asc">Incident Number (Low to High)</SelectItem>
                                <SelectItem value="urgency:desc">Urgency (High to Low)</SelectItem>
                                <SelectItem value="urgency:asc">Urgency (Low to High)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default FilterBar;
