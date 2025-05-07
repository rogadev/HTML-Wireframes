// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Set up language preferences
  setupLanguagePreferences()

  // Handle CTA button click
  const ctaButton = document.querySelector('.cta-button')
  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      alert('This would navigate to more information in the final site!')
    })
  }

  // Handle language toggle
  const languageButtons = document.querySelectorAll('.language-toggle button')
  languageButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      languageButtons.forEach((btn) => btn.classList.remove('active'))
      // Add active class to clicked button
      button.classList.add('active')

      // In a real implementation, this would change the language
      // For now, just show an alert
      const language = button.textContent
      alert(`Language would change to ${language} in the final implementation.`)
    })
  })

  // Add active class to current navigation item
  const currentPage = window.location.pathname.split('/').pop() || 'index.html'
  const navLinks = document.querySelectorAll('.nav-links a')

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute('href').split('/').pop()
    if (linkPage === currentPage) {
      link.classList.add('active')
    } else {
      link.classList.remove('active')
    }
  })

  // Handle global search
  const searchForm = document.querySelector('.search-wrapper')
  const searchInput = document.getElementById('global-search')
  const searchButton = document.querySelector('.search-button')

  if (searchForm && searchInput && searchButton) {
    const performSearch = () => {
      const searchTerm = searchInput.value.trim()
      if (searchTerm.length > 0) {
        // Redirect to search results page with the search term as a query parameter
        window.location.href = `pages/search-results.html?q=${encodeURIComponent(
          searchTerm
        )}`
      } else {
        searchInput.focus()
      }
    }

    searchButton.addEventListener('click', performSearch)

    searchForm.addEventListener('submit', (e) => {
      e.preventDefault()
      performSearch()
    })

    // Add search keyboard shortcut (Ctrl+/)
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        searchInput.focus()
      }
    })
  }

  // Interactive category cards
  const categoryCards = document.querySelectorAll('.category-card')
  categoryCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-8px)'
      card.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)'
    })

    card.addEventListener('mouseleave', () => {
      card.style.transform = ''
      card.style.boxShadow = ''
    })

    // Add click handler for entire card
    card.addEventListener('click', (e) => {
      // Don't trigger if they clicked the link directly (that will work normally)
      if (!e.target.classList.contains('card-link')) {
        const link = card.querySelector('.card-link')
        if (link) {
          window.location.href = link.getAttribute('href')
        }
      }
    })
  })

  // Make all card elements clickable
  const makeCardsClickable = (selector) => {
    const cards = document.querySelectorAll(selector)
    cards.forEach((card) => {
      card.addEventListener('click', (e) => {
        if (!e.target.tagName.toLowerCase() === 'a') {
          const link = card.querySelector('a')
          if (link) {
            window.location.href = link.getAttribute('href')
          }
        }
      })
    })
  }

  // Apply clickable behavior to various card types
  makeCardsClickable('.billing-card')
  makeCardsClickable('.topic-card')
  makeCardsClickable('.bulletin-item')
  makeCardsClickable('.offer-item')

  // Display sample recent and bookmarked articles
  // In a real implementation, these would be pulled from user history
  const initMockRecents = () => {
    // This is just a mockup function that would be replaced with real functionality
    // In a real implementation, this would load recent articles from a database or API
    console.log(
      'Recent articles would be loaded from user history in real implementation'
    )
  }

  initMockRecents()

  // Add clickable behavior to section headers
  const sectionHeaders = document.querySelectorAll('.section-header')
  sectionHeaders.forEach((header) => {
    const viewAllLink = header.querySelector('.view-all')
    if (viewAllLink) {
      header.addEventListener('click', (e) => {
        // Don't trigger if they clicked somewhere else in the header
        if (e.target === header) {
          viewAllLink.click()
        }
      })
    }
  })

  // Interactive feature cards
  const features = document.querySelectorAll('.feature')
  features.forEach((feature) => {
    feature.addEventListener('mouseenter', () => {
      feature.style.transform = 'translateY(-8px)'
      feature.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)'
    })

    feature.addEventListener('mouseleave', () => {
      feature.style.transform = ''
      feature.style.boxShadow = ''
    })
  })

  // Add click handler for promotional cards
  const promoCards = document.querySelectorAll('.promo-card')
  promoCards.forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.querySelector('h3').textContent
      alert(
        `Clicked on ${title} - this would navigate to the relevant page in the final site.`
      )
    })
  })

  // Simulate user role for demo purposes
  // In a real app, this would come from an auth service
  const simulateUserRole = () => {
    // For demonstration purposes, just set a mock role
    // In real implementation, this would be determined by SSO auth
    const isManager = localStorage.getItem('isManager') === 'true'

    // Toggle manager visibility
    const toggleManagerRole = () => {
      const newRole = !isManager
      localStorage.setItem('isManager', newRole)
      updateManagerVisibility(newRole)

      const status = newRole ? 'enabled' : 'disabled'
      alert(`Manager role ${status} for demonstration purposes.`)

      // Refresh the page to reflect changes
      window.location.reload()
    }

    // For demo purposes, double-clicking the company logo toggles manager role
    const logoElement = document.querySelector('.logo')
    if (logoElement) {
      logoElement.addEventListener('dblclick', toggleManagerRole)
    }

    return isManager
  }

  // Update manager visibility based on role
  const updateManagerVisibility = (isManager) => {
    const managerElements = document.querySelectorAll('.managers-only')

    managerElements.forEach((element) => {
      if (isManager) {
        element.style.display = ''
      } else {
        element.style.display = 'none'
      }
    })
  }

  // Initialize manager visibility
  const isManager = simulateUserRole()
  updateManagerVisibility(isManager)

  // Add a note about manager visibility for demo purposes
  const footer = document.querySelector('.footer-bottom p')
  if (footer) {
    const managerNote = document.createElement('small')
    managerNote.style.display = 'block'
    managerNote.style.marginTop = '10px'
    managerNote.style.fontSize = '0.8rem'
    managerNote.style.opacity = '0.7'
    managerNote.textContent =
      'For demo purposes: Double-click the logo to toggle manager view'
    footer.appendChild(managerNote)
  }

  // Handle critical alert banner
  const alertBanner = document.querySelector('.critical-alert-banner')
  const alertCloseBtn = document.querySelector('.alert-close-btn')

  if (alertBanner && alertCloseBtn) {
    // Check if the alert was previously dismissed
    const alertDismissed = localStorage.getItem('alert_dismissed')
    const currentAlert = alertBanner
      .querySelector('.alert-message')
      .textContent.trim()

    // Only show if not previously dismissed
    if (alertDismissed === currentAlert) {
      alertBanner.style.display = 'none'
    }

    // Close button functionality
    alertCloseBtn.addEventListener('click', () => {
      alertBanner.style.display = 'none'
      localStorage.setItem('alert_dismissed', currentAlert)
    })
  }

  // Set up mobile menu
  setupMobileMenu()

  // Set up offline access
  setupOfflineAccess()

  // Set up personalized news feed
  setupPersonalizedNewsFeed()

  // Initialize language content after language is loaded
  const savedLanguage = localStorage.getItem('preferred_language') || 'en'
  updateContentLanguage(savedLanguage)
})

