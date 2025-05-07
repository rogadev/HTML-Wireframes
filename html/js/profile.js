document.addEventListener('DOMContentLoaded', () => {
  setupProfileDashboard()
  setupFavourites()
  setupSkillTabs()
  setupHomeTeamVisibility()
  setupRegionSpecificContent()
})

// Set up the profile dashboard with user data
const setupProfileDashboard = () => {
  // In a real implementation, this would load user data from a database or API
  // For the wireframe, we'll use mock data
  const userData = {
    name: 'John Doe',
    role: 'Field Technician',
    region: 'Ontario',
    skills: ['Fiber Installation', 'Troubleshooting'],
    language: 'English',
    id: 'FT-1234',
    isHomeTeam: true, // Flag for home team vs partner
  }

  // Set user profile info
  document.getElementById('user-name').textContent = userData.name
  document.getElementById('user-region').textContent = userData.region
  document.getElementById('user-id').textContent = userData.id

  // Set badges in the role-region banner
  document.getElementById('role-display').textContent = userData.role
  document.getElementById('region-display').textContent = userData.region
  document.getElementById('skill-display').textContent =
    userData.skills.join(', ')
  document.getElementById('language-display').textContent = userData.language

  // Update region-specific sections
  document.getElementById('region-news-title').textContent = userData.region

  // In a real implementation, the following would load personalized content
  // based on the user's role, region, and skills
  loadPersonalizedLearning(userData)
  loadRegionalContent(userData.region)
  loadRoleSpecificContent(userData.role)
}

// Set up favourites functionality
const setupFavourites = () => {
  const favouriteItems = document.querySelectorAll('.favourite-item')
  const removeBtns = document.querySelectorAll('.remove-favourite')
  const addFavouriteBtn = document.querySelector('.add-favourite-btn')

  // Handle removing favourites
  removeBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      favouriteItems[index].style.opacity = '0'
      setTimeout(() => {
        favouriteItems[index].style.display = 'none'
        // In a real implementation, this would also update the database
        console.log('Removed favourite item')
      }, 300)
    })
  })

  // Handle adding new favourites (mock functionality)
  if (addFavouriteBtn) {
    addFavouriteBtn.addEventListener('click', () => {
      // In a real implementation, this would open a modal to select content to favourite
      alert(
        'In the real implementation, this would open a dialog to select content to add to your favourites.'
      )
    })
  }
}

// Set up skill tabs functionality
const setupSkillTabs = () => {
  const skillTabs = document.querySelectorAll('.skill-tab')
  const skillPanes = document.querySelectorAll('.skill-pane')

  skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and panes
      skillTabs.forEach((t) => t.classList.remove('active'))
      skillPanes.forEach((p) => p.classList.remove('active'))

      // Add active class to clicked tab and corresponding pane
      tab.classList.add('active')
      const skill = tab.getAttribute('data-skill')
      document.getElementById(`${skill}-pane`).classList.add('active')
    })
  })
}

// Toggle visibility of home team only content
const setupHomeTeamVisibility = () => {
  const homeTeamSections = document.querySelectorAll('.home-team-only')

  // Detect if user is home team or partner
  // In a real implementation, this would come from user data
  const isHomeTeam = localStorage.getItem('isHomeTeam') === 'true'

  homeTeamSections.forEach((section) => {
    if (isHomeTeam) {
      section.style.display = 'block'
    } else {
      section.style.display = 'none'
    }
  })

  // For demo purposes - toggle home team status with shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
      e.preventDefault()
      const newStatus = localStorage.getItem('isHomeTeam') !== 'true'
      localStorage.setItem('isHomeTeam', newStatus)

      const statusText = newStatus ? 'enabled' : 'disabled'
      alert(`Home Team status ${statusText} for demonstration purposes.`)

      // Refresh the page to reflect changes
      window.location.reload()
    }
  })
}

// Load personalized learning content
const loadPersonalizedLearning = (userData) => {
  // In a real implementation, this would load personalized learning content
  // based on the user's role, region, skills, and learning history
  console.log(
    `Loading personalized learning for ${userData.name} (${userData.role} in ${userData.region})`
  )

  // Add calendar functionality to training events
  const calendarBtns = document.querySelectorAll('.add-calendar-btn')
  calendarBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      // Get the event details from the parent training event
      const eventEl = e.target.closest('.training-event')
      const title = eventEl.querySelector('h4').textContent
      const date =
        eventEl.querySelector('.event-date .month').textContent +
        ' ' +
        eventEl.querySelector('.event-date .day').textContent

      alert(
        `Event "${title}" on ${date} would be added to your calendar in the real implementation.`
      )
    })
  })
}

// Load region-specific content
const loadRegionalContent = (region) => {
  // In a real implementation, this would load content specific to the user's region
  console.log(`Loading content specific to ${region} region`)

  // Example of how you would filter content based on region
  // This would typically come from a database query filtering by region

  // For Quebec region - add French content indication and specific regional guidelines
  if (region.toLowerCase() === 'quebec' || region.toLowerCase() === 'qc') {
    // Add Quebec-specific class to relevant elements
    const regionalElements = document.querySelectorAll(
      '.regional-updates .update-item'
    )
    regionalElements.forEach((el) => {
      el.classList.add('qc-specific')
    })

    // In a real implementation, the content would be dynamically loaded
    // based on the selected region
  }
}

// Load role-specific content
const loadRoleSpecificContent = (role) => {
  // In a real implementation, this would load content specific to the user's role
  console.log(`Loading content specific to ${role} role`)

  // Set role title in the section header
  const roleResourcesTitle = document.querySelector(
    '.role-resources-section h2'
  )
  if (roleResourcesTitle) {
    roleResourcesTitle.innerHTML = `<i class="fas fa-briefcase"></i> ${role} Resources`
  }

  // For demo, we'll simulate role-specific content loading
  // In a real implementation, this would come from a database
  switch (role.toLowerCase()) {
    case 'field technician':
      // Content already tailored to field technicians in the HTML
      break
    case 'team lead':
      // Would modify content for team leads
      break
    case 'manager':
      // Would modify content for managers
      break
    default:
      // Default content
      break
  }
}

// Check if regional billing rules apply to content
const checkRegionalBillingRules = (contentElement, region) => {
  // This would check if a content element has region-specific billing rules
  // and apply visual indicators if needed

  // For demo purposes - find all billing rule elements
  const billingRules = document.querySelectorAll('.billing-rules')

  billingRules.forEach((rule) => {
    const ruleRegions = rule.getAttribute('data-regions').split(',')

    if (ruleRegions.includes(region.toLowerCase())) {
      // This rule applies to the user's region
      rule.classList.add('applies-to-region')
    } else {
      // This rule doesn't apply to the user's region
      rule.classList.add('not-applicable-region')

      // Add a notice
      const notice = document.createElement('div')
      notice.className = 'region-notice'
      notice.innerHTML = `<i class="fas fa-info-circle"></i> This rule does not apply to the ${region} region.`
      rule.appendChild(notice)
    }
  })
}
