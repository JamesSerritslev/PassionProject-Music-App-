import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MOCK_EVENTS } from '@/data/mock'
import type { EventRow } from '@/lib/supabase'
import './CreateEventPage.css'

// In MVP we append to mock list; later use Supabase
let mockEvents = [...MOCK_EVENTS]

export default function CreateEventPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    event_date: '',
    event_time: '',
    price: '',
  })
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const newEvent: EventRow = {
      id: `e${Date.now()}`,
      created_by: 'current-user',
      name: form.name.trim(),
      description: form.description.trim() || null,
      location: form.location.trim() || null,
      event_date: form.event_date,
      event_time: form.event_time.trim() || null,
      price: form.price.trim() || null,
      image_url: null,
      attendee_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    mockEvents = [...mockEvents, newEvent]
    setLoading(false)
    navigate('/events', { replace: true })
  }

  return (
    <div className="create-event-page">
      <div className="create-event-card">
        <h1>Create new event</h1>
        <p className="create-event-sub">Add an upcoming show or event.</p>

        <form onSubmit={handleSubmit} className="create-event-form">
          <label className="ce-label">
            Event name *
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Open Mic Night"
              required
              className="ce-input"
            />
          </label>
          <label className="ce-label">
            Location *
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="Venue name, address"
              required
              className="ce-input"
            />
          </label>
          <label className="ce-label">
            Date *
            <input
              type="date"
              value={form.event_date}
              onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))}
              required
              className="ce-input"
            />
          </label>
          <label className="ce-label">
            Time
            <input
              type="time"
              value={form.event_time}
              onChange={(e) => setForm((f) => ({ ...f, event_time: e.target.value }))}
              className="ce-input"
            />
          </label>
          <label className="ce-label">
            Price
            <input
              type="text"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              placeholder="e.g. Free or $15"
              className="ce-input"
            />
          </label>
          <label className="ce-label">
            Description
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="More info about the event"
              rows={4}
              className="ce-input ce-textarea"
            />
          </label>
          <button type="submit" disabled={loading} className="ce-submit">
            {loading ? 'Creating…' : 'Create event'}
          </button>
          <button type="button" className="ce-cancel" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}