// Handle language toggle and preferences
const setupLanguagePreferences = () => {
  // DOM Elements
  const languageSelector = document.querySelector('.language-selector')
  const languageDropdownIcon = document.querySelector('.language-dropdown-icon')
  const languagePreferencesPanel = document.querySelector(
    '.language-preferences-panel'
  )
  const languageButtons = document.querySelectorAll('.language-btn')
  const radioEnglish = document.getElementById('lang-en')
  const radioFrench = document.getElementById('lang-fr')
  const rememberLangCheckbox = document.getElementById('remember-lang')
  const regionSelector = document.getElementById('region-selector')
  const savePreferencesButton = document.getElementById('save-preferences')

  // Load saved preferences if they exist
  const loadSavedPreferences = () => {
    const savedLanguage = localStorage.getItem('preferred_language')
    const savedRegion = localStorage.getItem('preferred_region')
    const shouldRemember = localStorage.getItem('remember_language') !== 'false'

    // Apply saved language if it exists
    if (savedLanguage) {
      if (savedLanguage === 'fr') {
        radioFrench.checked = true
        setActiveLanguageButton('fr')
      } else {
        radioEnglish.checked = true
        setActiveLanguageButton('en')
      }
    }

    // Apply saved region if it exists
    if (savedRegion && regionSelector) {
      regionSelector.value = savedRegion
    }

    // Apply remember preference
    if (rememberLangCheckbox) {
      rememberLangCheckbox.checked = shouldRemember
    }
  }

  // Set the active language button
  const setActiveLanguageButton = (lang) => {
    languageButtons.forEach((button) => {
      if (button.getAttribute('data-lang') === lang) {
        button.classList.add('active')
      } else {
        button.classList.remove('active')
      }
    })
  }

  // Apply language change
  const applyLanguageChange = (lang) => {
    // Set the active button
    setActiveLanguageButton(lang)

    // In a real implementation, this would change the page content language
    console.log(`Language changed to: ${lang}`)

    // For demonstration purposes, we'll update the UI to reflect the change
    document.documentElement.setAttribute('lang', lang)

    // Update content language
    updateContentLanguage(lang)

    // Save preference if remember is checked
    if (rememberLangCheckbox && rememberLangCheckbox.checked) {
      localStorage.setItem('preferred_language', lang)
      localStorage.setItem('remember_language', 'true')
    } else {
      localStorage.removeItem('preferred_language')
      localStorage.setItem('remember_language', 'false')
    }
  }

  // Toggle language preferences panel
  if (languageSelector && languagePreferencesPanel) {
    languageSelector.addEventListener('click', (e) => {
      e.stopPropagation()
      languagePreferencesPanel.classList.toggle('open')
      languageDropdownIcon.classList.toggle('open')
    })

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (
        !languagePreferencesPanel.contains(e.target) &&
        !languageSelector.contains(e.target)
      ) {
        languagePreferencesPanel.classList.remove('open')
        languageDropdownIcon.classList.remove('open')
      }
    })
  }

  // Handle language button clicks (quick toggle)
  languageButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      e.stopPropagation()
      const lang = button.getAttribute('data-lang')

      // Update radio buttons in the panel
      if (lang === 'en' && radioEnglish) {
        radioEnglish.checked = true
      } else if (lang === 'fr' && radioFrench) {
        radioFrench.checked = true
      }

      // Apply the language change
      applyLanguageChange(lang)
    })
  })

  // Handle save preferences button
  if (savePreferencesButton) {
    savePreferencesButton.addEventListener('click', () => {
      // Get selected language
      const selectedLang = radioEnglish.checked ? 'en' : 'fr'

      // Get selected region
      const selectedRegion = regionSelector.value

      // Apply language change
      applyLanguageChange(selectedLang)

      // Save region preference
      localStorage.setItem('preferred_region', selectedRegion)

      // Display notification
      alert(
        `Preferences saved. Language: ${selectedLang.toUpperCase()}, Region: ${selectedRegion}`
      )

      // Close the panel
      languagePreferencesPanel.classList.remove('open')
      languageDropdownIcon.classList.remove('open')

      // In a real implementation, this would trigger content filtering based on region
      console.log(`Region filter set to: ${selectedRegion}`)

      // Optionally, refresh the page to apply changes
      // window.location.reload();
    })
  }

  // Initial load of saved preferences
  loadSavedPreferences()
}

