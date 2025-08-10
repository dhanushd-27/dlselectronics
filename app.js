// DLS Electronics App JavaScript - Final Fixed Version

// Product data
const productData = {
  tv: [
    {
      id: 1,
      name: "Samsung 43\" Smart LED TV",
      mrp: 35000,
      booking_amount: 10000,
      features: ["4K Ultra HD", "Smart TV", "HDR Support", "Voice Control"]
    },
    {
      id: 2,
      name: "LG 55\" OLED Smart TV",
      mrp: 65000,
      booking_amount: 15000,
      features: ["4K OLED", "WebOS", "Dolby Vision", "AI ThinQ"]
    },
    {
      id: 3,
      name: "Sony 32\" HD LED TV",
      mrp: 25000,
      booking_amount: 8000,
      features: ["HD Ready", "X-Reality PRO", "Clear Audio+", "USB Playback"]
    }
  ],
  ac: [
    {
      id: 4,
      name: "LG 1.5 Ton 5 Star Split AC",
      mrp: 35000,
      booking_amount: 10000,
      features: ["5 Star Rating", "Copper Condenser", "Wi-Fi Enabled", "Dual Inverter"]
    },
    {
      id: 5,
      name: "Daikin 1 Ton Split AC",
      mrp: 32000,
      booking_amount: 9000,
      features: ["3 Star Rating", "R32 Refrigerant", "Stabilizer Free", "PM 2.5 Filter"]
    },
    {
      id: 6,
      name: "Voltas 2 Ton Window AC",
      mrp: 28000,
      booking_amount: 8000,
      features: ["3 Star Rating", "Copper Condenser", "Auto Clean", "Turbo Cool"]
    }
  ],
  fridge: [
    {
      id: 7,
      name: "Whirlpool 265L Double Door",
      mrp: 25000,
      booking_amount: 8000,
      features: ["Frost Free", "Energy Efficient", "Vegetable Crisper", "LED Lighting"]
    },
    {
      id: 8,
      name: "Samsung 253L Single Door",
      mrp: 18000,
      booking_amount: 6000,
      features: ["Direct Cool", "Base Stand Drawer", "Toughened Glass", "Smart Connect"]
    },
    {
      id: 9,
      name: "LG 687L Side by Side",
      mrp: 85000,
      booking_amount: 20000,
      features: ["Frost Free", "Water Dispenser", "Door Cooling+", "Smart Diagnosis"]
    }
  ],
  "washing-machine": [
    {
      id: 10,
      name: "IFB 8kg Front Load",
      mrp: 45000,
      booking_amount: 12000,
      features: ["Front Load", "1400 RPM", "Steam Wash", "Aqua Energie"]
    },
    {
      id: 11,
      name: "LG 7kg Top Load",
      mrp: 22000,
      booking_amount: 7000,
      features: ["Top Load", "Smart Inverter", "Punch+3", "Auto Restart"]
    },
    {
      id: 12,
      name: "Samsung 6.5kg Semi-Automatic",
      mrp: 15000,
      booking_amount: 5000,
      features: ["Semi Automatic", "Air Turbo Drying", "Magic Filter", "Rust Proof"]
    }
  ]
};

// App state
let currentUser = {
  referralCode: '',
  bookings: [],
  referrals: []
};

let currentBooking = {};
let currentStep = 1;

