import React, { useState, useEffect } from 'react';
import { User, BookOpen, Save, Calendar, CheckSquare, MapPin, Plus, Trash2, Clock } from 'lucide-react';

const TRAVELERS = ['יוסי', 'שירן', 'אייל', 'שי', 'משותף'];
const ONLY_PEOPLE = ['יוסי', 'שירן', 'אייל', 'שי'];

// 1 & 2. רשימות ציוד מעודכנות לפי התמונות (כולל הטאב המשותף)
const INITIAL_PACKING_LISTS = {
  'משותף': [
    'ביטוח חול', 'נובימול', 'חבילת גלישה', 'ספריי הגנה', 'פלסטרים',
    'אלוורה', 'אופטלגין', 'סלספט', 'לחם לליג', 'טוסטר לאייל'
  ],
  'שי': [
    'פספורט', 'בגדים', 'מכנסיים קצרים', 'חולצות קצרות', 'גופיות', 'פיג׳מה',
    'תחתונים', 'גרביים', 'נעלי ספורט', 'כפכפים', 'מברשת שיניים', 'תחתוניות / פדים',
    'ספריי הגנה', 'משקפי שמש', 'תיק איפור', 'מסרק', 'גומיות לשיער', 'תיק גב',
    'כובע', 'אוזניות', 'מטען לנייד', 'מטען נייד'
  ],
  'אייל': [
    'פספורט', 'בגדים', 'מכנסיים קצרים', 'חולצות קצרות', 'גופיות', 'פיג׳מה',
    'תחתונים', 'גרביים', 'נעלי ספורט', 'כפכפים', 'מברשת שיניים', 'דאודורנט',
    'תיק גב', 'מטען לנייד', 'משקפי שמש', 'כובע', 'אוזניות', 'מטען נייד'
  ],
  'שירן': [
    'פספורט', 'בגד יום', 'חולצות קצרות', 'מכנסיים קצרים', 'תחתונים', 'גופיות',
    'נעל ספורט', 'כפכפים', 'משקפי שמש', 'חולצה ארוכה / ג׳קט', 'שק כביסה',
    'גומיות לשיער', 'קרם לשיער', 'תחתוניות / פדים', 'מחליק שיער', 'תיק איפור',
    'כלי רחצה', 'גלולות', 'תיק גב', 'אוזניות', 'כובע'
  ],
  'יוסי': [
    'פספורט', 'חולצות קצרות', 'מכנסיים קצרים', 'תחתונים', 'גרביים שחורות',
    'גרבי ספורט', 'כובע טמבל', 'מטען לשעון', 'אוזניות בלוטות', 'מטען נייד',
    'מבחר שרשראות/צמיגים', 'נעלי ספורט', 'כפכפים', 'גופיות', 'ג׳ינסים', 'לפג',
    'נרתיק למשקפי שמש', 'משקפיים', 'תיק גב', 'מכונת תספורת', 'כובע מצחיה',
    'סכין גילוח+ג׳ל', 'בושם', 'חולצות ארוכות', 'מגבונים', 'שק כביסה', 'מטען לפלאפון',
    'מגש למסעדת', 'ערכת עזרה', 'דאודורנט', 'מכנס לשינה', 'משקפי אלטר', 'בקבוק מים',
    'דולרים', 'באטים', 'מטען נייד'
  ]
};

const DAYS = ['יום 1', 'יום 2', 'יום 3', 'יום 4', 'יום 5', 'יום 6', 'יום 7'];

