import React, { useState,  useCallback, useMemo } from 'react';
import { Star, MapPin, Heart, LogIn, Search, Menu, X } from 'lucide-react';

// Mock data for destinations
const destinationsData = [
  {
    id: 1,
    name: "Victoria Falls",
    location: "Matabeleland North",
    description: "One of the Seven Natural Wonders of the World, Victoria Falls is the world's largest sheet of falling water.",
    image: "🏞️",
    rating: 4.9,
    reviews: 2847,
    category: "Nature",
    activities: ["Wildlife Safari", "Bungee Jumping", "River Cruise", "Helicopter Tours"]
  },
  {
    id: 2,
    name: "Great Zimbabwe",
    location: "Masvingo",
    description: "Ancient city ruins that were the capital of the Kingdom of Zimbabwe during the Late Iron Age.",
    image: "🏛️",
    rating: 4.7,
    reviews: 1523,
    category: "Historical",
    activities: ["Guided Tours", "Archaeological Site", "Museum Visit"]
  },
  {
    id: 3,
    name: "Hwange National Park",
    location: "Matabeleland North",
    description: "Zimbabwe's largest game reserve with over 100 mammal species and 400 bird species.",
    image: "🦁",
    rating: 4.8,
    reviews: 1876,
    category: "Wildlife",
    activities: ["Game Drives", "Bird Watching", "Photography", "Bush Walks"]
  },
  {
    id: 4,
    name: "Mana Pools",
    location: "Mashonaland Central",
    description: "UNESCO World Heritage Site known for its remote wilderness and incredible wildlife encounters.",
    image: "🐘",
    rating: 4.9,
    reviews: 1234,
    category: "Wildlife",
    activities: ["Canoeing", "Walking Safaris", "Fishing", "Wildlife Viewing"]
  },
  {
    id: 5,
    name: "Lake Kariba",
    location: "Mashonaland West",
    description: "One of the world's largest man-made lakes, perfect for fishing and water sports.",
    image: "⛵",
    rating: 4.6,
    reviews: 987,
    category: "Water",
    activities: ["Houseboat Cruises", "Fishing", "Water Sports", "Sunset Views"]
  },
  {
    id: 6,
    name: "Eastern Highlands",
    location: "Manicaland",
    description: "Mountainous region with stunning scenery, waterfalls, and cool climate.",
    image: "⛰️",
    rating: 4.7,
    reviews: 1456,
    category: "Nature",
    activities: ["Hiking", "Mountain Biking", "Trout Fishing", "Scenic Drives"]
  }
];

// Initialize from localStorage
const getInitialFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem('zimbabweTourismFavorites') || '[]');
  } catch {
    return [];
  }
};

const getInitialReviews = () => {
  try {
    return JSON.parse(localStorage.getItem('zimbabweTourismReviews') || '{}');
  } catch {
    return {};
  }
};

