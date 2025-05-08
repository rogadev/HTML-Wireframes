import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// In a real application, this would connect to a database
// For our mockup, we'll just store in memory
const feedbackStore = {
  helpfulness: [] as { articleId: string; isHelpful: boolean; timestamp: string; }[],
  issues: [] as {
    articleId: string;
    name?: string;
    email?: string;
    pageUrl: string;
    issue: string;
    timestamp: string;
  }[]
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    const data = await request.json();
    const { feedbackType, articleId } = data;

    if (!articleId || !feedbackType) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Current timestamp
    const timestamp = new Date().toISOString();

    // Handle different types of feedback
    if (feedbackType === 'helpfulness') {
      const { isHelpful } = data;

      if (isHelpful === undefined) {
        return new Response(JSON.stringify({ error: 'isHelpful is required for helpfulness feedback' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Store the helpfulness feedback
      feedbackStore.helpfulness.push({
        articleId,
        isHelpful,
        timestamp
      });

      // In a real app, we might send notifications or trigger analytics here
      console.log(`Helpfulness feedback recorded for article ${articleId}: ${isHelpful ? 'Helpful' : 'Not helpful'}`);

      return json({
        success: true,
        message: 'Thank you for your feedback'
      });
    }
    else if (feedbackType === 'issue') {
      const { name, email, pageUrl, issue } = data;

      if (!issue || !pageUrl) {
        return new Response(JSON.stringify({ error: 'Issue description and page URL are required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Store the issue report
      feedbackStore.issues.push({
        articleId,
        name,
        email,
        pageUrl,
        issue,
        timestamp
      });

      // In a real app, this would trigger notifications to content owners
      // and potentially create tickets in a tracking system
      console.log(`Issue reported for article ${articleId}: ${issue}`);

      // Simulate sending email to content authors/editors
      if (email) {
        console.log(`Will notify reporter at ${email} when issue is resolved`);
      }

      return json({
        success: true,
        message: 'Thank you for reporting this issue. Our team will review it.'
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid feedback type' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing feedback:', error);
    return new Response(JSON.stringify({ error: 'Failed to process feedback' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// GET handler to retrieve feedback statistics (for admin users)
export const GET: RequestHandler = async ({ url }) => {
  const articleId = url.searchParams.get('articleId');

  // Simple authentication check would go here in a real app
  // For mockup purposes, we'll just return the data

  if (articleId) {
    // Get feedback for a specific article
    const articleHelpfulness = feedbackStore.helpfulness.filter(
      item => item.articleId === articleId
    );
    const articleIssues = feedbackStore.issues.filter(
      item => item.articleId === articleId
    );

    // Calculate helpfulness percentage
    const totalFeedback = articleHelpfulness.length;
    const helpfulCount = articleHelpfulness.filter(item => item.isHelpful).length;
    const helpfulPercentage = totalFeedback > 0 ? (helpfulCount / totalFeedback) * 100 : 0;

    return json({
      articleId,
      statistics: {
        totalFeedback,
        helpfulCount,
        notHelpfulCount: totalFeedback - helpfulCount,
        helpfulPercentage: Math.round(helpfulPercentage)
      },
      issues: articleIssues.length
    });
  }

  // Return overall statistics
  const totalHelpfulnessCount = feedbackStore.helpfulness.length;
  const totalHelpfulCount = feedbackStore.helpfulness.filter(item => item.isHelpful).length;
  const overallHelpfulPercentage =
    totalHelpfulnessCount > 0 ? (totalHelpfulCount / totalHelpfulnessCount) * 100 : 0;

  return json({
    statistics: {
      totalFeedbackCount: totalHelpfulnessCount,
      helpfulCount: totalHelpfulCount,
      notHelpfulCount: totalHelpfulnessCount - totalHelpfulCount,
      helpfulPercentage: Math.round(overallHelpfulPercentage)
    },
    totalIssues: feedbackStore.issues.length
  });
}; 
