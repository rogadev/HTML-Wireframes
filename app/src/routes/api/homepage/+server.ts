import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import homepageData from '$lib/data/homepage.json';
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

  // 1. Filter hot offers by region and language
  personalizedData.hotOffers = personalizedData.hotOffers.filter(offer => {
    if (region !== 'all' && offer.regions && !offer.regions.includes(region)) {
      return false;
    }

    if (offer.languages && !offer.languages.includes(language)) {
      return false;
    }

    // Filter based on team type (e.g., some incentives for home team only)
    if (offer.teamTypes && !offer.teamTypes.includes(teamType)) {
      return false;
    }

    return true;
  });

  // 2. Filter technical bulletins by role and region
  personalizedData.technicalBulletins = personalizedData.technicalBulletins.filter(bulletin => {
    if (bulletin.roles && !bulletin.roles.includes(role)) {
      return false;
    }

    if (region !== 'all' && bulletin.regions && !bulletin.regions.includes(region)) {
      return false;
    }

    return true;
  });

  // 3. Customize billing updates based on role and region
  personalizedData.billingUpdates = personalizedData.billingUpdates.filter(update => {
    if (region !== 'all' && update.regions && !update.regions.includes(region)) {
      return false;
    }

    // Filter by skill designations if applicable
    if (skillDesignations.length > 0 && update.skillDesignations) {
      // Check if any of the user's skills match the update's skills
      const hasMatchingSkill = update.skillDesignations.some(skill =>
        skillDesignations.includes(skill) || skill === 'all'
      );

      if (!hasMatchingSkill) {
        return false;
      }
    }

    return true;
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

  // Add more personalized content handling as needed

  return json(personalizedData);
}; 
