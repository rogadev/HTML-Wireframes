document.addEventListener('DOMContentLoaded', () => {
  setupCustomizeFeedButton()
  loadPersonalizedFeed()
})

// Handle customize feed button
const setupCustomizeFeedButton = () => {
  const customizeButton = document.querySelector('.customize-feed-btn')

  if (customizeButton) {
    customizeButton.addEventListener('click', () => {
      // In a real implementation, this would open a modal with customization options
      alert(
        'In the real implementation, this would open a modal to customize your personalized feed preferences.'
      )
    })
  }
}

// Load personalized feed content based on user preferences
const loadPersonalizedFeed = () => {
  const feedContent = document.querySelector('.feed-content')

  if (!feedContent) {
    return // Not on a page with personalized feed
  }

  // Get user preferences from local storage
  const userRegion = localStorage.getItem('preferred_region') || 'all'
  const userRole = localStorage.getItem('user_role') || 'field_technician'
  const userLanguage = localStorage.getItem('preferred_language') || 'en'

  console.log(
    `Loading personalized feed for region: ${userRegion}, role: ${userRole}, language: ${userLanguage}`
  )

  // In a real implementation, this would fetch personalized content from a server
  // For the wireframe, we'll just manipulate the existing content

  // Update region-specific content
  const regionItems = document.querySelectorAll('.feed-item.region-specific')
  regionItems.forEach((item) => {
    const itemTitle = item.querySelector('h3')
    if (itemTitle && userRegion !== 'all') {
      // Update the title to include the user's region
      const regionPattern = /Ontario|Quebec|Alberta|British Columbia|Atlantic/g
      itemTitle.textContent = itemTitle.textContent.replace(
        regionPattern,
        userRegion
      )

      // Update relevance text to specify the region
      const relevanceSpan = item.querySelector('.feed-relevance')
      if (relevanceSpan) {
        relevanceSpan.innerHTML = `<i class="fas fa-map-marker-alt"></i> Specific to ${userRegion}`
      }
    }
  })

  // Handle language-specific content
  if (userLanguage === 'fr') {
    // Add a French indicator to items
    feedContent.querySelectorAll('.feed-item').forEach((item) => {
      if (!item.querySelector('.language-indicator')) {
        const langIndicator = document.createElement('div')
        langIndicator.className = 'language-indicator'
        langIndicator.innerHTML = 'FR'
        item.appendChild(langIndicator)
      }
    })
  }

  // Add click event for feed items
  feedContent.querySelectorAll('.feed-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      // Don't trigger if they clicked a link directly
      if (!e.target.classList.contains('feed-item-link')) {
        const link = item.querySelector('.feed-item-link')
        if (link) {
          window.location.href = link.getAttribute('href')
        }
      }
    })
  })
}
