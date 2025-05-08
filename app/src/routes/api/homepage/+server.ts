import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import homepageData from '$lib/data/enhanced-homepage.json';
import articlesData from '$lib/data/articles.json';
import type { Region, Language, Role, TeamType, AudienceGroup, SkillDesignation } from '$lib/types/userPreferences';
import type { Article } from '$lib/types/article';

export const GET: RequestHandler = async ({ url }) => {
  try {
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
    const articles = articlesData as Article[];

    // Filter and personalize content
    try {
      // 1. Filter hot offers by region, language, and team type
      if (personalizedData.hotOffers && personalizedData.hotOffers.items) {
        personalizedData.hotOffers.items = personalizedData.hotOffers.items.filter(offer => {
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
        personalizedData.hotOffers.items.sort((a, b) =>
          (a.priority || Number.MAX_SAFE_INTEGER) - (b.priority || Number.MAX_SAFE_INTEGER)
        );
      }
    } catch (error) {
      console.error('Error processing hot offers:', error);
      // Provide empty array if there's an error
      personalizedData.hotOffers = {
        image: personalizedData.hotOffers?.image || "/images/hot-offers.jpg",
        items: []
      };
    }

    // 2. Get technical bulletins from articles.json
    try {
      const technicalBulletins = articles.filter(article => {
        // Match type or category
        const isTypeTechnicalBulletin = article.type && article.type.toLowerCase().includes('technical bulletin');
        const isCategoryTechnicalBulletin = article.category && article.category.toLowerCase().includes('technical');
        const hasTagTechnicalBulletin = article.tags && article.tags.some(tag =>
          tag.toLowerCase().includes('technical') || tag.toLowerCase().includes('bulletin')
        );

        const isBulletin = isTypeTechnicalBulletin || isCategoryTechnicalBulletin || hasTagTechnicalBulletin;

        if (!isBulletin) return false;

        // Filter by role
        if (article.roles && article.roles.length > 0 &&
          !article.roles.includes(role) &&
          !article.roles.includes('all')) {
          return false;
        }

        // Filter by region
        if (region !== 'all' && article.regions &&
          !article.regions.includes(region) &&
          !article.regions.includes('all')) {
          return false;
        }

        // Filter by skill designations if applicable
        if (skillDesignations.length > 0 && article.skillDesignations && article.skillDesignations.length > 0) {
          // Check if any of the user's skills match the bulletin's skills
          const hasMatchingSkill = article.skillDesignations.some(skill =>
            skillDesignations.includes(skill as SkillDesignation) || skill === 'all'
          );

          if (!hasMatchingSkill) {
            return false;
          }
        }

        // Filter by language
        if (article.languages && article.languages.length > 0 && !article.languages.includes(language)) {
          return false;
        }

        return true;
      });

      // Format technical bulletins for the frontend
      if (technicalBulletins.length > 0) {
        personalizedData.technicalBulletins = {
          image: personalizedData.technicalBulletins?.image || "/images/tech-bulletins.jpg",
          items: technicalBulletins.map(article => ({
            title: article.title,
            description: article.subtitle || article.summary || article.description || "",
            date: article.lastUpdated || article.publishDate || article.publishedDate || new Date().toISOString(),
            link: `/articles/${article.id}`,
            bulletinID: article.bulletinID || `TB-${article.id}`,
            severity: article.severity || "standard",
            priority: article.priority || 3,
            // Include any other fields needed
          }))
        };

        // Sort bulletins by priority and severity (critical first)
        personalizedData.technicalBulletins.items.sort((a, b) => {
          // Sort by priority first
          const priorityDiff = (a.priority || Number.MAX_SAFE_INTEGER) - (b.priority || Number.MAX_SAFE_INTEGER);
          if (priorityDiff !== 0) return priorityDiff;

          // If same priority, sort critical ones first
          if (a.severity === 'critical' && b.severity !== 'critical') return -1;
          if (a.severity !== 'critical' && b.severity === 'critical') return 1;

          // Then sort by date (newest first)
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
      } else {
        // If no bulletins match, provide an empty array
        personalizedData.technicalBulletins = {
          image: personalizedData.technicalBulletins?.image || "/images/tech-bulletins.jpg",
          items: []
        };
      }
    } catch (error) {
      console.error('Error processing technical bulletins:', error);
      // Provide empty array if there's an error
      personalizedData.technicalBulletins = {
        image: personalizedData.technicalBulletins?.image || "/images/tech-bulletins.jpg",
        items: []
      };
    }

    // 3. Get billing updates from articles.json
    try {
      const billingUpdates = articles.filter(article => {
        // Match type or category
        const isTypeBillingUpdate = article.type && article.type.toLowerCase().includes('billing');
        const isCategoryBilling = article.category && article.category.toLowerCase().includes('billing');
        const hasTagBilling = article.tags && article.tags.some(tag => tag.toLowerCase().includes('billing'));

        const isBillingUpdate = isTypeBillingUpdate || isCategoryBilling || hasTagBilling;

        if (!isBillingUpdate) return false;

        // Filter by region
        if (region !== 'all' && article.regions &&
          !article.regions.includes(region) &&
          !article.regions.includes('all')) {
          return false;
        }

        // Filter by skill designations if applicable
        if (skillDesignations.length > 0 && article.skillDesignations && article.skillDesignations.length > 0) {
          // Check if any of the user's skills match the update's skills
          const hasMatchingSkill = article.skillDesignations.some(skill =>
            skillDesignations.includes(skill as SkillDesignation) || skill === 'all'
          );

          if (!hasMatchingSkill) {
            return false;
          }
        }

        // Filter by language
        if (article.languages && article.languages.length > 0 && !article.languages.includes(language)) {
          return false;
        }

        return true;
      });

      // Format billing updates for the frontend
      if (billingUpdates.length > 0) {
        personalizedData.billingUpdates = {
          image: personalizedData.billingUpdates?.image || "/images/billing-updates.jpg",
          items: billingUpdates.map(article => ({
            title: article.title,
            description: article.subtitle || article.summary || article.description || "",
            date: article.lastUpdated || article.publishDate || article.publishedDate || new Date().toISOString(),
            link: `/articles/${article.id}`,
            updateID: article.updateID || `PBS-${article.id}`,
            effectiveDate: article.effectiveDate || article.publishDate || new Date().toISOString(),
            priority: article.priority || 3,
            // Include any other fields needed
          }))
        };

        // Sort billing updates by priority and effective date
        personalizedData.billingUpdates.items.sort((a, b) => {
          // Sort by priority first
          const priorityDiff = (a.priority || Number.MAX_SAFE_INTEGER) - (b.priority || Number.MAX_SAFE_INTEGER);
          if (priorityDiff !== 0) return priorityDiff;

          // Then by effective date (soonest first)
          return new Date(a.effectiveDate || a.date).getTime() - new Date(b.effectiveDate || b.date).getTime();
        });
      } else {
        // If no updates match, provide an empty array
        personalizedData.billingUpdates = {
          image: personalizedData.billingUpdates?.image || "/images/billing-updates.jpg",
          items: []
        };
      }
    } catch (error) {
      console.error('Error processing billing updates:', error);
      // Provide empty array if there's an error
      personalizedData.billingUpdates = {
        image: personalizedData.billingUpdates?.image || "/images/billing-updates.jpg",
        items: []
      };
    }

    // 4. Personalize feed items based on user preferences
    try {
      if (personalizedData.personalizedFeed && Array.isArray(personalizedData.personalizedFeed)) {
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
      }
    } catch (error) {
      console.error('Error processing personalized feed:', error);
      // Provide empty array if there's an error
      personalizedData.personalizedFeed = [];
    }

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
        hotOffers: personalizedData.hotOffers?.items?.length || 0,
        technicalBulletins: personalizedData.technicalBulletins?.items?.length || 0,
        billingUpdates: personalizedData.billingUpdates?.items?.length || 0,
        personalizedFeed: personalizedData.personalizedFeed?.length || 0
      }
    };

    return json({
      ...personalizedData,
      debug: debugInfo
    });
  } catch (error) {
    console.error('Error in homepage API:', error);
    return json({
      error: 'Failed to load personalized homepage content',
      hotOffers: { items: [] },
      technicalBulletins: { items: [] },
      billingUpdates: { items: [] },
      personalizedFeed: [],
      debug: { error: error instanceof Error ? error.message : String(error) }
    }, { status: 500 });
  }
}; 