// Initialize app when DOM is ready
function initializeApp() {
  console.log('Initializing DLS Electronics App...');
  
  // Generate referral code for demo
  currentUser.referralCode = generateReferralCode();
  
  // Set initial language
  updateLanguage('en');
  
  // Load featured products
  loadFeaturedProducts();
  
  // Setup event listeners
  setupEventListeners();
  
  // Update referral code in UI
  const referralCodeElement = document.getElementById('user-referral-code');
  if (referralCodeElement) {
    referralCodeElement.textContent = currentUser.referralCode;
  }
  updateShareText();
  
  console.log('App initialized successfully');
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Add click listeners directly to buttons that might not have onclick attributes
  setTimeout(() => {
    // Main booking buttons
    const heroBookNowBtns = document.querySelectorAll('.hero-buttons .btn--primary');
    heroBookNowBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        openBookingModal();
      });
    });

    // Refer & Earn buttons
    const referEarnBtns = document.querySelectorAll('.hero-buttons .btn--outline, .nav-link[href="#referral"]');
    referEarnBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        openReferralModal();
      });
    });

    // Category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
      card.addEventListener('click', function(e) {
        e.preventDefault();
        // Determine category from the card content
        const categoryText = this.querySelector('h3').textContent.toLowerCase();
        let category = '';
        if (categoryText.includes('tv')) category = 'tv';
        else if (categoryText.includes('air') || categoryText.includes('ac')) category = 'ac';
        else if (categoryText.includes('refrigerator') || categoryText.includes('fridge')) category = 'fridge';
        else if (categoryText.includes('washing') || categoryText.includes('machine')) category = 'washing-machine';
        
        viewCategory(category);
      });
    });

    // Category buttons inside cards
    const categoryBtns = document.querySelectorAll('.category-card .btn--outline');
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        const card = this.closest('.category-card');
        const categoryText = card.querySelector('h3').textContent.toLowerCase();
        let category = '';
        if (categoryText.includes('tv')) category = 'tv';
        else if (categoryText.includes('air') || categoryText.includes('ac')) category = 'ac';
        else if (categoryText.includes('refrigerator') || categoryText.includes('fridge')) category = 'fridge';
        else if (categoryText.includes('washing') || categoryText.includes('machine')) category = 'washing-machine';
        
        viewCategory(category);
      });
    });

    console.log('Direct event listeners attached');
  }, 500);

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
  }

  // Language selector
  const languageSelect = document.getElementById('language-select');
  if (languageSelect) {
    languageSelect.addEventListener('change', function() {
      updateLanguage(this.value);
    });
  }

  // Product category selection in booking modal
  const productCategory = document.getElementById('product-category');
  if (productCategory) {
    productCategory.addEventListener('change', function() {
      loadProductsForCategory(this.value);
    });
  }

  // Product selection in booking modal
  const productSelect = document.getElementById('product-select');
  if (productSelect) {
    productSelect.addEventListener('change', function() {
      updatePriceBreakdown(this.value);
    });
  }

  // Terms acceptance checkbox
  const termsAccept = document.getElementById('terms-accept');
  if (termsAccept) {
    termsAccept.addEventListener('change', function() {
      const sendOtpBtn = document.getElementById('send-otp-btn');
      if (sendOtpBtn) {
        sendOtpBtn.disabled = !this.checked;
      }
    });
  }

  // OTP input handling
  const otpInputs = document.querySelectorAll('.otp-digit');
  otpInputs.forEach((input, index) => {
    input.addEventListener('input', function() {
      if (this.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });
    
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Backspace' && this.value === '' && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });

  // Contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }

  // Smooth scrolling for navigation
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
        
        // Update active navigation
        document.querySelectorAll('.nav-link').forEach(navLink => {
          navLink.classList.remove('active');
        });
        this.classList.add('active');
      }
    });
  });

  // Close modals when clicking outside
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
      const modalId = e.target.id;
      closeModal(modalId);
    }
  });

  // Handle escape key to close modals
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal:not(.hidden)');
      if (openModal) {
        closeModal(openModal.id);
      }
    }
  });

  console.log('Event listeners setup complete');
}

function toggleMobileMenu() {
  const navMenu = document.querySelector('.nav-menu');
  if (navMenu) {
    const isVisible = navMenu.style.display === 'flex';
    navMenu.style.display = isVisible ? 'none' : 'flex';
    
    // Also toggle mobile styles
    if (!isVisible) {
      navMenu.style.flexDirection = 'column';
      navMenu.style.position = 'absolute';
      navMenu.style.top = '100%';
      navMenu.style.left = '0';
      navMenu.style.right = '0';
      navMenu.style.backgroundColor = 'var(--color-brand-white)';
      navMenu.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
      navMenu.style.padding = 'var(--space-16)';
    }
  }
}

