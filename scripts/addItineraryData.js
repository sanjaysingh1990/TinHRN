const fs = require('fs');

// Read the JSON file
const rawData = fs.readFileSync('/Users/sanjaysinghbisht/Desktop/workspace/cli-gemini/TiNHRn/TOURS_WITH_REVIEWS.json', 'utf8');
const data = JSON.parse(rawData);

// Sample activities for itinerary
const activities = [
    "Arrival at airport, transfer to hotel, briefing and equipment check",
    "Drive to trailhead, begin trekking through scenic valleys",
    "Trek through rhododendron forests with views of snow-capped peaks",
    "Cross suspension bridges, visit local villages and monasteries",
    "Ascend to higher altitude, acclimatization day with short hikes",
    "Continue trekking with panoramic mountain views",
    "Visit traditional settlements, experience local culture",
    "Trek to high-altitude camp with stunning sunrise views",
    "Cross high mountain passes with breathtaking vistas",
    "Descend through diverse landscapes to lower altitude",
    "Explore local markets and cultural sites",
    "Rest day for recovery and sightseeing in the valley",
    "Final trekking day, return to starting point",
    "Drive back to city, farewell dinner with team",
    "Departure transfer to airport for onward journey"
];

// Sample locations for itinerary
const locations = [
    "Kathmandu", "Pokhara", "Namche Bazaar", "Tengboche", "Dingboche",
    "Lobuche", "Gorakshep", "Everest Base Camp", "Annapurna Base Camp",
    "Manang", "Jomsom", "Muktinath", "Mustang", "Langtang Valley", "Helambu"
];

// Sample accommodations for itinerary
const accommodations = [
    "Luxury hotel in city", "Local guesthouse", "Teahouse lodge",
    "Mountain campsite", "Heritage resort", "Boutique hotel",
    "Traditional homestay", "Eco-lodge", "Tented camp", "Riverside resort"
];

// Sample meals for itinerary
const meals = [
    "Continental breakfast", "Packed lunch", "Local cuisine dinner",
    "Breakfast at hotel", "Lunch at local restaurant", "Dinner with cultural show",
    "Picnic lunch", "Buffet dinner", "Light breakfast", "Box lunch",
    "Traditional dinner", "Vegetarian options", "High-energy snacks"
];

// Function to generate random itinerary based on number of days
function generateItinerary(days) {
    const itinerary = [];

    for (let day = 1; day <= days; day++) {
        // Select random elements
        const activity = activities[Math.floor(Math.random() * activities.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const accommodation = accommodations[Math.floor(Math.random() * accommodations.length)];
        const meal = meals[Math.floor(Math.random() * meals.length)];

        // Create itinerary entry
        itinerary.push({
            day: day,
            location: location,
            activity: activity,
            accommodation: accommodation,
            meals: meal,
            altitude: `${Math.floor(Math.random() * 4000) + 1000}m`, // Random altitude between 1000m-5000m
            distance: `${Math.floor(Math.random() * 15) + 3} km`, // Random distance between 3-18km
            duration: `${Math.floor(Math.random() * 6) + 4} hours` // Random duration between 4-10 hours
        });
    }

    return itinerary;
}

// Process each tour
Object.keys(data.tours).forEach(tourKey => {
    const tour = data.tours[tourKey];

    // Extract number of days from duration string (e.g., "14 Days" -> 14)
    const daysMatch = tour.duration.match(/(\d+)\s*Days?/i);
    if (daysMatch) {
        const days = parseInt(daysMatch[1]);

        // Generate and add itinerary
        tour.itinerary = generateItinerary(days);
    } else {
        // Default to 10 days if can't parse
        tour.itinerary = generateItinerary(10);
    }
});

// Write updated data back to file
fs.writeFileSync('/Users/sanjaysinghbisht/Desktop/workspace/cli-gemini/TiNHRn/TOURS_WITH_REVIEWS.json', JSON.stringify(data, null, 4));

console.log('Itinerary data added to all tours successfully!');