export default function TravelApp() {
  const [activeMainTab, setActiveMainTab] = useState('itinerary'); // 'itinerary' | 'packing'

  // 4. בחירת זהות משתמש נכנס שמוזכרת ונשמרת במכשיר
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('travel_current_user') || 'יוסי';
  });

  // ניהול ימים ואירועים בלו"ז
  const [selectedDay, setSelectedDay] = useState('יום 1');
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('travel_events');
    return saved ? JSON.parse(saved) : {};
  });

  // טופס אירוע חדש
  const [newEventDesc, setNewEventDesc] = useState('');
  const [newEventCategory, setNewEventCategory] = useState('טיסה ✈️');
  const [newEventTime, setNewEventTime] = useState('');
  const [newEventMap, setNewEventMap] = useState('');

  // ניהול רשימת ציוד
  const [activePackingTab, setActivePackingTab] = useState('משותף');
  const [packingLists, setPackingLists] = useState(() => {
    const saved = localStorage.getItem('travel_packing_lists');
    return saved ? JSON.parse(saved) : INITIAL_PACKING_LISTS;
  });
  const [newPackingItem, setNewPackingItem] = useState('');

  // 3. יומן מסע לכל יום
  const [journalEntries, setJournalEntries] = useState(() => {
    const saved = localStorage.getItem('travel_journal');
    return saved ? JSON.parse(saved) : {};
  });
  const [newLogText, setNewLogText] = useState('');

  // שמירה אוטומטית ב-LocalStorage
  useEffect(() => {
    localStorage.setItem('travel_current_user', currentUser);
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('travel_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('travel_packing_lists', JSON.stringify(packingLists));
  }, [packingLists]);

  useEffect(() => {
    localStorage.setItem('travel_journal', JSON.stringify(journalEntries));
  }, [journalEntries]);

  // פונקציות הוספה/מחיקת אירועים בלו"ז
  const handleAddEvent = () => {
    if (!newEventDesc.trim()) return;
    const dayEvents = events[selectedDay] || [];
    const newEvent = {
      id: Date.now(),
      description: newEventDesc.trim(),
      category: newEventCategory,
      time: newEventTime.trim(),
      mapLink: newEventMap.trim()
    };
    setEvents({ ...events, [selectedDay]: [...dayEvents, newEvent] });
    setNewEventDesc('');
    setNewEventTime('');
    setNewEventMap('');
  };

  const handleDeleteEvent = (id) => {
    const dayEvents = (events[selectedDay] || []).filter(e => e.id !== id);
    setEvents({ ...events, [selectedDay]: dayEvents });
  };

  // פונקציות ציוד
  const handleAddPackingItem = () => {
    if (!newPackingItem.trim()) return;
    setPackingLists({
      ...packingLists,
      [activePackingTab]: [...(packingLists[activePackingTab] || []), newPackingItem.trim()]
    });
    setNewPackingItem('');
  };

  const handleDeletePackingItem = (index) => {
    const list = [...packingLists[activePackingTab]];
    list.splice(index, 1);
    setPackingLists({ ...packingLists, [activePackingTab]: list });
  };

  // 3. הוספת תיאור ליומן מסע
  const handleAddJournalEntry = () => {
    if (!newLogText.trim()) return;
    const dayLogs = journalEntries[selectedDay] || [];
    const entry = {
      id: Date.now(),
      author: currentUser,
      text: newLogText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setJournalEntries({
      ...journalEntries,
      [selectedDay]: [...dayLogs, entry]
    });
    setNewLogText('');
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif', direction: 'rtl', padding: '16px', backgroundColor: '#f8fafc', minHeight: '100vh', boxSizing: 'border-box' }}>
      
      {/* 4. בחירת זהות משתמש בראש האתר (נזכר לפי המכשיר) */}
      <div style={{ backgroundColor: '#fff', padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={18} color="#2563eb" />
          <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#1e293b' }}>מי אתה?</span>
        </div>
        <select 
          value={currentUser} 
          onChange={(e) => setCurrentUser(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#f1f5f9', fontWeight: 'bold', color: '#0f172a', outline: 'none' }}
        >
          {ONLY_PEOPLE.map(person => (
            <option key={person} value={person}>{person}</option>
          ))}
        </select>
      </div>

      {/* תפריט ניווט ראשי: לו"ז מסע / רשימת ציוד */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveMainTab('itinerary')}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: activeMainTab === 'itinerary' ? '#2563eb' : '#fff',
            color: activeMainTab === 'itinerary' ? '#fff' : '#64748b',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            cursor: 'pointer'
          }}
        >
          <Calendar size={18} /> לו"ז מסע
        </button>
        <button
          onClick={() => setActiveMainTab('packing')}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: activeMainTab === 'packing' ? '#2563eb' : '#fff',
            color: activeMainTab === 'packing' ? '#fff' : '#64748b',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            cursor: 'pointer'
          }}
        >
          <CheckSquare size={18} /> רשימת ציוד
        </button>
      </div>

      {/* -------------------- תצוגת לו"ז מסע ויומן -------------------- */}
      {activeMainTab === 'itinerary' && (
        <>
          {/* סרגל ימים */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: selectedDay === day ? '#0284c7' : '#fff',
                  color: selectedDay === day ? '#fff' : '#475569',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                {day}
              </button>
            ))}
          </div>

          {/* אירועי היום הנבחר */}
          <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '12px' }}>
              אירועים ל{selectedDay}
            </h3>

            {(!events[selectedDay] || events[selectedDay].length === 0) ? (
              <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', margin: '16px 0' }}>אין אירועים מתוכננים עדיין ליום זה</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                {events[selectedDay].map(item => (
                  <div key={item.id} style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '6px', fontWeight: 'bold' }}>{item.category}</span>
                        {item.time && <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '2px' }}><Clock size={12} /> {item.time}</span>}
                      </div>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1e293b', margin: '4px 0' }}>{item.description}</p>
                      {item.mapLink && (
                        <a href={item.mapLink} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none', marginTop: '4px' }}>
                          <MapPin size={12} /> קישור למפה
                        </a>
                      )}
                    </div>
                    <button onClick={() => handleDeleteEvent(item.id)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* טופס הוספת אירוע ליום הנבחר */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#334155' }}>הוספת אירוע ליום הנבחר</span>
              <input
                type="text"
                placeholder="תיאור האירוע"
                value={newEventDesc}
                onChange={(e) => setNewEventDesc(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={newEventCategory}
                  onChange={(e) => setNewEventCategory(e.target.value)}
                  style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                >
                  <option value="טיסה ✈️">טיסה ✈️</option>
                  <option value="מלון 🏨">מלון 🏨</option>
                  <option value="אטרקציה 🎡">אטרקציה 🎡</option>
                  <option value="אוכל 🍽️">אוכל 🍽️</option>
                  <option value="נסיעה 🚗">נסיעה 🚗</option>
                </select>
                <input
                  type="text"
                  placeholder="שעה (למשל 14:30)"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                  style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
                />
              </div>
              <input
                type="text"
                placeholder="קישור למפה (לא חובה)"
                value={newEventMap}
                onChange={(e) => setNewEventMap(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
              />
              <button
                onClick={handleAddEvent}
                style={{ padding: '10px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 'bold', color: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Plus size={16} /> הוסף אירוע ליום זה
              </button>
            </div>
          </div>

          {/* 3. יומן מסע (כפי שמופיע בתמונה שצורפה) */}
          <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <BookOpen size={18} color="#0284c7" />
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>יומן המסע ל{selectedDay}</h3>
            </div>

            {/* רשימת תיאורים שכבר נרשמו */}
            <div style={{ marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(!journalEntries[selectedDay] || journalEntries[selectedDay].length === 0) ? (
                <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', fontStyle: 'italic', margin: '8px 0' }}>טרם נרשמו חוויות ליום זה...</p>
              ) : (
                journalEntries[selectedDay].map(entry => (
                  <div key={entry.id} style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px', borderRight: '3px solid #2563eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{entry.author}</span>
                      <span>{entry.time}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#334155', margin: 0 }}>{entry.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* שדה הכתיבה ליומן היומי */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <textarea
                rows="3"
                placeholder={`איך היה היום... (יירשם בשם ${currentUser})`}
                value={newLogText}
                onChange={(e) => setNewLogText(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'none', fontSize: '13px', boxSizing: 'border-box' }}
              />
              <button
                onClick={handleAddJournalEntry}
                style={{ padding: '8px 16px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Save size={16} /> הוסף ליומן
              </button>
            </div>
          </div>
        </>
      )}

      {/* -------------------- תצוגת רשימת ציוד -------------------- */}
      {activeMainTab === 'packing' && (
        <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0284c7', marginBottom: '12px', borderRight: '4px solid #0284c7', paddingRight: '8px' }}>
            רשימת ציוד אישית לפי נוסע
          </h2>

          {/* 1. טאבים לרשימת הציוד (כולל טאב משותף) */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
            {TRAVELERS.map(tab => (
              <button
                key={tab}
                onClick={() => setActivePackingTab(tab)}
                style={{
                  flex: 1,
                  padding: '8px 4px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: activePackingTab === tab ? '#0284c7' : '#f1f5f9',
                  color: activePackingTab === tab ? '#fff' : '#475569',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '13px',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* הוספת פריט ציוד */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input
              type="text"
              placeholder="שם הפריט להוספה"
              value={newPackingItem}
              onChange={(e) => setNewPackingItem(e.target.value)}
              style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px' }}
            />
            <button 
              onClick={handleAddPackingItem}
              style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
            >
              הוסף פריט
            </button>
          </div>

          {/* 2. רשימת הפריטים לפי הנוסע/משותף */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '400px', overflowY: 'auto' }}>
            {(packingLists[activePackingTab] || []).map((item, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '10px', backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                  <span style={{ fontSize: '14px', color: '#334155' }}>{item}</span>
                </div>
                <button onClick={() => handleDeletePackingItem(index)} style={{ padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#fff', fontSize: '11px', cursor: 'pointer', color: '#64748b' }}>
                  מחק
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
