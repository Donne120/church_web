'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/browser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Clock, Users, BookOpen, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import dayjs from 'dayjs';

export default function JoinRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Get user session
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }

      // Get user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);

        // Check if user is admin/secretariat
        if (!['ADMIN', 'SECRETARIAT'].includes(profileData.role)) {
          toast.error('You do not have permission to view this page');
          router.push('/portal');
          return;
        }
      }

      // Fetch all join requests
      const { data: requestsData, error } = await supabase
        .from('join_requests')
        .select(`
          *,
          reviewer:profiles!join_requests_reviewed_by_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRequests(requestsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load join requests');
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(requestId: string, status: 'approved' | 'rejected') {
    if (!profile) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('join_requests')
        .update({
          status,
          reviewed_by: profile.id,
          reviewed_at: new Date().toISOString(),
          reviewer_comment: reviewComment || null,
        })
        .eq('id', requestId);

      if (error) throw error;

      toast.success(`Request ${status} successfully`);
      setSelectedRequest(null);
      setReviewComment('');
      loadData();
    } catch (error: any) {
      console.error('Error reviewing request:', error);
      toast.error(error.message || 'Failed to review request');
    } finally {
      setSubmitting(false);
    }
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const reviewedRequests = requests.filter(r => r.status !== 'pending');

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#0D2B66]">Join Requests</h1>
        <p className="text-gray-600 mt-2">Review and manage requests to join teams and programs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold">{pendingRequests.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Approved</p>
                <p className="text-2xl font-bold">{requests.filter(r => r.status === 'approved').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Rejected</p>
                <p className="text-2xl font-bold">{requests.filter(r => r.status === 'rejected').length}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Requests</CardTitle>
            <CardDescription>Requests awaiting review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{request.full_name}</h3>
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {request.email}
                      </div>
                      {request.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {request.phone}
                        </div>
                      )}
                      {request.university && (
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          {request.university}
                        </div>
                      )}
                      {request.region && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {request.region}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {dayjs(request.created_at).format('MMM D, YYYY')}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Wants to join: <span className="text-[#0D2B66]">
                      {request.request_type === 'team' ? request.team_name : request.program_name}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Motivation:</span> {request.motivation}
                  </p>
                  {request.experience && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-semibold">Experience:</span> {request.experience}
                    </p>
                  )}
                  {request.availability && (
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-semibold">Availability:</span> {request.availability}
                    </p>
                  )}
                </div>

                {selectedRequest?.id === request.id ? (
                  <div className="space-y-3 pt-3 border-t">
                    <div>
                      <Label htmlFor="comment">Comment (Optional)</Label>
                      <Textarea
                        id="comment"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Add a comment for the applicant..."
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleReview(request.id, 'approved')}
                        disabled={submitting}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReview(request.id, 'rejected')}
                        disabled={submitting}
                        variant="destructive"
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        onClick={() => {
                          setSelectedRequest(null);
                          setReviewComment('');
                        }}
                        disabled={submitting}
                        variant="outline"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => setSelectedRequest(request)}
                    variant="outline"
                    className="w-full"
                  >
                    Review Request
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Reviewed Requests */}
      {reviewedRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Reviewed Requests</CardTitle>
            <CardDescription>Previously reviewed requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviewedRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 opacity-75">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{request.full_name}</h3>
                    <p className="text-sm text-gray-600">{request.email}</p>
                  </div>
                  <Badge className={
                    request.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }>
                    {request.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {request.request_type === 'team' ? request.team_name : request.program_name}
                </p>
                {request.reviewer_comment && (
                  <p className="text-sm text-gray-500 mt-2 italic">
                    Comment: {request.reviewer_comment}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Reviewed by {request.reviewer?.full_name || 'Unknown'} on {dayjs(request.reviewed_at).format('MMM D, YYYY')}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {requests.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No join requests yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

