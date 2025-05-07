import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import articles from '$lib/data/articles.json';
import type { Region, Language, Role, TeamType, AudienceGroup, SkillDesignation } from '$lib/types/userPreferences';

// GET handler for all articles
export const GET: RequestHandler = async ({ url }) => {
  const id = url.searchParams.get('id');

  // If an ID is provided, return the specific article
  if (id) {
    const article = articles.find(article => article.id === id);
    if (article) {
      return json(article);
    }
    return new Response(JSON.stringify({ error: 'Article not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Get filter parameters from URL
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

  // Filter articles based on preferences
  let filteredArticles = [...articles];

  // Apply filters based on parameters
  if (region !== 'all') {
    filteredArticles = filteredArticles.filter(article =>
      article.regions?.includes(region) || article.regions?.includes('all')
    );
  }

  // Filter by language
  filteredArticles = filteredArticles.filter(article =>
    article.languages?.includes(language)
  );

  // Filter by role
  filteredArticles = filteredArticles.filter(article =>
    article.roles?.includes(role) || article.roles?.includes('all')
  );

  // Filter by team type
  if (teamType !== 'home') {
    filteredArticles = filteredArticles.filter(article =>
      article.teamTypes?.includes(teamType) || article.teamTypes?.includes('all')
    );
  }

  // Filter by audience group
  filteredArticles = filteredArticles.filter(article =>
    article.audienceGroups?.includes(audienceGroup) || article.audienceGroups?.includes('all')
  );

  // Filter by skill designations if specified
  if (skillDesignations.length > 0) {
    filteredArticles = filteredArticles.filter(article => {
      // Article should match if it contains ANY of the selected skill designations
      // or if it's tagged for all skill designations
      return article.skillDesignations?.some(skill =>
        skillDesignations.includes(skill) || skill === 'all'
      ) || false;
    });
  }

  return json(filteredArticles);
}; 
