'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FileUpload from './FileUpload';
import { supabase } from '@/lib/supabase/browser';
import { toast } from 'sonner';
import dayjs from 'dayjs';

// Zod schema for report validation
export const reportSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Invalid month format'),
  region: z.string().min(2, 'Region is required'),
  university_id: z.string().uuid('Please select a university'),
  meetings_count: z.coerce.number().int().nonnegative('Must be 0 or greater'),
  hours_invested: z.coerce.number().nonnegative('Must be 0 or greater'),
  uploads_youtube: z.coerce.number().int().nonnegative().default(0),
  uploads_instagram: z.coerce.number().int().nonnegative().default(0),
  uploads_tiktok: z.coerce.number().int().nonnegative().default(0),
  uploads_facebook: z.coerce.number().int().nonnegative().default(0),
  uploads_other: z.coerce.number().int().nonnegative().default(0),
  universities_reached: z.coerce.number().int().nonnegative('Must be 0 or greater'),
  tracts_given: z.coerce.number().int().nonnegative('Must be 0 or greater'),
  souls_saved: z.coerce.number().int().nonnegative('Must be 0 or greater'),
  integrations_count: z.coerce.number().int().nonnegative('Must be 0 or greater'),
  literature_money: z.coerce.number().nonnegative('Must be 0 or greater'),
  literature_count: z.coerce.number().int().nonnegative('Must be 0 or greater'),
  prayer_hours_friday: z.coerce.number().int().nonnegative().default(0),
  prayer_hours_literature: z.coerce.number().int().nonnegative().default(0),
  prayer_hours_media: z.coerce.number().int().nonnegative().default(0),
  prayer_hours_intercession: z.coerce.number().int().nonnegative().default(0),
  prayer_hours_worship: z.coerce.number().int().nonnegative().default(0),
  prayer_hours_evangelism: z.coerce.number().int().nonnegative().default(0),
  remarks: z.string().optional(),
});

export type ReportInput = z.infer<typeof reportSchema>;

interface ReportFormProps {
  initialData?: any;
  universities: Array<{ id: string; name: string; region: string }>;
  regions: string[];
  onSuccess?: () => void;
}

