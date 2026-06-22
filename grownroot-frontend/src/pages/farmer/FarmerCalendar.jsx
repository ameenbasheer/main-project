import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FiChevronLeft, FiChevronRight, FiCalendar, FiArrowLeft } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { PIE_PALETTE } from '../../components/common/PieChart3D';

function isoToLocalDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function FarmerCalendar() {
  const { crops } = useApp();
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(today);

  const events = useMemo(() => {
    const list = [];
    crops.forEach((c, idx) => {
      const color = PIE_PALETTE[idx % PIE_PALETTE.length];
      const plant = isoToLocalDate(c.plantingDate);
      if (plant) list.push({ date: plant, type: 'Planting', crop: c, color });
      const harvest = isoToLocalDate(c.harvestingDate);
      if (harvest) list.push({ date: harvest, type: 'Harvesting', crop: c, color });
      (c.expenses || []).forEach((ex) => {
        const d = isoToLocalDate(ex.date);
        if (d) list.push({ date: d, type: 'Expense', crop: c, color, amount: ex.amount, label: ex.label });
      });
      (c.sales || []).forEach((s) => {
        const d = isoToLocalDate(s.date);
        if (d) list.push({ date: d, type: 'Sale', crop: c, color, amount: s.amount, label: s.label });
      });
    });
    return list;
  }, [crops]);

  const eventsForDay = (day) => events.filter((e) => sameDay(e.date, day));
  const selectedEvents = selectedDay ? eventsForDay(selectedDay) : [];

  const upcoming = useMemo(() => {
    const now = new Date();
    return events
      .filter((e) => e.date >= now)
      .sort((a, b) => a.date - b.date)
      .slice(0, 6);
  }, [events]);

  // Event dots rendered inside each day tile.
  const tileContent = ({ date, view }) => {
    if (view !== 'month') return null;
    const dayEvents = eventsForDay(date);
    if (!dayEvents.length) return null;
    return (
      <div className="cal-dots">
        {dayEvents.slice(0, 3).map((e, idx) => (
          <span
            key={idx}
            className="cal-dot"
            style={{ background: e.color }}
            title={`${e.crop.name} · ${e.type}`}
          />
        ))}
        {dayEvents.length > 3 && (
          <span className="cal-more">+{dayEvents.length - 3}</span>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-light-muted hover:text-accent text-sm mb-5 no-underline transition-colors relative z-10"
      >
        <FiArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <div className="mb-5 relative z-10">
        <h1 className="text-3xl md:text-4xl font-light text-light-text">Farmer</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-accent">Calendar</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative z-10">
        {/* Calendar */}
        <div className="lg:col-span-2 rounded-3xl border border-light-border bg-white p-4">
          <div className="farmer-calendar">
            <Calendar
              value={selectedDay}
              onClickDay={(d) => setSelectedDay(d)}
              calendarType="gregory"
              showNeighboringMonth={false}
              minDetail="month"
              tileContent={tileContent}
              prevLabel={<FiChevronLeft size={18} />}
              nextLabel={<FiChevronRight size={18} />}
              prev2Label={null}
              next2Label={null}
            />
          </div>
        </div>

        {/* Side panels */}
        <div className="lg:col-span-1 space-y-5">
          <div className="rounded-3xl border border-light-border bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <FiCalendar className="text-accent" size={16} />
              <p className="text-light-text text-sm font-semibold">
                {selectedDay
                  ? selectedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
                  : 'Select a day'}
              </p>
            </div>
            {selectedEvents.length === 0 ? (
              <p className="text-light-muted text-xs">Nothing scheduled.</p>
            ) : (
              <ul className="space-y-2">
                {selectedEvents.map((e, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: e.color }} />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/dashboard/crops/${e.crop.id}`}
                        className="text-light-text text-xs font-medium hover:text-accent no-underline"
                      >
                        {e.crop.name}
                      </Link>
                      <p className="text-light-muted text-[11px]">
                        {e.type}
                        {e.amount ? ` · ₹${e.amount}` : ''}
                        {e.label ? ` · ${e.label}` : ''}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-3xl border border-light-border bg-white p-5">
            <p className="text-light-muted text-xs uppercase tracking-wider mb-3">Upcoming</p>
            {upcoming.length === 0 ? (
              <p className="text-light-muted text-xs">No upcoming events.</p>
            ) : (
              <ul className="space-y-2.5">
                {upcoming.map((e, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div
                      className="rounded-lg w-11 h-11 flex flex-col items-center justify-center text-[10px] text-[#0E2A18] font-bold shrink-0"
                      style={{ background: e.color }}
                    >
                      <span>{e.date.toLocaleDateString('en-US', { month: 'short' })}</span>
                      <span className="text-base leading-none">{e.date.getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/dashboard/crops/${e.crop.id}`}
                        className="text-light-text text-sm font-medium truncate block hover:text-accent no-underline"
                      >
                        {e.crop.name}
                      </Link>
                      <p className="text-light-muted text-[11px]">{e.type}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
