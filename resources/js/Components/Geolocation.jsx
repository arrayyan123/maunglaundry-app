import React, { useState, useEffect } from "react";

const DistanceCalculator = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const earthRadius = 6371; 
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c; 
  };

  useEffect(() => {
    const fetchLocation = async () => {
    const apiKey = import.meta.env.VITE_GEOLOCATION_API_KEY;
    console.log(apiKey);
      try {
        const response = await fetch(
          `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`
        );
        const data = await response.json();
        setCurrentLocation({ lat: parseFloat(data.latitude), lon: parseFloat(data.longitude) });
      } catch (error) {
        console.error("Error fetching location:", error);
      }
    };

    fetchLocation();
  }, []);

  const destination = { lat: -6.2022524, lon: 106.6980232 };

  useEffect(() => {
    if (currentLocation) {
    
      const dist = calculateDistance(
        currentLocation.lat,
        currentLocation.lon,
        destination.lat,
        destination.lon
      );
      setDistance(dist.toFixed(7));
    }
  }, [currentLocation]);

  return (
    <div>
      <h1>Distance Calculator</h1>
      {currentLocation ? (
        <>
          <p>Your current location: Latitude {currentLocation.lat}, Longitude {currentLocation.lon}</p>
          <p>
            Distance to Maung Laundry: {distance ? `${distance} km` : "Calculating..."}
          </p>
        </>
      ) : (
        <p>Loading your location...</p>
      )}
    </div>
  );
};

export default DistanceCalculator;