export default function ZimbabweTourism() {
  const [destinations] = useState(destinationsData);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState(getInitialFavorites);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [reviews, setReviews] = useState(getInitialReviews);
  const [authEmail, setAuthEmail] = useState('');
  const [reviewRating, setReviewRating] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const categories = ['All', 'Nature', 'Wildlife', 'Historical', 'Water'];

  // Use useMemo to compute filtered destinations
  const filteredDestinations = useMemo(() => {
    let filtered = destinations;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(d => d.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [destinations, selectedCategory, searchTerm]);

  const handleLogin = () => {
    if (authEmail) {
      const user = { email: authEmail, name: authEmail.split('@')[0] };
      setCurrentUser(user);
      setIsLoggedIn(true);
      setShowAuthModal(false);
      setAuthEmail('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const toggleFavorite = useCallback((destinationId) => {
    if (!isLoggedIn) {
      alert('Please login to save favorites');
      return;
    }

    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.includes(destinationId)
        ? prevFavorites.filter(id => id !== destinationId)
        : [...prevFavorites, destinationId];
      
      localStorage.setItem('zimbabweTourismFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, [isLoggedIn]);

  const submitReview = useCallback(() => {
    if (!isLoggedIn) {
      alert('Please login to add reviews');
      return;
    }

    if (!reviewRating || !reviewComment) {
      alert('Please fill in all fields');
      return;
    }

    if (!currentUser || !selectedDestination) return;

    const newReview = {
      user: currentUser.name,
      rating: parseInt(reviewRating),
      comment: reviewComment,
      date: new Date().toISOString()
    };

    setReviews(prevReviews => {
      const destinationReviews = prevReviews[selectedDestination.id] || [];
      const updatedReviews = {
        ...prevReviews,
        [selectedDestination.id]: [...destinationReviews, newReview]
      };
      
      localStorage.setItem('zimbabweTourismReviews', JSON.stringify(updatedReviews));
      return updatedReviews;
    });

    setReviewRating('');
    setReviewComment('');
  }, [isLoggedIn, reviewRating, reviewComment, currentUser, selectedDestination]);

  const handleContactSubmit = () => {
    if (contactName && contactEmail && contactMessage) {
      alert(`Thank you ${contactName}! We'll contact you at ${contactEmail} soon.`);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-4xl">🇿🇼</span>
              <h1 className="text-2xl font-bold text-green-700">Discover Zimbabwe</h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#destinations" className="text-gray-700 hover:text-green-600 font-medium">Destinations</a>
              <a href="#about" className="text-gray-700 hover:text-green-600 font-medium">About</a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 font-medium">Contact</a>
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">Hello, {currentUser?.name}</span>
                  <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                    Logout
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowAuthModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
                  <LogIn size={18} />
                  <span>Login</span>
                </button>
              )}
            </nav>

            <button onClick={() => setShowMenu(!showMenu)} className="md:hidden">
              {showMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {showMenu && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4">
              <nav className="flex flex-col space-y-3">
                <a href="#destinations" className="text-gray-700 hover:text-green-600">Destinations</a>
                <a href="#about" className="text-gray-700 hover:text-green-600">About</a>
                <a href="#contact" className="text-gray-700 hover:text-green-600">Contact</a>
                {isLoggedIn ? (
                  <>
                    <span className="text-sm text-gray-600">Hello, {currentUser?.name}</span>
                    <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-left">
                      Logout
                    </button>
                  </>
                ) : (
                  <button onClick={() => setShowAuthModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-left">
                    Login
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4">Welcome to Zimbabwe</h2>
          <p className="text-xl mb-8 opacity-90">Explore the heart of Africa's natural wonders and rich heritage</p>
          <div className="flex justify-center space-x-4">
            <a href="#destinations" className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Explore Now
            </a>
            <a href="#contact" className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition">
              Plan Your Trip
            </a>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section id="destinations" className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDestinations.map(destination => (
            <div key={destination.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1">
              <div className="h-48 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-8xl">
                {destination.image}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{destination.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm mt-1">
                      <MapPin size={14} className="mr-1" />
                      {destination.location}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFavorite(destination.id)}
                    className="text-red-500 hover:scale-110 transition"
                  >
                    <Heart
                      size={24}
                      fill={favorites.includes(destination.id) ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>

                <p className="text-gray-600 text-sm mb-4">{destination.description}</p>

                <div className="flex items-center mb-4">
                  <div className="flex items-center text-yellow-500">
                    <Star size={18} fill="currentColor" />
                    <span className="ml-1 font-semibold">{destination.rating}</span>
                  </div>
                  <span className="text-gray-500 text-sm ml-2">({destination.reviews} reviews)</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {destination.activities.slice(0, 2).map((activity, idx) => (
                    <span key={idx} className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                      {activity}
                    </span>
                  ))}
                  {destination.activities.length > 2 && (
                    <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                      +{destination.activities.length - 2} more
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedDestination(destination)}
                  className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">No destinations found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Why Visit Zimbabwe?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold mb-2">Natural Wonders</h3>
              <p className="text-gray-600">From Victoria Falls to pristine national parks, experience nature at its finest</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🏛️</div>
              <h3 className="text-xl font-semibold mb-2">Rich Heritage</h3>
              <p className="text-gray-600">Explore ancient civilizations and UNESCO World Heritage Sites</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🦁</div>
              <h3 className="text-xl font-semibold mb-2">Wildlife Safari</h3>
              <p className="text-gray-600">Encounter Africa's Big Five and hundreds of unique species</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gradient-to-r from-green-600 to-blue-600 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Plan Your Zimbabwe Adventure</h2>
          <p className="text-xl mb-8 opacity-90">Get in touch with us to start your journey</p>
          <div className="bg-white rounded-xl p-8 text-left">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-900 bg-white"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-900 bg-white"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none h-32 text-gray-900 bg-white"
                  placeholder="Tell us about your travel plans..."
                />
              </div>
              <button onClick={handleContactSubmit} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold">
                Send Inquiry
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="mb-2">&copy; 2024 Discover Zimbabwe. All rights reserved.</p>
          <p className="text-gray-400 text-sm">Built by Pretty Tondhlana - Software Developer</p>
        </div>
      </footer>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Login</h3>
              <button onClick={() => setShowAuthModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 bg-white focus:outline-none"
                placeholder="your@email.com"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 bg-white focus:outline-none"
                placeholder="••••••••"
              />
            </div>
            <button onClick={handleLogin} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold">
              Login
            </button>
            <p className="text-center text-gray-600 text-sm mt-4">
              This is a demo. Any email will work!
            </p>
          </div>
        </div>
      )}

      {/* Destination Detail Modal */}
      {selectedDestination && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full my-8">
            <div className="relative h-64 bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-9xl rounded-t-xl">
              {selectedDestination.image}
              <button
                onClick={() => setSelectedDestination(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 max-h-[600px] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedDestination.name}</h2>
                  <div className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-1" />
                    {selectedDestination.location}
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorite(selectedDestination.id)}
                  className="text-red-500 hover:scale-110 transition"
                >
                  <Heart
                    size={32}
                    fill={favorites.includes(selectedDestination.id) ? 'currentColor' : 'none'}
                  />
                </button>
              </div>

              <div className="flex items-center mb-6">
                <div className="flex items-center text-yellow-500 text-xl">
                  <Star size={24} fill="currentColor" />
                  <span className="ml-2 font-semibold">{selectedDestination.rating}</span>
                </div>
                <span className="text-gray-500 ml-2">({selectedDestination.reviews} reviews)</span>
              </div>

              <p className="text-gray-700 mb-6 text-lg leading-relaxed">{selectedDestination.description}</p>

              <h3 className="text-xl font-bold mb-3">Activities</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedDestination.activities.map((activity, idx) => (
                  <span key={idx} className="bg-green-100 text-green-700 px-4 py-2 rounded-full">
                    {activity}
                  </span>
                ))}
              </div>

              <h3 className="text-xl font-bold mb-3">Reviews</h3>
              <div className="space-y-4 mb-6">
                {(reviews[selectedDestination.id] || []).map((review, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill={i < review.rating ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                      <span className="ml-2 font-semibold text-sm">{review.user}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                  </div>
                ))}
                {(!reviews[selectedDestination.id] || reviews[selectedDestination.id].length === 0) && (
                  <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
                )}
              </div>

              {isLoggedIn && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Add Your Review</h4>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg mb-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select rating</option>
                    <option value="5">5 Stars - Excellent</option>
                    <option value="4">4 Stars - Very Good</option>
                    <option value="3">3 Stars - Good</option>
                    <option value="2">2 Stars - Fair</option>
                    <option value="1">1 Star - Poor</option>
                  </select>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg mb-3 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                    placeholder="Share your experience..."
                  />
                  <button onClick={submitReview} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                    Submit Review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}