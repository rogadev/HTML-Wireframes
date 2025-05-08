import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Mock database of articles with language information
const articles = [
  {
    title: 'Installing Fiber Optic in Your New Home',
    description: 'A comprehensive guide to installing fiber optic internet in your new home, including best practices and common pitfalls to avoid.',
    imageUrl: '/images/fiber-installation.jpg',
    link: '/fiber-installation-guide',
    category: 'Guide',
    tags: ['Fiber', 'Installation', 'Home'],
    date: 'June 1, 2024',
    author: 'John Doe',
    language: 'en'
  },
  {
    title: 'Understanding Fiber Optic Technology',
    description: 'Learn about the technology behind fiber optic internet and why it\'s the future of high-speed connectivity.',
    imageUrl: '/images/fiber-tech.jpg',
    link: '/fiber-technology-understanding',
    category: 'Technology',
    tags: ['Fiber', 'Technology', 'Internet'],
    date: 'May 28, 2024',
    author: 'Jane Smith',
    language: 'en'
  },
  {
    title: 'Fiber vs. Cable: Making the Right Choice',
    description: 'Compare fiber optic and cable internet to make an informed decision for your home or business.',
    imageUrl: '/images/fiber-vs-cable.jpg',
    link: '/fiber-vs-cable',
    category: 'Comparison',
    tags: ['Fiber', 'Cable', 'Internet'],
    date: 'May 25, 2024',
    author: 'Mike Johnson',
    language: 'en'
  },
  {
    title: 'Comprendre la technologie de fibre optique',
    description: 'Découvrez la technologie derrière l\'internet par fibre optique et pourquoi c\'est l\'avenir de la connectivité à grande vitesse.',
    imageUrl: '/images/fiber-tech.jpg',
    link: '/comprendre-technologie-fibre',
    category: 'Technologie',
    tags: ['Fibre', 'Technologie', 'Internet'],
    date: '28 mai 2024',
    author: 'Marie Dupont',
    language: 'fr'
  },
  {
    title: 'Guide d\'installation de fibre optique',
    description: 'Un guide complet pour l\'installation de l\'internet par fibre optique dans votre nouvelle maison.',
    imageUrl: '/images/fiber-installation.jpg',
    link: '/guide-installation-fibre',
    category: 'Guide',
    tags: ['Fibre', 'Installation', 'Maison'],
    date: '1 juin 2024',
    author: 'Jean Tremblay',
    language: 'fr'
  },
  {
    title: 'Fibre vs. Câble: Faire le bon choix',
    description: 'Comparez l\'internet par fibre optique et par câble pour prendre une décision éclairée pour votre maison ou entreprise.',
    imageUrl: '/images/fiber-vs-cable.jpg',
    link: '/fibre-vs-cable',
    category: 'Comparaison',
    tags: ['Fibre', 'Câble', 'Internet'],
    date: '25 mai 2024',
    author: 'Sophie Martin',
    language: 'fr'
  }
];

// In a real implementation, this would use a proper search index
// built with FlexSearch or Lunr that includes multilingual capabilities
export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get('q')?.toLowerCase() || '';
  const lang = url.searchParams.get('lang') || 'all'; // Get language preference

  // Simulate a small delay to mimic real API call
  await new Promise(resolve => setTimeout(resolve, 300));

  // Filter articles based on search query
  let results = articles.filter(article => {
    const searchableText = [
      article.title,
      article.description,
      article.category,
      ...article.tags
    ].join(' ').toLowerCase();

    return searchableText.includes(query);
  });

  // Filter by language if specified
  if (lang !== 'all') {
    results = results.filter(article => article.language === lang);
  }

  // Count results by language for the language filters
  const languageCounts = {
    en: results.filter(article => article.language === 'en').length,
    fr: results.filter(article => article.language === 'fr').length
  };

  // Mock search explanation information
  const searchInfo = {
    indexType: "FlexSearch multilingual index",
    indexSize: "5,247 documents (3,812 EN, 1,435 FR)",
    queryTime: "0.023 seconds",
    advancedFeatures: [
      "Multilingual stemming and normalization",
      "Cross-language semantic matching",
      "Language-specific relevance scoring"
    ]
  };

  return json({
    results,
    total: results.length,
    query,
    languages: languageCounts,
    searchInfo
  });
}; 