function updateLanguage(language) {
  console.log('Language switched to:', language);
  
  const translations = {
    'en': {
      'hero-title': 'Simple Life, Smart Life',
      'hero-subtitle': 'Transform your home with premium electronics. Book now with just ₹8,000 and get free home delivery through our unique referral program.',
    },
    'hi': {
      'hero-title': 'सरल जीवन, स्मार्ट जीवन',
      'hero-subtitle': 'प्रीमियम इलेक्ट्रॉनिक्स से अपने घर को बदलें। अभी केवल ₹8,000 में बुक करें और हमारे अनूठे रेफरल प्रोग्राम के माध्यम से मुफ्त होम डिलिव्हरी पाएं।',
    },
    'mr': {
      'hero-title': 'सोपे जीवन, स्मार्ट जीवन',
      'hero-subtitle': 'प्रीमियम इलेक्ट्रॉनिक्सने तुमचे घर बदला. फक्त ₹8,000 मध्ये बुक करा आणि आमच्या अद्वितीय रेफरल प्रोग्रामद्वारे मोफत होम डिलिव्हरी मिळवा.',
    }
  };
  
  // Update hero title and subtitle if elements exist
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  
  if (heroTitle && translations[language]) {
    heroTitle.textContent = translations[language]['hero-title'];
  }
  if (heroSubtitle && translations[language]) {
    heroSubtitle.textContent = translations[language]['hero-subtitle'];
  }
}

function loadFeaturedProducts() {
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) {
    console.log('Products grid not found');
    return;
  }

  console.log('Loading featured products...');

  // Get featured products (first product from each category)
  const featuredProducts = [
    { ...productData.tv[0], category: 'TV', icon: '📺' },
    { ...productData.ac[0], category: 'AC', icon: '❄️' },
    { ...productData.fridge[0], category: 'Fridge', icon: '🧊' }
  ];

  productsGrid.innerHTML = featuredProducts.map(product => `
    <div class="product-card">
      <div class="product-image">${product.icon}</div>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <ul class="product-features">
          ${product.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
        <div class="product-pricing">
          <div class="price-mrp">₹${product.mrp.toLocaleString()}</div>
          <div class="price-booking">Book: ₹${product.booking_amount.toLocaleString()}</div>
        </div>
        <button class="btn btn--primary btn--full-width product-book-btn" data-product-id="${product.id}">
          Book Now
        </button>
      </div>
    </div>
  `).join('');

  // Add event listeners to product book buttons
  setTimeout(() => {
    const productBookBtns = document.querySelectorAll('.product-book-btn');
    productBookBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const productId = this.getAttribute('data-product-id');
        bookProduct(parseInt(productId));
      });
    });
  }, 100);

  console.log('Featured products loaded');
}

function loadProductsForCategory(category) {
  const productSelect = document.getElementById('product-select');
  if (!productSelect) return;
  
  if (!category || !productData[category]) {
    productSelect.innerHTML = '<option value="">Choose product first</option>';
    productSelect.disabled = true;
    const nextBtn = document.getElementById('next-to-details');
    if (nextBtn) nextBtn.disabled = true;
    return;
  }

  const products = productData[category];
  productSelect.innerHTML = '<option value="">Select a product</option>' + 
    products.map(product => 
      `<option value="${product.id}" data-mrp="${product.mrp}" data-booking="${product.booking_amount}">
        ${product.name} - ₹${product.mrp.toLocaleString()}
      </option>`
    ).join('');
  
  productSelect.disabled = false;
}

