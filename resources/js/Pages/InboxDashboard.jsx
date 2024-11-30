import InboxMessage from '@/Components/AdminDashboard/Inbox/InboxMessage';
import AuthenticatedLayoutInbox from '@/Layouts/AuthenticatedLayoutInbox';
import { Head } from '@inertiajs/react';
import react, { useState, useEffect } from 'react';


export default function InboxDashboard({ auth, customers }) {
    return (
        <AuthenticatedLayoutInbox
            user={auth.user}
            header={
                <div>
                    <h2 className="text-xl font-semibold leading-tight text-white">
                        Inbox Dashboard
                    </h2>
                </div>
            }
        >
            <Head title="Inbox" />
            {/* inboxmessagecomponent nya */}
            <InboxMessage />
        </AuthenticatedLayoutInbox>
    );
}
