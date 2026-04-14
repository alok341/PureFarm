const fetch = require("node-fetch");

// Convert address to coordinates using OpenStreetMap Nominatim
const geocodeAddress = async (address) => {
  try {
    const { street, city, state, zipCode } = address;
    
    // Build full address string - make it more specific for better results
    const addressParts = [];
    if (street && street !== "GPS Location") addressParts.push(street);
    if (city) addressParts.push(city);
    if (state) addressParts.push(state);
    if (zipCode) addressParts.push(zipCode);
    
    // Add India to make it more specific
    if (addressParts.length > 0) {
      addressParts.push("India");
    }
    
    const addressString = addressParts.join(", ");
    
    if (!addressString || addressParts.length < 2) {
      console.log("Insufficient address for geocoding:", addressString);
      return { lat: 0, lng: 0 };
    }
    
    console.log("Geocoding address:", addressString);
    
    // Add delay to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressString)}&limit=1`
    );
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      console.log(`✅ Geocoded: ${addressString} → (${lat}, ${lng})`);
      return { lat, lng };
    }
    
    console.log(`❌ No coordinates found for address: ${addressString}`);
    return { lat: 0, lng: 0 };
  } catch (error) {
    console.error("Geocoding error:", error);
    return { lat: 0, lng: 0 };
  }
};

module.exports = { geocodeAddress };