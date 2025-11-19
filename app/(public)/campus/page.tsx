'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/browser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Search, Users } from 'lucide-react';
import CampusMap from '@/components/CampusMap';

export default function CampusPage() {
  const [universities, setUniversities] = useState<any[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [regionFilter, setRegionFilter] = useState<string>('all');

  useEffect(() => {
    loadUniversities();
  }, []);

  useEffect(() => {
    filterUniversities();
  }, [universities, searchQuery, regionFilter]);

  async function loadUniversities() {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setUniversities(data || []);
    } catch (error) {
      console.error('Error loading universities:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterUniversities() {
    let filtered = [...universities];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        u =>
          u.name.toLowerCase().includes(query) ||
          u.city?.toLowerCase().includes(query) ||
          u.region.toLowerCase().includes(query)
      );
    }

    // Region filter
    if (regionFilter !== 'all') {
      filtered = filtered.filter(u => u.region === regionFilter);
    }

    setFilteredUniversities(filtered);
  }

  const regions = Array.from(new Set(universities.map(u => u.region)));
  const groupedByRegion = filteredUniversities.reduce((acc, uni) => {
    if (!acc[uni.region]) acc[uni.region] = [];
    acc[uni.region].push(uni);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0D2B66] mb-4">Campus Map</h1>
          <p className="text-lg text-gray-600">
            Find CYSMF fellowship on campuses across Rwanda
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search universities, cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {regions.map(region => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Interactive Map - Moved to Top */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Interactive Campus Map - Rwanda
              </CardTitle>
              <p className="text-sm text-gray-600">
                Explore CYSMF campuses across Rwanda. Click on markers for more details.
              </p>
            </CardHeader>
            <CardContent>
              <CampusMap universities={filteredUniversities} />
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-[#0D2B66] mb-2">
                {universities.length}
              </div>
              <p className="text-gray-600">Total Campuses</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-[#FFB703] mb-2">
                {regions.length}
              </div>
              <p className="text-gray-600">Regions Covered</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-[#0D2B66] mb-2">
                {Array.from(new Set(universities.map(u => u.city).filter(Boolean))).length}
              </div>
              <p className="text-gray-600">Cities Reached</p>
            </CardContent>
          </Card>
        </div>

        {/* Universities List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading campuses...</div>
        ) : filteredUniversities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No campuses found matching your search.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedByRegion).map(([region, unis]: [string, any[]]) => (
              <div key={region}>
                <h2 className="text-2xl font-bold text-[#0D2B66] mb-4 flex items-center gap-2">
                  <MapPin className="h-6 w-6" />
                  {region}
                  <span className="text-sm font-normal text-gray-500">
                    ({unis.length} {unis.length === 1 ? 'campus' : 'campuses'})
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {unis.map((uni) => (
                    <Card key={uni.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg line-clamp-2">{uni.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-gray-600">
                          {uni.city && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{uni.city}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>Active Fellowship</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

