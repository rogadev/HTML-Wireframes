// Article Page Functionality
document.addEventListener('DOMContentLoaded', () => {
  // Share Modal Functionality
  const setupShareModal = () => {
    const shareButton = document.getElementById('shareArticle')
    const shareModal = document.getElementById('shareModal')
    const closeModalButtons = document.querySelectorAll('.close-modal')
    const copyLinkBtn = document.getElementById('copyLinkBtn')
    const shareLink = document.getElementById('shareLink')
    const shareMethods = document.querySelectorAll('.share-method')

    if (shareButton && shareModal) {
      // Open share modal
      shareButton.addEventListener('click', () => {
        shareModal.classList.add('active')
      })

      // Close modal when clicking close button
      closeModalButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const modal = button.closest('.modal')
          if (modal) {
            modal.classList.remove('active')
          }
        })
      })

      // Close modal when clicking outside content
      window.addEventListener('click', (e) => {
        if (e.target === shareModal) {
          shareModal.classList.remove('active')
        }
      })

      // Copy link functionality
      if (copyLinkBtn && shareLink) {
        copyLinkBtn.addEventListener('click', () => {
          shareLink.select()
          document.execCommand('copy')

          // Change button text temporarily
          const originalText = copyLinkBtn.textContent
          copyLinkBtn.textContent = 'Copied!'

          setTimeout(() => {
            copyLinkBtn.textContent = originalText
          }, 2000)
        })
      }

      // Share method buttons
      if (shareMethods) {
        shareMethods.forEach((method) => {
          method.addEventListener('click', () => {
            const shareType = method.getAttribute('data-method')
            const url = shareLink.value
            const title = document.title

            switch (shareType) {
              case 'email':
                window.location.href = `mailto:?subject=${encodeURIComponent(
                  title
                )}&body=${encodeURIComponent('Check out this article: ' + url)}`
                break
              case 'chat':
                alert(
                  'In a real implementation, this would open Google Chat with a pre-populated message containing the article link.'
                )
                break
              case 'sms':
                // On mobile, this would open the SMS app
                if (/Android|iPhone/i.test(navigator.userAgent)) {
                  window.location.href = `sms:?body=${encodeURIComponent(
                    'Check out this article: ' + url
                  )}`
                } else {
                  alert(
                    'SMS sharing is available on mobile devices. In the real implementation, a QR code might be shown here for mobile scanning.'
                  )
                }
                break
            }
          })
        })
      }
    }
  }

  // Feedback Modal Functionality
  const setupFeedbackModal = () => {
    const feedbackButton = document.getElementById('provideFeedback')
    const feedbackModal = document.getElementById('feedbackModal')
    const feedbackForm = document.getElementById('feedbackForm')

    if (feedbackButton && feedbackModal && feedbackForm) {
      // Open feedback modal
      feedbackButton.addEventListener('click', () => {
        feedbackModal.classList.add('active')
      })

      // Handle form submission
      feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault()

        const feedbackType = document.getElementById('feedbackType').value
        const feedbackDetails = document.getElementById('feedbackDetails').value

        // In a real implementation, this would send the feedback to a server
        console.log('Feedback submitted:', { feedbackType, feedbackDetails })

        // Show confirmation and close modal
        alert('Thank you for your feedback! It has been submitted to our team.')
        feedbackModal.classList.remove('active')

        // Reset form
        feedbackForm.reset()
      })
    }
  }

  // Questions & Discussion Functionality
  const setupQuestionsDiscussion = () => {
    const questionToggleBtns = document.querySelectorAll('.question-toggle-btn')
    const askQuestionBtns = document.querySelectorAll('.ask-question-btn')
    const replyBtns = document.querySelectorAll('.reply-btn')
    const tagBtns = document.querySelectorAll('.tag-btn')

    // Toggle question containers
    if (questionToggleBtns) {
      questionToggleBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const questionSection = btn.closest('.question-section')
          const questionContainer = questionSection.querySelector(
            '.question-container'
          )

          if (questionContainer) {
            questionContainer.classList.toggle('hidden')
          }
        })
      })
    }

    // Ask question buttons
    if (askQuestionBtns) {
      askQuestionBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const askQuestionContainer = btn.closest('.ask-question-container')
          const askForm = askQuestionContainer.querySelector('.ask-form')

          if (askForm) {
            askForm.classList.toggle('hidden')

            // Focus on textarea if form is visible
            if (!askForm.classList.contains('hidden')) {
              const textarea = askForm.querySelector('textarea')
              if (textarea) {
                textarea.focus()
              }
            }
          }
        })
      })
    }

    // Reply buttons
    if (replyBtns) {
      replyBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const questionItem = btn.closest('.question-item')
          const replyForm = questionItem.querySelector('.reply-form')

          if (replyForm) {
            replyForm.classList.toggle('hidden')

            // Focus on textarea if form is visible
            if (!replyForm.classList.contains('hidden')) {
              const textarea = replyForm.querySelector('textarea')
              if (textarea) {
                textarea.focus()
              }
            }
          }
        })
      })
    }

    // Tag buttons
    if (tagBtns) {
      tagBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          // In a real implementation, this would open a user selection interface
          alert(
            'In the real implementation, this would allow you to tag specific users or teams to notify them about this question.'
          )
        })
      })
    }

    // Handle cancel buttons
    const cancelReplyBtns = document.querySelectorAll('.cancel-reply-btn')
    if (cancelReplyBtns) {
      cancelReplyBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const replyForm = btn.closest('.reply-form')
          if (replyForm) {
            replyForm.classList.add('hidden')
            const textarea = replyForm.querySelector('textarea')
            if (textarea) {
              textarea.value = ''
            }
          }
        })
      })
    }

    const cancelAskBtns = document.querySelectorAll('.cancel-ask-btn')
    if (cancelAskBtns) {
      cancelAskBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const askForm = btn.closest('.ask-form')
          if (askForm) {
            askForm.classList.add('hidden')
            const textarea = askForm.querySelector('textarea')
            if (textarea) {
              textarea.value = ''
            }
          }
        })
      })
    }

    // Handle submit buttons for replies and questions
    const setupFormSubmissions = () => {
      // Submit reply
      const submitReplyBtns = document.querySelectorAll('.submit-reply-btn')
      if (submitReplyBtns) {
        submitReplyBtns.forEach((btn) => {
          btn.addEventListener('click', () => {
            const replyForm = btn.closest('.reply-form')
            const textarea = replyForm.querySelector('textarea')

            if (replyForm && textarea && textarea.value.trim()) {
              // In a real implementation, this would send the reply to a server
              alert('Your reply has been posted.')

              // Reset and hide form
              textarea.value = ''
              replyForm.classList.add('hidden')
            }
          })
        })
      }

      // Submit new question
      const submitAskBtns = document.querySelectorAll('.submit-ask-btn')
      if (submitAskBtns) {
        submitAskBtns.forEach((btn) => {
          btn.addEventListener('click', () => {
            const askForm = btn.closest('.ask-form')
            const textarea = askForm.querySelector('textarea')
            const tagSelect = askForm.querySelector('.tag-select')

            if (askForm && textarea && textarea.value.trim()) {
              // Get tagged person if any
              const taggedPerson = tagSelect ? tagSelect.value : ''

              // In a real implementation, this would send the question to a server
              console.log(
                'New question:',
                textarea.value,
                'Tagged:',
                taggedPerson
              )
              alert(
                'Your question has been posted.' +
                  (taggedPerson
                    ? ' The tagged person/team has been notified.'
                    : '')
              )

              // Reset and hide form
              textarea.value = ''
              if (tagSelect) {
                tagSelect.selectedIndex = 0
              }
              askForm.classList.add('hidden')
            }
          })
        })
      }
    }

    setupFormSubmissions()
  }

  // Table of Contents Navigation
  const setupTableOfContents = () => {
    // Since we've removed the sidebar TOC, this function is now mostly
    // handled by the setupFloatingTOC function
    // We'll keep this function as a placeholder in case we need to add
    // additional TOC functionality in the future
  }

  // Bookmark functionality
  const setupBookmark = () => {
    const bookmarkButton = document.querySelector('.bookmark-button')

    if (bookmarkButton) {
      // Check if article is already bookmarked
      const isBookmarked = localStorage.getItem('bookmarked_articles')
        ? JSON.parse(localStorage.getItem('bookmarked_articles')).includes(
            window.location.pathname
          )
        : false

      // Update bookmark button state
      if (isBookmarked) {
        bookmarkButton.innerHTML = '<i class="fas fa-bookmark"></i> Bookmarked'
        bookmarkButton.classList.add('bookmarked')
      }

      bookmarkButton.addEventListener('click', () => {
        // Toggle bookmark state
        const currentState = bookmarkButton.classList.contains('bookmarked')
        const newState = !currentState

        // Update button appearance
        if (newState) {
          bookmarkButton.innerHTML =
            '<i class="fas fa-bookmark"></i> Bookmarked'
          bookmarkButton.classList.add('bookmarked')
        } else {
          bookmarkButton.innerHTML = '<i class="far fa-bookmark"></i> Bookmark'
          bookmarkButton.classList.remove('bookmarked')
        }

        // Update localStorage
        let bookmarkedArticles = localStorage.getItem('bookmarked_articles')
          ? JSON.parse(localStorage.getItem('bookmarked_articles'))
          : []

        if (newState) {
          if (!bookmarkedArticles.includes(window.location.pathname)) {
            bookmarkedArticles.push(window.location.pathname)
          }
        } else {
          bookmarkedArticles = bookmarkedArticles.filter(
            (path) => path !== window.location.pathname
          )
        }

        localStorage.setItem(
          'bookmarked_articles',
          JSON.stringify(bookmarkedArticles)
        )
      })
    }
  }

  // Setup floating TOC
  const setupFloatingTOC = () => {
    const floatingToc = document.querySelector('.floating-toc')
    const toggleTocBtn = document.querySelector('.toggle-toc-btn')
    const tocFlyoutBtn = document.querySelector('.toc-flyout-btn')
    const floatingTocLinks = document.querySelectorAll('.floating-toc-list a')

    if (floatingToc && toggleTocBtn) {
      // Toggle TOC expansion
      toggleTocBtn.addEventListener('click', () => {
        floatingToc.classList.toggle('collapsed')
        floatingToc.classList.toggle('expanded')

        // Update toggle button icon
        const icon = toggleTocBtn.querySelector('i')
        if (floatingToc.classList.contains('collapsed')) {
          icon.className = 'fas fa-chevron-down'
        } else {
          icon.className = 'fas fa-chevron-up'
        }
      })

      // Flyout TOC when collapsed
      if (tocFlyoutBtn) {
        tocFlyoutBtn.addEventListener('click', () => {
          floatingToc.classList.remove('collapsed')
          floatingToc.classList.add('expanded')

          // Update toggle button icon
          const icon = toggleTocBtn.querySelector('i')
          icon.className = 'fas fa-chevron-up'
        })
      }

      // Initially collapse on smaller screens
      if (window.innerWidth <= 1400) {
        floatingToc.classList.add('collapsed')
        const icon = toggleTocBtn.querySelector('i')
        icon.className = 'fas fa-chevron-down'
      }

      // Handle TOC link clicks
      if (floatingTocLinks) {
        floatingTocLinks.forEach((link) => {
          link.addEventListener('click', (e) => {
            e.preventDefault()

            // Remove active class from all links
            floatingTocLinks.forEach((l) => l.classList.remove('active'))

            // Add active class to clicked link
            link.classList.add('active')

            // Scroll to the corresponding section
            const targetId = link.getAttribute('href').substring(1)
            const targetSection = document.getElementById(targetId)

            if (targetSection) {
              const yOffset = -80 // Offset for fixed header
              const y =
                targetSection.getBoundingClientRect().top +
                window.pageYOffset +
                yOffset

              window.scrollTo({
                top: y,
                behavior: 'smooth',
              })
            }
          })
        })
      }

      // Update active TOC item on scroll
      window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('.article-section')
        let currentSectionId = ''

        sections.forEach((section) => {
          const sectionTop = section.offsetTop

          if (pageYOffset >= sectionTop - 100) {
            currentSectionId = section.getAttribute('id')
          }
        })

        if (currentSectionId) {
          floatingTocLinks.forEach((link) => {
            link.classList.remove('active')
            if (link.getAttribute('href') === `#${currentSectionId}`) {
              link.classList.add('active')
            }
          })
        }
      })
    }
  }

  // Setup content detail level controls
  const setupDetailControls = () => {
    const detailOptions = document.querySelectorAll('.detail-option')
    const articleBody = document.querySelector('.article-body')

    if (detailOptions && articleBody) {
      // Set initial detail level class
      articleBody.classList.add('detail-level-medium')

      // Handle detail option clicks
      detailOptions.forEach((option) => {
        option.addEventListener('click', () => {
          // Remove active class from all options
          detailOptions.forEach((opt) => opt.classList.remove('active'))

          // Add active class to clicked option
          option.classList.add('active')

          // Update article body class for detail level
          const detailLevel = option.getAttribute('data-level')
          articleBody.className = 'article-body' // Reset classes
          articleBody.classList.add(`detail-level-${detailLevel}`)

          // Store preference in localStorage
          localStorage.setItem('preferred_detail_level', detailLevel)
        })
      })

      // Apply saved preference if exists
      const savedDetailLevel = localStorage.getItem('preferred_detail_level')
      if (savedDetailLevel) {
        const savedOption = document.querySelector(
          `.detail-option[data-level="${savedDetailLevel}"]`
        )
        if (savedOption) {
          savedOption.click()
        }
      }
    }
  }

  // Initialize all article page functionality
  setupShareModal()
  setupFeedbackModal()
  setupQuestionsDiscussion()
  setupTableOfContents()
  setupBookmark()
  setupFloatingTOC()
  setupDetailControls()
})