export default function ReportForm({ initialData, universities, regions, onSuccess }: ReportFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(initialData?.region || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ReportInput>({
    resolver: zodResolver(reportSchema),
    defaultValues: initialData || {
      month: dayjs().format('YYYY-MM'),
      meetings_count: 0,
      hours_invested: 0,
      uploads_youtube: 0,
      uploads_instagram: 0,
      uploads_tiktok: 0,
      uploads_facebook: 0,
      uploads_other: 0,
      universities_reached: 0,
      tracts_given: 0,
      souls_saved: 0,
      integrations_count: 0,
      literature_money: 0,
      literature_count: 0,
      prayer_hours_friday: 0,
      prayer_hours_literature: 0,
      prayer_hours_media: 0,
      prayer_hours_intercession: 0,
      prayer_hours_worship: 0,
      prayer_hours_evangelism: 0,
    },
  });

  const filteredUniversities = selectedRegion
    ? universities.filter(u => u.region === selectedRegion)
    : universities;

  const onSubmit = async (data: ReportInput, status: 'draft' | 'submitted') => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Upload files to storage
      let attachments: any[] = [];
      if (files.length > 0) {
        const uploadPromises = files.map(async (file) => {
          const fileName = `${user.id}/${Date.now()}_${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('report-attachments')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          return {
            name: file.name,
            path: fileName,
            size: file.size,
            contentType: file.type,
          };
        });

        attachments = await Promise.all(uploadPromises);
      }

      // Prepare report data
      const reportData = {
        month: data.month,
        reporter_id: user.id,
        region: data.region,
        university_id: data.university_id,
        meetings_count: data.meetings_count,
        hours_invested: data.hours_invested,
        uploads_by_platform: {
          youtube: data.uploads_youtube,
          instagram: data.uploads_instagram,
          tiktok: data.uploads_tiktok,
          facebook: data.uploads_facebook,
          other: data.uploads_other,
        },
        universities_reached: data.universities_reached,
        tracts_given: data.tracts_given,
        souls_saved: data.souls_saved,
        integrations_count: data.integrations_count,
        literature_money: data.literature_money,
        literature_count: data.literature_count,
        prayer_hours_friday: data.prayer_hours_friday || 0,
        prayer_hours_literature: data.prayer_hours_literature || 0,
        prayer_hours_media: data.prayer_hours_media || 0,
        prayer_hours_intercession: data.prayer_hours_intercession || 0,
        prayer_hours_worship: data.prayer_hours_worship || 0,
        prayer_hours_evangelism: data.prayer_hours_evangelism || 0,
        remarks: data.remarks,
        attachments,
        status,
        updated_at: new Date().toISOString(),
      };

      let result;
      if (initialData?.id) {
        // Update existing report
        result = await supabase
          .from('monthly_reports')
          .update(reportData)
          .eq('id', initialData.id);
      } else {
        // Create new report
        result = await supabase
          .from('monthly_reports')
          .insert(reportData);
      }

      if (result.error) throw result.error;

      // Log audit trail
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: initialData?.id ? 'update' : 'create',
        entity: 'monthly_report',
        entity_id: initialData?.id || null,
        diff: reportData,
      });

      toast.success(
        status === 'draft' 
          ? 'Report saved as draft' 
          : 'Report submitted successfully'
      );

      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error saving report:', error);
      toast.error(error.message || 'Failed to save report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Month, region, and campus details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="month">Month *</Label>
              <Input
                id="month"
                type="month"
                {...register('month')}
                className="mt-1"
              />
              {errors.month && (
                <p className="text-sm text-red-600 mt-1">{errors.month.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="region">Region *</Label>
              <Select
                value={watch('region')}
                onValueChange={(value) => {
                  setValue('region', value);
                  setSelectedRegion(value);
                  setValue('university_id', ''); // Reset university when region changes
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.region && (
                <p className="text-sm text-red-600 mt-1">{errors.region.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="university_id">University/Campus *</Label>
              <Select
                value={watch('university_id')}
                onValueChange={(value) => setValue('university_id', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select university" />
                </SelectTrigger>
                <SelectContent>
                  {filteredUniversities.map((uni) => (
                    <SelectItem key={uni.id} value={uni.id}>
                      {uni.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.university_id && (
                <p className="text-sm text-red-600 mt-1">{errors.university_id.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activities & Engagement</CardTitle>
          <CardDescription>Meetings, hours, and outreach activities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="meetings_count">Number of Meetings *</Label>
              <Input
                id="meetings_count"
                type="number"
                min="0"
                {...register('meetings_count')}
                className="mt-1"
              />
              {errors.meetings_count && (
                <p className="text-sm text-red-600 mt-1">{errors.meetings_count.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="hours_invested">Hours Invested *</Label>
              <Input
                id="hours_invested"
                type="number"
                min="0"
                step="0.5"
                {...register('hours_invested')}
                className="mt-1"
              />
              {errors.hours_invested && (
                <p className="text-sm text-red-600 mt-1">{errors.hours_invested.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="universities_reached">Universities Reached *</Label>
              <Input
                id="universities_reached"
                type="number"
                min="0"
                {...register('universities_reached')}
                className="mt-1"
              />
              {errors.universities_reached && (
                <p className="text-sm text-red-600 mt-1">{errors.universities_reached.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="tracts_given">Tracts Given *</Label>
              <Input
                id="tracts_given"
                type="number"
                min="0"
                {...register('tracts_given')}
                className="mt-1"
              />
              {errors.tracts_given && (
                <p className="text-sm text-red-600 mt-1">{errors.tracts_given.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="souls_saved">Souls Saved *</Label>
              <Input
                id="souls_saved"
                type="number"
                min="0"
                {...register('souls_saved')}
                className="mt-1"
              />
              {errors.souls_saved && (
                <p className="text-sm text-red-600 mt-1">{errors.souls_saved.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="integrations_count">Integrations *</Label>
              <Input
                id="integrations_count"
                type="number"
                min="0"
                {...register('integrations_count')}
                className="mt-1"
              />
              {errors.integrations_count && (
                <p className="text-sm text-red-600 mt-1">{errors.integrations_count.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prayer Hours by Group</CardTitle>
          <CardDescription>Track hours invested in different prayer groups</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="prayer_hours_friday">Friday Prayer</Label>
              <Input
                id="prayer_hours_friday"
                type="number"
                min="0"
                {...register('prayer_hours_friday')}
                className="mt-1"
                placeholder="Hours"
              />
              {errors.prayer_hours_friday && (
                <p className="text-sm text-red-600 mt-1">{errors.prayer_hours_friday.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="prayer_hours_literature">Literature Group Prayer</Label>
              <Input
                id="prayer_hours_literature"
                type="number"
                min="0"
                {...register('prayer_hours_literature')}
                className="mt-1"
                placeholder="Hours"
              />
              {errors.prayer_hours_literature && (
                <p className="text-sm text-red-600 mt-1">{errors.prayer_hours_literature.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="prayer_hours_media">Media Team Prayer</Label>
              <Input
                id="prayer_hours_media"
                type="number"
                min="0"
                {...register('prayer_hours_media')}
                className="mt-1"
                placeholder="Hours"
              />
              {errors.prayer_hours_media && (
                <p className="text-sm text-red-600 mt-1">{errors.prayer_hours_media.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="prayer_hours_intercession">Intercession Prayer</Label>
              <Input
                id="prayer_hours_intercession"
                type="number"
                min="0"
                {...register('prayer_hours_intercession')}
                className="mt-1"
                placeholder="Hours"
              />
              {errors.prayer_hours_intercession && (
                <p className="text-sm text-red-600 mt-1">{errors.prayer_hours_intercession.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="prayer_hours_worship">Worship Prayer</Label>
              <Input
                id="prayer_hours_worship"
                type="number"
                min="0"
                {...register('prayer_hours_worship')}
                className="mt-1"
                placeholder="Hours"
              />
              {errors.prayer_hours_worship && (
                <p className="text-sm text-red-600 mt-1">{errors.prayer_hours_worship.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="prayer_hours_evangelism">Evangelism Prayer</Label>
              <Input
                id="prayer_hours_evangelism"
                type="number"
                min="0"
                {...register('prayer_hours_evangelism')}
                className="mt-1"
                placeholder="Hours"
              />
              {errors.prayer_hours_evangelism && (
                <p className="text-sm text-red-600 mt-1">{errors.prayer_hours_evangelism.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Media Uploads</CardTitle>
          <CardDescription>Content uploaded to various platforms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="uploads_youtube">YouTube</Label>
              <Input
                id="uploads_youtube"
                type="number"
                min="0"
                {...register('uploads_youtube')}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="uploads_instagram">Instagram</Label>
              <Input
                id="uploads_instagram"
                type="number"
                min="0"
                {...register('uploads_instagram')}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="uploads_tiktok">TikTok</Label>
              <Input
                id="uploads_tiktok"
                type="number"
                min="0"
                {...register('uploads_tiktok')}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="uploads_facebook">Facebook</Label>
              <Input
                id="uploads_facebook"
                type="number"
                min="0"
                {...register('uploads_facebook')}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="uploads_other">Other Platforms</Label>
              <Input
                id="uploads_other"
                type="number"
                min="0"
                {...register('uploads_other')}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Literature Distribution</CardTitle>
          <CardDescription>Books, materials, and financial information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="literature_count">Literature Count *</Label>
              <Input
                id="literature_count"
                type="number"
                min="0"
                {...register('literature_count')}
                className="mt-1"
              />
              {errors.literature_count && (
                <p className="text-sm text-red-600 mt-1">{errors.literature_count.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="literature_money">Literature Money (FRw) *</Label>
              <Input
                id="literature_money"
                type="number"
                min="0"
                step="1"
                {...register('literature_money')}
                className="mt-1"
                placeholder="Amount in Rwandan Francs"
              />
              {errors.literature_money && (
                <p className="text-sm text-red-600 mt-1">{errors.literature_money.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>Remarks and attachments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="remarks">Remarks (Optional)</Label>
            <Textarea
              id="remarks"
              {...register('remarks')}
              className="mt-1"
              rows={4}
              placeholder="Any additional comments or notes..."
            />
          </div>

          <div>
            <Label>Attachments (Optional)</Label>
            <p className="text-sm text-gray-500 mb-2">
              Upload supporting documents, photos, or other files (max 10MB each)
            </p>
            <FileUpload
              value={files}
              onChange={setFiles}
              maxFiles={5}
              maxSize={10}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleSubmit((data) => onSubmit(data, 'draft'))}
          disabled={isSubmitting}
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          onClick={handleSubmit((data) => onSubmit(data, 'submitted'))}
          disabled={isSubmitting}
          className="bg-[#0D2B66] hover:bg-[#0D2B66]/90"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </Button>
      </div>
    </form>
  );
}

