'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/browser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Video, Music, FileText, ExternalLink } from 'lucide-react';
import dayjs from 'dayjs';

export default function MediaPage() {
  const [media, setMedia] = useState<any[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    loadMedia();
  }, []);

  useEffect(() => {
    filterMedia();
  }, [media, typeFilter]);

  async function loadMedia() {
    try {
      const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('consent_ok', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMedia(data || []);
    } catch (error) {
      console.error('Error loading media:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterMedia() {
    let filtered = [...media];

    if (typeFilter !== 'all') {
      filtered = filtered.filter(m => m.type === typeFilter);
    }

    setFilteredMedia(filtered);
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'audio':
        return <Music className="h-5 w-5" />;
      case 'document':
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-100 text-blue-800';
      case 'audio':
        return 'bg-green-100 text-green-800';
      case 'document':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0D2B66] mb-4">Media Hub</h1>
          <p className="text-lg text-gray-600">
            Sermons, teachings, worship sessions, and resources
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Media Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="document">Documents</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading media...</div>
        ) : filteredMedia.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No media found matching your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedia.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getTypeColor(item.type)}>
                      <span className="flex items-center gap-1">
                        {getIcon(item.type)}
                        {item.type.toUpperCase()}
                      </span>
                    </Badge>
                    {item.date && (
                      <span className="text-xs text-gray-500">
                        {dayjs(item.date).format('MMM D, YYYY')}
                      </span>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2">{item.title}</CardTitle>
                  {item.speaker && (
                    <CardDescription>Speaker: {item.speaker}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.slice(0, 3).map((tag: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <Button
                    asChild
                    variant="outline"
                    className="w-full"
                  >
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      {item.type === 'video' && 'Watch'}
                      {item.type === 'audio' && 'Listen'}
                      {item.type === 'document' && 'View'}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* YouTube Embed Example */}
        {filteredMedia.some(m => m.type === 'video' && m.url.includes('youtube')) && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#0D2B66] mb-6">Featured Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMedia
                .filter(m => m.type === 'video' && m.url.includes('youtube'))
                .slice(0, 2)
                .map((item) => {
                  const videoId = item.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)?.[1];
                  return videoId ? (
                    <div key={item.id} className="aspect-video">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={item.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded-lg"
                      />
                    </div>
                  ) : null;
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}







