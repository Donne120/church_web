'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Users, HandHeart, GraduationCap, Heart } from 'lucide-react';

const joinSchema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone number is required'),
  university: z.string().min(2, 'University is required'),
  message: z.string().optional(),
});

const serveSchema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone number is required'),
  skills: z.string().min(10, 'Please describe your skills'),
  availability: z.string().min(5, 'Please describe your availability'),
});

const mentorshipSchema = z.object({
  full_name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone number is required'),
  type: z.enum(['seeking', 'offering']),
  areas: z.string().min(10, 'Please describe areas of interest'),
  message: z.string().optional(),
});

const prayerSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  request: z.string().min(10, 'Please describe your prayer request'),
  anonymous: z.boolean().default(false),
});

export default function GetInvolvedPage() {
  const [activeTab, setActiveTab] = useState('join');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(type: string, data: any) {
    setSubmitting(true);
    try {
      const { error } = await supabase.from('submissions').insert({
        type,
        payload: data,
        status: 'pending',
      });

      if (error) throw error;

      toast.success('Thank you! We\'ll be in touch soon.');
      // Reset form would go here
    } catch (error: any) {
      console.error('Error submitting:', error);
      toast.error(error.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0D2B66] mb-4">Get Involved</h1>
          <p className="text-lg text-gray-600">
            Join us in making a difference on campuses across the nation
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
            <TabsTrigger value="join" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Join</span>
            </TabsTrigger>
            <TabsTrigger value="serve" className="flex items-center gap-2">
              <HandHeart className="h-4 w-4" />
              <span className="hidden sm:inline">Serve</span>
            </TabsTrigger>
            <TabsTrigger value="mentorship" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Mentorship</span>
            </TabsTrigger>
            <TabsTrigger value="prayer" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Prayer</span>
            </TabsTrigger>
          </TabsList>

          {/* Join Tab */}
          <TabsContent value="join">
            <Card>
              <CardHeader>
                <CardTitle>Join CYSMF</CardTitle>
                <CardDescription>
                  Become part of our fellowship and connect with other believers on your campus
                </CardDescription>
              </CardHeader>
              <CardContent>
                <JoinForm onSubmit={(data) => handleSubmit('join', data)} submitting={submitting} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Serve Tab */}
          <TabsContent value="serve">
            <Card>
              <CardHeader>
                <CardTitle>Serve with Us</CardTitle>
                <CardDescription>
                  Use your gifts and talents to support the ministry
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ServeForm onSubmit={(data) => handleSubmit('serve', data)} submitting={submitting} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mentorship Tab */}
          <TabsContent value="mentorship">
            <Card>
              <CardHeader>
                <CardTitle>Mentorship Program</CardTitle>
                <CardDescription>
                  Seek mentorship or offer to mentor others in their faith journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MentorshipForm onSubmit={(data) => handleSubmit('mentorship', data)} submitting={submitting} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Prayer Tab */}
          <TabsContent value="prayer">
            <Card>
              <CardHeader>
                <CardTitle>Prayer Requests</CardTitle>
                <CardDescription>
                  Share your prayer needs with our community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PrayerForm onSubmit={(data) => handleSubmit('prayer', data)} submitting={submitting} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function JoinForm({ onSubmit, submitting }: any) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(joinSchema),
  });

  const submitHandler = async (data: any) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div>
        <Label htmlFor="full_name">Full Name *</Label>
        <Input id="full_name" {...register('full_name')} className="mt-1" />
        {errors.full_name && <p className="text-sm text-red-600 mt-1">{errors.full_name.message as string}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register('email')} className="mt-1" />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message as string}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input id="phone" {...register('phone')} className="mt-1" />
          {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message as string}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="university">University/Campus *</Label>
        <Input id="university" {...register('university')} className="mt-1" />
        {errors.university && <p className="text-sm text-red-600 mt-1">{errors.university.message as string}</p>}
      </div>

      <div>
        <Label htmlFor="message">Message (Optional)</Label>
        <Textarea id="message" {...register('message')} className="mt-1" rows={4} />
      </div>

      <Button type="submit" disabled={submitting} className="w-full bg-[#0D2B66] hover:bg-[#0D2B66]/90">
        {submitting ? 'Submitting...' : 'Submit Application'}
      </Button>
    </form>
  );
}

