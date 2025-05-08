# ValueGen & PBS Data Models Integration Guide

This document outlines the data models for ValueGen, Technical Bulletins, and PBS (Professional Services Billing) integration with the Tech Central platform.

## Current Mock Model vs. Expected Real Systems

Our Tech Central application currently uses simplified models in `homepage.json`. This document provides guidance on mapping these simplified models to the expected real-world data structures for future integration.

## 1. Hot Offers (ValueGen)

### Current Simplified Model:

```json
{
	"title": "Summer Internet Bundle",
	"description": "Get 50% off your first 3 months with our new summer bundle",
	"validUntil": "2024-08-31",
	"link": "/valuegen/summer-bundle"
}
```

### Expected ValueGen CMS Model:

```json
{
	"offerID": "VG-2024-0128",
	"offerName": "Summer Internet Bundle",
	"shortDescription": "Get 50% off your first 3 months with our new summer bundle",
	"fullDescription": "Detailed multi-paragraph description of the offer terms and conditions...",
	"campaignCode": "SUM24-INT50",
	"validFrom": "2024-06-01T00:00:00Z",
	"validUntil": "2024-08-31T23:59:59Z",
	"productCategory": "Internet",
	"offerType": "Discount",
	"discountAmount": "50%",
	"discountDuration": "3 months",
	"qualificationCriteria": ["New customers only", "Requires 2-year term agreement"],
	"eligibleRegions": ["on", "qc", "ab-bc"],
	"eligibleTeamTypes": ["home", "custom_home"],
	"customerSegments": ["residential", "small_business"],
	"applicableServices": ["Internet 150", "Internet 300", "Internet 500"],
	"priority": 2,
	"thumbnail": "https://cms.telus.com/images/summer-bundle-2024.jpg",
	"cta": {
		"text": "View Offer Details",
		"link": "/valuegen/summer-bundle",
		"tracking": "vg_summer_int_2024"
	},
	"relatedDocuments": [
		{
			"title": "Offer Training Document",
			"link": "/training/summer-bundle-2024"
		}
	],
	"languages": ["en", "fr"],
	"translationKey": "SUMMER_BUNDLE_2024"
}
```

### Field Mapping:

- `title` → `offerName`
- `description` → `shortDescription`
- `validUntil` → `validUntil` (expanded with time component)
- `link` → `cta.link`

### Additional Required Fields:

- `offerID`: Unique identifier from ValueGen system
- `campaignCode`: Code used for tracking and application
- `validFrom`: Start date (with time)
- `eligibleRegions`: Maps to our Region type
- `eligibleTeamTypes`: Maps to our TeamType
- `languages`: For multilingual support
- `priority`: For ordering on homepage

## 2. Technical Bulletins

### Current Simplified Model:

```json
{
	"title": "New Fiber Installation Guidelines",
	"description": "Updated procedures for fiber optic installations in multi-unit buildings",
	"date": "2024-06-01",
	"link": "/learning-hub/fiber-installation-guidelines"
}
```

### Expected Technical Bulletin CMS Model:

```json
{
	"bulletinID": "TB-2024-0056",
	"title": "New Fiber Installation Guidelines",
	"summary": "Updated procedures for fiber optic installations in multi-unit buildings",
	"publishDate": "2024-06-01T09:00:00Z",
	"modifiedDate": "2024-06-03T14:30:00Z",
	"expiryDate": "2024-12-01T23:59:59Z",
	"content": "Full HTML content of the bulletin...",
	"category": "Installation",
	"subcategory": "Fiber",
	"severity": "standard", // critical, standard, informational
	"impactedRegions": ["on", "qc", "ab-bc", "atlantic", "mb-sk"],
	"impactedRoles": ["technician", "manager"],
	"impactedSkills": ["fiber"],
	"keywords": ["fiber", "installation", "MDU", "multi-dwelling"],
	"attachments": [
		{
			"name": "Full Guidelines PDF",
			"url": "/documents/fiber-guidelines-2024.pdf",
			"size": "1.2MB",
			"type": "application/pdf"
		}
	],
	"requiredAction": {
		"actionable": true,
		"deadline": "2024-07-01T23:59:59Z",
		"verificationRequired": true
	},
	"author": {
		"name": "Technical Documentation Team",
		"email": "tech.docs@telus.com"
	},
	"relatedBulletins": ["TB-2023-0143", "TB-2024-0032"],
	"priority": 1,
	"languages": ["en", "fr"],
	"translationKey": "FIBER_INSTALL_GUIDELINES_2024"
}
```

