// Comprehensive Global Destinations Database for Voyex AI Travel Website
const DESTINATIONS = [
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    tagline: "Ultra-modern neon metropolis meets timeless ancient traditions",
    continent: "Asia",
    vibe: ["Culture", "Foodie", "Modern", "Shopping"],
    budgetLevel: "Moderate to High ($$ - $$$)",
    avgDailyCost: 110, // USD
    bestMonths: "March - May & September - November",
    currency: "JPY (¥)",
    language: "Japanese",
    coordinates: [35.6762, 139.6503],
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    description: "From the bustling Shibuya scramble and futuristic Akihabara to the tranquil Meiji Shrine and world-class ramen alleyways, Tokyo offers an unforgettable sensory journey.",
    highlights: ["Shibuya Crossing & Sky Deck", "Sensō-ji Temple in Asakusa", "TeamLab Borderless Digital Art", "Tsukiji Outer Market Food Tour", "Shinjuku Gyoen National Garden"],
    visaInfo: {
      type: "Visa-Free / eVisa for 70+ countries (up to 90 days)",
      passportValidity: "Valid for duration of stay",
      adapter: "Type A & B (100V, 50/60Hz)",
      emergency: { police: "110", ambulance: "119", touristHelp: "+81 3-3201-3331" }
    },
    cultureEtiquette: {
      tipping: "No tipping culture (considered rude/confusing). Exceptional service is always included.",
      customs: ["Bow slightly when greeting or saying thank you", "Remove shoes when entering homes, ryokans, and traditional restaurants", "Do not eat or drink while walking on busy streets", "Keep voice low on public transit"],
      phrases: [
        { en: "Hello", local: "Konnichiwa (こんにちは)", phonetic: "kohn-nee-chee-wah" },
        { en: "Thank you very much", local: "Arigatou gozaimasu (ありがとうございます)", phonetic: "ah-ree-gah-toh go-zeye-mahs" },
        { en: "Excuse me / Sorry", local: "Sumimasen (すみません)", phonetic: "soo-mee-mah-sen" },
        { en: "How much is this?", local: "Kore wa ikura desu ka? (これはいくらですか？)", phonetic: "ko-reh wah ee-koo-rah des kah" },
        { en: "Where is the bathroom?", local: "Toire wa doko desu ka? (トイレはどこですか？)", phonetic: "toy-reh wah doh-koh des kah" },
        { en: "Delicious!", local: "Oishii! (美味しい！)", phonetic: "oy-shee" }
      ]
    },
    itineraryDays: [
      {
        day: 1,
        title: "Iconic Tokyo: Neon, Shrines & City Views",
        activities: [
          { time: "09:00 AM", category: "Culture", title: "Meiji Shrine & Yoyogi Forest Walk", desc: "Walk through towering cedar gates to Tokyo's grandest Shinto shrine nestled in a tranquil 170-acre forest.", cost: 0, lat: 35.6764, lng: 139.6993, icon: "landmark" },
          { time: "12:30 PM", category: "Food", title: "Harajuku Takeshita Street & Crepes", desc: "Sample trendy Japanese street snacks, Harajuku sweet crepes, and explore vibrant youth fashion boutiques.", cost: 15, lat: 35.6715, lng: 139.7032, icon: "utensils" },
          { time: "03:30 PM", category: "Sightseeing", title: "Shibuya Crossing & Hachiko Statue", desc: "Experience the world's busiest pedestrian crossing and pay tribute to Japan's most loyal canine.", cost: 0, lat: 35.6595, lng: 139.7005, icon: "camera" },
          { time: "06:30 PM", category: "Sunset / Views", title: "Shibuya Sky Observation Deck", desc: "360-degree open-air panoramic sunset view over Tokyo with glimpses of Mount Fuji on clear days.", cost: 18, lat: 35.6585, lng: 139.7022, icon: "eye" },
          { time: "08:30 PM", category: "Dining & Nightlife", title: "Omoide Yokocho (Memory Lane) Yakitori", desc: "Authentic dinner in a cozy lantern-lit post-war alleyway serving grilled chicken skewers and cold draft beer.", cost: 25, lat: 35.6931, lng: 139.6998, icon: "glass" }
        ]
      },
      {
        day: 2,
        title: "Historic Asakusa & Futuristic Digital Realms",
        activities: [
          { time: "08:30 AM", category: "Culture", title: "Sensō-ji Temple & Nakamise Dori", desc: "Tokyo's oldest Buddhist temple founded in 645 AD. Browse traditional folding fans and freshly made senbei rice crackers.", cost: 0, lat: 35.7148, lng: 139.7967, icon: "landmark" },
          { time: "12:00 PM", category: "Food", title: "Tsukiji Outer Market Seafood Feast", desc: "Taste fresh nigiri sushi, tamagoyaki (rolled omelet), and wagyu beef skewers from local master vendors.", cost: 30, lat: 35.6655, lng: 139.7708, icon: "utensils" },
          { time: "03:00 PM", category: "Experience", title: "teamLab Planets / Borderless Digital Art", desc: "Immerse in breathtaking multi-sensory crystal light installations, water gardens, and infinity mirrors.", cost: 28, lat: 35.6493, lng: 139.7898, icon: "sparkles" },
          { time: "07:00 PM", category: "Dining", title: "Ginza Luxury Ramen & Cocktail Lounge", desc: "Michelin-recommended truffle shoyu ramen followed by crafted bespoke cocktails at an intimate Ginza speakeasy.", cost: 35, lat: 35.6719, lng: 139.7640, icon: "utensils" }
        ]
      },
      {
        day: 3,
        title: "Pop Culture, Anime & Panoramic Skyline",
        activities: [
          { time: "09:30 AM", category: "Shopping", title: "Akihabara Electric Town & Retro Games", desc: "Explore multi-level arcades, vintage gaming stores (Super Potato), and anime figure galleries.", cost: 10, lat: 35.6983, lng: 139.7730, icon: "shopping-bag" },
          { time: "01:00 PM", category: "Culture", title: "Ueno Park & Tokyo National Museum", desc: "Stroll through tranquil ponds and view ancient samurai armor, swords, and ukiyo-e woodblock prints.", cost: 8, lat: 35.7188, lng: 139.7765, icon: "landmark" },
          { time: "05:00 PM", category: "Sightseeing", title: "Tokyo Skytree Golden Hour", desc: "Ascend to 450 meters above ground in one of the world's tallest towers for an endless sunset city panorama.", cost: 22, lat: 35.7100, lng: 139.8107, icon: "camera" },
          { time: "08:00 PM", category: "Dining", title: "Shinjuku Golden Gai Micro-Bars", desc: "Explore 200 tiny bars packed into 6 narrow alleyways, each with unique themes and cozy atmospheres.", cost: 30, lat: 35.6943, lng: 139.7046, icon: "glass" }
        ]
      }
    ]
  },
  {
    id: "paris",
    name: "Paris",
    country: "France",
    tagline: "The City of Light, romance, world-class art, and culinary perfection",
    continent: "Europe",
    vibe: ["Romantic", "Culture", "Foodie", "Architecture"],
    budgetLevel: "High ($$$)",
    avgDailyCost: 140,
    bestMonths: "April - June & September - November",
    currency: "EUR (€)",
    language: "French",
    coordinates: [48.8566, 2.3522],
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    description: "From the majesty of the Eiffel Tower and masterpieces in the Louvre to bohemian cobblestones in Montmartre, Paris is a timeless dream for every traveler.",
    highlights: ["Eiffel Tower & Champ de Mars", "Louvre Museum & Mona Lisa", "Montmartre & Sacré-Cœur", "Seine River Sunset Cruise", "Palace of Versailles"],
    visaInfo: {
      type: "Schengen Visa (Visa-Free for 90 days for 60+ countries)",
      passportValidity: "Must have at least 3 months validity beyond intended stay",
      adapter: "Type C & E (230V, 50Hz)",
      emergency: { police: "17", ambulance: "15", touristHelp: "112" }
    },
    cultureEtiquette: {
      tipping: "Service compris is included by law. Leaving 5-10% extra for great service is customary.",
      customs: ["Always greet shopkeepers and servers with 'Bonjour'", "Dress smart casual", "Keep voices moderate in cafés and restaurants"],
      phrases: [
        { en: "Hello / Good day", local: "Bonjour", phonetic: "bon-zhoor" },
        { en: "Thank you very much", local: "Merci beaucoup", phonetic: "mair-see boh-koo" },
        { en: "Please", local: "S'il vous plaît", phonetic: "seel voo pleh" },
        { en: "Where is the Eiffel Tower?", local: "Où est la tour Eiffel?", phonetic: "oo eh lah toor ay-fel" },
        { en: "The check, please", local: "L'addition, s'il vous plaît", phonetic: "lah-dee-syon seel voo pleh" }
      ]
    },
    itineraryDays: [
      {
        day: 1,
        title: "Heart of Paris: Icons, Seine & Sunset Sparkles",
        activities: [
          { time: "09:00 AM", category: "Culture", title: "Louvre Museum & Tuileries Gardens", desc: "Marvel at Da Vinci's Mona Lisa and Winged Victory of Samothrace.", cost: 22, lat: 48.8606, lng: 2.3376, icon: "landmark" },
          { time: "01:00 PM", category: "Food", title: "Classic Parisian Bistro Lunch in Saint-Germain", desc: "Indulge in French onion soup and croque monsieur at a vintage terrace.", cost: 28, lat: 48.8538, lng: 2.3333, icon: "utensils" },
          { time: "03:30 PM", category: "Sightseeing", title: "Notre-Dame Cathedral & Île de la Cité", desc: "Admire gothic architecture and walk along vintage riverside bookstalls.", cost: 0, lat: 48.8530, lng: 2.3499, icon: "landmark" },
          { time: "06:30 PM", category: "Experience", title: "Seine River Twilight Cruise", desc: "Glide past illuminated monuments and historic bridges.", cost: 16, lat: 48.8584, lng: 2.2945, icon: "sparkles" },
          { time: "08:30 PM", category: "Sunset / Views", title: "Eiffel Tower Light Show & Champ de Mars", desc: "Watch the Eiffel Tower sparkle with 20,000 bulbs at night.", cost: 0, lat: 48.8584, lng: 2.2945, icon: "camera" }
        ]
      },
      {
        day: 2,
        title: "Bohemian Montmartre, Le Marais & Arc de Triomphe",
        activities: [
          { time: "09:30 AM", category: "Culture", title: "Sacré-Cœur Basilica & Artists' Square", desc: "Climb the hill of Montmartre for sweeping views over Paris.", cost: 0, lat: 48.8867, lng: 2.3431, icon: "landmark" },
          { time: "12:30 PM", category: "Food", title: "Gourmet Pastries & Café in Le Marais", desc: "Sample artisanal pastries and Parisian café delicacies.", cost: 18, lat: 48.8575, lng: 2.3622, icon: "utensils" },
          { time: "03:00 PM", category: "Culture", title: "Musée d'Orsay Impressionist Masterpieces", desc: "Works by Monet, Van Gogh, Renoir inside a grand Beaux-Arts railway station.", cost: 16, lat: 48.8599, lng: 2.3266, icon: "camera" },
          { time: "06:30 PM", category: "Sightseeing", title: "Arc de Triomphe Rooftop Sunset", desc: "Panoramic sunset views of twelve grand avenues radiating outwards.", cost: 14, lat: 48.8738, lng: 2.2950, icon: "eye" },
          { time: "08:30 PM", category: "Dining", title: "Wine & French Gastronomy Dinner", desc: "Sample regional cheeses and Bordeaux wines in a cozy bistro.", cost: 38, lat: 48.8640, lng: 2.3450, icon: "glass" }
        ]
      },
      {
        day: 3,
        title: "Palace Splendor & Secret Covered Passages",
        activities: [
          { time: "08:30 AM", category: "Culture", title: "Palace of Versailles & Royal Gardens", desc: "Tour the famous Hall of Mirrors and fountain gardens.", cost: 30, lat: 48.8049, lng: 2.1204, icon: "landmark" },
          { time: "02:30 PM", category: "Shopping", title: "Galeries Lafayette Rooftop View", desc: "Admire the stained-glass dome and take in rooftop skyline views.", cost: 0, lat: 48.8738, lng: 2.3320, icon: "shopping-bag" },
          { time: "07:30 PM", category: "Dining & Nightlife", title: "Latin Quarter Jazz & Bistro Evening", desc: "Live jazz music with fine dining in Paris's historic quarter.", cost: 45, lat: 48.8841, lng: 2.3323, icon: "sparkles" }
        ]
      }
    ]
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    tagline: "Tropical paradise of lush jungle cascades, sacred temples, and golden beaches",
    continent: "Asia",
    vibe: ["Nature", "Relaxation", "Adventure", "Culture"],
    budgetLevel: "Budget to Moderate ($ - $$)",
    avgDailyCost: 55,
    bestMonths: "April - October (Dry season)",
    currency: "IDR (Rp)",
    language: "Indonesian & Balinese",
    coordinates: [-8.4095, 115.1889],
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    description: "From tranquil sunrise yoga above rice terraces in Ubud to surf breaks in Uluwatu and sacred water temples, Bali rejuvenates body and soul.",
    highlights: ["Tegallalang Rice Terraces", "Uluwatu Cliffside Temple & Kecak Dance", "Mount Batur Sunrise Volcano Trek", "Tirta Empul Holy Water Temple", "Nusa Penida Day Trip"],
    visaInfo: {
      type: "Visa on Arrival (VoA) / e-VoA for 90+ countries (30 days)",
      passportValidity: "Must have at least 6 months validity from entry date",
      adapter: "Type C & F (230V, 50Hz)",
      emergency: { police: "110 / 112", ambulance: "118", touristHelp: "+62 361 224608" }
    },
    cultureEtiquette: {
      tipping: "5-10% tipping in restaurants and small tips for drivers is warmly appreciated.",
      customs: ["Wear a sarong and sash when entering temples", "Never step on Canang Sari flower offerings", "Use your right hand for giving and receiving"],
      phrases: [
        { en: "Hello", local: "Om Swastiastu / Halo", phonetic: "ohm swas-tee-ahs-too" },
        { en: "Thank you", local: "Terima kasih / Suksema", phonetic: "t'ree-mah kah-see" },
        { en: "How much is this?", local: "Berapa harganya?", phonetic: "b'rah-pah har-gah-nyah" }
      ]
    },
    itineraryDays: [
      {
        day: 1,
        title: "Spiritual Ubud: Rice Terraces & Holy Water",
        activities: [
          { time: "07:30 AM", category: "Nature", title: "Tegallalang Rice Terrace Sunrise Walk", desc: "Stroll emerald green stepped paddies bathed in morning golden light.", cost: 4, lat: -8.4357, lng: 115.2796, icon: "sparkles" },
          { time: "11:00 AM", category: "Culture", title: "Tirta Empul Sacred Water Purification", desc: "Participate in the ancient Balinese cleansing spring ritual.", cost: 6, lat: -8.4150, lng: 115.3150, icon: "landmark" },
          { time: "01:30 PM", category: "Food", title: "Organic Warung Feast in Ubud", desc: "Taste authentic Nasi Campur and dragonfruit smoothie bowls.", cost: 9, lat: -8.5069, lng: 115.2625, icon: "utensils" },
          { time: "03:30 PM", category: "Nature", title: "Sacred Monkey Forest Sanctuary", desc: "Wander among moss-covered temples and playful long-tailed macaques.", cost: 7, lat: -8.5188, lng: 115.2588, icon: "camera" },
          { time: "07:00 PM", category: "Relaxation", title: "Traditional Balinese Herbal Spa", desc: "Unwind with authentic flower bath and deep-tissue massage.", cost: 18, lat: -8.5080, lng: 115.2640, icon: "sparkles" }
        ]
      },
      {
        day: 2,
        title: "Volcano Trek & Hidden Cascades",
        activities: [
          { time: "03:00 AM", category: "Adventure", title: "Mount Batur Sunrise Volcano Hike", desc: "Hike up an active volcano to watch pastel dawn colors over Lake Batur.", cost: 35, lat: -8.2424, lng: 115.3755, icon: "compass" },
          { time: "10:30 AM", category: "Nature", title: "Tibumana & Kanto Lampo Waterfalls", desc: "Swim in crystal jungle pools surrounded by hanging vines.", cost: 4, lat: -8.5034, lng: 115.3340, icon: "sparkles" },
          { time: "07:00 PM", category: "Dining", title: "Campuhan Ridge Twilight & Fine Dining", desc: "Scenic ridge walk at sunset followed by gourmet Indonesian dining.", cost: 22, lat: -8.5020, lng: 115.2540, icon: "utensils" }
        ]
      },
      {
        day: 3,
        title: "South Bali Cliffs & Kecak Sunset Dance",
        activities: [
          { time: "09:30 AM", category: "Relaxation", title: "Padang Padang & Dreamland Beach", desc: "Sunbathe and swim in turquoise waters beside limestone cliffs.", cost: 2, lat: -8.8111, lng: 115.1039, icon: "sun" },
          { time: "05:00 PM", category: "Culture", title: "Uluwatu Temple & Sunset Kecak Fire Dance", desc: "Watch 50 chanting dancers against a dramatic ocean sunset.", cost: 12, lat: -8.8291, lng: 115.0849, icon: "landmark" },
          { time: "08:00 PM", category: "Dining", title: "Jimbaran Bay Candlelit Beach BBQ", desc: "Grilled fresh snapper and king prawns right on the sand.", cost: 25, lat: -8.7700, lng: 115.1667, icon: "glass" }
        ]
      }
    ]
  },
  {
    id: "rome",
    name: "Rome",
    country: "Italy",
    tagline: "The Eternal City of gladiators, Renaissance art, espresso, and culinary passion",
    continent: "Europe",
    vibe: ["Culture", "History", "Foodie", "Architecture"],
    budgetLevel: "Moderate to High ($$ - $$$)",
    avgDailyCost: 120,
    bestMonths: "April - June & September - October",
    currency: "EUR (€)",
    language: "Italian",
    coordinates: [41.9028, 12.4964],
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
    description: "Walk in the footsteps of emperors at the Colosseum, toss a coin into Trevi Fountain, and savor creamy cacio e pepe in charming Trastevere.",
    highlights: ["Colosseum & Roman Forum", "Vatican Museums & Sistine Chapel", "Pantheon & Piazza Navona", "Trevi Fountain & Spanish Steps", "Trastevere Food Walk"],
    visaInfo: {
      type: "Schengen Visa (Visa-Free for 90 days for 60+ countries)",
      passportValidity: "At least 3 months after scheduled departure date",
      adapter: "Type C, F & L (230V, 50Hz)",
      emergency: { police: "113 / 112", ambulance: "118", touristHelp: "060608" }
    },
    cultureEtiquette: {
      tipping: "Tipping is not required (coperto fee included). Rounding up is courteous.",
      customs: ["Cappuccino in the morning only; order espresso after 11:00 AM", "Cover shoulders and knees in churches", "Do not cut pasta with a knife"],
      phrases: [
        { en: "Hello", local: "Ciao / Buongiorno", phonetic: "chow / bwon-zhor-no" },
        { en: "Thank you very much", local: "Grazie mille", phonetic: "grah-tsee-eh meel-leh" },
        { en: "The bill, please", local: "Il conto, per favore", phonetic: "eel kohn-toh pehr fah-voh-reh" }
      ]
    },
    itineraryDays: [
      {
        day: 1,
        title: "Ancient Rome: Colosseum & Imperial Forum",
        activities: [
          { time: "09:00 AM", category: "Culture", title: "Colosseum Arena Floor & Underground", desc: "Stand where gladiators fought 2,000 years ago.", cost: 24, lat: 41.8902, lng: 12.4922, icon: "landmark" },
          { time: "12:00 PM", category: "History", title: "Roman Forum & Palatine Hill", desc: "Stroll through the political hub of the Roman Empire.", cost: 0, lat: 41.8925, lng: 12.4853, icon: "landmark" },
          { time: "02:00 PM", category: "Food", title: "Traditional Carbonara in Monti", desc: "Feast on authentic Carbonara and crispy supplì.", cost: 20, lat: 41.8947, lng: 12.4938, icon: "utensils" },
          { time: "08:00 PM", category: "Dining", title: "Trastevere Trattoria Dinner", desc: "Sip house Chianti while enjoying homemade lasagna on cobblestones.", cost: 30, lat: 41.8890, lng: 12.4700, icon: "glass" }
        ]
      },
      {
        day: 2,
        title: "Vatican Treasures & Baroque Piazzas",
        activities: [
          { time: "08:30 AM", category: "Culture", title: "Vatican Museums & Sistine Chapel", desc: "Gaze up at Michelangelo's ceiling frescoes.", cost: 28, lat: 41.9065, lng: 12.4534, icon: "landmark" },
          { time: "12:00 PM", category: "Culture", title: "St. Peter's Basilica & Dome", desc: "Climb the dome for 360-degree views of Rome.", cost: 10, lat: 41.9022, lng: 12.4568, icon: "eye" },
          { time: "08:00 PM", category: "Dining", title: "Piazza Navona Aperitivo", desc: "Aperol Spritz beside Bernini's Fountain of the Four Rivers.", cost: 22, lat: 41.8992, lng: 12.4731, icon: "glass" }
        ]
      },
      {
        day: 3,
        title: "Pantheon, Trevi Fountain & Spanish Steps",
        activities: [
          { time: "09:00 AM", category: "History", title: "The Pantheon's Historic Oculus", desc: "Step inside the best-preserved ancient Roman dome.", cost: 5, lat: 41.8986, lng: 12.4769, icon: "landmark" },
          { time: "11:30 AM", category: "Sightseeing", title: "Trevi Fountain Coin Toss", desc: "Toss a coin over your left shoulder to ensure your return.", cost: 0, lat: 41.9009, lng: 12.4833, icon: "camera" },
          { time: "01:00 PM", category: "Food", title: "Gourmet Gelato at Giolitti", desc: "Taste creamy pistachio and dark chocolate gelato.", cost: 6, lat: 41.9006, lng: 12.4782, icon: "utensils" },
          { time: "06:30 PM", category: "Sunset / Views", title: "Pincio Terrace Sunset at Villa Borghese", desc: "Romantic hilltop sunset overlooking Rome.", cost: 0, lat: 41.9114, lng: 12.4795, icon: "eye" }
        ]
      }
    ]
  },
  {
    id: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    tagline: "Futuristic city of world records, luxury shopping, and golden desert dunes",
    continent: "Middle East",
    vibe: ["Luxury", "Modern", "Adventure", "Shopping"],
    budgetLevel: "High to Ultra-Luxury ($$$ - $$$$)",
    avgDailyCost: 160,
    bestMonths: "November - March",
    currency: "AED (د.إ)",
    language: "Arabic & English",
    coordinates: [25.2048, 55.2708],
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    description: "Experience the world's tallest tower, ski inside a desert mall, race over Arabian sand dunes, and dine in futuristic waterfront restaurants.",
    highlights: ["Burj Khalifa 148th Floor", "Dubai Fountain & Dubai Mall", "Desert Safari with Dune Bashing & BBQ", "Museum of the Future", "Palm Jumeirah & Atlantis"],
    visaInfo: {
      type: "Visa-Free / Visa on Arrival for 70+ nationalities (30-90 days)",
      passportValidity: "At least 6 months validity from date of entry",
      adapter: "Type G (230V, 50Hz)",
      emergency: { police: "999", ambulance: "998", touristHelp: "800 4888" }
    },
    cultureEtiquette: {
      tipping: "10-15% tipping is standard in restaurants and for taxi drivers.",
      customs: ["Dress respectfully in public malls and government areas", "Public displays of affection should be kept minimal", "Ask permission before photographing local residents"],
      phrases: [
        { en: "Hello", local: "Marhaba / Salam", phonetic: "mar-hah-bah" },
        { en: "Thank you", local: "Shukran", phonetic: "shook-rahn" },
        { en: "Welcome", local: "Ahlan wa Sahlan", phonetic: "ah-lahn wah sah-lahn" }
      ]
    },
    itineraryDays: [
      {
        day: 1,
        title: "Burj Khalifa, Dubai Mall & Fountain Show",
        activities: [
          { time: "09:30 AM", category: "Culture", title: "Museum of the Future", desc: "Step into futuristic exhibitions on space, AI, and bio-tech.", cost: 38, lat: 25.2255, lng: 55.2818, icon: "sparkles" },
          { time: "01:00 PM", category: "Shopping", title: "Dubai Mall & Giant Aquarium", desc: "Shop world brands and gaze at 33,000 marine animals.", cost: 25, lat: 25.1972, lng: 55.2797, icon: "shopping-bag" },
          { time: "04:30 PM", category: "Sunset / Views", title: "Burj Khalifa Observation Deck", desc: "Golden sunset over the desert skyline from the world's tallest tower.", cost: 45, lat: 25.1972, lng: 55.2744, icon: "eye" },
          { time: "07:30 PM", category: "Experience", title: "Dubai Fountain Dancing Water Show", desc: "Watch illuminated water jets dance across Burj Lake.", cost: 0, lat: 25.1953, lng: 25.2767, icon: "camera" }
        ]
      },
      {
        day: 2,
        title: "Arabian Desert Safari & Bedouin BBQ Camp",
        activities: [
          { time: "09:30 AM", category: "Culture", title: "Old Dubai, Gold & Spice Souks", desc: "Ride an Abra boat across Dubai Creek and explore spice markets.", cost: 5, lat: 25.2680, lng: 55.2970, icon: "landmark" },
          { time: "03:00 PM", category: "Adventure", title: "4x4 Desert Dune Bashing & Sandboarding", desc: "Exciting roller coaster ride over red sand dunes.", cost: 55, lat: 24.9500, lng: 55.6000, icon: "compass" },
          { time: "07:30 PM", category: "Dining", title: "Desert Camp BBQ Feast & Fire Show", desc: "Under the stars with grilled meats and fire dancers.", cost: 0, lat: 24.9550, lng: 55.6050, icon: "utensils" }
        ]
      },
      {
        day: 3,
        title: "The Palm, Atlantis & Marina Sunset Yacht",
        activities: [
          { time: "10:00 AM", category: "Sightseeing", title: "The View at The Palm 360 Observatory", desc: "Gaze over the world-famous man-made palm island.", cost: 28, lat: 25.1147, lng: 55.1408, icon: "eye" },
          { time: "05:30 PM", category: "Experience", title: "Dubai Marina Sunset Yacht Cruise", desc: "Sail past Ain Dubai and the illuminated marina skyscrapers.", cost: 40, lat: 25.0784, lng: 55.1384, icon: "compass" },
          { time: "08:30 PM", category: "Dining", title: "Pier 7 Marina Gourmet Dinner", desc: "Waterfront dining overlooking thousands of glittering yachts.", cost: 50, lat: 25.0770, lng: 55.1400, icon: "glass" }
        ]
      }
    ]
  },
  {
    id: "newyork",
    name: "New York City",
    country: "United States",
    tagline: "The buzzing global capital of art, Broadway, towering skylines, and endless energy",
    continent: "North America",
    vibe: ["Modern", "Culture", "Foodie", "Shopping"],
    budgetLevel: "High to Ultra-High ($$$ - $$$$)",
    avgDailyCost: 175,
    bestMonths: "April - June & September - November",
    currency: "USD ($)",
    language: "English",
    coordinates: [40.7128, -74.0060],
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
    description: "From morning strolls through Central Park to sunset at Summit One Vanderbilt and midnight slices of pizza, NYC is electric 24/7.",
    highlights: ["Times Square & Broadway Show", "Central Park & The Met Museum", "Statue of Liberty & Ferry", "Summit One Vanderbilt", "Brooklyn Bridge Sunset Walk"],
    visaInfo: {
      type: "ESTA (Visa Waiver for 40+ countries) or US B1/B2 Visa",
      passportValidity: "Valid for at least 6 months beyond stay",
      adapter: "Type A & B (120V, 60Hz)",
      emergency: { police: "911", ambulance: "911", touristHelp: "311" }
    },
    cultureEtiquette: {
      tipping: "18-22% tipping is standard in all sit-down restaurants and bars.",
      customs: ["Walk with purpose and keep sidewalk flow", "Stand on right of subway escalators"],
      phrases: [
        { en: "How you doing?", local: "How ya doing? / What's up?", phonetic: "how-yah doo-ing" },
        { en: "Regular slice of pizza", local: "Plain cheese slice to go", phonetic: "pleyn slyce" }
      ]
    },
    itineraryDays: [
      {
        day: 1,
        title: "Central Park, The Met & Broadway Lights",
        activities: [
          { time: "09:00 AM", category: "Nature", title: "Central Park Walk & Bow Bridge", desc: "Walk through leafy avenues and see Bethesda Fountain.", cost: 0, lat: 40.7738, lng: -73.9708, icon: "sun" },
          { time: "12:00 PM", category: "Culture", title: "The Metropolitan Museum of Art (The Met)", desc: "Wander through Temple of Dendur and master paintings.", cost: 30, lat: 40.7794, lng: -73.9632, icon: "landmark" },
          { time: "06:30 PM", category: "Sunset / Views", title: "SUMMIT One Vanderbilt Mirrors", desc: "Mirror observation deck with mind-bending skyline views.", cost: 42, lat: 40.7527, lng: -73.9772, icon: "eye" },
          { time: "08:30 PM", category: "Experience", title: "Broadway Musical in Theatre District", desc: "Catch an iconic Broadway production in Times Square.", cost: 95, lat: 40.7580, lng: -73.9855, icon: "sparkles" }
        ]
      },
      {
        day: 2,
        title: "High Line, Soho & Brooklyn Bridge",
        activities: [
          { time: "09:30 AM", category: "Sightseeing", title: "The High Line Elevated Park", desc: "Lush linear park built on historic elevated freight rails.", cost: 0, lat: 40.7480, lng: -74.0048, icon: "sun" },
          { time: "12:30 PM", category: "Food", title: "Chelsea Market Gourmet Bites", desc: "Sample fresh lobster rolls and street tacos.", cost: 25, lat: 40.7424, lng: -74.0061, icon: "utensils" },
          { time: "06:00 PM", category: "Sunset / Views", title: "Brooklyn Bridge Sunset Walk to DUMBO", desc: "Cross the 1883 bridge with skyline sunset views.", cost: 0, lat: 40.7061, lng: -73.9969, icon: "camera" }
        ]
      },
      {
        day: 3,
        title: "Statue of Liberty & Financial District",
        activities: [
          { time: "09:00 AM", category: "Culture", title: "Statue of Liberty & Ellis Island", desc: "Ferry ride to Lady Liberty and historic museum.", cost: 25, lat: 40.6892, lng: -74.0445, icon: "landmark" },
          { time: "03:30 PM", category: "History", title: "9/11 Memorial Reflecting Pools & The Oculus", desc: "Cascading waterfall pools and soaring transit hub.", cost: 0, lat: 40.7115, lng: -74.0132, icon: "camera" },
          { time: "07:30 PM", category: "Dining", title: "Greenwich Village Speakeasy & Live Music", desc: "Bespoke cocktails and jazz in historic village.", cost: 35, lat: 40.7300, lng: -74.0000, icon: "sparkles" }
        ]
      }
    ]
  },
  {
    id: "switzerland",
    name: "Swiss Alps",
    country: "Switzerland",
    tagline: "Majestic snow-capped peaks, crystal turquoise lakes, and fairy-tale alpine villages",
    continent: "Europe",
    vibe: ["Nature", "Adventure", "Romantic", "Relaxation"],
    budgetLevel: "Ultra-High ($$$$)",
    avgDailyCost: 190,
    bestMonths: "June - September & December - March",
    currency: "CHF (Fr.)",
    language: "German & French",
    coordinates: [46.6863, 7.8632],
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
    description: "Take panoramic trains to the Top of Europe, ride cable cars beneath the Matterhorn, and savor Swiss fondue in wooden chalets.",
    highlights: ["Jungfraujoch - Top of Europe", "Matterhorn & Gornergrat Train", "Lauterbrunnen Valley of 72 Waterfalls", "Grindelwald First Cliff Walk", "Lake Brienz Cruise"],
    visaInfo: {
      type: "Schengen Visa (Visa-Free for 90 days for 60+ countries)",
      passportValidity: "At least 3 months validity beyond stay",
      adapter: "Type J & C (230V, 50Hz)",
      emergency: { police: "117", ambulance: "144", rescue: "1414" }
    },
    cultureEtiquette: {
      tipping: "Service is included; rounding up to nearest 5 or 10 CHF is customary.",
      customs: ["Punctuality is sacred", "Pristine environmental cleanliness"],
      phrases: [
        { en: "Hello", local: "Grüezi / Bonjour", phonetic: "grew-eht-see" },
        { en: "Thank you", local: "Merci vilmal / Danke", phonetic: "mair-see feel-mahl" }
      ]
    },
    itineraryDays: [
      {
        day: 1,
        title: "Lauterbrunnen Waterfalls & Grindelwald First",
        activities: [
          { time: "09:00 AM", category: "Nature", title: "Lauterbrunnen Valley & Staubbach Falls", desc: "Walk beneath 300m rock faces and roaring falls.", cost: 0, lat: 46.5935, lng: 7.9090, icon: "sun" },
          { time: "12:00 PM", category: "Food", title: "Alpine Cheese Fondue in Wooden Chalet", desc: "Dip crusty bread into bubbling Gruyère cheese.", cost: 32, lat: 46.6240, lng: 7.9200, icon: "utensils" },
          { time: "02:30 PM", category: "Adventure", title: "Grindelwald First Cliff Walk", desc: "Suspended bridge along sheer cliffs with 1,000m drops.", cost: 36, lat: 46.6610, lng: 8.0530, icon: "compass" }
        ]
      },
      {
        day: 2,
        title: "Jungfraujoch: Top of Europe Glacier Experience",
        activities: [
          { time: "08:30 AM", category: "Experience", title: "Eiger Express & Jungfrau Railway (3,454m)", desc: "Europe's highest railway station into the heart of glaciers.", cost: 140, lat: 46.5475, lng: 7.9822, icon: "compass" },
          { time: "11:30 AM", category: "Nature", title: "Aletsch Glacier Ice Palace Walk", desc: "Blue ice tunnels sculpted inside the longest glacier in Alps.", cost: 0, lat: 46.5475, lng: 7.9822, icon: "sparkles" }
        ]
      },
      {
        day: 3,
        title: "Matterhorn Magic in Zermatt",
        activities: [
          { time: "09:00 AM", category: "Experience", title: "Gornergrat Cogwheel Train Viewpoint", desc: "View 29 peaks exceeding 4,000 meters facing the Matterhorn.", cost: 85, lat: 45.9840, lng: 7.7830, icon: "eye" },
          { time: "01:00 PM", category: "Nature", title: "Riffelsee Lake Mirror Reflection", desc: "Hike to the lake capturing the Matterhorn reflection.", cost: 0, lat: 45.9830, lng: 7.7650, icon: "camera" }
        ]
      }
    ]
  },
  {
    id: "london",
    name: "London",
    country: "United Kingdom",
    tagline: "Historic royal landmarks, West End theatre, world-class museums, and lively pub culture",
    continent: "Europe",
    vibe: ["Culture", "History", "Shopping", "Foodie"],
    budgetLevel: "High ($$$)",
    avgDailyCost: 150,
    bestMonths: "May - September",
    currency: "GBP (£)",
    language: "English",
    coordinates: [51.5074, -0.1278],
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80",
    description: "Watch the Changing of the Guard at Buckingham Palace, see Big Ben glow beside the Thames, and explore free world-leading museums.",
    highlights: ["Tower of London & Tower Bridge", "Big Ben & Westminster Abbey", "British Museum", "Buckingham Palace", "West End Show"],
    visaInfo: {
      type: "UK ETA / Standard Visitor Visa (Visa-free 6 months for US/EU)",
      passportValidity: "Valid for duration of stay",
      adapter: "Type G (230V, 50Hz)",
      emergency: { police: "999 / 112", ambulance: "999", touristHelp: "101" }
    },
    cultureEtiquette: {
      tipping: "10-12.5% service charge is standard in restaurants. No tip needed at pub bars.",
      customs: ["Stand on the right on Tube escalators", "Always queue politely"],
      phrases: [
        { en: "Cheers / Thank you", local: "Cheers mate!", phonetic: "cheerz mayt" },
        { en: "Mind the gap", local: "Mind the gap", phonetic: "mynd thuh gap" }
      ]
    },
    itineraryDays: [
      {
        day: 1,
        title: "Royal Westminster & Thames River Highlights",
        activities: [
          { time: "09:30 AM", category: "Culture", title: "Big Ben & Westminster Abbey", desc: "Coronation church of kings and the world's most famous clock.", cost: 27, lat: 51.4994, lng: -0.1274, icon: "landmark" },
          { time: "11:30 AM", category: "Sightseeing", title: "Buckingham Palace Changing of the Guard", desc: "Iconic precision royal pageantry in red tunics.", cost: 0, lat: 51.5014, lng: -0.1419, icon: "landmark" },
          { time: "04:30 PM", category: "Sunset / Views", title: "The London Eye Sunset Flight", desc: "Glass capsule flight 135 meters above the Thames.", cost: 35, lat: 51.5033, lng: -0.1195, icon: "eye" },
          { time: "07:30 PM", category: "Experience", title: "West End Musical Performance", desc: "World-class performing arts in London's theatre district.", cost: 65, lat: 51.5120, lng: -0.1300, icon: "sparkles" }
        ]
      },
      {
        day: 2,
        title: "Tower of London, Borough Market & Tate Modern",
        activities: [
          { time: "09:00 AM", category: "History", title: "Tower of London & Crown Jewels", desc: "Dazzling 23,000-gem royal jewels and 1,000 years of history.", cost: 33, lat: 51.5081, lng: -0.0759, icon: "landmark" },
          { time: "01:15 PM", category: "Food", title: "Borough Market Gourmet Food Hall", desc: "Taste artisan cheeses, warm pastries, and street delicacies.", cost: 20, lat: 51.5055, lng: -0.0908, icon: "utensils" },
          { time: "03:30 PM", category: "Culture", title: "Tate Modern & Millennium Bridge", desc: "Modern masterpieces by Picasso and Warhol overlooking St. Paul's.", cost: 0, lat: 51.5076, lng: -0.0994, icon: "landmark" }
        ]
      },
      {
        day: 3,
        title: "British Museum & Hyde Park",
        activities: [
          { time: "09:30 AM", category: "Culture", title: "The British Museum (Rosetta Stone)", desc: "Egyptian mummies and Parthenon sculptures (Free entry).", cost: 0, lat: 51.5194, lng: -0.1270, icon: "landmark" },
          { time: "01:00 PM", category: "Food", title: "Traditional Afternoon Tea & Scones", desc: "Warm scones with clotted cream and fine Darjeeling tea.", cost: 45, lat: 51.5070, lng: -0.1400, icon: "utensils" },
          { time: "03:30 PM", category: "Nature", title: "Hyde Park & Kensington Gardens", desc: "Stroll along Serpentine lake and royal palaces.", cost: 0, lat: 51.5050, lng: -0.1870, icon: "sun" }
        ]
      }
    ]
  },
  {
    id: "bangkok",
    name: "Bangkok",
    country: "Thailand",
    tagline: "Golden temples, buzzing floating markets, sizzling street food, and sky-high rooftop bars",
    continent: "Asia",
    vibe: ["Foodie", "Culture", "Nightlife", "Shopping"],
    budgetLevel: "Budget ($ - $$)",
    avgDailyCost: 45,
    bestMonths: "November - February",
    currency: "THB (฿)",
    language: "Thai",
    coordinates: [13.7563, 100.5018],
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
    description: "Marvel at the dazzling Grand Palace, take longtail boats down Chao Phraya, and taste world-renowned street food on Chinatown streets.",
    highlights: ["The Grand Palace & Emerald Buddha", "Wat Arun (Temple of Dawn)", "Chatuchak Weekend Market", "Chao Phraya River Cruise", "Chinatown Yaowarat Food"],
    visaInfo: {
      type: "Visa-Free for 93 nationalities (up to 60 days)",
      passportValidity: "At least 6 months validity",
      adapter: "Type A, B & C (220V, 50Hz)",
      emergency: { police: "191", touristPolice: "1155", ambulance: "1669" }
    },
    cultureEtiquette: {
      tipping: "10-20% tipping is appreciated but not mandatory.",
      customs: ["Wai greeting with slight bow", "Respect the Royal Family", "Cover shoulders and knees at all temples"],
      phrases: [
        { en: "Hello", local: "Sawasdee krup / ka", phonetic: "sah-wah-dee krahp" },
        { en: "Thank you", local: "Khob khun krup / ka", phonetic: "kawp koon krahp" },
        { en: "Delicious", local: "Aroi mak!", phonetic: "ah-roy mahk" }
      ]
    },
    itineraryDays: [
      {
        day: 1,
        title: "Golden Temples & River Express",
        activities: [
          { time: "08:30 AM", category: "Culture", title: "The Grand Palace & Wat Phra Kaew", desc: "Gaze upon the revered Emerald Buddha and gold-leaf murals.", cost: 14, lat: 13.7500, lng: 100.4914, icon: "landmark" },
          { time: "11:30 AM", category: "Culture", title: "Wat Pho Giant Reclining Buddha", desc: "46-meter-long gold leaf Buddha and sacred grounds.", cost: 6, lat: 13.7465, lng: 100.4930, icon: "landmark" },
          { time: "03:30 PM", category: "Culture", title: "Wat Arun Porcelain Spire at Dusk", desc: "Khmer-style stupa covered in colorful Chinese porcelain.", cost: 3, lat: 13.7437, lng: 100.4888, icon: "camera" }
        ]
      },
      {
        day: 2,
        title: "Floating Markets & Chinatown Food Odyssey",
        activities: [
          { time: "07:30 AM", category: "Experience", title: "Floating Market Longtail Boat", desc: "Canal vendors selling tropical fruits and skewers from wooden boats.", cost: 25, lat: 13.5186, lng: 99.9570, icon: "compass" },
          { time: "06:30 PM", category: "Food", title: "Chinatown Yaowarat Street Feast", desc: "Michelin-rated crab omelets and wok-tossed pad thai under neon.", cost: 12, lat: 13.7410, lng: 100.5090, icon: "utensils" }
        ]
      },
      {
        day: 3,
        title: "Chatuchak & Sunset Dinner Cruise",
        activities: [
          { time: "09:30 AM", category: "Shopping", title: "Chatuchak Weekend Market", desc: "Explore 15,000 stalls of handcrafted silks, clothes, and spices.", cost: 10, lat: 13.7999, lng: 100.5502, icon: "shopping-bag" },
          { time: "08:00 PM", category: "Dining", title: "Chao Phraya Luxury Dinner Cruise", desc: "Buffet dinner cruising past illuminated temples and skyline.", cost: 35, lat: 13.7250, lng: 100.5120, icon: "sparkles" }
        ]
      }
    ]
  }
];

const CURRENCIES = {
  USD: { symbol: "$", name: "US Dollar", rate: 1.0 },
  EUR: { symbol: "€", name: "Euro", rate: 0.92 },
  GBP: { symbol: "£", name: "British Pound", rate: 0.79 },
  INR: { symbol: "₹", name: "Indian Rupee", rate: 83.5 },
  JPY: { symbol: "¥", name: "Japanese Yen", rate: 154.0 },
  AUD: { symbol: "A$", name: "Australian Dollar", rate: 1.52 },
  CAD: { symbol: "C$", name: "Canadian Dollar", rate: 1.37 },
  AED: { symbol: "AED", name: "UAE Dirham", rate: 3.67 },
  SGD: { symbol: "S$", name: "Singapore Dollar", rate: 1.35 },
  CHF: { symbol: "CHF", name: "Swiss Franc", rate: 0.90 }
};
