import React, { useState, useEffect } from "react";

const DistanceCalculator = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  const fetchCurrentLocation = async () => {
    const apiKey = import.meta.env.VITE_GEOLOCATION_API_KEY; // Use your ipgeolocation.io API key
    try {
      const response = await fetch(
        `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`
      );
      const data = await response.json();
      return {
        lat: parseFloat(data.latitude),
        lon: parseFloat(data.longitude),
      };
    } catch (error) {
      console.error("Error fetching current location:", error);
      return null;
    }
  };

  const fetchDistanceFromAPI = async (originLat, originLon, destLat, destLon) => {
    const apiKey = import.meta.env.VITE_DISTANCE_MATRIX_API_KEY; // Use your DistanceMatrix.ai API key
    try {
      const response = await fetch(
        `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${originLat},${originLon}&destinations=${destLat},${destLon}&key=${apiKey}`
      );
      const data = await response.json();

      if (
        data.status === "OK" &&
        data.rows[0]?.elements[0]?.status === "OK"
      ) {
        return data.rows[0].elements[0].distance.text;
      } else {
        throw new Error("Error calculating distance.");
      }
    } catch (error) {
      console.error("Error fetching distance:", error);
      return null;
    }
  };

  useEffect(() => {
    const calculateDistance = async () => {
      const destination = { lat: -6.2022579, lon: 106.6980221 };

      const location = await fetchCurrentLocation();
      if (location) {
        setCurrentLocation(location);

        const dist = await fetchDistanceFromAPI(
          location.lat,
          location.lon,
          destination.lat,
          destination.lon
        );
        if (dist) setDistance(dist);
      }
    };

    calculateDistance();
  }, []);

  return (
    <div>
      <h1>Distance Calculator</h1>
      {currentLocation ? (
        <>
          <p>
            Your current location: Latitude {currentLocation.lat}, Longitude{" "}
            {currentLocation.lon}
          </p>
          <p>
            Distance to Maung Laundry:{" "}
            {distance ? `${distance}` : "Calculating..."}
          </p>
        </>
      ) : (
        <p>Loading your location...</p>
      )}
    </div>
  );
};

export default DistanceCalculator;
