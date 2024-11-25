import React, { useState, useEffect } from "react";

const DistanceCalculator = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState(null);
  const GOOGLE_API_KEY =import.meta.env.VITE_GOOGLE_API_KEY;
  const destination = { lat: -6.2022524, lng: 106.6954483 };

  useEffect(() => {
    const getLocation = async () => {
        const response = await fetch(
          `https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_API_KEY}`,
          { method: "POST", body: JSON.stringify({ considerIp: true }) }
        );
        const data = await response.json();
        console.log(data);
      };
      getLocation();      
  }, []);

  useEffect(() => {
    if (currentLocation) {
      const fetchDistance = async () => {
        try {
          const origin = `${currentLocation.lat},${currentLocation.lng}`;
          const destinationCoords = `${destination.lat},${destination.lng}`;
          const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destinationCoords}&key=${GOOGLE_API_KEY}`;

          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }

          const data = await response.json();
          const distanceText =
            data.rows[0].elements[0].distance.text; // e.g., "25.4 km"
          setDistance(distanceText);
        } catch (err) {
          setError("Error fetching distance: " + err.message);
        }
      };

      fetchDistance();
    }
  }, [currentLocation]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Road Distance Calculator</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!currentLocation && !error && <p>Fetching your location...</p>}
      {currentLocation && (
        <div>
          <p>
            <strong>Your Location:</strong>{" "}
            {`Lat: ${currentLocation.lat}, Lng: ${currentLocation.lng}`}
          </p>
          {distance ? (
            <p>
              <strong>Distance to Destination:</strong> {distance}
            </p>
          ) : (
            <p>Calculating distance...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DistanceCalculator;