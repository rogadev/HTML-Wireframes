// Search Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
  // Get search query from URL parameters
  parseSearchQueryFromURL()

  // Initialize Tech Floating Menu
  initTechFloatingMenu()

  // Initialize Critical Alert Banner
  initCriticalAlertBanner()

  // Initialize Advanced Search Panel
  initAdvancedSearch()

  // Initialize Filter Tags
  initFilterTags()

  // Initialize Promo Code Copy
  initPromoCopy()

  // Initialize Training Tab Functionality
  initTrainingTab()

  // Simulate search functionality
  initSearchFunctionality()
})

// Training Tab Initialization
function initTrainingTab() {
  // Calendar event handling
  initCalendarEvents()

  // Learning path role filtering
  initRoleFilter()

  // Manager tools visibility (hide for non-managers)
  initManagerToolsVisibility()

  // Course enrollment handling
  initCourseEnrollment()

  // Skill badge progress animation
  initSkillBadges()

  // Mentorship buttons handling
  initMentorshipProgram()
}

// Calendar Events Handling
function initCalendarEvents() {
  const calendarDays = document.querySelectorAll('.calendar-day.has-event')
  const calendarNavButtons = document.querySelectorAll('.calendar-nav button')

  if (calendarDays.length) {
    calendarDays.forEach((day) => {
      day.addEventListener('click', function () {
        const eventName = this.getAttribute('data-event')
        // In a real implementation, this would show event details
        alert(
          `Event: ${eventName}\nClick "View Full Calendar" to see details and manage registrations.`
        )
      })
    })
  }

  if (calendarNavButtons.length) {
    // Previous month button
    calendarNavButtons[0].addEventListener('click', function () {
      const calendarMonth = document.querySelector('.calendar-month')
      if (calendarMonth) {
        calendarMonth.textContent = 'May 2023' // Just for demo
      }
    })

    // Next month button
    calendarNavButtons[1].addEventListener('click', function () {
      const calendarMonth = document.querySelector('.calendar-month')
      if (calendarMonth) {
        calendarMonth.textContent = 'July 2023' // Just for demo
      }
    })
  }

  // Schedule technician button
  const scheduleButton = document.querySelector('.schedule-tech')
  if (scheduleButton) {
    scheduleButton.addEventListener('click', function (e) {
      e.preventDefault()
      // In a real implementation, this would open a scheduling modal
      alert(
        'This would open a technician scheduling interface where managers can assign training courses to their team members.'
      )
    })
  }
}

// Learning Path Role Filtering
function initRoleFilter() {
  const roleFilter = document.getElementById('role-filter')
  const learningPaths = document.querySelectorAll(
    '.tech-menu-section:nth-child(2) ul li'
  )

  if (!roleFilter || !learningPaths.length) return

  roleFilter.addEventListener('change', function () {
    const selectedRole = this.value

    // For demonstration purposes, simulate filtering based on role
    if (selectedRole === 'all') {
      learningPaths.forEach((path) => {
        path.style.display = ''
      })
    } else {
      // In a real implementation, this would filter based on role tags
      // For demo, we'll randomly show/hide items
      learningPaths.forEach((path) => {
        const pathText = path.textContent.toLowerCase()

        // Match paths to roles (in a real implementation, this would use proper data attributes)
        let shouldShow = false
        if (selectedRole === 'shs' && pathText.includes('security')) {
          shouldShow = true
        } else if (selectedRole === 'custom' && pathText.includes('custom')) {
          shouldShow = true
        } else if (selectedRole === 'tv' && pathText.includes('tv')) {
          shouldShow = true
        } else if (selectedRole === 'wifi' && pathText.includes('wifi')) {
          shouldShow = true
        } else if (
          selectedRole === 'internet' &&
          pathText.includes('internet')
        ) {
          shouldShow = true
        }

        path.style.display = shouldShow ? '' : 'none'
      })
    }
  })
}

// Manager Tools Visibility Control
function initManagerToolsVisibility() {
  const managerTools = document.querySelector('.tech-menu-section:nth-child(4)')
  if (!managerTools) return

  // Check if user is a manager (using the same logic as in main.js)
  const isManager = localStorage.getItem('isManager') === 'true'

  if (!isManager) {
    managerTools.style.display = 'none'
  }
}