function ServeForm({ onSubmit, submitting }: any) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(serveSchema),
  });

  const submitHandler = async (data: any) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div>
        <Label htmlFor="full_name">Full Name *</Label>
        <Input id="full_name" {...register('full_name')} className="mt-1" />
        {errors.full_name && <p className="text-sm text-red-600 mt-1">{errors.full_name.message as string}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register('email')} className="mt-1" />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message as string}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input id="phone" {...register('phone')} className="mt-1" />
          {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message as string}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="skills">Skills & Experience *</Label>
        <Textarea id="skills" {...register('skills')} className="mt-1" rows={4} 
          placeholder="Describe your skills, experience, and how you'd like to serve..." />
        {errors.skills && <p className="text-sm text-red-600 mt-1">{errors.skills.message as string}</p>}
      </div>

      <div>
        <Label htmlFor="availability">Availability *</Label>
        <Textarea id="availability" {...register('availability')} className="mt-1" rows={3} 
          placeholder="When are you available to serve?" />
        {errors.availability && <p className="text-sm text-red-600 mt-1">{errors.availability.message as string}</p>}
      </div>

      <Button type="submit" disabled={submitting} className="w-full bg-[#0D2B66] hover:bg-[#0D2B66]/90">
        {submitting ? 'Submitting...' : 'Submit Application'}
      </Button>
    </form>
  );
}

function MentorshipForm({ onSubmit, submitting }: any) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(mentorshipSchema),
  });

  const submitHandler = async (data: any) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div>
        <Label htmlFor="full_name">Full Name *</Label>
        <Input id="full_name" {...register('full_name')} className="mt-1" />
        {errors.full_name && <p className="text-sm text-red-600 mt-1">{errors.full_name.message as string}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register('email')} className="mt-1" />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message as string}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Phone *</Label>
          <Input id="phone" {...register('phone')} className="mt-1" />
          {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message as string}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="type">I am *</Label>
        <select id="type" {...register('type')} className="w-full mt-1 px-3 py-2 border rounded-md">
          <option value="seeking">Seeking a mentor</option>
          <option value="offering">Offering to mentor</option>
        </select>
        {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type.message as string}</p>}
      </div>

      <div>
        <Label htmlFor="areas">Areas of Interest/Expertise *</Label>
        <Textarea id="areas" {...register('areas')} className="mt-1" rows={4} 
          placeholder="What areas would you like help with or can help others with?" />
        {errors.areas && <p className="text-sm text-red-600 mt-1">{errors.areas.message as string}</p>}
      </div>

      <div>
        <Label htmlFor="message">Additional Information (Optional)</Label>
        <Textarea id="message" {...register('message')} className="mt-1" rows={3} />
      </div>

      <Button type="submit" disabled={submitting} className="w-full bg-[#0D2B66] hover:bg-[#0D2B66]/90">
        {submitting ? 'Submitting...' : 'Submit Request'}
      </Button>
    </form>
  );
}

function PrayerForm({ onSubmit, submitting }: any) {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: zodResolver(prayerSchema),
  });

  const anonymous = watch('anonymous');

  const submitHandler = async (data: any) => {
    await onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div className="flex items-center space-x-2">
        <input type="checkbox" id="anonymous" {...register('anonymous')} className="rounded" />
        <Label htmlFor="anonymous" className="cursor-pointer">Submit anonymously</Label>
      </div>

      {!anonymous && (
        <>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} className="mt-1" />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} className="mt-1" />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message as string}</p>}
          </div>
        </>
      )}

      <div>
        <Label htmlFor="request">Prayer Request *</Label>
        <Textarea id="request" {...register('request')} className="mt-1" rows={6} 
          placeholder="Share your prayer request..." />
        {errors.request && <p className="text-sm text-red-600 mt-1">{errors.request.message as string}</p>}
      </div>

      <Button type="submit" disabled={submitting} className="w-full bg-[#0D2B66] hover:bg-[#0D2B66]/90">
        {submitting ? 'Submitting...' : 'Submit Prayer Request'}
      </Button>
    </form>
  );
}