### Field Mapping:

- `title` → `title`
- `description` → `summary`
- `date` → `publishDate` (expanded with time)
- `link` → Generated from `bulletinID` and `title`

### Additional Required Fields:

- `bulletinID`: Unique identifier
- `modifiedDate`: For tracking updates
- `expiryDate`: When the bulletin is no longer relevant
- `severity`: Importance level
- `impactedRegions`: Maps to our Region type
- `impactedRoles`: Maps to our Role type
- `impactedSkills`: Maps to our SkillDesignation type
- `requiredAction`: Whether technicians must acknowledge

## 3. Billing Updates (PBS)

### Current Simplified Model:

```json
{
	"title": "Updated Service Call Rates",
	"description": "New rates effective July 1st, 2024",
	"date": "2024-06-15",
	"link": "/billing/service-call-rates"
}
```

### Expected PBS CMS Model:

```json
{
	"updateID": "PBS-2024-0089",
	"title": "Updated Service Call Rates",
	"summary": "New rates effective July 1st, 2024",
	"publishDate": "2024-06-15T00:00:00Z",
	"effectiveDate": "2024-07-01T00:00:00Z",
	"detailedContent": "Detailed HTML content with tables of rates...",
	"category": "Rates",
	"subcategory": "Service Calls",
	"impactedRegions": ["on", "qc"],
	"impactedSkills": ["copper", "fiber", "wifi_plus"],
	"rateChanges": [
		{
			"serviceType": "Standard Install",
			"oldRate": "$75.00",
			"newRate": "$85.00",
			"percentChange": "+13.3%"
		},
		{
			"serviceType": "Premium Install",
			"oldRate": "$120.00",
			"newRate": "$135.00",
			"percentChange": "+12.5%"
		}
	],
	"approvedBy": "Finance Department",
	"rateCard": {
		"name": "July 2024 Rate Card",
		"url": "/documents/rate-card-july-2024.pdf"
	},
	"acknowledgementRequired": true,
	"priority": 1,
	"relatedDocuments": [
		{
			"title": "Rate Change Procedure",
			"link": "/billing/rate-change-procedure"
		}
	],
	"languages": ["en", "fr"],
	"translationKey": "SERVICE_CALL_RATES_JULY_2024"
}
```

### Field Mapping:

- `title` → `title`
- `description` → `summary`
- `date` → `publishDate` (expanded with time)
- `link` → Generated from `updateID` and `title`

### Additional Required Fields:

- `updateID`: Unique identifier
- `effectiveDate`: When rates take effect
- `impactedRegions`: Maps to our Region type
- `impactedSkills`: Maps to our SkillDesignation type
- `rateChanges`: Detailed information about specific changes
- `acknowledgementRequired`: Whether technicians must acknowledge

## Integration Requirements

For successful CMS integration with Tech Central, the following architectural components will be needed:

1. **Data Transform Layer**:

   - Convert CMS export format to Tech Central compatible models
   - Handle field mapping as described above
   - Validate data completeness and integrity

2. **Scheduled Import Jobs**:

   - Daily import of ValueGen offers
   - Real-time or hourly import of critical bulletins
   - Weekly import of billing updates

3. **Content Filtering Logic**:

   - Match user preferences with content metadata
   - Apply regional and role-based visibility rules
   - Sort by priority and relevance

4. **Translation Handling**:
   - Use `translationKey` to link related content across languages
   - Ensure all user-facing content is available in both English and French

## Future Considerations

1. **API Integration**:

   - Real-time API integration with ValueGen and PBS systems
   - Webhooks for immediate notification of critical updates

2. **User-specific Content**:

   - Personalized offers based on technician performance metrics
   - Learning recommendations based on skill gaps

3. **Analytics**:
   - Track content views and relevance ratings
   - Monitor bulletin acknowledgement rates

## Mockup Implementation Guidelines

For the Tech Central mockup, developers should enhance the current models to include the most important fields from the expected CMS models, specifically:

1. Add `priority`, `eligibleRegions`, `eligibleTeamTypes` to Hot Offers
2. Add `severity`, `impactedRegions`, `impactedRoles` to Technical Bulletins
3. Add `effectiveDate`, `impactedRegions`, `impactedSkills` to Billing Updates

This will allow the mockup to demonstrate region and role-based filtering while keeping the data model manageable.
