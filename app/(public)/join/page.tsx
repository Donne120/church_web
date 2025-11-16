'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { ArrowLeft, Users, BookOpen, Heart, Video, Music, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const TEAMS = [
  { value: 'Media Team', label: 'Media Team', icon: Video, description: 'Content creation, social media management' },
  { value: 'Literature Group', label: 'Literature Group', icon: BookOpen, description: 'Book distribution, reading programs' },
  { value: 'Evangelism Team', label: 'Evangelism Team', icon: Users, description: 'Campus outreach, sharing the gospel' },
  { value: 'Prayer Team', label: 'Prayer Team', icon: Heart, description: 'Intercession, worship, prayer meetings' },
  { value: 'Worship Team', label: 'Worship Team', icon: Music, description: 'Music ministry, worship leading' },
  { value: 'Admin Team', label: 'Admin Team', icon: TrendingUp, description: 'Organization, coordination, planning' },
];

const PROGRAMS = [
  { value: 'Campus Ministry', label: 'Campus Ministry' },
  { value: 'Friday Prayer Group', label: 'Friday Prayer Group' },
  { value: 'Literature Prayer Group', label: 'Literature Prayer Group' },
  { value: 'Media Prayer Group', label: 'Media Prayer Group' },
  { value: 'Intercession Prayer', label: 'Intercession Prayer' },
  { value: 'Worship Prayer', label: 'Worship Prayer' },
  { value: 'Evangelism Prayer', label: 'Evangelism Prayer' },
  { value: 'Leadership Training', label: 'Leadership Training' },
  { value: 'Discipleship Program', label: 'Discipleship Program' },
];

const REGIONS = ['Kigali', 'Northern Province', 'Southern Province', 'Eastern Province', 'Western Province'];

export default function JoinPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [requestType, setRequestType] = useState<'team' | 'program'>('team');
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    university: '',
    region: '',
    team_name: '',
    program_name: '',
    motivation: '',
    experience: '',
    availability: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user (if logged in)
      const { data: { user } } = await supabase.auth.getUser();

      const requestData = {
        user_id: user?.id || null,
        request_type: requestType,
        team_name: requestType === 'team' ? formData.team_name : null,
        program_name: requestType === 'program' ? formData.program_name : null,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        university: formData.university || null,
        region: formData.region || null,
        motivation: formData.motivation,
        experience: formData.experience || null,
        availability: formData.availability || null,
        status: 'pending',
      };

      const { error } = await supabase
        .from('join_requests')
        .insert([requestData]);

      if (error) throw error;

      toast.success('Request submitted successfully! We\'ll review it and get back to you soon.');
      
      // Redirect to homepage after 2 seconds
      setTimeout(() => {
        router.push('/');
      }, 2000);

    } catch (error: any) {
      console.error('Error submitting request:', error);
      toast.error(error.message || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0D2B66] mb-4">Join Our Ministry</h1>
          <p className="text-lg text-gray-600">
            Be part of something bigger! Join a team or program and make an impact on campuses across Rwanda.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Request Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>What would you like to join?</CardTitle>
              <CardDescription>Choose between joining a ministry team or a program</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={requestType} onValueChange={(value: any) => setRequestType(value)}>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="team" id="team" />
                  <Label htmlFor="team" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Ministry Team</div>
                    <div className="text-sm text-gray-500">Join a specific team (Media, Literature, Evangelism, etc.)</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value="program" id="program" />
                  <Label htmlFor="program" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Ministry Program</div>
                    <div className="text-sm text-gray-500">Join a program (Prayer Group, Leadership Training, etc.)</div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Team/Program Selection */}
          {requestType === 'team' ? (
            <Card>
              <CardHeader>
                <CardTitle>Select a Team</CardTitle>
                <CardDescription>Choose the team you'd like to join</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.team_name} onValueChange={(value) => setFormData({ ...formData, team_name: value })}>
                  {TEAMS.map((team) => {
                    const Icon = team.icon;
                    return (
                      <div key={team.value} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <RadioGroupItem value={team.value} id={team.value} className="mt-1" />
                        <Label htmlFor={team.value} className="flex-1 cursor-pointer">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon className="h-5 w-5 text-[#0D2B66]" />
                            <span className="font-semibold">{team.label}</span>
                          </div>
                          <div className="text-sm text-gray-500">{team.description}</div>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Select a Program</CardTitle>
                <CardDescription>Choose the program you'd like to join</CardDescription>
              </CardHeader>
              <CardContent>
                <Select value={formData.program_name} onValueChange={(value) => setFormData({ ...formData, program_name: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a program" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROGRAMS.map((program) => (
                      <SelectItem key={program.value} value={program.value}>
                        {program.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Tell us about yourself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name *</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+250 XXX XXX XXX"
                />
              </div>

              <div>
                <Label htmlFor="region">Region</Label>
                <Select value={formData.region} onValueChange={(value) => setFormData({ ...formData, region: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your region" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="university">University/Campus</Label>
                <Input
                  id="university"
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  placeholder="e.g., University of Rwanda"
                />
              </div>
            </CardContent>
          </Card>

          {/* Motivation & Details */}
          <Card>
            <CardHeader>
              <CardTitle>Tell Us More</CardTitle>
              <CardDescription>Help us understand your interest</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="motivation">Why do you want to join? *</Label>
                <Textarea
                  id="motivation"
                  value={formData.motivation}
                  onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                  required
                  rows={4}
                  placeholder="Share your motivation and what you hope to contribute..."
                />
              </div>

              <div>
                <Label htmlFor="experience">Relevant Experience (Optional)</Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  rows={3}
                  placeholder="Any previous ministry experience, skills, or training..."
                />
              </div>

              <div>
                <Label htmlFor="availability">Availability (Optional)</Label>
                <Textarea
                  id="availability"
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  rows={2}
                  placeholder="When are you available? (e.g., Weekends, Friday evenings, etc.)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/')}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.full_name || !formData.email || !formData.motivation || 
                (requestType === 'team' && !formData.team_name) || 
                (requestType === 'program' && !formData.program_name)}
              className="flex-1 bg-[#0D2B66] hover:bg-[#0D2B66]/90"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