// Course Enrollment Handling
function initCourseEnrollment() {
  const enrollButtons = document.querySelectorAll('.enroll-btn')

  if (!enrollButtons.length) return

  enrollButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault()
      const courseName =
        this.closest('.course-item').querySelector('h4').textContent

      // In a real implementation, this would trigger an enrollment API call
      alert(
        `You have been enrolled in "${courseName}". Check your email for confirmation.`
      )

      // Change button text to indicate enrollment
      this.textContent = 'Enrolled'
      this.classList.add('enrolled')
      this.disabled = true
    })
  })
}

// Skill Badge Progress Animation
function initSkillBadges() {
  const skillBadges = document.querySelectorAll('.skill-badge')

  if (!skillBadges.length) return

  // Animate progress bars when they become visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progressBar = entry.target.querySelector('.progress-bar')
        const progressValue = entry.target.getAttribute('data-progress')

        if (progressBar && progressValue) {
          setTimeout(() => {
            progressBar.style.width = progressValue + '%'
          }, 100)
        }

        // Stop observing once animation is triggered
        observer.unobserve(entry.target)
      }
    })
  })

  skillBadges.forEach((badge) => {
    observer.observe(badge)
  })
}

// Mentorship Program Handling
function initMentorshipProgram() {
  const mentorshipButtons = document.querySelectorAll('.mentorship-btn')

  if (!mentorshipButtons.length) return

  mentorshipButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.preventDefault()
      const mentorshipType =
        this.closest('.mentorship-role').querySelector('h4').textContent

      if (mentorshipType.includes('Find a Mentor')) {
        alert(
          'This would open a directory of experienced technicians who have volunteered to be mentors, allowing you to filter by skill area and reach out for guidance.'
        )
      } else {
        alert(
          'Thank you for your interest in becoming a mentor! This would open a form where you can indicate your areas of expertise and availability to help newer technicians.'
        )
      }
    })
  })
}

// Parse search query from URL
function parseSearchQueryFromURL() {
  const urlParams = new URLSearchParams(window.location.search)
  const searchQuery = urlParams.get('q')

  if (searchQuery) {
    // Update the search input field
    const searchInput = document.getElementById('global-search')
    if (searchInput) {
      searchInput.value = searchQuery
    }

    // Update the search term display
    const searchTermDisplay = document.getElementById('search-term')
    if (searchTermDisplay) {
      searchTermDisplay.textContent = searchQuery
    }

    // Update the page title
    document.title = `Search Results for "${searchQuery}" - Tech Central`

    // In a real implementation, this would trigger the actual search
    // but for our wireframe, the static content is sufficient
  }
}

