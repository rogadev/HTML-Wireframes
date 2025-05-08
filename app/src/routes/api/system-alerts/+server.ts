import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Mock data for system alerts
// In a real application, this would come from a database or external service
const systemAlerts = [
  {
    id: 'sys-001',
    type: 'outage',
    severity: 'critical',
    title: 'System Outage: CRM Service',
    message: 'The CRM service is currently unavailable. Our team is working to restore service as quickly as possible.',
    startTime: '2024-06-05T14:30:00Z',
    estimatedResolution: '2024-06-05T18:30:00Z',
    affectedSystems: ['CRM', 'Customer Portal', 'Order Management'],
    updates: [
      {
        timestamp: '2024-06-05T15:15:00Z',
        message: 'Issue identified as database connection failure. Working on resolution.'
      },
      {
        timestamp: '2024-06-05T16:00:00Z',
        message: 'Database services being restored. Estimated 30 minutes to complete recovery.'
      }
    ],
    active: true
  },
  {
    id: 'sys-002',
    type: 'maintenance',
    severity: 'warning',
    title: 'Scheduled Maintenance: Billing System',
    message: 'The billing system will be undergoing maintenance. Service disruptions may occur during this period.',
    startTime: '2024-06-10T22:00:00Z',
    estimatedResolution: '2024-06-11T02:00:00Z',
    affectedSystems: ['Billing', 'Payments', 'Reporting'],
    updates: [],
    active: true
  },
  {
    id: 'sys-003',
    type: 'degraded',
    severity: 'moderate',
    title: 'Performance Issues: Field Service App',
    message: 'The field service mobile application is experiencing slow response times. Our team is investigating.',
    startTime: '2024-06-04T09:15:00Z',
    estimatedResolution: '2024-06-05T17:00:00Z',
    affectedSystems: ['Field Service App', 'Dispatch System'],
    updates: [
      {
        timestamp: '2024-06-04T11:30:00Z',
        message: 'Issue traced to high server load. Adding additional capacity.'
      }
    ],
    active: true
  },
  {
    id: 'sys-004',
    type: 'resolved',
    severity: 'critical',
    title: 'Resolved: Network Connectivity Issues',
    message: 'The network connectivity issues affecting remote offices have been resolved.',
    startTime: '2024-06-02T13:45:00Z',
    estimatedResolution: '2024-06-02T18:00:00Z',
    actualResolution: '2024-06-02T16:30:00Z',
    affectedSystems: ['VPN', 'Remote Access', 'Video Conferencing'],
    updates: [
      {
        timestamp: '2024-06-02T14:30:00Z',
        message: 'Issue identified as ISP routing problem.'
      },
      {
        timestamp: '2024-06-02T16:30:00Z',
        message: 'ISP has resolved the routing issue. All services have been restored.'
      }
    ],
    active: false
  }
];

// GET handler to retrieve all active system alerts
export const GET: RequestHandler = async ({ url }) => {
  try {
    const activeOnly = url.searchParams.get('active') !== 'false';
    const alertType = url.searchParams.get('type');
    const minSeverity = url.searchParams.get('min_severity');

    // Create a deep copy to avoid mutation issues
    let filteredAlerts = JSON.parse(JSON.stringify(systemAlerts));

    try {
      // Filter by active status if requested
      if (activeOnly) {
        filteredAlerts = filteredAlerts.filter(alert => alert.active);
      }

      // Filter by alert type if specified
      if (alertType) {
        filteredAlerts = filteredAlerts.filter(alert => alert.type === alertType);
      }

      // Filter by minimum severity if specified
      if (minSeverity) {
        const severityLevels = ['low', 'moderate', 'warning', 'critical'];
        const minSeverityIndex = severityLevels.indexOf(minSeverity);

        if (minSeverityIndex !== -1) {
          filteredAlerts = filteredAlerts.filter(alert => {
            const alertSeverityIndex = severityLevels.indexOf(alert.severity);
            return alertSeverityIndex >= minSeverityIndex;
          });
        }
      }
    } catch (err) {
      filteredAlerts = [];
    }

    return json({
      alerts: filteredAlerts
    });
  } catch (err) {
    return json({
      alerts: [],
      error: 'An unexpected error occurred'
    });
  }
};

// POST handler for creating a new system alert (would require authentication in production)
export const POST: RequestHandler = async ({ request }) => {
  try {
    // In a real application, verify authentication and authorization here
    const alertData = await request.json();

    // Validate required fields
    if (!alertData.title || !alertData.message || !alertData.type || !alertData.severity) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Generate an ID and set defaults
    const newAlert = {
      id: `sys-${(systemAlerts.length + 1).toString().padStart(3, '0')}`,
      ...alertData,
      startTime: alertData.startTime || new Date().toISOString(),
      updates: alertData.updates || [],
      active: alertData.active !== undefined ? alertData.active : true
    };

    // In a real app, save to database here
    systemAlerts.push(newAlert);

    return json({
      success: true,
      alert: newAlert
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create system alert' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// PATCH handler for updating an existing alert
export const PATCH: RequestHandler = async ({ request, url }) => {
  try {
    const alertId = url.searchParams.get('id');

    if (!alertId) {
      return new Response(JSON.stringify({ error: 'Alert ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const updateData = await request.json();
    const alertIndex = systemAlerts.findIndex(a => a.id === alertId);

    if (alertIndex === -1) {
      return new Response(JSON.stringify({ error: 'Alert not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Update the alert
    systemAlerts[alertIndex] = {
      ...systemAlerts[alertIndex],
      ...updateData,
      // Update the 'updates' array if new update is provided
      updates: updateData.newUpdate
        ? [...systemAlerts[alertIndex].updates, {
          timestamp: new Date().toISOString(),
          message: updateData.newUpdate
        }]
        : systemAlerts[alertIndex].updates
    };

    // Remove the temporary newUpdate field
    if (updateData.newUpdate) {
      delete systemAlerts[alertIndex].newUpdate;
    }

    return json({
      success: true,
      alert: systemAlerts[alertIndex]
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update system alert' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 
