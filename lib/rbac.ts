/**
 * Role-Based Access Control (RBAC) utilities
 * Defines permissions and role checks
 */

export type UserRole = 'ADMIN' | 'SECRETARIAT' | 'REGIONAL_LEADER' | 'CAMPUS_LEADER' | 'EDITOR';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  region: string | null;
  university_id: string | null;
  phone: string | null;
  created_at: string;
}

/**
 * Check if a user has permission to approve reports
 */
export function canApproveReports(profile: Profile, reportRegion?: string): boolean {
  if (profile.role === 'ADMIN' || profile.role === 'SECRETARIAT') {
    return true;
  }
  
  if (profile.role === 'REGIONAL_LEADER' && reportRegion) {
    return profile.region === reportRegion;
  }
  
  return false;
}

/**
 * Check if a user can edit a report
 */
export function canEditReport(
  profile: Profile,
  reporterId: string,
  reportStatus: string
): boolean {
  // Owner can edit if status is draft or rejected
  if (profile.id === reporterId && ['draft', 'rejected'].includes(reportStatus)) {
    return true;
  }
  
  // Admins and secretariat can always edit
  if (profile.role === 'ADMIN' || profile.role === 'SECRETARIAT') {
    return true;
  }
  
  return false;
}

/**
 * Check if a user can manage media
 */
export function canManageMedia(profile: Profile): boolean {
  return profile.role === 'ADMIN' || profile.role === 'EDITOR';
}

/**
 * Check if a user can manage events
 */
export function canManageEvents(profile: Profile): boolean {
  return ['ADMIN', 'SECRETARIAT', 'REGIONAL_LEADER', 'CAMPUS_LEADER'].includes(profile.role);
}

/**
 * Check if a user can view all reports
 */
export function canViewAllReports(profile: Profile): boolean {
  return profile.role === 'ADMIN' || profile.role === 'SECRETARIAT';
}

/**
 * Check if a user can view regional reports
 */
export function canViewRegionalReports(profile: Profile, reportRegion: string): boolean {
  if (canViewAllReports(profile)) {
    return true;
  }
  
  if (profile.role === 'REGIONAL_LEADER') {
    return profile.region === reportRegion;
  }
  
  return false;
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    ADMIN: 'Administrator',
    SECRETARIAT: 'Secretariat',
    REGIONAL_LEADER: 'Regional Leader',
    CAMPUS_LEADER: 'Campus Leader',
    EDITOR: 'Media Editor',
  };
  
  return roleNames[role] || role;
}

/**
 * Get available roles for assignment (admins only)
 */
export function getAssignableRoles(): UserRole[] {
  return ['ADMIN', 'SECRETARIAT', 'REGIONAL_LEADER', 'CAMPUS_LEADER', 'EDITOR'];
}




