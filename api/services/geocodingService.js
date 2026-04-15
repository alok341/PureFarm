const fetch = require("node-fetch");

// Default coordinates for major cities in Maharashtra and India
const cityCoordinates = {
  // Mumbai & Suburbs
  "mumbai": { lat: 19.0760, lng: 72.8777 },
  "bandra": { lat: 19.0596, lng: 72.8400 },
  "andheri": { lat: 19.1196, lng: 72.8466 },
  "juhu": { lat: 19.1000, lng: 72.8250 },
  "dadar": { lat: 19.0170, lng: 72.8420 },
  "powai": { lat: 19.1160, lng: 72.9050 },
  "borivali": { lat: 19.2300, lng: 72.8600 },
  "thane": { lat: 19.2183, lng: 72.9780 },
  "ghatkopar": { lat: 19.0860, lng: 72.9080 },
  "malad": { lat: 19.1860, lng: 72.8480 },
  "kandivali": { lat: 19.2010, lng: 72.8690 },
  "goregaon": { lat: 19.1620, lng: 72.8510 },
  "vile parle": { lat: 19.0980, lng: 72.8400 },
  "santacruz": { lat: 19.0880, lng: 72.8350 },
  "khar": { lat: 19.0700, lng: 72.8330 },
  
  // Thane District
  "dombivli": { lat: 19.2183, lng: 73.0867 },
  "kalyan": { lat: 19.2350, lng: 73.1300 },
  "ulhasnagar": { lat: 19.2167, lng: 73.1500 },
  "ambarnath": { lat: 19.2000, lng: 73.1833 },
  "badlapur": { lat: 19.1550, lng: 73.2650 },
  "titwala": { lat: 19.2833, lng: 73.2667 },
  "shahad": { lat: 19.1950, lng: 73.1250 },
  "vithalwadi": { lat: 19.2000, lng: 73.1333 },
  "mohone": { lat: 19.2667, lng: 73.1500 },
  
  // Pune District
  "pune": { lat: 18.5204, lng: 73.8567 },
  "hinjewadi": { lat: 18.5914, lng: 73.7388 },
  "kothrud": { lat: 18.5076, lng: 73.8149 },
  "pimpri": { lat: 18.6278, lng: 73.8076 },
  "chinchwad": { lat: 18.6278, lng: 73.7917 },
  
  // Other Major Cities
  "nagpur": { lat: 21.1458, lng: 79.0882 },
  "nasik": { lat: 19.9975, lng: 73.7898 },
  "aurangabad": { lat: 19.8762, lng: 75.3433 },
  "solapur": { lat: 17.6599, lng: 75.9064 },
  "kolhapur": { lat: 16.7050, lng: 74.2433 },
  "satara": { lat: 17.6800, lng: 74.0200 },
  "sangli": { lat: 16.8600, lng: 74.5700 },
  "jalgaon": { lat: 21.0077, lng: 75.5626 },
  "amravati": { lat: 20.9374, lng: 77.7796 },
  "nanded": { lat: 19.1383, lng: 77.3210 },
  "latur": { lat: 18.4048, lng: 76.5667 },
  "ahmednagar": { lat: 19.0952, lng: 74.7499 },
  "dhule": { lat: 20.9042, lng: 74.7749 },
  "chandrapur": { lat: 19.9596, lng: 79.2956 },
  "raigad": { lat: 18.2539, lng: 73.1341 },
  "ratnagiri": { lat: 16.9833, lng: 73.3000 },
  "sindhudurg": { lat: 16.1667, lng: 73.7000 },
  
  // Navi Mumbai
  "navi mumbai": { lat: 19.0330, lng: 73.0290 },
  "vashi": { lat: 19.0771, lng: 73.0000 },
  "kharghar": { lat: 19.0400, lng: 73.0700 },
  "nerul": { lat: 19.0300, lng: 73.0200 },
  "belapur": { lat: 19.0150, lng: 73.0300 },
  "panvel": { lat: 18.9898, lng: 73.1152 },
  "airoli": { lat: 19.1600, lng: 72.9997 },
  
  // Delhi NCR
  "delhi": { lat: 28.6139, lng: 77.2090 },
  "noida": { lat: 28.5355, lng: 77.3910 },
  "gurgaon": { lat: 28.4595, lng: 77.0266 },
  
  // Bangalore
  "bangalore": { lat: 12.9716, lng: 77.5946 },
  
  // Chennai
  "chennai": { lat: 13.0827, lng: 80.2707 },
  
  // Kolkata
  "kolkata": { lat: 22.5726, lng: 88.3639 },
  
  // Hyderabad
  "hyderabad": { lat: 17.3850, lng: 78.4867 },
  
  // Ahmedabad
  "ahmedabad": { lat: 23.0225, lng: 72.5714 }
};

// Convert address to coordinates using OpenStreetMap Nominatim
const geocodeAddress = async (address) => {
  try {
    const { street, city, state, zipCode } = address;
    
    // Build full address string
    const addressParts = [];
    if (street && street !== "GPS Location") addressParts.push(street);
    if (city) addressParts.push(city);
    if (state) addressParts.push(state);
    if (zipCode) addressParts.push(zipCode);
    
    // Add India to make it more specific
    if (addressParts.length > 0 && !addressParts.includes("India")) {
      addressParts.push("India");
    }
    
    const addressString = addressParts.join(", ");
    
    if (!addressString || addressParts.length < 2) {
      console.log("Insufficient address for geocoding:", addressString);
      // Try to get coordinates from city name
      const cityLower = (city || "").toLowerCase();
      if (cityCoordinates[cityLower]) {
        console.log(`📍 Using default coordinates for ${city}`);
        return cityCoordinates[cityLower];
      }
      // Default to Dombivli
      return { lat: 19.2183, lng: 73.0867 };
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
    
    // If geocoding fails, return default coordinates based on city
    console.log(`❌ No coordinates found, using default for city: ${city}`);
    const cityLower = (city || "").toLowerCase();
    if (cityCoordinates[cityLower]) {
      console.log(`📍 Using default coordinates for ${city}`);
      return cityCoordinates[cityLower];
    }
    
    // Last resort - return Dombivli coordinates
    return { lat: 19.2183, lng: 73.0867 };
  } catch (error) {
    console.error("Geocoding error:", error);
    // Return default coordinates for the city if available
    const cityLower = (address?.city || "").toLowerCase();
    if (cityCoordinates[cityLower]) {
      return cityCoordinates[cityLower];
    }
    return { lat: 19.2183, lng: 73.0867 };
  }
};

module.exports = { geocodeAddress, cityCoordinates };