// Mobile Menu Functionality
const setupMobileMenu = () => {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn')
  const navLinks = document.querySelector('.nav-links')

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open')
      document.body.style.overflow = navLinks.classList.contains('open')
        ? 'hidden'
        : ''
    })

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !mobileMenuBtn.contains(e.target)
      ) {
        navLinks.classList.remove('open')
        document.body.style.overflow = ''
      }
    })

    // Close mobile menu when window is resized to desktop size
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open')
        document.body.style.overflow = ''
      }
    })
  }
}

// Offline Access Functionality
const setupOfflineAccess = () => {
  const offlineBanner = document.querySelector('.offline-banner')
  const offlineToggleBtn = document.querySelector('.offline-toggle-btn')
  const offlineOptions = document.querySelector('.offline-options')
  const enableOfflineCheckbox = document.getElementById('enable-offline')
  const offlineIndicator = document.querySelector('.offline-indicator')
  const offlineStatusText = document.querySelector('.offline-status-text')
  const saveForOfflineBtn = document.getElementById('save-for-offline')
  const storageBar = document.querySelector('.storage-used')
  const storageText = document.querySelector('.storage-text')

  // Check if the browser supports Service Workers and Cache API
  const isOfflineSupported = 'serviceWorker' in navigator && 'caches' in window

  if (!isOfflineSupported && offlineBanner) {
    offlineBanner.style.display = 'none'
    return
  }

  // Toggle offline options panel
  if (offlineToggleBtn && offlineOptions) {
    offlineToggleBtn.addEventListener('click', () => {
      offlineOptions.classList.toggle('open')
      offlineToggleBtn.classList.toggle('active')
    })
  }

  // Handle enable offline checkbox change
  if (
    enableOfflineCheckbox &&
    offlineIndicator &&
    offlineStatusText &&
    saveForOfflineBtn
  ) {
    // Check if offline access was previously enabled
    const offlineEnabled = localStorage.getItem('offline_enabled') === 'true'
    enableOfflineCheckbox.checked = offlineEnabled

    if (offlineEnabled) {
      offlineIndicator.classList.add('enabled')
      offlineStatusText.textContent = 'Enabled'
      saveForOfflineBtn.disabled = false
    }

    enableOfflineCheckbox.addEventListener('change', () => {
      if (enableOfflineCheckbox.checked) {
        // Register service worker for offline access
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker
            .register('/service-worker.js')
            .then((registration) => {
              console.log(
                'Service Worker registered with scope:',
                registration.scope
              )
              offlineIndicator.classList.add('enabled')
              offlineStatusText.textContent = 'Enabled'
              saveForOfflineBtn.disabled = false
              localStorage.setItem('offline_enabled', 'true')
            })
            .catch((error) => {
              console.error('Service Worker registration failed:', error)
              enableOfflineCheckbox.checked = false
              alert('Failed to enable offline access. Please try again.')
            })
        }
      } else {
        // Unregister service worker to disable offline access
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then((registrations) => {
            for (let registration of registrations) {
              registration.unregister()
            }
            console.log('Service Worker unregistered')
            offlineIndicator.classList.remove('enabled')
            offlineStatusText.textContent = 'Not enabled'
            saveForOfflineBtn.disabled = true
            localStorage.setItem('offline_enabled', 'false')
          })
        }
      }
    })
  }

  // Handle save for offline button click
  if (saveForOfflineBtn) {
    saveForOfflineBtn.addEventListener('click', () => {
      // In a real implementation, this would save the necessary content for offline use
      // using the Cache API and the Service Worker

      // Mock the storage usage for demo purposes
      const mockStorageUsed = 25 // percentage
      const mockStorageMB = 12.5
      const mockAvailableMB = 50

      if (storageBar && storageText) {
        storageBar.style.width = `${mockStorageUsed}%`
        storageText.textContent = `${mockStorageMB} MB used (${mockAvailableMB} MB available)`
      }

      // Show success message
      alert(
        'Content has been saved for offline use. You can now access this content when offline.'
      )
    })
  }

  // Check if the device is online or offline
  const updateOnlineStatus = () => {
    if (offlineStatusText) {
      const isOnline = navigator.onLine
      if (!isOnline && enableOfflineCheckbox && enableOfflineCheckbox.checked) {
        offlineStatusText.textContent = 'Using offline content'
        if (offlineIndicator) {
          offlineIndicator.style.backgroundColor = 'orange'
        }
      } else if (enableOfflineCheckbox && enableOfflineCheckbox.checked) {
        offlineStatusText.textContent = 'Enabled'
        if (offlineIndicator) {
          offlineIndicator.classList.add('enabled')
        }
      }
    }
  }

  // Listen for online/offline events
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)

  // Initial check
  updateOnlineStatus()
}

