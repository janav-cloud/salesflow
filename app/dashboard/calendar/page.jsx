"use client";

import { useState } from "react";

export default function GmailIntegrationPage() {
  const [authUrl, setAuthUrl] = useState("/api/auth/gmail"); // Backend should handle OAuth
  const [emails, setEmails] = useState([]);
  const [events, setEvents] = useState([]);
  const [connected, setConnected] = useState(false);

  // Step 1: Connect Gmail (OAuth)
  async function handleConnect() {
    window.location.href = authUrl;
  }

  // Step 2: Fetch emails and events from backend after OAuth
  async function fetchEmailsAndEvents() {
    const emailRes = await fetch("/api/gmail/emails");
    setEmails(await emailRes.json());
    const eventRes = await fetch("/api/gmail/events");
    setEvents(await eventRes.json());
    setConnected(true);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-700">Gmail Email & Calendar Integration</h1>
      <div className="mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleConnect}
        >
          Connect Gmail
        </button>
        <button
          className="ml-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={fetchEmailsAndEvents}
        >
          Fetch Emails & Calendar Events
        </button>
      </div>
      {connected && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-semibold mb-2">Recent Emails</h2>
            <ul className="divide-y">
              {emails.length === 0 && <li className="text-gray-500 text-sm">No emails loaded.</li>}
              {emails.map(email => (
                <li key={email.id} className="py-2">
                  <div className="font-bold">{email.subject}</div>
                  <div className="text-sm text-gray-600">From: {email.from}</div>
                  <div className="text-xs text-gray-400">{email.date}</div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Upcoming Calendar Events</h2>
            <ul className="divide-y">
              {events.length === 0 && <li className="text-gray-500 text-sm">No events loaded.</li>}
              {events.map(event => (
                <li key={event.id} className="py-2">
                  <div className="font-bold">{event.title}</div>
                  <div className="text-sm text-gray-600">{event.start} - {event.end}</div>
                  <div className="text-xs text-gray-400">{event.location}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}