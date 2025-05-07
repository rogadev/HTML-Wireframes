import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Mock database of articles
const articles = [
  {
    title: 'Installing Fiber Optic in Your New Home',
    description: 'A comprehensive guide to installing fiber optic internet in your new home, including best practices and common pitfalls to avoid.',
    imageUrl: '/images/fiber-installation.jpg',
    link: '/articles/fiber-installation-guide',
    category: 'Guide',
    tags: ['Fiber', 'Installation', 'Home'],
    date: 'June 1, 2024',
    author: 'John Doe'
  },
  {
    title: 'Understanding Fiber Optic Technology',
    description: 'Learn about the technology behind fiber optic internet and why it\'s the future of high- speed connectivity.',
    imageUrl: '/images/fiber-tech.jpg',
    link: '/articles/fiber-technology-understanding',
    category: 'Technology',
    tags: ['Fiber', 'Technology', 'Internet'],
    date: 'May 28, 2024',
    author: 'Jane Smith'
  },
  {
    title: 'Fiber vs. Cable: Making the Right Choice',
    description: 'Compare fiber optic and cable internet to make an informed decision for your home or business.',
    imageUrl: '/images/fiber-vs-cable.jpg',
    link: '/articles/fiber-vs-cable',
    category: 'Comparison',
    tags: ['Fiber', 'Cable', 'Internet'],
    date: 'May 25, 2024',
    author: 'Mike Johnson'
  }
];

export const GET: RequestHandler = async ({ url }) => {
  const query = url.searchParams.get('q')?.toLowerCase() || '';

  // Simulate a small delay to mimic real API call
  await new Promise(resolve => setTimeout(resolve, 300));

  // Filter articles based on search query
  const results = articles.filter(article => {
    const searchableText = [
      article.title,
      article.description,
      article.category,
      ...article.tags
    ].join(' ').toLowerCase();

    return searchableText.includes(query);
  });

  return json({
    results,
    total: results.length,
    query
  });
}; 