// Set up personalized news feed on homepage
const setupPersonalizedNewsFeed = () => {
  // Check if we're on the homepage
  const technicalBulletins = document.querySelector('.technical-bulletins')
  const hotOffers = document.querySelector('.hot-offers')

  if (!technicalBulletins || !hotOffers) {
    return // Not on homepage or elements don't exist
  }

  // Get user preferences from local storage
  const userRegion = localStorage.getItem('preferred_region') || 'all'
  const userRole = localStorage.getItem('user_role') || 'field_technician'

  console.log(
    `Loading personalized news feed for region: ${userRegion}, role: ${userRole}`
  )

  // Add personalized label to the section headers
  const updatesSectionHeaders = document.querySelectorAll(
    '.updates-section .section-header h2'
  )
  updatesSectionHeaders.forEach((header) => {
    const personalizationLabel = document.createElement('span')
    personalizationLabel.className = 'personalization-label'
    personalizationLabel.innerHTML = ` <i class="fas fa-user-check"></i>`
    personalizationLabel.title = `Content personalized for your ${
      userRegion !== 'all' ? 'region' : 'preferences'
    }`
    header.appendChild(personalizationLabel)
  })

  // In a real implementation, this would filter news items based on region and role
  // For demo purposes, we'll just add a class to all news items
  const newsItems = document.querySelectorAll('.bulletin-item, .offer-item')
  newsItems.forEach((item) => {
    // Add a subtle highlight to personalized items
    item.classList.add('personalized-content')

    // Visually highlight region-specific items if a region is selected
    if (userRegion !== 'all') {
      // In a real implementation, we would check if the item matches the region
      // Here we'll just randomly highlight some items as region-specific
      if (Math.random() > 0.5) {
        const regionBadge = document.createElement('span')
        regionBadge.className = 'region-badge'
        regionBadge.innerText = userRegion.toUpperCase()
        item.querySelector('h4').appendChild(regionBadge)
      }
    }
  })
}

