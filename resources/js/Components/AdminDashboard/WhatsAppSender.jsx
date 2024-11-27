import { useState } from 'react';
import axios from 'axios';

function WhatsAppSender() {
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/send-whatsapp', { phone, message });
            setStatus(response.data.status);
        } catch (error) {
            setStatus(error.response?.data?.error || 'Failed to send message');
        }
    };    

    return (
        <div>
            <h2>Send WhatsApp Message</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                />
                <button type="submit">Send</button>
            </form>
            {status && <p>{status}</p>}
        </div>
    );
}

export default WhatsAppSender;