function updatePriceBreakdown(productId) {
  const priceBreakdown = document.getElementById('price-breakdown');
  const nextBtn = document.getElementById('next-to-details');
  
  if (!productId) {
    if (priceBreakdown) priceBreakdown.classList.add('hidden');
    if (nextBtn) nextBtn.disabled = true;
    return;
  }

  const selectedOption = document.querySelector(`#product-select option[value="${productId}"]`);
  if (!selectedOption) return;
  
  const mrp = parseInt(selectedOption.dataset.mrp);
  const bookingAmount = parseInt(selectedOption.dataset.booking);
  const balance = mrp - bookingAmount;

  // Update price display elements
  const productMrpEl = document.getElementById('product-mrp');
  const bookingAmountEl = document.getElementById('booking-amount');
  const balanceAmountEl = document.getElementById('balance-amount');
  
  if (productMrpEl) productMrpEl.textContent = `₹${mrp.toLocaleString()}`;
  if (bookingAmountEl) bookingAmountEl.textContent = `₹${bookingAmount.toLocaleString()}`;
  if (balanceAmountEl) balanceAmountEl.textContent = `₹${balance.toLocaleString()}`;
  
  // Store in current booking
  currentBooking.productId = productId;
  currentBooking.mrp = mrp;
  currentBooking.bookingAmount = bookingAmount;
  currentBooking.balance = balance;

  if (priceBreakdown) priceBreakdown.classList.remove('hidden');
  if (nextBtn) nextBtn.disabled = false;
}

// Modal functions - Global functions
function openBookingModal() {
  console.log('Opening booking modal...');
  openModal('booking-modal');
}

function openReferralModal() {
  console.log('Opening referral modal...');
  openModal('referral-modal');
  updateReferralStats();
}

function viewCategory(category) {
  console.log('Viewing category:', category);
  openBookingModal();
  setTimeout(() => {
    const categorySelect = document.getElementById('product-category');
    if (categorySelect) {
      categorySelect.value = category;
      loadProductsForCategory(category);
    }
  }, 200);
}

function bookProduct(productId) {
  console.log('Booking product:', productId);
  openBookingModal();
  
  const product = findProductById(productId);
  if (product) {
    // Determine category
    let category = '';
    for (const cat in productData) {
      if (productData[cat].find(p => p.id === productId)) {
        category = cat;
        break;
      }
    }
    
    setTimeout(() => {
      const categorySelect = document.getElementById('product-category');
      if (categorySelect) {
        categorySelect.value = category;
        loadProductsForCategory(category);
        
        setTimeout(() => {
          const productSelect = document.getElementById('product-select');
          if (productSelect) {
            productSelect.value = productId;
            updatePriceBreakdown(productId);
          }
        }, 200);
      }
    }, 200);
  }
}

function openModal(modalId) {
  console.log('Opening modal:', modalId);
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    console.log('Modal opened:', modalId);
  } else {
    console.error('Modal not found:', modalId);
  }
}

function closeModal(modalId) {
  console.log('Closing modal:', modalId);
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    
    if (modalId === 'booking-modal') {
      resetBookingModal();
    }
  }
}

function resetBookingModal() {
  currentStep = 1;
  currentBooking = {};
  showStep(1);
  
  // Reset form elements
  const categorySelect = document.getElementById('product-category');
  const productSelect = document.getElementById('product-select');
  const priceBreakdown = document.getElementById('price-breakdown');
  const nextBtn = document.getElementById('next-to-details');
  
  if (categorySelect) categorySelect.value = '';
  if (productSelect) {
    productSelect.innerHTML = '<option value="">Choose product first</option>';
    productSelect.disabled = true;
  }
  if (priceBreakdown) priceBreakdown.classList.add('hidden');
  if (nextBtn) nextBtn.disabled = true;
}

// Step navigation functions
function nextStep(stepNumber) {
  if (validateCurrentStep()) {
    showStep(stepNumber);
  }
}

function prevStep(stepNumber) {
  showStep(stepNumber);
}

function showStep(stepNumber) {
  console.log('Showing step:', stepNumber);
  
  // Hide all steps
  document.querySelectorAll('.booking-steps .step').forEach(step => {
    step.classList.remove('active');
    step.classList.add('hidden');
  });
  
  // Show current step
  const currentStepEl = document.getElementById(`step-${stepNumber}`);
  if (currentStepEl) {
    currentStepEl.classList.remove('hidden');
    currentStepEl.classList.add('active');
  }
  
  currentStep = stepNumber;
}

