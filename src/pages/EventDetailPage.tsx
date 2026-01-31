import { useParams, Link } from 'react-router-dom'
import { MOCK_EVENTS } from '@/data/mock'
import './EventDetailPage.css'

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const event = MOCK_EVENTS.find((e) => e.id === id)

  if (!event) {
    return (
      <div className="event-detail-page">
        <p>Event not found.</p>
        <Link to="/events">Back to events</Link>
      </div>
    )
  }

  const dateStr = new Date(event.event_date).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="event-detail-page">
      <Link to="/events" className="event-detail-back">← Back to events</Link>

      <div className="event-detail-image">
        {event.image_url ? (
          <img src={event.image_url} alt="" />
        ) : (
          <span className="event-detail-placeholder">📅</span>
        )}
      </div>

      <div className="event-detail-body">
        <h1 className="event-detail-name">{event.name}</h1>
        {event.location && <p className="event-detail-location">{event.location}</p>}
        <p className="event-detail-date">{dateStr}{event.event_time && ` at ${event.event_time}`}</p>
        {event.price && <p className="event-detail-price">{event.price}</p>}
        <p className="event-detail-attendees">{event.attendee_count} attending</p>

        {event.description && (
          <div className="event-detail-description">
            <h2>About</h2>
            <p>{event.description}</p>
          </div>
        )}

        <p className="event-detail-venue">
          <Link to="/">Venue profile</Link> (placeholder)
        </p>
      </div>
    </div>
  )
}
