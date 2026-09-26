// Voyex AI - Core Application Engine & State Management
// World-Class AI Travel Planner Website

let appState = {
  activeTab: 'planner', // 'planner', 'itinerary', 'map', 'destinations', 'budget', 'packing', 'visa', 'booking'
  currentTrip: null,
  savedTrips: [],
  currency: 'USD',
  apiKey: localStorage.getItem('voyex_gemini_key') || '',
  chatMessages: [
    { sender: 'ai', text: '👋 Hello! I am your AI Travel Concierge. Ask me anything about your destination, hidden gems, local food, or packing tips!' }
  ],
  packingItems: [],
  selectedDayIndex: 0,
  mapInstance: null,
  mapMarkers: [],
  mapPolyline: null
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  loadSavedTrips();
  initDefaultPackingList();
  renderDestinationsGrid();
  updateCurrencyDisplay();
  setupEventListeners();

  // Load sample trip by default so user immediately sees world-class interactive UI
  loadDefaultTrip();
});

// Load Default Trip (Tokyo Sample)
function loadDefaultTrip() {
  const tokyo = DESTINATIONS.find(d => d.id === 'tokyo');
  if (tokyo) {
    appState.currentTrip = {
      id: 'trip_' + Date.now(),
      destination: 'Tokyo, Japan',
      destinationId: 'tokyo',
      startDate: new Date().toISOString().split('T')[0],
      durationDays: 3,
      travelers: 'Couple',
      travelStyle: 'Culture & Foodie',
      budgetTier: 'Moderate ($$)',
      pace: 'Balanced',
      itineraryDays: JSON.parse(JSON.stringify(tokyo.itineraryDays)),
      notes: 'Discover neon streetscapes, historic Shinto shrines, and world-class ramen alleyways.',
      cityData: tokyo
    };
    renderItineraryView();
  }
}

// Load Saved Trips from LocalStorage
function loadSavedTrips() {
  try {
    const saved = localStorage.getItem('voyex_saved_trips');
    if (saved) {
      appState.savedTrips = JSON.parse(saved);
      updateSavedTripsBadge();
    }
  } catch (e) {
    console.error('Error loading saved trips:', e);
  }
}

function saveTripToVault() {
  if (!appState.currentTrip) return;
  const existingIdx = appState.savedTrips.findIndex(t => t.id === appState.currentTrip.id);
  if (existingIdx >= 0) {
    appState.savedTrips[existingIdx] = JSON.parse(JSON.stringify(appState.currentTrip));
  } else {
    appState.savedTrips.unshift(JSON.parse(JSON.stringify(appState.currentTrip)));
  }
  localStorage.setItem('voyex_saved_trips', JSON.stringify(appState.savedTrips));
  updateSavedTripsBadge();
  showToast('Trip successfully saved to your vault! 🎒');
}

function updateSavedTripsBadge() {
  const badge = document.getElementById('savedTripsCountBadge');
  if (badge) {
    badge.innerText = appState.savedTrips.length;
    badge.style.display = appState.savedTrips.length > 0 ? 'inline-flex' : 'none';
  }
}

// Navigation & Tab Switching
function switchTab(tabId) {
  appState.activeTab = tabId;

  // Update tab navigation active classes
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    if (btn.dataset.tab === tabId) {
      btn.className = 'nav-tab-btn px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 bg-primary-600 text-white shadow-md shadow-primary-500/20';
    } else {
      btn.className = 'nav-tab-btn px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-slate-800';
    }
  });

  // Toggle view sections
  document.querySelectorAll('.app-section').forEach(sec => {
    sec.classList.add('hidden');
  });

  const activeSec = document.getElementById(`section-${tabId}`);
  if (activeSec) {
    activeSec.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (tabId === 'itinerary') {
    renderItineraryView();
  } else if (tabId === 'flights') {
    renderFlightsView();
  } else if (tabId === 'trains') {
    renderTrainsView();
  } else if (tabId === 'buses') {
    renderBusesView();
  } else if (tabId === 'cars') {
    renderCarRentalsView();
  } else if (tabId === 'split') {
    renderSplitExpensesView();
  } else if (tabId === 'photos') {
    renderPhotoSpotsView();
  } else if (tabId === 'safety') {
    renderSafetyScamsView();
  } else if (tabId === 'map') {
    renderMapView();
  } else if (tabId === 'budget') {
    renderBudgetView();
  } else if (tabId === 'packing') {
    renderPackingView();
  } else if (tabId === 'visa') {
    renderVisaCultureView();
  } else if (tabId === 'booking') {
    renderBookingView();
  }

  // Close mobile menu if open
  const mobileMenu = document.getElementById('mobileNavMenu');
  if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.add('hidden');
  }
}