function validateCurrentStep() {
  switch(currentStep) {
    case 1:
      return currentBooking.productId;
    case 2:
      const name = document.getElementById('customer-name')?.value;
      const mobile = document.getElementById('customer-mobile')?.value;
      const state = document.getElementById('customer-state')?.value;
      const address = document.getElementById('customer-address')?.value;
      
      if (!name || !mobile || !state || !address) {
        alert('Please fill all required fields');
        return false;
      }
      
      // Store customer details
      currentBooking.customerName = name;
      currentBooking.customerMobile = mobile;
      currentBooking.customerState = state;
      currentBooking.customerAddress = address;
      currentBooking.referralCode = document.getElementById('referral-code')?.value || '';
      
      return true;
    case 3:
      const termsChecked = document.getElementById('terms-accept')?.checked;
      if (!termsChecked) {
        alert('Please accept the terms and conditions');
        return false;
      }
      return currentBooking.otpVerified;
    default:
      return true;
  }
}

// OTP functions
function sendOTP() {
  const mobile = currentBooking.customerMobile;
  if (!mobile) {
    alert('Please enter mobile number first');
    return;
  }

  console.log('Sending OTP to:', mobile);
  
  // Simulate OTP sending
  const otp = '1234';
  currentBooking.otp = otp;
  
  const sendBtn = document.getElementById('send-otp-btn');
  const otpGroup = document.getElementById('otp-input-group');
  
  if (sendBtn) {
    sendBtn.textContent = 'OTP Sent!';
    sendBtn.disabled = true;
  }
  
  if (otpGroup) {
    otpGroup.classList.remove('hidden');
  }
  
  // Auto-fill OTP for demo purposes
  setTimeout(() => {
    const otpInputs = document.querySelectorAll('.otp-digit');
    if (otpInputs.length >= 4) {
      otpInputs[0].value = '1';
      otpInputs[1].value = '2';
      otpInputs[2].value = '3';
      otpInputs[3].value = '4';
    }
  }, 1000);
}

function verifyOTP() {
  const otpInputs = document.querySelectorAll('.otp-digit');
  const enteredOTP = Array.from(otpInputs).map(input => input.value).join('');
  
  console.log('Verifying OTP:', enteredOTP);
  
  if (enteredOTP === currentBooking.otp) {
    currentBooking.otpVerified = true;
    
    const verifyBtn = document.getElementById('verify-otp-btn');
    const nextBtn = document.getElementById('next-to-payment');
    
    if (verifyBtn) {
      verifyBtn.textContent = 'Verified ✓';
      verifyBtn.disabled = true;
    }
    
    if (nextBtn) {
      nextBtn.disabled = false;
    }
    
    // Update payment amount
    const finalAmount = document.getElementById('final-amount');
    if (finalAmount && currentBooking.bookingAmount) {
      finalAmount.textContent = `₹${currentBooking.bookingAmount.toLocaleString()}`;
    }
  } else {
    alert('Invalid OTP. Please try again.');
  }
}

function completeBooking() {
  console.log('Completing booking...');
  
  // Validate payment proof upload
  const paymentProof = document.getElementById('payment-proof')?.files[0];
  if (!paymentProof) {
    alert('Please upload payment screenshot');
    return;
  }

  // Store transaction details
  currentBooking.transactionId = document.getElementById('transaction-id')?.value || '';
  currentBooking.paymentProof = paymentProof.name;
  currentBooking.bookingDate = new Date();
  currentBooking.status = 'Payment Pending';
  currentBooking.bookingId = 'DLS-' + Date.now();

  // Add to user bookings
  currentUser.bookings.push({ ...currentBooking });

  // Show success step
  showBookingSummary();
  showStep(5);
}

function showBookingSummary() {
  const summary = document.getElementById('booking-summary');
  const product = findProductById(currentBooking.productId);
  
  if (summary && product) {
    summary.innerHTML = `
      <div class="summary-item"><strong>Booking ID:</strong> ${currentBooking.bookingId}</div>
      <div class="summary-item"><strong>Product:</strong> ${product.name}</div>
      <div class="summary-item"><strong>Amount Paid:</strong> ₹${currentBooking.bookingAmount.toLocaleString()}</div>
      <div class="summary-item"><strong>Balance:</strong> ₹${currentBooking.balance.toLocaleString()}</div>
      <div class="summary-item"><strong>Your Referral Code:</strong> ${currentUser.referralCode}</div>
    `;
  }
}

