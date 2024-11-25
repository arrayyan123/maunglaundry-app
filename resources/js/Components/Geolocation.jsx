import React, { useEffect, useState } from "react";

const DistanceCalculator = ({ param }) => {
  const [distance, setDistance] = useState(null);

  const extractLocation = (address) => {
    // Extract the last part of the address and replace spaces with "+"
    const location = address.split(", ").pop();
    return location.replace(/\s+/g, "+");
  };

  useEffect(() => {
    const calculateDistance = async () => {
      try {
        // Origin coordinates are hardcoded
        const originCoords = { lat: -6.2022524, lon: 106.6954483 };

        // Check if the address parameter is valid
        if (!param?.address) {
          throw new Error("Destination address is missing.");
        }

        // Extract and format destination address
        const formattedAddress = extractLocation(param.address);

        // Function to fetch coordinates from Nominatim
        const getCoordinates = async (formattedAddress) => {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${formattedAddress}&format=geojson`
          );

          const data = await response.json();

          if (!data.features || data.features.length === 0) {
            throw new Error(`Location "${formattedAddress}" not found.`);
          }

          const coordinates = data.features[0].geometry.coordinates; // GeoJSON format: [lon, lat]
          return { lat: coordinates[1], lon: coordinates[0] };
        };

        // Fetch destination coordinates
        const destinationCoords = await getCoordinates(formattedAddress);

        // Call the Google Distance Matrix API
        const distanceMatrixResponse = await fetch(
          `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originCoords.lat},${originCoords.lon}&destinations=${destinationCoords.lat},${destinationCoords.lon}&key=YOUR_GOOGLE_API_KEY`
        );

        const distanceMatrixData = await distanceMatrixResponse.json();

        // Validate Distance Matrix API response
        if (distanceMatrixData.status !== "OK") {
          throw new Error("Failed to calculate distance.");
        }

        const roadDistance =
          distanceMatrixData.rows[0].elements[0].distance.text;

        setDistance(roadDistance);
      } catch (error) {
        console.error("Error:", error.message);
        setDistance("Error calculating distance.");
      }
    };

    calculateDistance();
  }, [param]);

  return (
    <div>
      <h1>Distance Calculator</h1>
      {distance ? <p>Distance: {distance}</p> : <p>Calculating distance...</p>}
    </div>
  );
};

export default DistanceCalculator;