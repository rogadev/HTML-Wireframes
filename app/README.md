# Tech Central - SvelteKit Application

A modern web application for Telus field technicians, managers, and partners to access critical resources, training materials, and documentation.

## Project Structure

The application is organized into six main sections, each serving a specific purpose:

### Learning Hub (/learning-hub)

- Installation guides and procedures
- Troubleshooting resources
- Hardware business rules
- Device library
- Equipment safety protocols
- Network topology guides
- Technical specifications
- QA checklists

### ValueGen (/valuegen)

- Current promotions and offers
- Promotions calendar
- Incentive rate guides
- Deal qualification guides
- Regional offers
- Critical alerts banner
- Sales investigation tracking
- Solicitation policies
- Language-specific content

### Billing/PSB (/billing)

- Quick billing guide
- Billing procedures and guidelines
- Rate cards and templates
- Regional billing rules
- Repair billing guidelines
- Skill-specific billing information
- Billing updates archive

### Partners (/partners)

- Partner-specific job aids
- Service documentation
- Partner guidelines and contracts
- Training materials
- Performance metrics
- Partner onboarding

### Training (/training)

- Learning paths
- Training modules and materials
- Certification programs
- Knowledge checks & quizzes
- Training calendar
- Mentorship program
- Compliance training
- Onboarding resources

### Managers (/managers)

- Management dashboards
- Performance metrics
- Team management tools
- Scheduling & staffing tools
- Training management dashboard
- Certification tracking
- Reports & analytics
- Team scheduling
- Access request management

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## API Routes

The application uses SvelteKit's API routes to serve static content. These routes are organized to match the main navigation structure and will be replaced with CMS integration in the future.

## Content Organization

- Each section has its own navigation structure
- Content is tagged with appropriate metadata for filtering and search
- Related content is cross-linked when appropriate
- Regional and language-specific content is clearly marked
- Content includes last updated dates and version information

## Accessibility

- All interactive elements are keyboard accessible
- ARIA labels are used appropriately
- Content is available in both English and French
- Color contrast meets WCAG standards

## Mobile Support

- Responsive design for all screen sizes
- Mobile-optimized views for technical diagrams
- Offline access capabilities for critical content
- Touch-friendly interface elements
