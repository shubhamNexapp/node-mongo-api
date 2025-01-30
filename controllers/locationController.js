const Location = require("../models/locationSchema");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

async function getCoordinatesForAddresses(addresses) {
  const apiKey = "FANgz5SPPeXsGdtDz2c3X1k4NzGejJLAK3CcTubL";
  const url = "https://api.olamaps.io/places/v1/geocode";

  const requests = addresses.map(async (address) => {
    try {
      const response = await axios.get(url, {
        params: {
          address: address,
          api_key: apiKey,
        },
        headers: {
          "X-Request-Id": uuidv4(),
        },
      });

      if (response.data && response.data.geocodingResults) {
        const locationData =
          response.data.geocodingResults[0].geometry.location;
        return {
          address,
          latitude: locationData.lat,
          longitude: locationData.lng,
        };
      }
    } catch (error) {
      console.error(`Failed to fetch coordinates for ${address}:`, error);
      return null;
    }
  });

  // Wait for all requests to complete
  const results = await Promise.all(requests);
  return results;
}

const addLocation = async (req, res) => {
  const { firstName, lastName, email, password, city, role, results } =
    req.body;

  try {
    // Fetch latitude and longitude for each city
    const coordinatesData = await getCoordinatesForAddresses(city);

    // Filter out any null values if the API failed to fetch coordinates for some cities
    const validCoordinates = coordinatesData
      .filter((data) => data !== null)
      .map((data) => ({
        type: "Point",
        coordinates: [data.longitude, data.latitude], // [longitude, latitude]
      }));

    // Create a new location document
    const newLocation = new Location({
      firstName,
      lastName,
      email,
      password,
      location: validCoordinates, // Store the valid coordinates in the location field
      role,
      results,
    });

    // Save the new location to the database
    await newLocation.save();

    // Respond with a success message
    res
      .status(201)
      .json({ message: "Location added successfully!", newLocation });
  } catch (error) {
    console.error("Error adding location:", error);
    res.status(500).json({ message: "Failed to add location", error });
  }
};

module.exports = {
  addLocation,
};
