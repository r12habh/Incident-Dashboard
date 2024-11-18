"use client";
import React, { useState, useMemo, useCallback } from 'react';
import { useIncidents } from '../hooks/useIncidents';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, Search, AlertCircle } from 'lucide-react';
import FilterBar from './FilterBar';
import Stats from './Stats';
import IncidentChart from './IncidentChart';
import IncidentCard from './IncidentCard';
import { filterIncidents, sortIncidents, getServiceSummary } from '../utils/incidentHelpers';

// Helper components
const SearchBar = ({ searchTerm, handleSearchChange }) => (
  <div className="relative w-64">
    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
    <Input
      type="text"
      placeholder="Search incidents..."
      value={searchTerm}
      onChange={handleSearchChange}
      className="pl-10"
    />
  </div>
);

const Header = ({ dataSource }) => (
  <div className="flex items-center justify-between mb-6">
    <div>
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Bell className="w-8 h-8" />
        PagerDuty Dashboard
      </h1>
      <Badge className="mt-2">
        {dataSource === 'api' ? 'Live Data' : 'Mock Data'}
      </Badge>
    </div>
    <SearchBar />
  </div>
);

const IncidentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('all');
  const [filters, setFilters] = useState({
    status: [],
    urgency: [],
    dateRange: 'all',
    sortBy: 'created_at:desc'
  });

  // Fetch incidents using the useIncidents hook
  const { incidents: allIncidents, loading, error, dataSource } = useIncidents(filters, selectedService);

  // Memoized filtering, sorting, and other computations
  const filteredAndSortedIncidents = useMemo(() => {
    const filtered = filterIncidents(allIncidents, filters, searchTerm, selectedService);
    return sortIncidents(filtered, filters.sortBy);
  }, [allIncidents, filters, searchTerm, selectedService]);

  const services = useMemo(() => {
    const serviceSet = new Set(allIncidents.map(inc => getServiceSummary(inc)));
    return ['all', ...Array.from(serviceSet)];
  }, [allIncidents]);

  const stats = useMemo(() => ({
    total: filteredAndSortedIncidents.length,
    highUrgency: filteredAndSortedIncidents.filter(inc => inc.urgency === 'high').length,
    p1Count: filteredAndSortedIncidents.filter(inc => inc.priority?.summary === 'P1').length
  }), [filteredAndSortedIncidents]);

  const chartData = useMemo(() => 
    services.map(service => ({
      name: service === 'all' ? 'All Services' : service,
      incidents: filteredAndSortedIncidents.filter(inc =>
        service === 'all' ? true : getServiceSummary(inc) === service
      ).length
    })), [services, filteredAndSortedIncidents]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Header dataSource={dataSource} />
      
      <FilterBar 
        filters={filters}
        setFilters={setFilters}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        services={services}
      />

      <Stats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IncidentChart chartData={chartData} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedIncidents.map(incident => (
          <IncidentCard key={incident.id} incident={incident} />
        ))}
      </div>

      {filteredAndSortedIncidents.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No incidents found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default IncidentDashboard;
