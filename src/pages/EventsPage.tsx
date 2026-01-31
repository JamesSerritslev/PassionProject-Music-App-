import { Link } from 'react-router-dom'
import { MOCK_EVENTS } from '@/data/mock'
import './EventsPage.css'

export default function EventsPage() {
  const events = MOCK_EVENTS

  return (
    <div className="events-page">
      <header className="events-header">
        <h1>Upcoming events</h1>
        <p className="events-sub">Discover shows from venues and bands</p>
      </header>

      <section className="events-list">
        {events.length === 0 ? (
          <p className="events-empty">No upcoming events. Check back later.</p>
        ) : (
          <ul className="events-card-list">
            {events.map((ev) => (
              <li key={ev.id}>
                <Link to={`/events/${ev.id}`} className="events-card-link">
                  <article className="events-card">
                    <div className="events-card-image">
                      {ev.image_url ? (
                        <img src={ev.image_url} alt="" />
                      ) : (
                        <span className="events-card-placeholder">📅</span>
                      )}
                    </div>
                    <div className="events-card-body">
                      <h2 className="events-card-name">{ev.name}</h2>
                      {ev.location && <p className="events-card-location">{ev.location}</p>}
                      <p className="events-card-date">
                        {new Date(ev.event_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                        {ev.event_time && ` · ${ev.event_time}`}
                      </p>
                      {ev.price && <p className="events-card-price">{ev.price}</p>}
                      <p className="events-card-attendees">{ev.attendee_count} attending</p>
                      <span className="events-card-more">More info →</span>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
