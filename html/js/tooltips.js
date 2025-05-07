// Tooltips functionality for stakeholder presentations
document.addEventListener('DOMContentLoaded', function () {
  // Get elements
  const presentationControls = document.querySelector('.presentation-controls')
  const presentationModeToggle = document.getElementById(
    'presentation-mode-toggle'
  )
  const prevButton = document.getElementById('prev-tooltip')
  const nextButton = document.getElementById('next-tooltip')
  const counterElement = document.querySelector('.tooltip-counter')
  const body = document.body

  // Get all tooltips
  const tooltips = document.querySelectorAll('.tooltip-wrapper')
  let currentTooltipIndex = 0
  let presentationModeActive = false

  // Create centered tooltip elements if they don't exist
  let centeredTooltipContainer = document.getElementById(
    'centered-tooltip-container'
  )
  let centeredTooltip = document.getElementById('centered-tooltip')
  let tooltipSourceIndicator = document.getElementById(
    'tooltip-source-indicator'
  )

  if (!centeredTooltipContainer) {
    centeredTooltipContainer = document.createElement('div')
    centeredTooltipContainer.id = 'centered-tooltip-container'
    document.body.appendChild(centeredTooltipContainer)

    centeredTooltip = document.createElement('div')
    centeredTooltip.id = 'centered-tooltip'
    centeredTooltipContainer.appendChild(centeredTooltip)

    tooltipSourceIndicator = document.createElement('div')
    tooltipSourceIndicator.id = 'tooltip-source-indicator'
    document.body.appendChild(tooltipSourceIndicator)
  }

  // Initialize counter
  updateCounter()

  // Toggle presentation mode
  if (presentationModeToggle) {
    presentationModeToggle.addEventListener('change', function () {
      presentationModeActive = this.checked

      if (presentationModeActive) {
        body.classList.add('presentation-mode')
        // Show first tooltip when entering presentation mode
        showTooltip(currentTooltipIndex)
        updateButtonState()
      } else {
        body.classList.remove('presentation-mode')
        // Hide all tooltips when leaving presentation mode
        hideAllTooltips()
      }
    })
  }

  // Previous button functionality
  if (prevButton) {
    prevButton.addEventListener('click', function () {
      if (!presentationModeActive) return

      hideAllTooltips()

      // Go to previous tooltip
      currentTooltipIndex = Math.max(0, currentTooltipIndex - 1)

      showTooltip(currentTooltipIndex)
      updateCounter()
      updateButtonState()
    })
  }

  // Next button functionality
  if (nextButton) {
    nextButton.addEventListener('click', function () {
      if (!presentationModeActive) return

      hideAllTooltips()

      // Go to next tooltip
      currentTooltipIndex = Math.min(
        tooltips.length - 1,
        currentTooltipIndex + 1
      )

      showTooltip(currentTooltipIndex)
      updateCounter()
      updateButtonState()
    })
  }

  // Update tooltip counter
  function updateCounter() {
    if (counterElement) {
      counterElement.textContent = `${currentTooltipIndex + 1} / ${
        tooltips.length
      }`
    }
  }

  // Update button states (disabled/enabled)
  function updateButtonState() {
    if (prevButton) {
      prevButton.disabled = currentTooltipIndex === 0
    }
    if (nextButton) {
      nextButton.disabled = currentTooltipIndex === tooltips.length - 1
    }
  }

  // Show specific tooltip
  function showTooltip(index) {
    if (tooltips[index]) {
      const tooltipElement = tooltips[index]

      // Create temporary visible class
      tooltipElement.classList.add('tooltip-visible')

      // Get the tooltip content
      const tooltip = tooltipElement.querySelector('.tooltip')

      if (tooltip) {
        // Show centered tooltip in presentation mode
        if (presentationModeActive) {
          showCenteredTooltip(tooltipElement, tooltip)
        } else {
          // Show standard tooltip for non-presentation mode
          tooltip.style.visibility = 'visible'
          tooltip.style.opacity = '1'
          tooltip.style.bottom = 'calc(100% + 15px)'
        }
      }

      // Scroll to the tooltip
      tooltipElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }

  // Show centered tooltip with pulsing indicator
  function showCenteredTooltip(tooltipElement, tooltip) {
    // Get tooltip content
    const title =
      tooltip.querySelector('.tooltip-title')?.innerText || 'Information'
    const description =
      tooltip.querySelector('.tooltip-description')?.innerText || ''
    const priorityClass = tooltip.classList.contains('tooltip-priority-high')
      ? 'tooltip-priority-high'
      : tooltip.classList.contains('tooltip-priority-medium')
      ? 'tooltip-priority-medium'
      : tooltip.classList.contains('tooltip-priority-low')
      ? 'tooltip-priority-low'
      : ''

    // Get the source element position
    const iconElement = tooltipElement.querySelector('.tooltip-icon')
    const iconRect = iconElement.getBoundingClientRect()

    // Source coordinates (center of the icon)
    const sourceX = iconRect.left + iconRect.width / 2
    const sourceY = iconRect.top + iconRect.height / 2

    // Update tooltip content
    centeredTooltip.innerHTML = `
      <div class="tooltip-title">${title}</div>
      <p class="tooltip-description">${description}</p>
    `

    // Apply priority class if present
    centeredTooltip.className = priorityClass

    // Position source indicator with pulsing effect
    // Apply the appropriate priority color to the indicator
    tooltipSourceIndicator.className = `tooltip-source-indicator ${
      priorityClass || ''
    }`
    tooltipSourceIndicator.style.left = `${sourceX}px`
    tooltipSourceIndicator.style.top = `${sourceY}px`

    // Show centered tooltip elements
    centeredTooltipContainer.style.display = 'block'
    tooltipSourceIndicator.style.display = 'block'
  }

  // Hide all tooltips
  function hideAllTooltips() {
    // Hide standard tooltips
    tooltips.forEach((tooltipWrapper) => {
      tooltipWrapper.classList.remove('tooltip-visible')

      const tooltip = tooltipWrapper.querySelector('.tooltip')
      if (tooltip) {
        tooltip.style.visibility = ''
        tooltip.style.opacity = ''
        tooltip.style.bottom = ''
      }
    })

    // Hide centered tooltip elements
    if (centeredTooltipContainer) {
      centeredTooltipContainer.style.display = 'none'
    }
    if (tooltipSourceIndicator) {
      tooltipSourceIndicator.style.display = 'none'
    }
  }

  // Manual tooltip click functionality (alternative to hover)
  tooltips.forEach((tooltip, index) => {
    tooltip.addEventListener('click', function (e) {
      e.stopPropagation()

      if (presentationModeActive) {
        // In presentation mode, clicking a tooltip advances to that tooltip
        hideAllTooltips()
        currentTooltipIndex = index
        showTooltip(currentTooltipIndex)
        updateCounter()
        updateButtonState()
      } else {
        // Regular behavior: hide all other tooltips, toggle this one
        tooltips.forEach((t) => {
          if (t !== this) {
            t.classList.remove('tooltip-active')
          }
        })

        this.classList.toggle('tooltip-active')
      }
    })
  })

  // Close tooltips when clicking elsewhere (but only in non-presentation mode)
  document.addEventListener('click', function () {
    if (!presentationModeActive) {
      tooltips.forEach((tooltip) => {
        tooltip.classList.remove('tooltip-active')
      })
    }
  })

  // Handle window resize to update positions
  window.addEventListener('resize', function () {
    if (presentationModeActive) {
      showTooltip(currentTooltipIndex)
    }
  })
})
