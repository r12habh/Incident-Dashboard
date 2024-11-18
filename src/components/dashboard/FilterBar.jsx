import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from 'lucide-react';

const FILTER_OPTIONS = {
  status: [
    { value: 'all', label: 'All' },
    { value: 'triggered', label: 'Triggered' },
    { value: 'acknowledged', label: 'Acknowledged' },
    { value: 'resolved', label: 'Resolved' }
  ],
  urgency: [
    { value: 'all', label: 'All' },
    { value: 'high', label: 'High' },
    { value: 'low', label: 'Low' }
  ],
  dateRange: [
    { value: 'past_month', label: 'Past Month' },
    { value: 'past_week', label: 'Past Week' },
    { value: 'past_day', label: 'Past 24 Hours' },
    { value: 'all', label: 'All Time' }
  ],
  sortBy: [
    { value: 'created_at:desc', label: 'Newest First' },
    { value: 'created_at:asc', label: 'Oldest First' },
    { value: 'incident_number:desc', label: 'Incident Number (High to Low)' },
    { value: 'incident_number:asc', label: 'Incident Number (Low to High)' },
    { value: 'urgency:asc', label: 'Urgency (High to Low)' },
    { value: 'urgency:desc', label: 'Urgency (Low to High)' }
  ]
};

const FilterSelect = ({ label, value, onChange, options, placeholder }) => (
  <div>
    <label className="text-sm font-medium mb-2 block">{label}</label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ value, label }) => (
          <SelectItem key={value} value={value}>{label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

const FilterBar = ({ filters, setFilters, selectedService, setSelectedService, services = [] }) => {
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value === 'all' ? [] : [value]
    }));
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <FilterSelect
            label="Service"
            value={selectedService}
            onChange={setSelectedService}
            options={services.map(service => ({
              value: service,
              label: service === 'all' ? 'All Services' : service
            }))}
            placeholder="Select service"
          />
          
          <FilterSelect
            label="Status"
            value={filters.status?.length ? filters.status[0] : 'all'}
            onChange={value => handleFilterChange('status', value)}
            options={FILTER_OPTIONS.status}
            placeholder="Select status"
          />
          
          <FilterSelect
            label="Urgency"
            value={filters.urgency?.length ? filters.urgency[0] : 'all'}
            onChange={value => handleFilterChange('urgency', value)}
            options={FILTER_OPTIONS.urgency}
            placeholder="Select urgency"
          />
          
          <FilterSelect
            label="Date Range"
            value={filters.dateRange}
            onChange={value => setFilters(prev => ({ ...prev, dateRange: value }))}
            options={FILTER_OPTIONS.dateRange}
            placeholder="Select date range"
          />
          
          <FilterSelect
            label="Sort By"
            value={filters.sortBy}
            onChange={value => setFilters(prev => ({ ...prev, sortBy: value }))}
            options={FILTER_OPTIONS.sortBy}
            placeholder="Select sort order"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterBar;