// Function to update content displays based on language preference
const updateContentLanguage = (language) => {
  // This is a mock implementation for the wireframe
  // In a real implementation, this would load content in the selected language
  console.log(`Updating content language to: ${language}`)

  // Visual cue for Quebec-specific installation requirements
  if (language === 'fr') {
    const billingRules = document.querySelectorAll('.billing-card')
    billingRules.forEach((rule) => {
      // Check if there's already a Quebec badge
      if (!rule.querySelector('.quebec-specific')) {
        const hasQuebecRules = Math.random() > 0.5 // Randomly determine for demo

        if (hasQuebecRules) {
          const quebecBadge = document.createElement('div')
          quebecBadge.className = 'quebec-specific'
          quebecBadge.innerHTML =
            '<i class="fas fa-info-circle"></i> Quebec-specific rules apply'
          rule.appendChild(quebecBadge)
        }
      }
    })

    // Add visual distinction to all technical bulletins
    const bulletins = document.querySelectorAll('.bulletin-item')
    bulletins.forEach((bulletin) => {
      // In a real implementation, only Quebec-specific bulletins would be marked
      if (Math.random() > 0.7) {
        // Randomly mark some bulletins for demo
        bulletin.classList.add('quebec-specific-content')

        // Add a small indicator
        if (!bulletin.querySelector('.qc-indicator')) {
          const qcIndicator = document.createElement('div')
          qcIndicator.className = 'qc-indicator'
          qcIndicator.innerHTML = 'QC'
          bulletin.appendChild(qcIndicator)
        }
      }
    })
  }
}
