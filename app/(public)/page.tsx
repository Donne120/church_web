'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import KPICard from '@/components/KPICard';
import { getKPIs } from '@/lib/kpis';
import { formatDualCurrency } from '@/lib/currency';
import { supabase } from '@/lib/supabase/browser';
import { Users, BookOpen, Heart, TrendingUp, Calendar, Video } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import dayjs from 'dayjs';

export default function HomePage() {
  const [kpis, setKpis] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Load all data in parallel for faster loading
        const [kpiData, eventsData, mediaData] = await Promise.all([
          // Load KPIs
          getKPIs().catch(() => null),
          
          // Load upcoming events
          supabase
            .from('events')
            .select('*')
            .gte('start_at', new Date().toISOString())
            .order('start_at', { ascending: true })
            .limit(3)
            .then(({ data }) => data || [])
            .catch(() => []),
          
          // Load latest media
          supabase
            .from('media')
            .select('*')
            .eq('consent_ok', true)
            .order('created_at', { ascending: false })
            .limit(3)
            .then(({ data }) => data || [])
            .catch(() => []),
        ]);

        setKpis(kpiData);
        setEvents(eventsData);
        setMedia(mediaData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0D2B66] to-[#1a4d8f] text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Christian Youth and Students Missionary Fellowship
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Empowering young believers on campuses across Rwanda and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-[#FFB703] text-black hover:bg-[#FFB703]/90">
                <Link href="/join">Join a Team or Program</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Live KPI Counters */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0D2B66] mb-4">Our Impact</h2>
            <p className="text-gray-600">
              Real-time metrics from our approved monthly reports
              {kpis?.month && (
                <span className="block text-sm mt-2">
                  Last updated: {dayjs(kpis.month).format('MMMM YYYY')}
                </span>
              )}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-8 w-16 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Universities Reached"
                value={kpis?.universities_reached || 0}
                icon={Users}
                description="Campuses with active ministry"
              />
              <KPICard
                title="Tracts Given"
                value={kpis?.tracts_given || 0}
                icon={BookOpen}
                description="Gospel literature distributed"
              />
              <KPICard
                title="Souls Saved"
                value={kpis?.souls_saved || 0}
                icon={Heart}
                description="Lives transformed by Christ"
              />
              <KPICard
                title="Integrations"
                value={kpis?.integrations || 0}
                icon={TrendingUp}
                description="New believers integrated"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <KPICard
              title="Meetings Held"
              value={kpis?.meetings || 0}
              icon={Calendar}
              description="Fellowship gatherings"
            />
            <KPICard
              title="Hours Invested"
              value={kpis?.hours_invested ? Math.round(kpis.hours_invested) : 0}
              icon={TrendingUp}
              description="Ministry time commitment"
            />
            <KPICard
              title="Prayer Hours"
              value={kpis?.prayer_hours ? Math.round(kpis.prayer_hours) : 0}
              icon={Heart}
              description="Hours in prayer groups"
            />
            <KPICard
              title="Literature Distributed"
              value={kpis?.literature_count || 0}
              icon={BookOpen}
              description="Books and materials shared"
            />
            <KPICard
              title="Literature Investment"
              value={kpis?.literature_money ? formatDualCurrency(kpis.literature_money) : 'FRw 0'}
              icon={TrendingUp}
              description="Financial commitment"
            />
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#0D2B66] mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              CYSMF exists to reach students on university campuses with the Gospel of Jesus Christ,
              disciple them in their faith, and equip them to be effective witnesses in their spheres
              of influence. We believe in the power of transformed lives to impact nations.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {events.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-[#0D2B66]">Upcoming Events</h2>
              <Button asChild variant="outline">
                <Link href="/events">View All</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4" />
                      {dayjs(event.start_at).format('MMM D, YYYY')}
                    </div>
                    <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-3">
                      {event.description || 'No description available'}
                    </CardDescription>
                    <Button asChild variant="link" className="mt-4 p-0">
                      <Link href={`/events/${event.id}`}>Learn More →</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Media */}
      {media.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-[#0D2B66]">Latest Media</h2>
              <Button asChild variant="outline">
                <Link href="/media">View All</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {media.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Video className="h-4 w-4" />
                      {item.type.toUpperCase()}
                    </div>
                    <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {item.speaker && (
                      <p className="text-sm text-gray-600 mb-2">Speaker: {item.speaker}</p>
                    )}
                    <Button asChild variant="link" className="p-0">
                      <Link href={`/media#${item.id}`}>Watch/Listen →</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-[#0D2B66] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
          <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Be part of a community of passionate young believers making a difference on campuses across the nation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-[#FFB703] text-black hover:bg-[#FFB703]/90">
              <Link href="/get-involved">Get Involved Today</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