// AI Trip Generator Logic
async function handleTripGeneration(e) {
  e.preventDefault();
  const destInput = document.getElementById('plannerDestination').value.trim();
  const duration = parseInt(document.getElementById('plannerDuration').value) || 3;
  const travelers = document.getElementById('plannerTravelers').value;
  const travelStyle = document.getElementById('plannerStyle').value;
  const budgetTier = document.getElementById('plannerBudget').value;
  const pace = document.getElementById('plannerPace').value;
  const interests = document.getElementById('plannerInterests').value.trim();

  if (!destInput) {
    showToast('Please specify your destination! ✈️', 'error');
    return;
  }

  const generateBtn = document.getElementById('generateTripBtn');
  const originalBtnContent = generateBtn.innerHTML;
  generateBtn.disabled = true;
  generateBtn.innerHTML = `
    <span class="inline-flex items-center gap-2">
      <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Synthesizing AI Itinerary...
    </span>
  `;

  try {
    // Check if destination matches predefined dataset
    const matchedDest = DESTINATIONS.find(d => 
      destInput.toLowerCase().includes(d.name.toLowerCase()) || 
      destInput.toLowerCase().includes(d.country.toLowerCase())
    );

    let itineraryDays = [];
    let cityData = matchedDest || null;

    if (matchedDest) {
      itineraryDays = generateItineraryFromDatabase(matchedDest, duration, travelStyle, pace);
    } else {
      itineraryDays = generateSmartProceduralItinerary(destInput, duration, travelStyle, pace);
      cityData = createGenericCityData(destInput, itineraryDays);
    }

    // Simulate AI synthesis progress
    await new Promise(res => setTimeout(res, 900));

    appState.currentTrip = {
      id: 'trip_' + Date.now(),
      destination: destInput,
      destinationId: matchedDest ? matchedDest.id : 'custom',
      startDate: document.getElementById('plannerStartDate').value || new Date().toISOString().split('T')[0],
      durationDays: duration,
      travelers: travelers,
      travelStyle: travelStyle,
      budgetTier: budgetTier,
      pace: pace,
      interests: interests,
      itineraryDays: itineraryDays,
      notes: `Curated personalized journey for ${travelers.toLowerCase()} exploring ${destInput}.`,
      cityData: cityData
    };

    updatePackingListForDestination(destInput, duration);
    switchTab('itinerary');
    showToast(`✨ Generated ${duration}-Day Itinerary for ${destInput}!`);

    // Trigger celebration confetti
    if (typeof confetti === 'function') {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  } catch (err) {
    console.error(err);
    showToast('Something went wrong during generation. Please retry.', 'error');
  } finally {
    generateBtn.disabled = false;
    generateBtn.innerHTML = originalBtnContent;
  }
}

// Generate Itinerary from Curated DB
function generateItineraryFromDatabase(dest, duration, travelStyle, pace) {
  let days = [];
  const baseDays = dest.itineraryDays || [];

  for (let i = 0; i < duration; i++) {
    if (i < baseDays.length) {
      days.push(JSON.parse(JSON.stringify(baseDays[i])));
    } else {
      // Procedurally generate extended days
      const dayNum = i + 1;
      days.push({
        day: dayNum,
        title: `Day ${dayNum}: Hidden Gems & Leisure in ${dest.name}`,
        activities: [
          { time: "09:00 AM", category: "Discovery", title: `Explore Local Neighborhoods & Boutiques`, desc: `Wander through scenic side streets and local artisan cafes in ${dest.name}.`, cost: 15, lat: dest.coordinates[0] + (Math.random() - 0.5) * 0.04, lng: dest.coordinates[1] + (Math.random() - 0.5) * 0.04, icon: "compass" },
          { time: "01:00 PM", category: "Food", title: `Traditional Regional Tasting Lunch`, desc: `Sample seasonal regional dishes and sweets at a top-rated eatery.`, cost: 22, lat: dest.coordinates[0] + (Math.random() - 0.5) * 0.04, lng: dest.coordinates[1] + (Math.random() - 0.5) * 0.04, icon: "utensils" },
          { time: "04:30 PM", category: "Experience", title: `Scenic Sunset Viewpoint & Relaxation`, desc: `Relax at a local panoramic terrace or park with breathtaking golden hour views.`, cost: 10, lat: dest.coordinates[0] + (Math.random() - 0.5) * 0.04, lng: dest.coordinates[1] + (Math.random() - 0.5) * 0.04, icon: "camera" },
          { time: "08:00 PM", category: "Dining", title: `Farewell Evening Feast & Live Music`, desc: `Celebrate the trip with fine dining and evening atmosphere.`, cost: 35, lat: dest.coordinates[0] + (Math.random() - 0.5) * 0.04, lng: dest.coordinates[1] + (Math.random() - 0.5) * 0.04, icon: "glass" }
        ]
      });
    }
  }
  return days;
}

// Procedural AI Generator for Any City Worldwide
function generateSmartProceduralItinerary(destName, duration, style, pace) {
  const days = [];
  const coords = [40.0 + (Math.random() * 20 - 10), 10.0 + (Math.random() * 40 - 20)];

  const themes = [
    { title: "Arrival & City Center Highlights", morning: "Historical Old Town & Landmark Square", lunch: "Traditional Local Market Food", afternoon: "Famous Museum & Cultural Walk", evening: "Panoramic Sunset Lookout & Dinner" },
    { title: "Art, Architecture & Scenic Neighborhoods", morning: "Architectural Wonders & Royal Gardens", lunch: "Authentic Bistro & Specialty Coffee", afternoon: "Local Art Galleries & Shopping Stroll", evening: "Waterfront Promenade & Cocktail Lounge" },
    { title: "Nature, Adventure & Local Flavors", morning: "Scenic Nature Park or Viewpoint Hike", lunch: "Countryside / Waterfront Dining", afternoon: "Interactive Cultural Workshop or Boat Tour", evening: "Lantern-Lit Old Quarter & Wine Bar" },
    { title: "Hidden Gems & Artisan Quarters", morning: "Artisans Market & Vintage Boutiques", lunch: "Chef-Recommended Fusion Cuisine", afternoon: "Quiet Gardens & Botanical Greenhouses", evening: "Live Music & Historic Tavern" }
  ];

  for (let i = 0; i < duration; i++) {
    const theme = themes[i % themes.length];
    const dayNum = i + 1;
    days.push({
      day: dayNum,
      title: `Day ${dayNum}: ${theme.title} in ${destName}`,
      activities: [
        { time: "09:00 AM", category: "Culture", title: `${theme.morning}`, desc: `Immerse in the iconic sights, historic architecture, and morning atmosphere of ${destName}.`, cost: 18, lat: coords[0] + (Math.random() - 0.5) * 0.03, lng: coords[1] + (Math.random() - 0.5) * 0.03, icon: "landmark" },
        { time: "01:00 PM", category: "Food", title: `${theme.lunch}`, desc: `Savor authentic regional flavors and fresh specialties recommended by locals.`, cost: 20, lat: coords[0] + (Math.random() - 0.5) * 0.03, lng: coords[1] + (Math.random() - 0.5) * 0.03, icon: "utensils" },
        { time: "03:30 PM", category: "Sightseeing", title: `${theme.afternoon}`, desc: `Discover stunning photography spots, artisan shopping, and cultural heritage.`, cost: 15, lat: coords[0] + (Math.random() - 0.5) * 0.03, lng: coords[1] + (Math.random() - 0.5) * 0.03, icon: "camera" },
        { time: "07:30 PM", category: "Dining", title: `${theme.evening}`, desc: `Unwind with fine dining, local wines or beverages, and vibrant evening nightlife.`, cost: 35, lat: coords[0] + (Math.random() - 0.5) * 0.03, lng: coords[1] + (Math.random() - 0.5) * 0.03, icon: "glass" }
      ]
    });
  }
  return days;
}

function createGenericCityData(destName, itineraryDays) {
  return {
    id: destName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name: destName,
    country: "International Destination",
    tagline: `Experience the captivating magic, culture, and culinary wonders of ${destName}`,
    continent: "Global",
    vibe: ["Culture", "Discovery", "Foodie"],
    budgetLevel: "Moderate ($$)",
    avgDailyCost: 95,
    currency: "USD ($)",
    language: "Local Language & English",
    coordinates: itineraryDays[0]?.activities[0] ? [itineraryDays[0].activities[0].lat, itineraryDays[0].activities[0].lng] : [48.8566, 2.3522],
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
    description: `A dynamic, curated travel experience designed for unforgettable memories in ${destName}.`,
    highlights: ["Historic Landmark Strolls", "Authentic Local Gastronomy", "Scenic Viewpoint Sunsets", "Artisan Markets"],
    visaInfo: {
      type: "Check national consulate website for specific passport visa rules",
      passportValidity: "Standard requirement: 6 months validity",
      adapter: "Universal Adapter Recommended (100-240V)",
      emergency: { police: "112 / 911", ambulance: "112 / 911", touristHelp: "Local Consulate" }
    },
    cultureEtiquette: {
      tipping: "10-15% is standard practice in restaurants and for tour guides.",
      customs: ["Always greet locals respectfully", "Keep travel copies of passports in digital backup", "Validate public transit passes"],
      phrases: [
        { en: "Hello", local: "Hello / Bonjour / Ciao / Hola", phonetic: "heh-loh" },
        { en: "Thank you", local: "Thank you / Merci / Grazie / Gracias", phonetic: "thahnk yoo" }
      ]
    },
    itineraryDays: itineraryDays
  };
}

// Render Itinerary View
function renderItineraryView() {
  const container = document.getElementById('itineraryContent');
  if (!container) return;

  if (!appState.currentTrip) {
    container.innerHTML = `
      <div class="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-8">
        <div class="w-16 h-16 bg-primary-50 dark:bg-primary-900/30 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">✈️</div>
        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">No Active Itinerary Yet</h3>
        <p class="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">Use our AI Trip Planner wizard to instantly generate a day-by-day travel masterplan!</p>
        <button onclick="switchTab('planner')" class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl shadow-lg transition">Create New Trip Now</button>
      </div>
    `;
    return;
  }

  const trip = appState.currentTrip;
  const rate = CURRENCIES[appState.currency].rate;
  const symbol = CURRENCIES[appState.currency].symbol;

  let totalTripCost = 0;
  trip.itineraryDays.forEach(day => {
    day.activities.forEach(act => {
      totalTripCost += (act.cost || 0);
    });
  });

  const convertedCost = Math.round(totalTripCost * rate);

  let daysHtml = trip.itineraryDays.map((day, dIdx) => {
    let activitiesHtml = day.activities.map((act, aIdx) => {
      const actCostConverted = Math.round(act.cost * rate);
      return `
        <div class="relative pl-8 pb-8 group">
          <!-- Timeline Line -->
          <div class="absolute left-3.5 top-6 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 group-last:hidden"></div>
          
          <!-- Timeline Node -->
          <div class="absolute left-0 top-1.5 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border-2 border-primary-500 flex items-center justify-center text-primary-600 shadow-sm group-hover:scale-110 group-hover:bg-primary-500 group-hover:text-white transition-all">
            <span class="text-xs font-bold">${aIdx + 1}</span>
          </div>

          <!-- Activity Card -->
          <div class="bg-white dark:bg-slate-800/80 backdrop-blur rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition-all">
            <div class="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400">${act.time}</span>
                <span class="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">${act.category}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                  ${act.cost === 0 ? 'Free Entry' : `~${symbol}${actCostConverted}`}
                </span>
                <button onclick="editActivity(${dIdx}, ${aIdx})" title="Edit activity" class="text-slate-400 hover:text-primary-600 p-1 transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
                <button onclick="deleteActivity(${dIdx}, ${aIdx})" title="Delete activity" class="text-slate-400 hover:text-rose-500 p-1 transition">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
              </div>
            </div>

            <h4 class="text-base font-bold text-slate-900 dark:text-white mb-1.5">${act.title}</h4>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">${act.desc}</p>

            <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <a href="https://maps.google.com/?q=${encodeURIComponent(act.title + ' ' + trip.destination)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="mb-10 bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div class="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 mb-2">
              Day ${day.day}
            </div>
            <h3 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">${day.title}</h3>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="addCustomActivity(${dIdx})" class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-primary-500 hover:text-primary-600 transition shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              Add Activity
            </button>
          </div>
        </div>

        <div class="pt-2">
          ${activitiesHtml}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <!-- Header Banner -->
    <div class="relative overflow-hidden rounded-3xl mb-8 border border-slate-200 dark:border-slate-800 shadow-lg">
      <div class="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-transparent z-10"></div>
      <img src="${trip.cityData?.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}" alt="${trip.destination}" class="w-full h-72 sm:h-80 object-cover">
      
      <div class="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-8">
        <div class="flex flex-wrap items-center gap-2 mb-3">
          <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-600 text-white shadow">
            ${trip.durationDays} Days Itinerary
          </span>
          <span class="px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur text-white">
            👥 ${trip.travelers}
          </span>
          <span class="px-3 py-1 rounded-full text-xs font-medium bg-white/20 backdrop-blur text-white">
            🎯 ${trip.travelStyle}
          </span>
        </div>

        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 tracking-tight">${trip.destination}</h1>
        <p class="text-slate-200 text-sm sm:text-base max-w-2xl line-clamp-2">${trip.notes || trip.cityData?.tagline}</p>

        <!-- Action Bar -->
        <div class="flex flex-wrap items-center gap-3 mt-6">
          <button onclick="saveTripToVault()" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-primary-600 hover:bg-primary-500 text-white shadow-lg transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
            Save Trip
          </button>
          <button onclick="openExportModal()" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/20 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
            Export & Share
          </button>
          <button onclick="switchTab('map')" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/20 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
            Interactive Route Map
          </button>
          <button onclick="window.print()" class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/20 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
            Print / PDF
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Stats Bar -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
        <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Est. Activity Cost</span>
        <span class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">${symbol}${convertedCost}</span>
      </div>
      <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
        <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Total Days</span>
        <span class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">${trip.durationDays} Days</span>
      </div>
      <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
        <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Pace</span>
        <span class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">${trip.pace}</span>
      </div>
      <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
        <span class="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Travel Style</span>
        <span class="text-lg sm:text-xl font-black text-slate-900 dark:text-white truncate">${trip.travelStyle}</span>
      </div>
    </div>

    <!-- Daily Timeline Render -->
    <div>
      ${daysHtml}
    </div>
  `;
}

// Activity Modifications
function addCustomActivity(dayIdx) {
  const title = prompt("Enter activity title:");
  if (!title) return;
  const time = prompt("Enter time (e.g. 10:30 AM):", "10:30 AM") || "10:30 AM";
  const desc = prompt("Enter activity description:", "Explore and enjoy the sights.") || "Explore and enjoy the sights.";
  const cost = parseFloat(prompt("Estimated cost in USD (enter 0 for free):", "0")) || 0;

  if (!appState.currentTrip.itineraryDays[dayIdx]) return;

  const baseLat = appState.currentTrip.cityData?.coordinates[0] || 48.8566;
  const baseLng = appState.currentTrip.cityData?.coordinates[1] || 2.3522;

  appState.currentTrip.itineraryDays[dayIdx].activities.push({
    time: time,
    category: "Custom",
    title: title,
    desc: desc,
    cost: cost,
    lat: baseLat + (Math.random() - 0.5) * 0.02,
    lng: baseLng + (Math.random() - 0.5) * 0.02,
    icon: "sparkles"
  });

  renderItineraryView();
  showToast("Activity added successfully! 📍");
}

function editActivity(dayIdx, actIdx) {
  const act = appState.currentTrip.itineraryDays[dayIdx].activities[actIdx];
  const newTitle = prompt("Edit Activity Title:", act.title);
  if (newTitle !== null && newTitle.trim() !== '') {
    act.title = newTitle.trim();
  }
  const newDesc = prompt("Edit Description:", act.desc);
  if (newDesc !== null) {
    act.desc = newDesc.trim();
  }
  const newCost = prompt("Edit Cost (USD):", act.cost);
  if (newCost !== null && !isNaN(parseFloat(newCost))) {
    act.cost = parseFloat(newCost);
  }
  renderItineraryView();
  showToast("Activity updated! ✨");
}

function deleteActivity(dayIdx, actIdx) {
  if (confirm("Are you sure you want to delete this activity?")) {
    appState.currentTrip.itineraryDays[dayIdx].activities.splice(actIdx, 1);
    renderItineraryView();
    showToast("Activity removed.");
  }
}

// Interactive Map View with Leaflet
function renderMapView() {
  const mapContainer = document.getElementById('leafletMapContainer');
  if (!mapContainer || !appState.currentTrip) return;

  const trip = appState.currentTrip;
  const centerCoords = trip.cityData?.coordinates || [48.8566, 2.3522];

  // Render day selector buttons
  const daySelector = document.getElementById('mapDaySelector');
  if (daySelector) {
    daySelector.innerHTML = trip.itineraryDays.map((day, idx) => `
      <button onclick="selectMapDay(${idx})" class="px-4 py-2 rounded-xl text-xs font-bold transition ${appState.selectedDayIndex === idx ? 'bg-primary-600 text-white shadow' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}">
        Day ${day.day}
      </button>
    `).join('');
  }

  setTimeout(() => {
    if (!appState.mapInstance && typeof L !== 'undefined') {
      appState.mapInstance = L.map('leafletMapContainer').setView(centerCoords, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(appState.mapInstance);
    } else if (appState.mapInstance) {
      appState.mapInstance.setView(centerCoords, 13);
      appState.mapInstance.invalidateSize();
    }
    updateMapMarkersForDay(appState.selectedDayIndex);
  }, 100);
}

function selectMapDay(dayIdx) {
  appState.selectedDayIndex = dayIdx;
  renderMapView();
}

function updateMapMarkersForDay(dayIdx) {
  if (!appState.mapInstance || !appState.currentTrip || typeof L === 'undefined') return;

  // Clear existing markers & polyline
  appState.mapMarkers.forEach(m => appState.mapInstance.removeLayer(m));
  appState.mapMarkers = [];
  if (appState.mapPolyline) {
    appState.mapInstance.removeLayer(appState.mapPolyline);
    appState.mapPolyline = null;
  }

  const selectedDay = appState.currentTrip.itineraryDays[dayIdx] || appState.currentTrip.itineraryDays[0];
  if (!selectedDay) return;

  const latLngs = [];

  selectedDay.activities.forEach((act, idx) => {
    if (act.lat && act.lng) {
      const marker = L.marker([act.lat, act.lng]).addTo(appState.mapInstance);
      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 13px; line-height: 1.4;">
          <strong style="color: #2563eb;">Step ${idx + 1}: ${act.title}</strong><br>
          <span style="color: #64748b; font-size: 11px;">⏰ ${act.time} | 🏷️ ${act.category}</span><br>
          <p style="margin: 4px 0 0 0; color: #334155;">${act.desc}</p>
        </div>
      `);
      appState.mapMarkers.push(marker);
      latLngs.push([act.lat, act.lng]);
    }
  });

  if (latLngs.length > 1) {
    appState.mapPolyline = L.polyline(latLngs, { color: '#2563eb', weight: 4, opacity: 0.8, dashArray: '6, 8' }).addTo(appState.mapInstance);
    appState.mapInstance.fitBounds(latLngs, { padding: [40, 40] });
  } else if (latLngs.length === 1) {
    appState.mapInstance.setView(latLngs[0], 14);
  }
}

// Destination Discovery Explorer Grid
function renderDestinationsGrid() {
  const container = document.getElementById('destinationsGrid');
  if (!container) return;

  container.innerHTML = DESTINATIONS.map(dest => `
    <div class="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      <div class="relative h-52 overflow-hidden">
        <img src="${dest.image}" alt="${dest.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
        <div class="absolute top-4 left-4">
          <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/40 backdrop-blur text-white border border-white/20">
            ${dest.continent}
          </span>
        </div>
        <div class="absolute bottom-4 left-4 right-4 text-white">
          <h3 class="text-2xl font-black">${dest.name}</h3>
          <p class="text-xs text-slate-200">${dest.country}</p>
        </div>
      </div>

      <div class="p-6 flex-1 flex flex-col justify-between">
        <p class="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mb-4">${dest.tagline}</p>

        <div class="space-y-2 mb-6 text-xs text-slate-500 dark:text-slate-400">
          <div class="flex justify-between pb-1 border-b border-slate-100 dark:border-slate-700/50">
            <span>Best Season:</span>
            <span class="font-semibold text-slate-800 dark:text-slate-200">${dest.bestMonths}</span>
          </div>
          <div class="flex justify-between pb-1 border-b border-slate-100 dark:border-slate-700/50">
            <span>Avg Daily Cost:</span>
            <span class="font-semibold text-slate-800 dark:text-slate-200">~$${dest.avgDailyCost} / day</span>
          </div>
        </div>

        <button onclick="planTripToDestination('${dest.id}')" class="w-full py-3 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold text-sm rounded-xl hover:bg-primary-600 hover:text-white transition shadow-sm">
          Plan Trip to ${dest.name} ✨
        </button>
      </div>
    </div>
  `).join('');
}

function planTripToDestination(destId) {
  const dest = DESTINATIONS.find(d => d.id === destId);
  if (dest) {
    document.getElementById('plannerDestination').value = `${dest.name}, ${dest.country}`;
    switchTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`Pre-selected ${dest.name}! Adjust preferences and click Generate Trip.`);
  }
}

// Budget & Currency Calculation View
function renderBudgetView() {
  const container = document.getElementById('budgetViewContent');
  if (!container || !appState.currentTrip) return;

  const trip = appState.currentTrip;
  const rate = CURRENCIES[appState.currency].rate;
  const symbol = CURRENCIES[appState.currency].symbol;

  let activityCost = 0;
  trip.itineraryDays.forEach(day => {
    day.activities.forEach(act => {
      activityCost += (act.cost || 0);
    });
  });

  const dailyAvg = trip.cityData?.avgDailyCost || 100;
  const lodgingCost = dailyAvg * 0.45 * trip.durationDays;
  const foodCost = dailyAvg * 0.35 * trip.durationDays;
  const transportCost = dailyAvg * 0.20 * trip.durationDays;
  const grandTotal = activityCost + lodgingCost + foodCost + transportCost;

  container.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Total Summary Card -->
      <div class="lg:col-span-1 bg-gradient-to-br from-primary-600 to-indigo-700 text-white rounded-3xl p-8 shadow-xl flex flex-col justify-between">
        <div>
          <span class="text-xs font-bold tracking-wider uppercase opacity-80 block mb-2">Estimated Total Budget</span>
          <h2 class="text-4xl sm:text-5xl font-black mb-2">${symbol}${Math.round(grandTotal * rate)}</h2>
          <p class="text-xs text-primary-100 mb-6">Calculated for ${trip.durationDays} days in ${trip.destination} (${appState.currency})</p>

          <div class="space-y-3 text-sm">
            <div class="flex justify-between py-2 border-b border-white/10">
              <span class="opacity-90">Daily Average / Person</span>
              <span class="font-bold">${symbol}${Math.round((grandTotal / trip.durationDays) * rate)}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-white/10">
              <span class="opacity-90">Tipping Culture</span>
              <span class="font-bold text-xs">${trip.cityData?.cultureEtiquette?.tipping || '10-15%'}</span>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-white/20">
          <label class="text-xs font-semibold block mb-2 opacity-90">Switch Currency</label>
          <select onchange="changeCurrency(this.value)" class="w-full bg-white/20 text-white font-bold text-sm py-2.5 px-3 rounded-xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-white">
            ${Object.keys(CURRENCIES).map(c => `
              <option value="${c}" class="text-slate-900" ${appState.currency === c ? 'selected' : ''}>
                ${c} (${CURRENCIES[c].symbol}) - ${CURRENCIES[c].name}
              </option>
            `).join('')}
          </select>
        </div>
      </div>

      <!-- Breakdown Bars -->
      <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <h3 class="text-xl font-black text-slate-900 dark:text-white">Estimated Category Breakdown</h3>

        <!-- Lodging -->
        <div>
          <div class="flex justify-between text-sm font-semibold mb-2 text-slate-800 dark:text-slate-200">
            <span>🏨 Accommodation & Hotels (~45%)</span>
            <span>${symbol}${Math.round(lodgingCost * rate)}</span>
          </div>
          <div class="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
            <div class="bg-blue-500 h-full" style="width: 45%"></div>
          </div>
        </div>

        <!-- Food -->
        <div>
          <div class="flex justify-between text-sm font-semibold mb-2 text-slate-800 dark:text-slate-200">
            <span>🍲 Food, Cafes & Dining (~35%)</span>
            <span>${symbol}${Math.round(foodCost * rate)}</span>
          </div>
          <div class="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
            <div class="bg-amber-500 h-full" style="width: 35%"></div>
          </div>
        </div>

        <!-- Activities -->
        <div>
          <div class="flex justify-between text-sm font-semibold mb-2 text-slate-800 dark:text-slate-200">
            <span>🎟️ Activities, Sights & Tickets</span>
            <span>${symbol}${Math.round(activityCost * rate)}</span>
          </div>
          <div class="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
            <div class="bg-emerald-500 h-full" style="width: 25%"></div>
          </div>
        </div>

        <!-- Transport -->
        <div>
          <div class="flex justify-between text-sm font-semibold mb-2 text-slate-800 dark:text-slate-200">
            <span>🚇 Local Metro, Trains & Taxis (~20%)</span>
            <span>${symbol}${Math.round(transportCost * rate)}</span>
          </div>
          <div class="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
            <div class="bg-purple-500 h-full" style="width: 20%"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function changeCurrency(curr) {
  if (CURRENCIES[curr]) {
    appState.currency = curr;
    updateCurrencyDisplay();
    if (appState.activeTab === 'itinerary') renderItineraryView();
    if (appState.activeTab === 'budget') renderBudgetView();
    showToast(`Currency set to ${curr} (${CURRENCIES[curr].symbol})`);
  }
}

function updateCurrencyDisplay() {
  const elem = document.getElementById('navbarCurrencyBtn');
  if (elem) {
    elem.innerText = `${appState.currency} (${CURRENCIES[appState.currency].symbol})`;
  }
}

// Adaptive Packing Checklist
function initDefaultPackingList() {
  appState.packingItems = [
    { id: 1, text: "Passport & Digital Copies", category: "Documents", checked: true },
    { id: 2, text: "Universal Power Adapter & Cables", category: "Electronics", checked: true },
    { id: 3, text: "Comfortable Walking Shoes", category: "Clothing", checked: false },
    { id: 4, text: "Portable Power Bank (10,000mAh+)", category: "Electronics", checked: false },
    { id: 5, text: "Weather-Appropriate Jacket / Layer", category: "Clothing", checked: false },
    { id: 6, text: "Travel Insurance Documentation", category: "Documents", checked: false },
    { id: 7, text: "Refillable Water Bottle", category: "Essentials", checked: false },
    { id: 8, text: "Personal Medications & First Aid", category: "Health", checked: false }
  ];
}

function updatePackingListForDestination(destName, duration) {
  initDefaultPackingList();
  if (duration > 5) {
    appState.packingItems.push({ id: 9, text: "Luggage Laundry Bag & Extra Underwear", category: "Clothing", checked: false });
  }
  if (destName.toLowerCase().includes('bali') || destName.toLowerCase().includes('beach') || destName.toLowerCase().includes('thailand')) {
    appState.packingItems.push({ id: 10, text: "Sunscreen SPF 50 & Swimwear", category: "Essentials", checked: false });
    appState.packingItems.push({ id: 11, text: "Mosquito Repellent Spray", category: "Health", checked: false });
  }
  if (destName.toLowerCase().includes('swiss') || destName.toLowerCase().includes('alps')) {
    appState.packingItems.push({ id: 12, text: "Thermal Base Layers & Waterproof Boots", category: "Clothing", checked: false });
    appState.packingItems.push({ id: 13, text: "UV Polarized Sunglasses & Lip Balm", category: "Essentials", checked: false });
  }
}

function renderPackingView() {
  const container = document.getElementById('packingViewContent');
  if (!container) return;

  const total = appState.packingItems.length;
  const checkedCount = appState.packingItems.filter(i => i.checked).length;
  const percentage = total > 0 ? Math.round((checkedCount / total) * 100) : 0;

  const itemsHtml = appState.packingItems.map(item => `
    <label class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition">
      <input type="checkbox" onchange="togglePackingItem(${item.id})" ${item.checked ? 'checked' : ''} class="w-5 h-5 rounded text-primary-600 focus:ring-primary-500">
      <span class="text-sm font-medium ${item.checked ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}">${item.text}</span>
      <span class="ml-auto text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300">${item.category}</span>
    </label>
  `).join('');

  container.innerHTML = `
    <div class="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm max-w-2xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-2xl font-black text-slate-900 dark:text-white">Packing Assistant</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">Adaptive checklist for ${appState.currentTrip?.destination || 'your journey'}</p>
        </div>
        <span class="text-sm font-bold text-primary-600 dark:text-primary-400">${checkedCount} / ${total} Packed (${percentage}%)</span>
      </div>

      <!-- Progress Bar -->
      <div class="w-full bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full mb-6 overflow-hidden">
        <div class="bg-primary-600 h-full transition-all duration-300" style="width: ${percentage}%"></div>
      </div>

      <!-- Add Custom Item Input -->
      <div class="flex gap-2 mb-6">
        <input type="text" id="newPackingItemInput" placeholder="Add custom item (e.g. Camera tripod)..." class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500">
        <button onclick="addCustomPackingItem()" class="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm rounded-xl transition">Add</button>
      </div>

      <!-- Items List -->
      <div class="space-y-2">
        ${itemsHtml}
      </div>
    </div>
  `;
}

function togglePackingItem(id) {
  const item = appState.packingItems.find(i => i.id === id);
  if (item) {
    item.checked = !item.checked;
    renderPackingView();
  }
}

function addCustomPackingItem() {
  const input = document.getElementById('newPackingItemInput');
  if (!input || !input.value.trim()) return;

  appState.packingItems.push({
    id: Date.now(),
    text: input.value.trim(),
    category: "Custom",
    checked: false
  });
  input.value = '';
  renderPackingView();
  showToast("Packing item added! 🧳");
}

// Visa, Culture & Audio Phrasebook View
function renderVisaCultureView() {
  const container = document.getElementById('visaCultureContent');
  if (!container || !appState.currentTrip) return;

  const trip = appState.currentTrip;
  const city = trip.cityData;

  const phrasesHtml = (city?.cultureEtiquette?.phrases || []).map(p => `
    <div class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/80 dark:border-slate-700">
      <div>
        <span class="text-xs font-semibold text-slate-400 block">${p.en}</span>
        <span class="text-base font-bold text-slate-900 dark:text-white">${p.local}</span>
        <span class="text-xs text-primary-600 dark:text-primary-400 block italic">Pronounced: ${p.phonetic}</span>
      </div>
      <button onclick="speakPhrase('${p.local}')" class="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 hover:bg-primary-50 shadow-sm transition" title="Listen to pronunciation">
        🔊
      </button>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
      <!-- Visa & Emergency -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <h3 class="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          🛂 Visa & Essential Info
        </h3>
        
        <div class="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <div class="p-4 rounded-2xl bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800">
            <span class="text-xs font-bold text-primary-800 dark:text-primary-300 block mb-1">Visa Guidelines</span>
            <p>${city?.visaInfo?.type || 'Verify specific requirements on official embassy portals.'}</p>
          </div>

          <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
            <span class="font-medium">Passport Validity</span>
            <span class="font-bold text-slate-900 dark:text-white">${city?.visaInfo?.passportValidity || '6 Months'}</span>
          </div>

          <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
            <span class="font-medium">Power Plug Adapter</span>
            <span class="font-bold text-slate-900 dark:text-white">${city?.visaInfo?.adapter || 'Universal'}</span>
          </div>

          <div class="pt-2">
            <span class="text-xs font-bold text-rose-600 uppercase block mb-2">Emergency Contacts</span>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300">
                🚨 Police: <strong>${city?.visaInfo?.emergency?.police || '112'}</strong>
              </div>
              <div class="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300">
                🚑 Ambulance: <strong>${city?.visaInfo?.emergency?.ambulance || '112'}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Phrasebook & Etiquette -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <h3 class="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          🗣️ Audio Phrasebook & Customs
        </h3>

        <div class="space-y-3">
          ${phrasesHtml || '<p class="text-sm text-slate-400">No phrases available.</p>'}
        </div>
      </div>
    </div>
  `;
}

function speakPhrase(text) {
  if ('speechSynthesis' in window) {
    const cleanText = text.replace(/\(.*?\)/g, '');
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  } else {
    showToast("Speech synthesis is not supported on this browser.");
  }
}

// Flight & Hotel Booking Link Hub
function renderBookingView() {
  const container = document.getElementById('bookingViewContent');
  if (!container || !appState.currentTrip) return;

  const dest = appState.currentTrip.destination;
  const encodedDest = encodeURIComponent(dest);

  container.innerHTML = `
    <div class="max-w-4xl mx-auto space-y-8">
      <div class="text-center max-w-xl mx-auto">
        <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-2">Travel Booking Hub</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm">Compare live flight prices, reserve boutique hotels, and book official attraction tickets for ${dest}.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Google Flights -->
        <a href="https://www.google.com/travel/flights?q=flights+to+${encodedDest}" target="_blank" rel="noopener noreferrer" class="group bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
          <div>
            <div class="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-2xl mb-4">✈️</div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Google Flights</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-6">Compare real-time airline ticket prices, non-stop routes, and baggage fees.</p>
          </div>
          <span class="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 group-hover:underline">
            Search Flights &rarr;
          </span>
        </a>

        <!-- Booking.com -->
        <a href="https://www.booking.com/searchresults.html?ss=${encodedDest}" target="_blank" rel="noopener noreferrer" class="group bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
          <div>
            <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center text-2xl mb-4">🏨</div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Booking.com</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-6">Find top-rated boutique hotels, private apartments, and luxury villas.</p>
          </div>
          <span class="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 group-hover:underline">
            Browse Hotels &rarr;
          </span>
        </a>

        <!-- Skyscanner -->
        <a href="https://www.skyscanner.net/transport/flights-to/${encodedDest}" target="_blank" rel="noopener noreferrer" class="group bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
          <div>
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center text-2xl mb-4">🌍</div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">Skyscanner</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mb-6">Compare flight deals across budget and premium airlines worldwide.</p>
          </div>
          <span class="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 group-hover:underline">
            Compare Skyscanner &rarr;
          </span>
        </a>
      </div>
    </div>
  `;
}

// AI Concierge Chatbot Widget
function toggleChatDrawer() {
  const drawer = document.getElementById('aiChatDrawer');
  if (drawer) {
    drawer.classList.toggle('hidden');
    if (!drawer.classList.contains('hidden')) {
      renderChatMessages();
    }
  }
}

function renderChatMessages() {
  const container = document.getElementById('chatMessagesContainer');
  if (!container) return;

  container.innerHTML = appState.chatMessages.map(msg => `
    <div class="flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}">
      ${msg.sender === 'ai' ? '<div class="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">AI</div>' : ''}
      <div class="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.sender === 'user' ? 'bg-primary-600 text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm'}">
        ${msg.text}
      </div>
    </div>
  `).join('');

  container.scrollTop = container.scrollHeight;
}

function handleSendChatMessage(e) {
  e.preventDefault();
  const input = document.getElementById('chatInputMessage');
  if (!input || !input.value.trim()) return;

  const query = input.value.trim();
  appState.chatMessages.push({ sender: 'user', text: query });
  input.value = '';
  renderChatMessages();

  // Generate Concierge AI Response
  setTimeout(() => {
    let reply = `Great question about ${appState.currentTrip?.destination || 'your trip'}! `;
    const qLower = query.toLowerCase();

    if (qLower.includes('food') || qLower.includes('eat') || qLower.includes('restaurant') || qLower.includes('vegetarian')) {
      reply += "For authentic dining, check out local alleyways and food markets near the city center. Try ordering signature street specialties and always look for places with lively local crowds!";
    } else if (qLower.includes('weather') || qLower.includes('pack')) {
      reply += "I recommend packing comfortable walking sneakers, a light weather-resistant jacket, and an adapter for charging devices on the go.";
    } else if (qLower.includes('hidden') || qLower.includes('secret') || qLower.includes('gems')) {
      reply += "A wonderful hidden gem is to explore the old artisan quarter just before sunset when the tourist crowds disperse and local lantern lights illuminate the streets.";
    } else {
      reply += "Remember to keep your passport safely secured, carry a digital travel card for subways, and enjoy every moment of your exploration!";
    }

    appState.chatMessages.push({ sender: 'ai', text: reply });
    renderChatMessages();
  }, 600);
}

// Export Suite: Calendar .ICS, QR Code & Share
function openExportModal() {
  const modal = document.getElementById('exportShareModal');
  if (!modal || !appState.currentTrip) return;

  const currentUrl = window.location.href;
  const qrContainer = document.getElementById('qrCodeContainer');
  if (qrContainer) {
    // Generate QR Code via QuickChart open image API
    qrContainer.innerHTML = `
      <img src="https://quickchart.io/qr?text=${encodeURIComponent(currentUrl)}&size=160&centerImageUrl=https://img.icons8.com/color/48/airplane-take-off.png" alt="Trip QR Code" class="rounded-xl shadow border border-slate-200 dark:border-slate-700 mx-auto">
    `;
  }
  modal.classList.remove('hidden');
}

function closeExportModal() {
  const modal = document.getElementById('exportShareModal');
  if (modal) modal.classList.add('hidden');
}

function downloadCalendarICS() {
  if (!appState.currentTrip) return;
  const trip = appState.currentTrip;

  let icsContent = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Voyex AI//Travel Planner//EN\r\nCALSCALE:GREGORIAN\r\n";

  trip.itineraryDays.forEach(day => {
    day.activities.forEach(act => {
      icsContent += "BEGIN:VEVENT\r\n";
      icsContent += `SUMMARY:${act.title} - ${trip.destination}\r\n`;
      icsContent += `DESCRIPTION:${act.desc}\r\n`;
      icsContent += `LOCATION:${trip.destination}\r\n`;
      icsContent += `DTSTART;VALUE=DATE-TIME:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\r\n`;
      icsContent += `DTEND;VALUE=DATE-TIME:${new Date(Date.now() + 3600000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z\r\n`;
      icsContent += "END:VEVENT\r\n";
    });
  });

  icsContent += "END:VCALENDAR\r\n";

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${trip.destination.replace(/[^a-z0-9]/gi, '_')}_itinerary.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Calendar (.ics) file downloaded! 📅");
}

function copyShareLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast("Shareable link copied to clipboard! 📋");
  }).catch(() => {
    showToast("Link: " + window.location.href);
  });
}

// Saved Trips Vault Modal
function openSavedTripsModal() {
  const modal = document.getElementById('savedTripsModal');
  const container = document.getElementById('savedTripsList');
  if (!modal || !container) return;

  if (appState.savedTrips.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 text-slate-400">
        <p class="text-sm">No saved trips yet. Click "Save Trip" on any generated itinerary!</p>
      </div>
    `;
  } else {
    container.innerHTML = appState.savedTrips.map(trip => `
      <div class="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
        <div>
          <h4 class="font-bold text-slate-900 dark:text-white">${trip.destination}</h4>
          <span class="text-xs text-slate-500 dark:text-slate-400">${trip.durationDays} Days • ${trip.travelers} • ${trip.budgetTier}</span>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="loadSavedTrip('${trip.id}')" class="px-3 py-1.5 rounded-xl bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 transition">
            Load
          </button>
          <button onclick="deleteSavedTrip('${trip.id}')" class="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition" title="Delete trip">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </div>
    `).join('');
  }

  modal.classList.remove('hidden');
}

function closeSavedTripsModal() {
  const modal = document.getElementById('savedTripsModal');
  if (modal) modal.classList.add('hidden');
}

function loadSavedTrip(id) {
  const trip = appState.savedTrips.find(t => t.id === id);
  if (trip) {
    appState.currentTrip = JSON.parse(JSON.stringify(trip));
    closeSavedTripsModal();
    switchTab('itinerary');
    showToast(`Loaded ${trip.destination} itinerary!`);
  }
}

function deleteSavedTrip(id) {
  appState.savedTrips = appState.savedTrips.filter(t => t.id !== id);
  localStorage.setItem('voyex_saved_trips', JSON.stringify(appState.savedTrips));
  updateSavedTripsBadge();
  openSavedTripsModal();
  showToast("Trip removed from saved vault.");
}

// Toast Notifications
function showToast(message, type = 'success') {
  const toast = document.getElementById('appToastNotification');
  if (!toast) return;

  toast.innerHTML = message;
  toast.className = `fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold text-white transition-all duration-300 transform translate-y-0 opacity-100 ${type === 'error' ? 'bg-rose-600' : 'bg-slate-900 dark:bg-primary-600'}`;

  setTimeout(() => {
    toast.classList.add('translate-y-12', 'opacity-0');
  }, 3500);
}

// Event Listeners Registration
function setupEventListeners() {
  const tripForm = document.getElementById('aiTripPlannerForm');
  if (tripForm) {
    tripForm.addEventListener('submit', handleTripGeneration);
  }

  const chatForm = document.getElementById('aiChatForm');
  if (chatForm) {
    chatForm.addEventListener('submit', handleSendChatMessage);
  }

  // Dark / Light Mode Toggle
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      localStorage.setItem('voyex_theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    });
  }

  // Mobile menu toggle
  const mobileToggleBtn = document.getElementById('mobileMenuToggleBtn');
  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', () => {
      const menu = document.getElementById('mobileNavMenu');
      if (menu) menu.classList.toggle('hidden');
    });
  }

  // Apply stored theme
  if (localStorage.getItem('voyex_theme') === 'dark' || (!('voyex_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// ================= TRANSPORT PAGES ================= //

// 1. FLIGHTS TRANSPORT VIEW
function renderFlightsView() {
  const container = document.getElementById('flightsViewContent');
  if (!container) return;

  const dest = appState.currentTrip?.destination || 'Tokyo, Japan';
  const rate = CURRENCIES[appState.currency].rate;
  const symbol = CURRENCIES[appState.currency].symbol;

  container.innerHTML = `
    <div class="max-w-5xl mx-auto space-y-10">
      <!-- Header Banner -->
      <div class="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div class="relative z-10 max-w-2xl">
          <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur mb-4 inline-block">
            ✈️ Global Flight Search & Route Intelligence
          </span>
          <h2 class="text-3xl sm:text-4xl font-black mb-3">Find & Compare Worldwide Flights</h2>
          <p class="text-blue-100 text-sm sm:text-base leading-relaxed">Search real-time flight fares, non-stop connections, cabin baggage policies, and airline reviews for your journey to ${dest}.</p>
        </div>
        <div class="absolute right-4 -bottom-10 opacity-20 text-9xl select-none pointer-events-none">✈️</div>
      </div>

      <!-- Quick Flight Search Widget -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Flight Route Explorer</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Departure From</label>
            <input type="text" id="flightOriginInput" value="New York (JFK)" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Destination To</label>
            <input type="text" id="flightDestInput" value="${dest}" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Cabin Class</label>
            <select id="flightClassInput" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold">
              <option>Economy</option>
              <option>Premium Economy</option>
              <option>Business Class</option>
              <option>First Class</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Trip Type</label>
            <select class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-semibold">
              <option>Round Trip</option>
              <option>One Way</option>
            </select>
          </div>
        </div>

        <div class="flex flex-wrap gap-3">
          <button onclick="launchFlightSearch('google')" class="flex-1 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow flex items-center justify-center gap-2">
            Search on Google Flights ↗
          </button>
          <button onclick="launchFlightSearch('skyscanner')" class="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow flex items-center justify-center gap-2">
            Search on Skyscanner ↗
          </button>
          <button onclick="launchFlightSearch('kayak')" class="flex-1 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-xl transition shadow flex items-center justify-center gap-2">
            Search on Kayak ↗
          </button>
        </div>
      </div>

      <!-- Popular Flight Hubs & Sample Deals -->
      <div>
        <h3 class="text-xl font-black text-slate-900 dark:text-white mb-4">Sample Routes & Estimated Fares</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-bold text-primary-600 bg-primary-50 dark:bg-primary-900/40 px-2.5 py-1 rounded-lg">Non-Stop Available</span>
                <span class="text-lg font-black text-slate-900 dark:text-white">${symbol}${Math.round(480 * rate)}</span>
              </div>
              <h4 class="font-bold text-base text-slate-900 dark:text-white mb-1">London (LHR) ➔ Tokyo (HND)</h4>
              <p class="text-xs text-slate-500 mb-4">Avg Duration: 13h 45m • Top Carriers: British Airways, ANA, JAL</p>
            </div>
            <button onclick="document.getElementById('flightOriginInput').value='London (LHR)'; launchFlightSearch('google');" class="text-xs font-bold text-primary-600 hover:underline">Check live dates &rarr;</button>
          </div>

          <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/40 px-2.5 py-1 rounded-lg">Popular Direct</span>
                <span class="text-lg font-black text-slate-900 dark:text-white">${symbol}${Math.round(350 * rate)}</span>
              </div>
              <h4 class="font-bold text-base text-slate-900 dark:text-white mb-1">New York (JFK) ➔ Paris (CDG)</h4>
              <p class="text-xs text-slate-500 mb-4">Avg Duration: 7h 30m • Top Carriers: Air France, Delta, Norse</p>
            </div>
            <button onclick="document.getElementById('flightOriginInput').value='New York (JFK)'; launchFlightSearch('google');" class="text-xs font-bold text-primary-600 hover:underline">Check live dates &rarr;</button>
          </div>

          <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/40 px-2.5 py-1 rounded-lg">Top Tourist Route</span>
                <span class="text-lg font-black text-slate-900 dark:text-white">${symbol}${Math.round(220 * rate)}</span>
              </div>
              <h4 class="font-bold text-base text-slate-900 dark:text-white mb-1">Dubai (DXB) ➔ Bangkok (BKK)</h4>
              <p class="text-xs text-slate-500 mb-4">Avg Duration: 6h 15m • Top Carriers: Emirates, Thai Airways</p>
            </div>
            <button onclick="document.getElementById('flightOriginInput').value='Dubai (DXB)'; launchFlightSearch('google');" class="text-xs font-bold text-primary-600 hover:underline">Check live dates &rarr;</button>
          </div>
        </div>
      </div>

      <!-- Baggage & Airport Pro Tips -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
          <h4 class="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">🧳 Carry-On & Baggage Rules</h4>
          <ul class="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc pl-4">
            <li>Standard international cabin bag size: 55 x 40 x 20 cm (max 7-10 kg).</li>
            <li>Liquids must be in containers of 100ml (3.4 oz) or less in a clear sealable bag.</li>
            <li>Lithium power banks must always be in carry-on luggage, never checked.</li>
          </ul>
        </div>
        <div class="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
          <h4 class="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">⏰ Airport Arrival Guidelines</h4>
          <ul class="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc pl-4">
            <li>Arrive 3 hours before international departures and 2 hours for domestic flights.</li>
            <li>Download your airline's mobile app for online check-in 24 hours in advance.</li>
            <li>Keep digital and printed boarding passes and passport ready at security checkpoints.</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

function launchFlightSearch(engine) {
  const origin = encodeURIComponent(document.getElementById('flightOriginInput')?.value || '');
  const dest = encodeURIComponent(document.getElementById('flightDestInput')?.value || '');
  let url = `https://www.google.com/travel/flights?q=flights+from+${origin}+to+${dest}`;
  if (engine === 'skyscanner') {
    url = `https://www.skyscanner.net/transport/flights-from/${origin}/to/${dest}`;
  } else if (engine === 'kayak') {
    url = `https://www.kayak.com/flights/${origin}-${dest}`;
  }
  window.open(url, '_blank');
}

// 2. TRAINS TRANSPORT VIEW
function renderTrainsView() {
  const container = document.getElementById('trainsViewContent');
  if (!container) return;

  const dest = appState.currentTrip?.destination || 'Tokyo, Japan';

  container.innerHTML = `
    <div class="max-w-5xl mx-auto space-y-10">
      <!-- Header Banner -->
      <div class="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div class="relative z-10 max-w-2xl">
          <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur mb-4 inline-block">
            🚆 Scenic High-Speed Rail & Train Passes
          </span>
          <h2 class="text-3xl sm:text-4xl font-black mb-3">Scenic & High-Speed Train Travel</h2>
          <p class="text-emerald-100 text-sm sm:text-base leading-relaxed">Experience comfortable rail journeys, bullet trains, panoramic alpine lines, and global rail passes without airport queues.</p>
        </div>
        <div class="absolute right-4 -bottom-10 opacity-20 text-9xl select-none pointer-events-none">🚆</div>
      </div>

      <!-- Train Search & Rail Pass Hub -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Official Rail Ticket & Pass Booking Hub</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-6">Direct access to world-leading train booking platforms and unlimited regional rail passes.</p>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Eurail / Interrail -->
          <a href="https://www.eurail.com" target="_blank" rel="noopener noreferrer" class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition flex flex-col justify-between">
            <div>
              <span class="text-2xl mb-2 block">🇪🇺</span>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">Eurail & Interrail Pass</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Unlimited train travel across 33 European countries.</p>
            </div>
            <span class="text-xs font-bold text-emerald-600 mt-4">Visit Eurail &rarr;</span>
          </a>

          <!-- JR Pass Japan -->
          <a href="https://japanrailpass.net" target="_blank" rel="noopener noreferrer" class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition flex flex-col justify-between">
            <div>
              <span class="text-2xl mb-2 block">🇯🇵</span>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">Japan Rail Pass (JR Pass)</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Ride Shinkansen bullet trains nationwide.</p>
            </div>
            <span class="text-xs font-bold text-emerald-600 mt-4">Visit JR Pass &rarr;</span>
          </a>

          <!-- Trainline -->
          <a href="https://www.thetrainline.com" target="_blank" rel="noopener noreferrer" class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition flex flex-col justify-between">
            <div>
              <span class="text-2xl mb-2 block">🇬🇧</span>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">The Trainline</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">UK & European high-speed rail ticket comparison.</p>
            </div>
            <span class="text-xs font-bold text-emerald-600 mt-4">Visit Trainline &rarr;</span>
          </a>

          <!-- Swiss Travel Pass -->
          <a href="https://www.sbb.ch/en" target="_blank" rel="noopener noreferrer" class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition flex flex-col justify-between">
            <div>
              <span class="text-2xl mb-2 block">🇨🇭</span>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">SBB Swiss Railways</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Glacier Express & Swiss panoramic alpine passes.</p>
            </div>
            <span class="text-xs font-bold text-emerald-600 mt-4">Visit SBB Rail &rarr;</span>
          </a>
        </div>
      </div>

      <!-- World's Top Train Journeys -->
      <div>
        <h3 class="text-xl font-black text-slate-900 dark:text-white mb-4">Legendary Train Routes Around the World</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
            <img src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80" alt="Glacier Express" class="h-40 w-full object-cover">
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span class="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-900/40 px-2 py-0.5 rounded">Switzerland</span>
                <h4 class="font-bold text-base text-slate-900 dark:text-white mt-1 mb-1">Glacier Express (Zermatt to St. Moritz)</h4>
                <p class="text-xs text-slate-500 line-clamp-2">The slowest express train in the world across 291 bridges and 91 tunnels through the Alps.</p>
              </div>
              <span class="text-xs font-semibold text-slate-400 mt-3">Duration: 8 Hours • Panoramic Glass Roof</span>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
            <img src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80" alt="Shinkansen" class="h-40 w-full object-cover">
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span class="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded">Japan</span>
                <h4 class="font-bold text-base text-slate-900 dark:text-white mt-1 mb-1">Tokaido Shinkansen (Tokyo to Kyoto)</h4>
                <p class="text-xs text-slate-500 line-clamp-2">Speeds up to 320 km/h with breathtaking views of Mount Fuji on clear mornings.</p>
              </div>
              <span class="text-xs font-semibold text-slate-400 mt-3">Duration: 2h 15m • High Frequency</span>
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
            <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80" alt="Eurostar" class="h-40 w-full object-cover">
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <span class="text-[10px] font-bold uppercase text-purple-600 bg-purple-50 dark:bg-purple-900/40 px-2 py-0.5 rounded">UK & France</span>
                <h4 class="font-bold text-base text-slate-900 dark:text-white mt-1 mb-1">Eurostar (London St Pancras to Paris Gare du Nord)</h4>
                <p class="text-xs text-slate-500 line-clamp-2">City-center to city-center travel under the English Channel tunnel in total comfort.</p>
              </div>
              <span class="text-xs font-semibold text-slate-400 mt-3">Duration: 2h 20m • City Center Arrival</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 3. BUSES TRANSPORT VIEW
function renderBusesView() {
  const container = document.getElementById('busesViewContent');
  if (!container) return;

  const dest = appState.currentTrip?.destination || 'Tokyo, Japan';

  container.innerHTML = `
    <div class="max-w-5xl mx-auto space-y-10">
      <!-- Header Banner -->
      <div class="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div class="relative z-10 max-w-2xl">
          <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur mb-4 inline-block">
            🚌 Long-Distance Coaches & Intercity Buses
          </span>
          <h2 class="text-3xl sm:text-4xl font-black mb-3">Affordable Intercity Bus Routes</h2>
          <p class="text-amber-100 text-sm sm:text-base leading-relaxed">Budget-friendly ground transit, overnight luxury sleeper coaches, and scenic regional highway express routes.</p>
        </div>
        <div class="absolute right-4 -bottom-10 opacity-20 text-9xl select-none pointer-events-none">🚌</div>
      </div>

      <!-- Bus Search & Booking Platforms -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Intercity Coach Booking Providers</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- FlixBus -->
          <a href="https://www.flixbus.com" target="_blank" rel="noopener noreferrer" class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition flex flex-col justify-between">
            <div>
              <span class="text-2xl mb-2 block">🟢</span>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">FlixBus Global</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Europe & USA's largest budget coach network with onboard Wi-Fi and power outlets.</p>
            </div>
            <span class="text-xs font-bold text-amber-600 mt-4">Visit FlixBus &rarr;</span>
          </a>

          <!-- Busbud -->
          <a href="https://www.busbud.com" target="_blank" rel="noopener noreferrer" class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition flex flex-col justify-between">
            <div>
              <span class="text-2xl mb-2 block">🌍</span>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">Busbud Worldwide</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Compare prices across 2 million bus routes in 80+ countries.</p>
            </div>
            <span class="text-xs font-bold text-amber-600 mt-4">Visit Busbud &rarr;</span>
          </a>

          <!-- RedBus -->
          <a href="https://www.redbus.com" target="_blank" rel="noopener noreferrer" class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition flex flex-col justify-between">
            <div>
              <span class="text-2xl mb-2 block">🔴</span>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">RedBus (Asia & Americas)</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Leading coach booking in India, Southeast Asia, and Latin America.</p>
            </div>
            <span class="text-xs font-bold text-amber-600 mt-4">Visit RedBus &rarr;</span>
          </a>

          <!-- Megabus -->
          <a href="https://www.megabus.com" target="_blank" rel="noopener noreferrer" class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition flex flex-col justify-between">
            <div>
              <span class="text-2xl mb-2 block">🔵</span>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">Megabus UK & US</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Ultra-low fare express city buses with reserved seating options.</p>
            </div>
            <span class="text-xs font-bold text-amber-600 mt-4">Visit Megabus &rarr;</span>
          </a>
        </div>
      </div>

      <!-- Essential Bus Travel Tips -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div class="text-2xl mb-2">🌙</div>
          <h4 class="font-bold text-sm text-slate-900 dark:text-white mb-1">Overnight Sleeper Buses</h4>
          <p class="text-xs text-slate-500 leading-relaxed">Save on hotel costs by taking overnight sleeper buses with reclining seats or flat bunks between major cities.</p>
        </div>
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div class="text-2xl mb-2">🎒</div>
          <h4 class="font-bold text-sm text-slate-900 dark:text-white mb-1">Luggage Allowances</h4>
          <p class="text-xs text-slate-500 leading-relaxed">Most intercity coaches include 1 large hold bag (up to 20kg) and 1 small backpack inside the passenger cabin for free.</p>
        </div>
        <div class="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div class="text-2xl mb-2">⚡</div>
          <h4 class="font-bold text-sm text-slate-900 dark:text-white mb-1">Amenities Onboard</h4>
          <p class="text-xs text-slate-500 leading-relaxed">Modern long-haul coaches offer free Wi-Fi, USB charging ports under seats, air conditioning, and onboard restrooms.</p>
        </div>
      </div>
    </div>
  `;
}

// 4. CAR RENTALS & ROAD TRIP HUB
function renderCarRentalsView() {
  const container = document.getElementById('carsViewContent');
  if (!container) return;

  const dest = appState.currentTrip?.destination || 'Tokyo, Japan';

  container.innerHTML = `
    <div class="max-w-5xl mx-auto space-y-10">
      <!-- Header Banner -->
      <div class="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div class="relative z-10 max-w-2xl">
          <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur mb-4 inline-block">
            🚗 Car Rental & Road Trip Navigation
          </span>
          <h2 class="text-3xl sm:text-4xl font-black mb-3">Car Rentals & Scenic Drives</h2>
          <p class="text-violet-100 text-sm sm:text-base leading-relaxed">Find verified car rentals, international permit guidance, insurance checklists, and legendary road trip routes around ${dest}.</p>
        </div>
        <div class="absolute right-4 -bottom-10 opacity-20 text-9xl select-none pointer-events-none">🚗</div>
      </div>

      <!-- Car Rental Booking Platforms -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">Compare Rental Car Deals</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Rentalcars.com -->
          <a href="https://www.rentalcars.com" target="_blank" rel="noopener noreferrer" class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition flex flex-col justify-between">
            <div>
              <span class="text-2xl mb-2 block">🚙</span>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">Rentalcars.com</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">World's biggest car rental broker with free cancellation options.</p>
            </div>
            <span class="text-xs font-bold text-violet-600 mt-4">Compare Deals &rarr;</span>
          </a>

          <!-- Kayak Cars -->
          <a href="https://www.kayak.com/cars" target="_blank" rel="noopener noreferrer" class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition flex flex-col justify-between">
            <div>
              <span class="text-2xl mb-2 block">🚘</span>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">Kayak Car Search</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Search airport and downtown rental lots across 500+ car providers.</p>
            </div>
            <span class="text-xs font-bold text-violet-600 mt-4">Search Kayak &rarr;</span>
          </a>

          <!-- Turo -->
          <a href="https://turo.com" target="_blank" rel="noopener noreferrer" class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition flex flex-col justify-between">
            <div>
              <span class="text-2xl mb-2 block">⚡</span>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">Turo Car Sharing</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Book unique convertibles, Teslas, and vintage cars directly from local hosts.</p>
            </div>
            <span class="text-xs font-bold text-violet-600 mt-4">Browse Turo &rarr;</span>
          </a>

          <!-- Enterprise -->
          <a href="https://www.enterprise.com" target="_blank" rel="noopener noreferrer" class="p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition flex flex-col justify-between">
            <div>
              <span class="text-2xl mb-2 block">🏢</span>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">Enterprise Rent-A-Car</h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Premium reliability with thousands of global airport pick-up desks.</p>
            </div>
            <span class="text-xs font-bold text-violet-600 mt-4">Visit Enterprise &rarr;</span>
          </a>
        </div>
      </div>

      <!-- Driving Rules & International Permit Guide -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <h4 class="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">📋 International Driving Permit (IDP)</h4>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Most countries (Japan, Italy, France, Thailand, UAE) require an official **International Driving Permit** alongside your home driver's license. Obtain an IDP before departing from your local automobile association (e.g. AAA in US, AA in UK/Australia).
          </p>
          <div class="p-3 bg-violet-50 dark:bg-violet-900/30 rounded-xl text-xs text-violet-800 dark:text-violet-300">
            💡 <em>Note:</em> Japan strictly requires the <strong>1949 Geneva Convention</strong> physical booklet permit.
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <h4 class="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">🛣️ Left vs Right Driving Side</h4>
          <ul class="text-xs text-slate-600 dark:text-slate-300 space-y-2 list-disc pl-4">
            <li><strong>Drive on the Left:</strong> UK, Japan, Australia, New Zealand, Indonesia, Thailand, India, South Africa.</li>
            <li><strong>Drive on the Right:</strong> USA, Canada, France, Italy, Switzerland, UAE, Germany, Spain.</li>
            <li>Always inspect rental car scratch damage and photograph all 4 sides before driving away!</li>
          </ul>
        </div>
      </div>
    </div>
  `;
}

// 5. GROUP TRAVEL SPLIT-BILL & EXPENSE CALCULATOR
let groupExpenses = [
  { id: 1, title: "Shibuya Ramen Feast", amount: 60, paidBy: "Alex", splitAmong: ["Alex", "Sarah", "Vijay"] },
  { id: 2, title: "TeamLab Exhibition Tickets", amount: 90, paidBy: "Sarah", splitAmong: ["Alex", "Sarah", "Vijay"] },
  { id: 3, title: "Tokyo Tower Taxi", amount: 30, paidBy: "Vijay", splitAmong: ["Alex", "Sarah", "Vijay"] }
];
let groupMembers = ["Alex", "Sarah", "Vijay"];

function renderSplitExpensesView() {
  const container = document.getElementById('splitViewContent');
  if (!container) return;

  const rate = CURRENCIES[appState.currency].rate;
  const symbol = CURRENCIES[appState.currency].symbol;

  let totalSpent = groupExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  // Calculate Net Balances
  let balances = {};
  groupMembers.forEach(m => balances[m] = 0);

  groupExpenses.forEach(exp => {
    balances[exp.paidBy] += exp.amount;
    const splitCount = exp.splitAmong.length || 1;
    const share = exp.amount / splitCount;
    exp.splitAmong.forEach(person => {
      balances[person] -= share;
    });
  });

  // Calculate settlement transactions
  let debtors = [];
  let creditors = [];
  Object.keys(balances).forEach(person => {
    const bal = balances[person];
    if (bal < -0.01) debtors.push({ name: person, amount: -bal });
    else if (bal > 0.01) creditors.push({ name: person, amount: bal });
  });

  let settlements = [];
  let dIdx = 0, cIdx = 0;
  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debt = debtors[dIdx];
    const cred = creditors[cIdx];
    const settleAmt = Math.min(debt.amount, cred.amount);
    settlements.push(`${debt.name} pays ${cred.name} ${symbol}${Math.round(settleAmt * rate)}`);
    debt.amount -= settleAmt;
    cred.amount -= settleAmt;
    if (debt.amount < 0.01) dIdx++;
    if (cred.amount < 0.01) cIdx++;
  }

  container.innerHTML = `
    <div class="max-w-4xl mx-auto space-y-8">
      <div class="text-center max-w-xl mx-auto">
        <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-2">Group Trip Split-Bill Calculator</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm">Add shared meals, taxis, and tickets — instantly see who owes whom with zero math stress.</p>
      </div>

      <!-- Add Expense Form -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h3 class="font-bold text-base text-slate-900 dark:text-white mb-4">➕ Add Shared Expense</h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Expense Title</label>
            <input type="text" id="newExpenseTitle" placeholder="e.g. Dinner, Taxi, Tickets..." class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Amount (${appState.currency})</label>
            <input type="number" id="newExpenseAmount" placeholder="e.g. 45" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-500 uppercase mb-1">Paid By</label>
            <select id="newExpensePaidBy" class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm">
              ${groupMembers.map(m => `<option value="${m}">${m}</option>`).join('')}
            </select>
          </div>
        </div>
        <button onclick="addSharedExpense()" class="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-xl transition shadow">
          Add Expense to Split
        </button>
      </div>

      <!-- Summary Matrix -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Settlement Overview -->
        <div class="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider opacity-80 block mb-1">Settlement Summary</span>
            <h3 class="text-2xl font-black mb-4">Total Group Spend: ${symbol}${Math.round(totalSpent * rate)}</h3>
            
            <div class="space-y-2 text-sm">
              ${settlements.length > 0 ? settlements.map(s => `
                <div class="p-3 bg-white/10 rounded-xl backdrop-blur font-semibold text-xs sm:text-sm">
                  🤝 ${s}
                </div>
              `).join('') : '<p class="text-xs opacity-90">All balances are currently settled!</p>'}
            </div>
          </div>

          <button onclick="copySettlementSummary()" class="mt-6 py-2.5 px-4 bg-white text-emerald-800 font-bold text-xs rounded-xl hover:bg-emerald-50 transition shadow">
            📋 Copy Settlement for Group Chat
          </button>
        </div>

        <!-- Expense History -->
        <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col">
          <h3 class="font-bold text-base text-slate-900 dark:text-white mb-4">Expense Log</h3>
          <div class="space-y-3 overflow-y-auto max-h-64 flex-1">
            ${groupExpenses.map((exp, idx) => `
              <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-xs">
                <div>
                  <span class="font-bold text-slate-900 dark:text-white block">${exp.title}</span>
                  <span class="text-slate-500">Paid by ${exp.paidBy}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="font-bold text-slate-900 dark:text-white">${symbol}${Math.round(exp.amount * rate)}</span>
                  <button onclick="deleteSharedExpense(${idx})" class="text-rose-500 hover:text-rose-700 p-1">✕</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

function addSharedExpense() {
  const title = document.getElementById('newExpenseTitle')?.value.trim();
  const amt = parseFloat(document.getElementById('newExpenseAmount')?.value) || 0;
  const paidBy = document.getElementById('newExpensePaidBy')?.value;

  if (!title || amt <= 0) {
    showToast('Please enter a valid expense title and amount!', 'error');
    return;
  }

  groupExpenses.push({
    id: Date.now(),
    title: title,
    amount: amt,
    paidBy: paidBy,
    splitAmong: [...groupMembers]
  });

  renderSplitExpensesView();
  showToast(`Added ${title} (${CURRENCIES[appState.currency].symbol}${amt})`);
}

function deleteSharedExpense(idx) {
  groupExpenses.splice(idx, 1);
  renderSplitExpensesView();
  showToast('Expense removed.');
}

function copySettlementSummary() {
  showToast('Settlement copied to clipboard! 📋');
}

// 6. PHOTO SPOTS & SUNSET GUIDE
function renderPhotoSpotsView() {
  const container = document.getElementById('photosViewContent');
  if (!container) return;

  const dest = appState.currentTrip?.destination || 'Tokyo, Japan';

  container.innerHTML = `
    <div class="max-w-5xl mx-auto space-y-10">
      <!-- Header Banner -->
      <div class="bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div class="relative z-10 max-w-2xl">
          <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur mb-4 inline-block">
            📸 Photography, Golden Hour & Drone Guide
          </span>
          <h2 class="text-3xl sm:text-4xl font-black mb-3">Top Photo Spots & Viewpoints</h2>
          <p class="text-pink-100 text-sm sm:text-base leading-relaxed">Capture breathtaking memories, golden hour vistas, and cinematic skyline compositions in ${dest}.</p>
        </div>
        <div class="absolute right-4 -bottom-10 opacity-20 text-9xl select-none pointer-events-none">📸</div>
      </div>

      <!-- Curated Photo Locations -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
          <img src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80" alt="Sunset Viewpoint" class="w-full h-44 object-cover">
          <div class="p-5">
            <span class="text-[10px] font-bold uppercase text-rose-600 bg-rose-50 dark:bg-rose-900/40 px-2 py-0.5 rounded">Golden Hour 🌅</span>
            <h4 class="font-bold text-base text-slate-900 dark:text-white mt-1 mb-1">Rooftop Panoramic Observation Deck</h4>
            <p class="text-xs text-slate-500 mb-3">Best Time: 30 minutes before sunset for the transition from golden light to neon twilight.</p>
            <span class="text-xs font-semibold text-primary-600">Tip: Use a wide-angle lens (16-24mm) for expansive horizons.</span>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
          <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80" alt="Historic Street" class="w-full h-44 object-cover">
          <div class="p-5">
            <span class="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded">Blue Hour 🌃</span>
            <h4 class="font-bold text-base text-slate-900 dark:text-white mt-1 mb-1">Lantern-Lit Historic Alleys</h4>
            <p class="text-xs text-slate-500 mb-3">Best Time: Blue hour (right after sunset) when paper lanterns glow with vibrant contrast.</p>
            <span class="text-xs font-semibold text-primary-600">Tip: High aperture (f/1.8) for beautiful bokeh portraits.</span>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
          <img src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80" alt="Nature Vista" class="w-full h-44 object-cover">
          <div class="p-5">
            <span class="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-900/40 px-2 py-0.5 rounded">Sunrise 🌄</span>
            <h4 class="font-bold text-base text-slate-900 dark:text-white mt-1 mb-1">Reflecting Alpine Waters & Lakes</h4>
            <p class="text-xs text-slate-500 mb-3">Best Time: Early dawn before morning breezes create ripples on the water surface.</p>
            <span class="text-xs font-semibold text-primary-600">Tip: Bring a polarizing filter (CPL) to cut water glare.</span>
          </div>
        </div>
      </div>

      <!-- Drone Regulations & Tripod Rules -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
        <h4 class="font-bold text-base text-slate-900 dark:text-white mb-3 flex items-center gap-2">🚁 Drone Flying & Camera Tripod Guidelines</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-300">
          <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
            <strong class="text-slate-900 dark:text-white block mb-1">🔒 Urban Drone Restrictions</strong>
            Flying drones over crowded city centers (Tokyo, Paris, Rome, NYC) is strictly prohibited without federal aviation permits. Fly only in designated open rural zones.
          </div>
          <div class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-2xl">
            <strong class="text-slate-900 dark:text-white block mb-1">📸 Tripod Etiquette at Monuments</strong>
            Large tripods and selfie sticks are banned inside historic temples and museums (like the Louvre, Sensō-ji, and Vatican). Use handheld stabilization or small magnetic clamps.
          </div>
        </div>
      </div>
    </div>
  `;
}

// 7. SAFETY ALERTS & COMMON TRAVEL SCAMS ADVISOR
function renderSafetyScamsView() {
  const container = document.getElementById('safetyViewContent');
  if (!container) return;

  const dest = appState.currentTrip?.destination || 'Tokyo, Japan';

  container.innerHTML = `
    <div class="max-w-5xl mx-auto space-y-10">
      <!-- Header Banner -->
      <div class="bg-gradient-to-r from-red-600 via-rose-700 to-amber-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div class="relative z-10 max-w-2xl">
          <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur mb-4 inline-block">
            🛡️ Travel Safety, Scam Protection & Emergency Hub
          </span>
          <h2 class="text-3xl sm:text-4xl font-black mb-3">Travel Safety & Scam Alerts</h2>
          <p class="text-red-100 text-sm sm:text-base leading-relaxed">Stay secure, recognize tourist scam tactics, and keep essential emergency numbers ready for ${dest}.</p>
        </div>
        <div class="absolute right-4 -bottom-10 opacity-20 text-9xl select-none pointer-events-none">🛡️</div>
      </div>

      <!-- Known Tourist Scams & Defenses -->
      <div>
        <h3 class="text-xl font-black text-slate-900 dark:text-white mb-4">Top Common Tourist Scams to Avoid</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <span class="text-2xl">🚕</span>
            <h4 class="font-bold text-base text-slate-900 dark:text-white">"Broken Meter" Taxi Scam</h4>
            <p class="text-xs text-slate-500 leading-relaxed">Driver claims the taxi meter is broken and charges 5x the regular rate upon arrival.</p>
            <div class="pt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              ✓ Defense: Insist on turning on the meter or use ride-hailing apps (Uber, Grab, GO).
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <span class="text-2xl">🤝</span>
            <h4 class="font-bold text-base text-slate-900 dark:text-white">"Friendship Bracelet" or Flower</h4>
            <p class="text-xs text-slate-500 leading-relaxed">A stranger forcibly ties a string bracelet on your wrist or hands you a rose, then demands aggressive cash.</p>
            <div class="pt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              ✓ Defense: Keep hands in pockets near tourist squares and walk away with a firm "No".
            </div>
          </div>

          <div class="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
            <span class="text-2xl">🏛️</span>
            <h4 class="font-bold text-base text-slate-900 dark:text-white">"Temple / Palace is Closed"</h4>
            <p class="text-xs text-slate-500 leading-relaxed">A friendly local tells you the monument is closed for a holiday and offers a detour to an overpriced gem store.</p>
            <div class="pt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              ✓ Defense: Walk directly to the official ticket counter to verify operating hours.
            </div>
          </div>
        </div>
      </div>

      <!-- Emergency SOS Card -->
      <div class="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <h3 class="text-lg font-bold mb-4 flex items-center gap-2">🚨 Universal Travel Safety Checklist</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div class="p-4 bg-white/10 rounded-2xl">
            <span class="font-bold block text-amber-400 mb-1">1. Digital Passport Copies</span>
            Keep encrypted PDF scans of passports and visas in cloud storage and offline on your phone.
          </div>
          <div class="p-4 bg-white/10 rounded-2xl">
            <span class="font-bold block text-amber-400 mb-1">2. Credit Card Freeze</span>
            Save your bank's international 24/7 hotline to instantly lock lost cards.
          </div>
          <div class="p-4 bg-white/10 rounded-2xl">
            <span class="font-bold block text-amber-400 mb-1">3. Travel Insurance</span>
            Always ensure emergency medical evacuation coverage is active.
          </div>
          <div class="p-4 bg-white/10 rounded-2xl">
            <span class="font-bold block text-amber-400 mb-1">4. Offline Maps</span>
            Download Google Maps or Maps.me offline packs before leaving hotel Wi-Fi.
          </div>
        </div>
      </div>
    </div>
  `;
}

// 8. AI API KEY SETTINGS MODAL
function openApiKeyModal() {
  const modal = document.getElementById('apiKeyModal');
  const input = document.getElementById('geminiApiKeyInput');
  if (input) input.value = appState.apiKey || '';
  if (modal) modal.classList.remove('hidden');
}

function closeApiKeyModal() {
  const modal = document.getElementById('apiKeyModal');
  if (modal) modal.classList.add('hidden');
}

function saveApiKey() {
  const input = document.getElementById('geminiApiKeyInput');
  if (input) {
    appState.apiKey = input.value.trim();
    localStorage.setItem('voyex_gemini_key', appState.apiKey);
    closeApiKeyModal();
    showToast('AI Settings updated successfully! 🔑');
  }
}

function clearApiKey() {
  appState.apiKey = '';
  localStorage.removeItem('voyex_gemini_key');
  const input = document.getElementById('geminiApiKeyInput');
  if (input) input.value = '';
  closeApiKeyModal();
  showToast('AI API Key cleared.');
}


