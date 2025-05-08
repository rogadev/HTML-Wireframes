import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import homepageData from '$lib/data/enhanced-homepage.json';
import type { Region, Language, Role, TeamType, AudienceGroup, SkillDesignation } from '$lib/types/userPreferences';

export const GET: RequestHandler = async ({ url }) => {
  // Extract preferences from URL parameters
  const region = url.searchParams.get('region') as Region || 'all';
  const language = url.searchParams.get('language') as Language || 'en';
  const role = url.searchParams.get('role') as Role || 'technician';
  const teamType = url.searchParams.get('teamType') as TeamType || 'home';
  const audienceGroup = url.searchParams.get('audienceGroup') as AudienceGroup || 'tech';

  // Get multiple skill designations from URL
  const skillDesignationsParam = url.searchParams.get('skillDesignations');
  const skillDesignations: SkillDesignation[] = skillDesignationsParam
    ? skillDesignationsParam.split(',') as SkillDesignation[]
    : [];

  // Create a deep copy of the homepage data
  const personalizedData = JSON.parse(JSON.stringify(homepageData));

  // Filter and personalize content

  // 1. Filter hot offers by region, language, and team type
  personalizedData.hotOffers = personalizedData.hotOffers.filter(offer => {
    // Filter by region
    if (region !== 'all' && offer.eligibleRegions &&
      !offer.eligibleRegions.includes(region) &&
      !offer.eligibleRegions.includes('all')) {
      return false;
    }

    // Filter by language
    if (offer.languages && !offer.languages.includes(language)) {
      return false;
    }

    // Filter by team type
    if (offer.eligibleTeamTypes &&
      !offer.eligibleTeamTypes.includes(teamType) &&
      !offer.eligibleTeamTypes.includes('all')) {
      return false;
    }

    return true;
  });

  // Sort offers by priority (lower number = higher priority)
  personalizedData.hotOffers.sort((a, b) =>
    (a.priority || Number.MAX_SAFE_INTEGER) - (b.priority || Number.MAX_SAFE_INTEGER)
  );

  // 2. Filter technical bulletins by role, region, and severity
  personalizedData.technicalBulletins = personalizedData.technicalBulletins.filter(bulletin => {
    // Filter by role
    if (bulletin.impactedRoles &&
      !bulletin.impactedRoles.includes(role) &&
      !bulletin.impactedRoles.includes('all')) {
      return false;
    }

    // Filter by region
    if (region !== 'all' && bulletin.impactedRegions &&
      !bulletin.impactedRegions.includes(region) &&
      !bulletin.impactedRegions.includes('all')) {
      return false;
    }

    // Filter by skill designations if applicable
    if (skillDesignations.length > 0 && bulletin.impactedSkills) {
      // Check if any of the user's skills match the bulletin's skills
      const hasMatchingSkill = bulletin.impactedSkills.some(skill =>
        skillDesignations.includes(skill as SkillDesignation) || skill === 'all'
      );

      if (!hasMatchingSkill) {
        return false;
      }
    }

    // Filter by language
    if (bulletin.languages && !bulletin.languages.includes(language)) {
      return false;
    }

    return true;
  });

  // Sort bulletins by priority and severity (critical first)
  personalizedData.technicalBulletins.sort((a, b) => {
    // Sort by priority first
    const priorityDiff = (a.priority || Number.MAX_SAFE_INTEGER) - (b.priority || Number.MAX_SAFE_INTEGER);
    if (priorityDiff !== 0) return priorityDiff;

    // If same priority, sort critical ones first
    if (a.severity === 'critical' && b.severity !== 'critical') return -1;
    if (a.severity !== 'critical' && b.severity === 'critical') return 1;

    // Then sort by date (newest first)
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // 3. Customize billing updates based on role, region, and skills
  personalizedData.billingUpdates = personalizedData.billingUpdates.filter(update => {
    // Filter by region
    if (region !== 'all' && update.impactedRegions &&
      !update.impactedRegions.includes(region) &&
      !update.impactedRegions.includes('all')) {
      return false;
    }

    // Filter by skill designations if applicable
    if (skillDesignations.length > 0 && update.impactedSkills) {
      // Check if any of the user's skills match the update's skills
      const hasMatchingSkill = update.impactedSkills.some(skill =>
        skillDesignations.includes(skill as SkillDesignation) || skill === 'all'
      );

      if (!hasMatchingSkill) {
        return false;
      }
    }

    // Filter by language
    if (update.languages && !update.languages.includes(language)) {
      return false;
    }

    return true;
  });

  // Sort billing updates by priority and effective date
  personalizedData.billingUpdates.sort((a, b) => {
    // Sort by priority first
    const priorityDiff = (a.priority || Number.MAX_SAFE_INTEGER) - (b.priority || Number.MAX_SAFE_INTEGER);
    if (priorityDiff !== 0) return priorityDiff;

    // Then by effective date (soonest first)
    return new Date(a.effectiveDate || a.date).getTime() - new Date(b.effectiveDate || b.date).getTime();
  });

  // 4. Personalize feed items based on user preferences
  personalizedData.personalizedFeed = personalizedData.personalizedFeed.filter(item => {
    // Ensure language match
    if (item.languages && !item.languages.includes(language)) {
      return false;
    }

    // Ensure role relevance
    if (item.roles && !item.roles.includes(role)) {
      return false;
    }

    // Filter by region if not 'all'
    if (region !== 'all' && item.regions && !item.regions.includes(region)) {
      return false;
    }

    // Filter by audience group
    if (item.audienceGroups && !item.audienceGroups.includes(audienceGroup)) {
      return false;
    }

    // Filter by skill designations if applicable
    if (skillDesignations.length > 0 && item.skillDesignations) {
      const hasMatchingSkill = item.skillDesignations.some(skill =>
        skillDesignations.includes(skill) || skill === 'all'
      );

      if (!hasMatchingSkill) {
        return false;
      }
    }

    return true;
  });

  // Add debug information to help with testing and validation
  const debugInfo = {
    appliedFilters: {
      region,
      language,
      role,
      teamType,
      audienceGroup,
      skillDesignations,
    },
    resultCounts: {
      hotOffers: personalizedData.hotOffers.length,
      technicalBulletins: personalizedData.technicalBulletins.length,
      billingUpdates: personalizedData.billingUpdates.length,
      personalizedFeed: personalizedData.personalizedFeed.length
    }
  };

  return json({
    ...personalizedData,
    debug: debugInfo
  });
}; 
