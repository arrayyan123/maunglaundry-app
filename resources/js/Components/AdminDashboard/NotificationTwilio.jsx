import React from 'react'
import { Fade } from 'react-awesome-reveal'

function NotificationTwilio({ handleToggleNotificationTwilio }) {
    return (
        <div>
            <Fade>
                <div className="bg-gray-100 p-6 mb-5 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl text-center font-semibold">Informasi </h3>
                        <button
                            className="text-red-500 hover:text-red-600 font-bold"
                            onClick={handleToggleNotificationTwilio}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Fade>
        </div>
    )
}

export default NotificationTwilio