function findProductById(productId) {
  for (const category in productData) {
    const product = productData[category].find(p => p.id == productId);
    if (product) return product;
  }
  return null;
}

// Referral functions
function generateReferralCode() {
  return 'DLS-' + Math.random().toString(36).substr(2, 7).toUpperCase();
}

function updateReferralStats() {
  const successfulReferrals = currentUser.referrals.filter(r => r.status === 'confirmed').length;
  const pendingReferrals = currentUser.referrals.filter(r => r.status === 'pending').length;
  
  const statNumbers = document.querySelectorAll('.referral-stats .stat-number');
  if (statNumbers[0]) statNumbers[0].textContent = `${successfulReferrals}/3`;
  if (statNumbers[1]) statNumbers[1].textContent = pendingReferrals;
}

function copyReferralCode() {
  const code = document.getElementById('user-referral-code')?.textContent;
  if (!code) return;
  
  navigator.clipboard.writeText(code).then(() => {
    alert('Referral code copied to clipboard!');
  }).catch(() => {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = code;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Referral code copied to clipboard!');
  });
}

function updateShareText() {
  const shareText = `🎉 Book premium electronics at DLS Electronics and get FREE delivery! 

Use my referral code: ${currentUser.referralCode}

📱 Visit dlsstore.com 
📞 Call: 7770007110

Transform your home with smart appliances today!`;
  
  const shareTextEl = document.getElementById('share-text');
  if (shareTextEl) {
    shareTextEl.textContent = shareText;
  }
}

function shareWhatsApp() {
  const shareText = document.getElementById('share-text')?.textContent;
  if (shareText) {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  }
}

function shareGeneric() {
  const shareText = document.getElementById('share-text')?.textContent;
  const shareUrl = `https://dlsstore.com?ref=${currentUser.referralCode}`;
  const fullText = `${shareText}\n\n${shareUrl}`;
  
  navigator.clipboard.writeText(fullText).then(() => {
    alert('Share link copied to clipboard!');
  }).catch(() => {
    // Fallback
    const textArea = document.createElement('textarea');
    textArea.value = fullText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    alert('Share link copied to clipboard!');
  });
}

// Contact and utility functions
function handleContactForm(e) {
  e.preventDefault();
  console.log('Contact form submitted');
  alert('Thank you for your message! We will contact you soon.');
  e.target.reset();
}

function openWhatsApp() {
  const message = 'Hi! I need help with DLS Electronics products and booking process.';
  const whatsappUrl = `https://wa.me/917770007110?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}

function showTerms() {
  alert('Terms & Conditions page would open here. In a real app, this would navigate to a dedicated page or modal.');
}

function showPrivacy() {
  alert('Privacy Policy page would open here. In a real app, this would navigate to a dedicated page or modal.');
}

function showRefund() {
  alert('Refund Policy page would open here. In a real app, this would navigate to a dedicated page or modal.');
}

// Make all functions available globally
window.openBookingModal = openBookingModal;
window.openReferralModal = openReferralModal;
window.viewCategory = viewCategory;
window.bookProduct = bookProduct;
window.closeModal = closeModal;
window.nextStep = nextStep;
window.prevStep = prevStep;
window.sendOTP = sendOTP;
window.verifyOTP = verifyOTP;
window.completeBooking = completeBooking;
window.copyReferralCode = copyReferralCode;
window.shareWhatsApp = shareWhatsApp;
window.shareGeneric = shareGeneric;
window.openWhatsApp = openWhatsApp;
window.showTerms = showTerms;
window.showPrivacy = showPrivacy;
window.showRefund = showRefund;

// Smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

console.log('DLS Electronics JavaScript loaded successfully - All functions available globally');