// Tech Floating Menu Functions
function initTechFloatingMenu() {
  const techMenuBtn = document.querySelector('.tech-menu-btn')
  const techFloatingMenu = document.querySelector('.tech-floating-menu')
  const techTabs = document.querySelectorAll('.tech-tab')
  const minimizeBtn = document.getElementById('minimize-tech-menu')
  const pinMenuCheckbox = document.getElementById('pin-tech-menu')

  if (!techMenuBtn) return

  // Toggle menu open/close
  techMenuBtn.addEventListener('click', function () {
    techFloatingMenu.classList.toggle('open')

    // If menu is pinned, save state to localStorage
    if (pinMenuCheckbox && pinMenuCheckbox.checked) {
      localStorage.setItem(
        'techMenuOpen',
        techFloatingMenu.classList.contains('open')
      )
    }
  })

  // Tab switching
  if (techTabs.length) {
    techTabs.forEach((tab) => {
      tab.addEventListener('click', function () {
        // Remove active class from all tabs
        techTabs.forEach((t) => t.classList.remove('active'))

        // Add active class to clicked tab
        this.classList.add('active')

        // Hide all tab content
        const tabContents = document.querySelectorAll('.tech-menu-tab-content')
        tabContents.forEach((content) => content.classList.remove('active'))

        // Show clicked tab content
        const tabId = this.getAttribute('data-tab')
        const activeContent = document.getElementById(tabId + '-tab')
        if (activeContent) {
          activeContent.classList.add('active')
        }

        // Save active tab to localStorage
        localStorage.setItem('activeTechTab', tabId)
      })
    })

    // Restore active tab from localStorage
    const savedTab = localStorage.getItem('activeTechTab')
    if (savedTab) {
      const tabToActivate = document.querySelector(
        `.tech-tab[data-tab="${savedTab}"]`
      )
      if (tabToActivate) {
        tabToActivate.click()
      }
    }
  }

  // Minimize button
  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', function () {
      techFloatingMenu.classList.remove('open')
    })
  }

  // Pin menu checkbox
  if (pinMenuCheckbox) {
    // Restore pinned state from localStorage
    const isPinned = localStorage.getItem('techMenuPinned') === 'true'
    pinMenuCheckbox.checked = isPinned

    pinMenuCheckbox.addEventListener('change', function () {
      localStorage.setItem('techMenuPinned', this.checked)

      // If pinned and menu should be open, open it
      if (this.checked) {
        localStorage.setItem(
          'techMenuOpen',
          techFloatingMenu.classList.contains('open')
        )
      }
    })

    // If pinned and was previously open, open it
    if (isPinned && localStorage.getItem('techMenuOpen') === 'true') {
      techFloatingMenu.classList.add('open')
    }
  }

  // Close menu when clicking outside unless pinned
  document.addEventListener('click', function (event) {
    if (
      !techFloatingMenu.contains(event.target) &&
      techFloatingMenu.classList.contains('open') &&
      (!pinMenuCheckbox || !pinMenuCheckbox.checked)
    ) {
      techFloatingMenu.classList.remove('open')
    }
  })

  // Make menu draggable
  makeDraggable(techFloatingMenu)
}

// Make an element draggable
function makeDraggable(element) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0

  if (element.querySelector('.tech-menu-btn')) {
    // If present, the header is where you move the DIV from
    element.querySelector('.tech-menu-btn').onmousedown = dragMouseDown
  } else {
    // Otherwise, move the DIV from anywhere inside the DIV
    element.onmousedown = dragMouseDown
  }

  function dragMouseDown(e) {
    e = e || window.event
    e.preventDefault()
    // Get the mouse cursor position at startup
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    // Call a function whenever the cursor moves
    document.onmousemove = elementDrag
  }

  function elementDrag(e) {
    e = e || window.event
    e.preventDefault()
    // Calculate the new cursor position
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY
    // Set the element's new position
    const newTop = element.offsetTop - pos2
    const newLeft = element.offsetLeft - pos1

    // Ensure the element stays within the viewport
    const maxTop = window.innerHeight - element.offsetHeight
    const maxLeft = window.innerWidth - element.offsetWidth

    element.style.top = Math.min(Math.max(0, newTop), maxTop) + 'px'
    element.style.left = Math.min(Math.max(0, newLeft), maxLeft) + 'px'
    element.style.bottom = 'auto'
    element.style.right = 'auto'

    // Save position to localStorage
    localStorage.setItem(
      'techMenuPos',
      JSON.stringify({
        top: element.style.top,
        left: element.style.left,
      })
    )
  }

  function closeDragElement() {
    // Stop moving when mouse button is released
    document.onmouseup = null
    document.onmousemove = null
  }

  // Restore position from localStorage if available
  const savedPos = localStorage.getItem('techMenuPos')
  if (savedPos) {
    try {
      const pos = JSON.parse(savedPos)
      element.style.top = pos.top
      element.style.left = pos.left
      element.style.bottom = 'auto'
      element.style.right = 'auto'
    } catch (e) {
      console.error('Error restoring menu position:', e)
    }
  }
}

// Critical Alert Banner Functions
function initCriticalAlertBanner() {
  const alertDismissBtn = document.querySelector('.alert-dismiss')
  const alertBanner = document.querySelector('.critical-alert-banner')

  if (!alertDismissBtn || !alertBanner) return

  alertDismissBtn.addEventListener('click', function () {
    alertBanner.style.display = 'none'

    // Store in session storage that the alert was dismissed
    sessionStorage.setItem('alertDismissed', 'true')
  })

  // Check if alert was previously dismissed
  if (sessionStorage.getItem('alertDismissed') === 'true') {
    alertBanner.style.display = 'none'
  }
}

