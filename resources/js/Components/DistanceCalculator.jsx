import React, { useState, useEffect } from "react";
import axios from "axios";
import SlotCounter from 'react-slot-counter';

const DistanceCalculator = ({ customerAddress }) => {
    const [distance, setDistance] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (customerAddress) {
            calculateDistance(customerAddress);
        }
    }, [customerAddress]);

    const calculateDistance = async (address) => {
        setError(null);
        setDistance(null);

        try {
            const response = await axios.post("/api/calculate-distance", {
                address: address,
            });
            setDistance(response.data.distance);
        } catch (err) {
            setError("Tidak dapat mengkalkulasi jarak.");
        }
    };
    const getDistanceClass = () => {
        if (distance === null) return "text-gray-600";
        return distance > 2 ? "text-red-600" : "text-green-600";
    };

    return (
        <div className="mt-4">
            <h2 className="font-semibold">Jarak menuju Maung Laundry</h2>
            {distance !== null && (
                <div className={`mt-2 ${getDistanceClass()}`}>
                    Jarak: <SlotCounter value={distance.toFixed(2)}/> km
                </div>
            )}
            {error && <div className="mt-2 text-red-600">{error}</div>}
        </div>
    );
};

export default DistanceCalculator;
