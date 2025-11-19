'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Clock, ArrowLeft, Download } from 'lucide-react';
import dayjs from 'dayjs';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, [params.id]);

  async function loadEvent() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error('Error loading event:', error);
    } finally {
      setLoading(false);
    }
  }

  function downloadICS() {
    if (!event) return;

    const startDate = dayjs(event.start_at);
    const endDate = event.end_at ? dayjs(event.end_at) : startDate.add(2, 'hour');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CYSMF//Events//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}@cysmf.org`,
      `DTSTAMP:${dayjs().format('YYYYMMDDTHHmmss')}Z`,
      `DTSTART:${startDate.format('YYYYMMDDTHHmmss')}Z`,
      `DTEND:${endDate.format('YYYYMMDDTHHmmss')}Z`,
      `SUMMARY:${event.title}`,
      event.description ? `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}` : '',
      event.location ? `LOCATION:${event.location}` : '',
      'END:VEVENT',
      'END:VCALENDAR',
    ].filter(Boolean).join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    link.click();
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading event...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event not found</h1>
          <Button asChild>
            <Link href="/events">Back to Events</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/events" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Link>

        <Card>
          <CardContent className="p-8">
            {/* Header */}
            <div className="mb-6">
              {event.category && (
                <Badge variant="secondary" className="mb-4">{event.category}</Badge>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-[#0D2B66] mb-4">
                {event.title}
              </h1>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-gray-600">
                      {dayjs(event.start_at).format('MMMM D, YYYY')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-gray-600">
                      {dayjs(event.start_at).format('h:mm A')}
                      {event.end_at && ` - ${dayjs(event.end_at).format('h:mm A')}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {event.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-600">{event.location}</p>
                    </div>
                  </div>
                )}

                {event.capacity && (
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-gray-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-gray-600">{event.capacity} attendees</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">About This Event</h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={downloadICS}
                className="bg-[#0D2B66] hover:bg-[#0D2B66]/90"
              >
                <Download className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
              <Button asChild variant="outline">
                <Link href="/get-involved">Get Involved</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}