// Advanced Search Panel Functions
function initAdvancedSearch() {
  const toggleAdvancedSearchBtn = document.querySelector(
    '.toggle-advanced-search'
  )
  const advancedSearchPanel = document.querySelector('.advanced-search-panel')
  const applyFiltersBtn = document.querySelector('.apply-filters-btn')
  const resetFiltersBtn = document.querySelector('.reset-filters-btn')

  if (!toggleAdvancedSearchBtn || !advancedSearchPanel) return

  toggleAdvancedSearchBtn.addEventListener('click', function () {
    advancedSearchPanel.classList.toggle('open')
  })

  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', function () {
      // Apply filters logic would go here
      advancedSearchPanel.classList.remove('open')

      // For demo purposes, update the active filters display
      updateActiveFilters()
    })
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', function () {
      // Reset all checkboxes and radio buttons
      const checkboxes = advancedSearchPanel.querySelectorAll(
        'input[type="checkbox"]'
      )
      const radioButtons = advancedSearchPanel.querySelectorAll(
        'input[type="radio"]'
      )

      checkboxes.forEach((checkbox) => {
        checkbox.checked =
          checkbox.id.includes('filter-articles') ||
          checkbox.id.includes('filter-videos') ||
          checkbox.id.includes('filter-jobaid') ||
          checkbox.id.includes('filter-training') ||
          checkbox.id.includes('filter-billing')
      })

      radioButtons.forEach((radio) => {
        radio.checked = radio.id.includes('any')
      })
    })
  }
}

// Filter Tags Functions
function initFilterTags() {
  const removeFilterBtns = document.querySelectorAll('.remove-filter')
  const clearAllFiltersBtn = document.querySelector('.clear-all-filters')

  if (removeFilterBtns.length) {
    removeFilterBtns.forEach((btn) => {
      btn.addEventListener('click', function () {
        const filterTag = this.closest('.filter-tag')
        if (filterTag) {
          filterTag.remove()

          // Logic to actually remove the filter would go here
        }
      })
    })
  }

  if (clearAllFiltersBtn) {
    clearAllFiltersBtn.addEventListener('click', function () {
      const filterTags = document.querySelectorAll('.filter-tag')
      filterTags.forEach((tag) => tag.remove())

      // Logic to actually clear all filters would go here
    })
  }
}

// Helper function to update active filters display based on selection
function updateActiveFilters() {
  const filterTagsContainer = document.querySelector('.filter-tags')
  if (!filterTagsContainer) return

  // This would be replaced with actual logic based on selected filters
  // For now, we'll just simulate adding a new filter tag

  const newTag = document.createElement('div')
  newTag.className = 'filter-tag'
  newTag.innerHTML = `
    Ontario
    <button class="remove-filter">
      <i class="fas fa-times"></i>
    </button>
  `

  filterTagsContainer.appendChild(newTag)

  // Reinitialize event listeners for the new tag
  newTag.querySelector('.remove-filter').addEventListener('click', function () {
    newTag.remove()
  })
}

// Promo Code Copy Functions
function initPromoCopy() {
  const copyBtns = document.querySelectorAll('.copy-btn')

  if (!copyBtns.length) return

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      const codeElement =
        this.closest('.promo-details').querySelector('.copyable')
      const textToCopy = codeElement.getAttribute('data-clipboard-text')

      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          // Visual feedback
          this.innerHTML = '<i class="fas fa-check"></i>'

          setTimeout(() => {
            this.innerHTML = '<i class="fas fa-copy"></i>'
          }, 2000)
        })
        .catch((err) => {
          console.error('Could not copy text: ', err)
        })
    })
  })
}

// Search functionality (simulated)
function initSearchFunctionality() {
  const searchButton = document.querySelector('.search-button')
  const searchInput = document.getElementById('global-search')
  const searchTermDisplay = document.getElementById('search-term')

  if (!searchButton || !searchInput || !searchTermDisplay) return

  searchButton.addEventListener('click', function () {
    const searchTerm = searchInput.value.trim()
    if (searchTerm) {
      searchTermDisplay.textContent = searchTerm
      // In a real application, this would trigger an actual search
    }
  })

  // Also trigger search on Enter key
  searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      searchButton.click()
    }
  })
}

// Additional utility functions can be added here
