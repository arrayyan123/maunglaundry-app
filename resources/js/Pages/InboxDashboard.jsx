import InboxMessage from '@/Components/AdminDashboard/Inbox/InboxMessage';
import AuthenticatedLayoutInbox from '@/Layouts/AuthenticatedLayoutInbox';
import { Head, Link } from '@inertiajs/react';
import react, { useState, useEffect } from 'react';
import { Breadcrumbs } from "@material-tailwind/react";

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
            <Breadcrumbs>
                <Link href={route('dashboard')} className="opacity-60">
                    Dashboard
                </Link>
                <Link href={route('diagram.page')} className="opacity-60">
                    Inbox
                </Link>
            </Breadcrumbs>
            <InboxMessage />
        </AuthenticatedLayoutInbox>
    );
}
