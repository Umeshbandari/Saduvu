import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Calendar, CheckCircle2, Circle, Plus, X, ChevronLeft, ChevronRight, BookOpen, TrendingUp, TrendingDown, BarChart3, Menu } from 'lucide-react';

const getLocalDateKey = (dateObj) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateKey = (dateStr) => {
  const parts = (dateStr || '').split('-');
  if (parts.length !== 3) return new Date();
  const [year, month, day] = parts.map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
};

const SUBJECT_OPTIONS = [
  'Polity',
  'Geography',
  'Economics',
  'AMAC',
  'Modern History',
  'Environment',
  'Science & Tech',
  'IR',
  'Agri',
  'Security',
  'Misc'
];

// Updated component to accept Firebase props
const Chaduvu = ({ initialStudyData, initialTasks, onSave }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedDate] = useState(() => getLocalDateKey(new Date()));
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Initialize state from Firebase props
  const [studyData, setStudyData] = useState(initialStudyData || {});
  const [tasks, setTasks] = useState(initialTasks || {});
  const [loading] = useState(false); // Managed by App.jsx now

  // Keep local state synced if Firebase data changes from another device
  useEffect(() => {
    setStudyData(initialStudyData || {});
    setTasks(initialTasks || {});
  }, [initialStudyData, initialTasks]);

  // Save data to Firebase via App.jsx prop
  const saveData = async (newStudyData, newTasks) => {
    try {
      await onSave(newStudyData, newTasks);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  };

  const formatDayMonth = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const [, month, day] = parts;
    return `${day}-${month}`;
  };

  const formatDateKey = (dateObj) => {
    return getLocalDateKey(dateObj);
  };

  // Calendar component
  const CalendarView = ({ onSelectDate, selectedDate }) => {
    const [currentMonth, setCurrentMonth] = useState(() => {
      const baseDate = selectedDate ? parseDateKey(selectedDate) : new Date();
      return new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    });

    useEffect(() => {
      const baseDate = selectedDate ? parseDateKey(selectedDate) : new Date();
      setCurrentMonth(new Date(baseDate.getFullYear(), baseDate.getMonth(), 1));
    }, [selectedDate]);

    const getDaysInMonth = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDayOfWeek = firstDay.getDay();

      const days = [];
      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }
      for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(year, month, i));
      }
      return days;
    };

    const days = getDaysInMonth(currentMonth);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const prevMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    return (
      <div className="absolute top-full left-0 mt-2 bg-white border border-slate-200 shadow-lg rounded-2xl p-4 z-50 w-80">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="p-1 rounded transition-colors hover:bg-slate-100"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="font-semibold text-slate-800">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
          <button
            onClick={nextMonth}
            className="p-1 rounded transition-colors hover:bg-slate-100"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-slate-500">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            if (!day) return <div key={idx} />;
            const dateStr = formatDateKey(day);
            const isSelected = dateStr === selectedDate;
            return (
              <button
                key={idx}
                onClick={() => onSelectDate(dateStr)}
                className={`p-2 text-sm rounded-lg transition-all ${
                  isSelected
                    ? 'bg-emerald-500 text-white font-semibold shadow-sm'
                    : 'hover:bg-emerald-50 text-slate-700'
                }`}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Home Page Component
  const HomePage = () => {
    const ForestCutIllustration = () => (
      <svg viewBox="0 0 220 140" className="w-44 h-auto mx-auto" role="img" aria-label="Forest being cut illustration">
        <rect x="0" y="112" width="220" height="28" fill="#d6e3d3" />
        <polygon points="36,88 66,28 96,88" fill="#4f8d5d" />
        <polygon points="40,70 66,20 92,70" fill="#5ca66e" />
        <rect x="61" y="88" width="10" height="24" fill="#7a5a43" />
        <polygon points="124,90 148,44 172,90" fill="#3f7f53" />
        <polygon points="128,74 148,34 168,74" fill="#4f9663" />
        <rect x="144" y="90" width="8" height="22" fill="#6f503a" />
        <ellipse cx="112" cy="110" rx="20" ry="10" fill="#9a6f4f" />
        <ellipse cx="112" cy="110" rx="14" ry="6" fill="#b78a68" />
        <rect x="92" y="72" width="34" height="5" rx="2.5" fill="#6f503a" transform="rotate(18 109 74)" />
        <rect x="124" y="66" width="24" height="5" rx="2.5" fill="#9aa4ad" transform="rotate(18 136 68)" />
      </svg>
    );

    const getHomeTodayTasks = () => {
      const todayData = studyData[selectedDate] || {};
      const todayTasks = todayData.tomorrowTasks || [];
      const completedTasks = todayData.completedTasks || [];

      const yesterday = parseDateKey(selectedDate);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = formatDateKey(yesterday);
      const yesterdayData = studyData[yesterdayStr] || {};
      const yesterdayTasks = yesterdayData.tomorrowTasks || [];
      const yesterdayCompleted = yesterdayData.completedTasks || [];
      const carriedForwardTasks = yesterdayTasks.filter(task => !yesterdayCompleted.includes(task));

      return {
        tasks: [...carriedForwardTasks, ...todayTasks],
        carriedForwardCount: carriedForwardTasks.length,
        completedTasks
      };
    };

    const toggleHomeTaskCompletion = async (task) => {
      const currentData = studyData[selectedDate] || {
        hoursStudied: 0,
        completedTasks: [],
        tomorrowTasks: [],
        studyRating: 0,
        newspaper: { status: 'not-yet' },
        planSubjects: []
      };

      const completed = currentData.completedTasks || [];
      const updatedCompleted = completed.includes(task)
        ? completed.filter(t => t !== task)
        : [...completed, task];

      const newStudyData = {
        ...studyData,
        [selectedDate]: {
          ...currentData,
          completedTasks: updatedCompleted
        }
      };

      setStudyData(newStudyData);
      await saveData(newStudyData, tasks);
    };

    const getSpacedRepetitionTasks = () => {
      const today = parseDateKey(selectedDate);
      const intervals = [
        { days: 1, label: 'Day 1' },
        { days: 3, label: '3 Days' },
        { days: 7, label: '7 Days' },
        { days: 15, label: '15 Days' },
        { days: 30, label: '1 Month' }
      ];

      const results = {};
      intervals.forEach(interval => {
        const targetDate = new Date(today);
        targetDate.setDate(targetDate.getDate() - interval.days);
        const dateStr = formatDateKey(targetDate);
        
        if (studyData[dateStr] && studyData[dateStr].completedTasks) {
          const taskList = studyData[dateStr].completedTasks.filter(task => {
            const repetitionStatus = studyData[dateStr].repetitionStatus || {};
            return !repetitionStatus[`${task}_${interval.days}`];
          });
          if (taskList.length > 0) {
            results[interval.label] = { tasks: taskList, originalDate: dateStr, days: interval.days };
          }
        }
      });
      return results;
    };

    const spacedTasks = getSpacedRepetitionTasks();
    const homeToday = getHomeTodayTasks();

    const markTaskComplete = async (intervalLabel, task, originalDate, days) => {
      const newStudyData = { ...studyData };
      if (!newStudyData[originalDate].repetitionStatus) {
        newStudyData[originalDate].repetitionStatus = {};
      }
      newStudyData[originalDate].repetitionStatus[`${task}_${days}`] = true;
      setStudyData(newStudyData);
      await saveData(newStudyData, tasks);
    };

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-3" style={{ letterSpacing: '0.05em' }}>NEW</h3>
            {homeToday.carriedForwardCount > 0 && (
              <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-800 font-semibold mb-1">Carried forward from yesterday:</p>
              </div>
            )}
            {homeToday.tasks.length === 0 ? (
              <div className="py-10 text-center">
                <ForestCutIllustration />
              </div>
            ) : (
              <div className="space-y-2">
                {homeToday.tasks.map((task, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                      homeToday.completedTasks.includes(task)
                        ? 'bg-emerald-50 border-emerald-200'
                        : 'bg-slate-50 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <button onClick={() => toggleHomeTaskCompletion(task)}>
                      {homeToday.completedTasks.includes(task) ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-400" />
                      )}
                    </button>
                    <span className={`flex-1 font-medium ${homeToday.completedTasks.includes(task) ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                      {idx + 1}. {task}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-3" style={{ letterSpacing: '0.05em' }}>SPACED</h3>
            {Object.keys(spacedTasks).length === 0 ? (
              <div className="py-10 text-center">
                <ForestCutIllustration />
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(spacedTasks).map(([interval, data]) => (
                  <div key={interval} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-base font-semibold text-slate-800">{interval}</h4>
                      <span className="text-xs text-slate-600 bg-slate-100 px-3 py-1 rounded-full font-medium">
                        {formatDisplayDate(data.originalDate)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {data.tasks.map((task, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-xl transition-colors hover:bg-emerald-50">
                          <button
                            onClick={() => markTaskComplete(interval, task, data.originalDate, data.days)}
                            className="mt-0.5 flex-shrink-0"
                          >
                            <Circle className="w-5 h-5 text-emerald-600 hover:text-emerald-700" />
                          </button>
                          <span className="text-slate-700 text-sm font-medium">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Data Page Component
  const DataPage = () => {
    const postDate = getLocalDateKey(new Date());

    const getDefaultDayData = () => ({
      hoursStudied: 0,
      completedTasks: [],
      tomorrowTasks: [],
      studyRating: 0,
      newspaper: { status: 'not-yet' },
      planSubjects: [],
      subjectPlans: {}
    });

    const currentData = studyData[postDate] || getDefaultDayData(postDate);
    const [formData, setFormData] = useState(currentData);

    const [planDate, setPlanDate] = useState(() => getLocalDateKey(new Date()));
    const [showPlanCalendar, setShowPlanCalendar] = useState(false);
    const [newPlan, setNewPlan] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    const normalizeSubjectPlans = (dayData) => {
      const raw = dayData?.subjectPlans || {};
      const normalized = {};

      Object.entries(raw).forEach(([subject, tasksList]) => {
        const cleanedTasks = (tasksList || [])
          .map((task) => (typeof task === 'string' ? task.trim() : ''))
          .filter(Boolean);
        if (cleanedTasks.length > 0) {
          normalized[subject] = cleanedTasks;
        }
      });

      if (Object.keys(normalized).length === 0) {
        const legacyTasks = (dayData?.tomorrowTasks || [])
          .map((task) => (typeof task === 'string' ? task.trim() : ''))
          .filter(Boolean);
        if (legacyTasks.length > 0) {
          const fallbackSubject = (dayData?.planSubjects || [])[0] || 'General';
          normalized[fallbackSubject] = legacyTasks;
        }
      }

      return normalized;
    };

    const flattenSubjectPlans = (subjectPlansMap) => (
      Object.values(subjectPlansMap)
        .flat()
        .map((task) => (typeof task === 'string' ? task.trim() : ''))
        .filter(Boolean)
    );

    const planDayData = studyData[planDate] || getDefaultDayData(planDate);
    const normalizedPlansForDate = normalizeSubjectPlans(planDayData);
    const planSubjects = Array.from(new Set([
      ...(planDayData.planSubjects || []),
      ...Object.keys(normalizedPlansForDate)
    ]));
    const hasSelectedSubject = Boolean(selectedSubject);

    useEffect(() => {
      const data = studyData[postDate] || getDefaultDayData(postDate);
      setFormData(data);
    }, [postDate, studyData]);

    useEffect(() => {
      const dayData = studyData[planDate] || getDefaultDayData(planDate);
      const rawSubjectPlans = dayData.subjectPlans || {};
      const subjectsWithPlans = Object.keys(rawSubjectPlans).filter((subject) =>
        (rawSubjectPlans[subject] || [])
          .map((task) => (typeof task === 'string' ? task.trim() : ''))
          .filter(Boolean)
          .length > 0
      );
      const subjectsForDate = Array.from(new Set([
        ...(dayData.planSubjects || []),
        ...subjectsWithPlans
      ]));

      if (!selectedSubject) {
        if (subjectsForDate.length > 0) {
          setSelectedSubject(subjectsForDate[0]);
        }
        return;
      }

      if (!SUBJECT_OPTIONS.includes(selectedSubject)) {
        setSelectedSubject(subjectsForDate[0] || '');
      }
    }, [planDate, studyData, selectedSubject]);

    const saveFormData = async () => {
      const normalizedPostData = {
        ...formData,
        newspaper: {
          status: formData.newspaper?.status || 'not-yet',
          date: postDate
        }
      };
      const newStudyData = { ...studyData, [postDate]: normalizedPostData };
      setStudyData(newStudyData);
      await saveData(newStudyData, tasks);
    };

    const plannedDatesSummary = Object.keys(studyData)
      .sort()
      .filter((date) => Object.keys(normalizeSubjectPlans(studyData[date] || {})).length > 0)
      .map((date) => ({
        date,
        subjectPlans: normalizeSubjectPlans(studyData[date] || {})
      }));

    const addPlanItem = async () => {
      if (!hasSelectedSubject || !newPlan.trim()) return;
      const existing = studyData[planDate] || getDefaultDayData(planDate);
      const existingSubjectPlans = normalizeSubjectPlans(existing);
      const updatedSubjectPlans = {
        ...existingSubjectPlans,
        [selectedSubject]: [...(existingSubjectPlans[selectedSubject] || []), newPlan.trim()]
      };
      const updatedSubjects = Array.from(new Set([...planSubjects, selectedSubject]));
      const newStudyData = {
        ...studyData,
        [planDate]: {
          ...existing,
          planSubjects: updatedSubjects,
          subjectPlans: updatedSubjectPlans,
          tomorrowTasks: flattenSubjectPlans(updatedSubjectPlans)
        }
      };
      setStudyData(newStudyData);
      setNewPlan('');
      await saveData(newStudyData, tasks);
    };

    const removePlanItemFromOverview = async (date, subject, index) => {
      const existing = studyData[date] || getDefaultDayData(date);
      const existingSubjectPlans = normalizeSubjectPlans(existing);
      const subjectPlans = [...(existingSubjectPlans[subject] || [])];
      if (index < 0 || index >= subjectPlans.length) return;
      subjectPlans.splice(index, 1);

      const updatedSubjectPlans = { ...existingSubjectPlans };
      if (subjectPlans.length === 0) {
        delete updatedSubjectPlans[subject];
      } else {
        updatedSubjectPlans[subject] = subjectPlans;
      }

      const updatedSubjects = Object.keys(updatedSubjectPlans);
      const newStudyData = {
        ...studyData,
        [date]: {
          ...existing,
          planSubjects: updatedSubjects,
          subjectPlans: updatedSubjectPlans,
          tomorrowTasks: flattenSubjectPlans(updatedSubjectPlans)
        }
      };
      setStudyData(newStudyData);

      if (date === planDate && !updatedSubjects.includes(selectedSubject)) {
        setSelectedSubject(updatedSubjects[0] || '');
      }

      await saveData(newStudyData, tasks);
    };

    const selectPlanSubject = (subject) => {
      setSelectedSubject(subject);
    };

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 text-center" style={{ letterSpacing: '0.06em' }}>POST</h2>

          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-500 mb-2" style={{ letterSpacing: '0.05em' }}>POST DATE</label>
            <div className="w-full flex items-center gap-3 px-5 py-4 border border-emerald-200 rounded-xl bg-emerald-50">
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-slate-800">{formatDisplayDate(postDate)}</span>
              <span className="ml-auto text-xs font-semibold text-emerald-700">TODAY ONLY</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-500 mb-2" style={{ letterSpacing: '0.05em' }}>HOURS STUDIED</label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={formData.hoursStudied}
              onChange={(e) => setFormData({ ...formData, hoursStudied: parseFloat(e.target.value) || 0 })}
              className="w-full px-5 py-4 border border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 focus:outline-none text-slate-800 font-semibold bg-white transition-colors"
            />
          </div>

          <div className="mb-6">
            <h3 className="block text-xs font-semibold text-slate-500 mb-2" style={{ letterSpacing: '0.05em' }}>QUALITY STUDY</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFormData({ ...formData, studyRating: star })}
                  className="text-2xl hover:scale-110 transition-transform"
                >
                  {star <= formData.studyRating ? '⭐' : '☆'}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="block text-xs font-semibold text-slate-500 mb-2" style={{ letterSpacing: '0.05em' }}>NEWSPAPER</h3>
            <div className="space-y-3">
              <div>
                <div className="flex gap-2 flex-wrap">
                  {['not-yet', 'partial', 'done'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFormData({
                        ...formData,
                        newspaper: { ...formData.newspaper, status }
                      })}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                        formData.newspaper.status === status
                          ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-sky-500'
                      }`}
                    >
                      {status === 'not-yet' ? 'Not Yet' : status === 'partial' ? 'Partial' : 'Completed'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={saveFormData}
              className="px-5 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Save
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 text-center" style={{ letterSpacing: '0.06em' }}>PLAN</h2>

          <div className="mb-6 relative">
            <label className="block text-xs font-semibold text-slate-500 mb-2" style={{ letterSpacing: '0.05em' }}>PLAN DATE</label>
            <button
              onClick={() => setShowPlanCalendar(!showPlanCalendar)}
              className="w-full flex items-center gap-3 px-5 py-4 border border-slate-300 rounded-xl hover:border-emerald-400 transition-colors bg-white"
            >
              <Calendar className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-slate-800">{formatDisplayDate(planDate)}</span>
            </button>
            {showPlanCalendar && (
              <CalendarView
                selectedDate={planDate}
                onSelectDate={(date) => {
                  setPlanDate(date);
                  setShowPlanCalendar(false);
                }}
              />
            )}
          </div>

          <div className="mb-6">
            <h3 className="block text-xs font-semibold text-slate-500 mb-2" style={{ letterSpacing: '0.05em' }}>SUBJECTS</h3>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_OPTIONS.map((subject) => (
                <button
                  key={subject}
                  onClick={() => selectPlanSubject(subject)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                    selectedSubject === subject
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : planSubjects.includes(subject)
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-500'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
            {hasSelectedSubject ? (
              <p className="mt-2 text-xs text-emerald-700 font-medium">
                Defining plan for: {selectedSubject}
              </p>
            ) : (
              <p className="mt-2 text-xs text-amber-700 font-medium">
                Select a subject to enable plan entry.
              </p>
            )}
          </div>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newPlan}
              onChange={(e) => setNewPlan(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPlanItem()}
              disabled={!hasSelectedSubject}
              placeholder={hasSelectedSubject ? `Add plan for ${selectedSubject}...` : 'Select subject first'}
              className={`flex-1 px-5 py-3 border rounded-xl focus:outline-none font-medium placeholder-slate-400 ${
                hasSelectedSubject
                  ? 'border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-white text-slate-800'
                  : 'border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            />
            <button
              onClick={addPlanItem}
              disabled={!hasSelectedSubject || !newPlan.trim()}
              className={`px-5 py-3 rounded-xl transition-colors shadow-sm ${
                hasSelectedSubject && newPlan.trim()
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-semibold text-slate-700 mb-3" style={{ letterSpacing: '0.04em' }}>OVERVIEW</h3>
            <div className="space-y-3">
              {plannedDatesSummary.map((entry) => (
                <div key={entry.date} className="p-4 bg-white border border-slate-200 rounded-xl">
                  <div className="text-sm font-semibold text-slate-800 mb-3">{formatDisplayDate(entry.date)}</div>
                  <div className="space-y-3">
                    {Object.entries(entry.subjectPlans).map(([subject, tasksList]) => (
                      <div key={`${entry.date}-${subject}`} className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
                            {subject}
                          </span>
                          <span className="text-xs text-slate-500">{tasksList.length} plan(s)</span>
                        </div>
                        <div className="space-y-2">
                          {tasksList.map((task, idx) => (
                            <div key={`${entry.date}-${subject}-${idx}`} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                              <span className="flex-1 text-sm text-slate-700">{idx + 1}. {task}</span>
                              <button
                                onClick={() => removePlanItemFromOverview(entry.date, subject, idx)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                                aria-label={`Delete plan ${idx + 1} for ${subject}`}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {plannedDatesSummary.length === 0 && (
                <p className="text-sm text-slate-500">No plans added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Analysis Page Component
  const AnalysisPage = () => {
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const getChecklistStatsForDate = (date) => {
      const day = studyData[date] || {};
      const todayTasks = day.tomorrowTasks || [];

      const previousDate = parseDateKey(date);
      previousDate.setDate(previousDate.getDate() - 1);
      const previousDateKey = formatDateKey(previousDate);
      const previousDay = studyData[previousDateKey] || {};

      const carriedForward = (previousDay.tomorrowTasks || []).filter(
        (task) => !(previousDay.completedTasks || []).includes(task)
      );

      const checklistTasks = [...carriedForward, ...todayTasks];
      const completedChecklistTasks = (day.completedTasks || []).filter((task) =>
        checklistTasks.includes(task)
      );

      return {
        total: checklistTasks.length,
        completed: Math.min(completedChecklistTasks.length, checklistTasks.length)
      };
    };

    const getSeededNoise = (seed) => {
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        hash = (hash << 5) - hash + seed.charCodeAt(i);
        hash |= 0;
      }
      const normalized = Math.sin(hash) * 10000;
      return (normalized - Math.floor(normalized)) * 2 - 1;
    };

    const buildProductivityIndexHistory = () => {
      const dates = Object.keys(studyData).sort();
      const basePrice = 100;
      const maxDailyGain = 0.06;
      const maxDailyLoss = -0.04;
      const crashFloorAbsolute = 82;
      const peakProtection = 0.74;
      const momentumCap = 0.18;

      const history = [
        {
          date: 'Start',
          isoDate: 'start',
          internalPrice: basePrice,
          visiblePrice: 0,
          dailyChangePercent: 0,
          dailyChangeValue: 0,
          streak: 0,
          goalCompletionPercent: 0,
          focusQuality: 0,
          consistencyScore: 100
        }
      ];

      if (dates.length === 0) {
        return history;
      }

      let previousPrice = basePrice;
      let peakPrice = basePrice;
      let streak = 0;
      let rollingExecutionScores = [];

      dates.forEach((date) => {
        const day = studyData[date] || {};
        const checklistStats = getChecklistStatsForDate(date);
        const totalTasks = checklistStats.total;
        const completedTasks = checklistStats.completed;
        const oldPrice = previousPrice;

        const goalCompletion = totalTasks > 0 ? completedTasks / totalTasks : (completedTasks > 0 ? 1 : 0.6);
        const ratingScore = clamp((day.studyRating || 0) / 5, 0, 1);
        const hourScore = clamp((day.hoursStudied || 0) / 8, 0, 1);
        const focusQuality = clamp((ratingScore * 0.75) + (hourScore * 0.25), 0, 1);
        const executionScore = clamp((goalCompletion * 0.6) + (focusQuality * 0.4), 0, 1);

        streak = executionScore >= 0.62 ? streak + 1 : 0;

        const recentWindow = [...rollingExecutionScores.slice(-6), executionScore];
        const mean = recentWindow.reduce((sum, score) => sum + score, 0) / recentWindow.length;
        const variance = recentWindow.reduce((sum, score) => sum + ((score - mean) ** 2), 0) / recentWindow.length;
        const consistencyScore = clamp(1 - (variance / 0.08), 0, 1);
        const inconsistency = 1 - consistencyScore;

        const streakBonus = Math.min(Math.log1p(streak) * 0.06, 0.16);
        const momentumMultiplier = 1 + Math.min(Math.log1p(streak) * 0.07, momentumCap);

        const performanceScore = clamp(
          (executionScore * 0.55) + (consistencyScore * 0.25) + (streakBonus * 0.2),
          0,
          1
        );

        let growthRate = (performanceScore - 0.52) * 0.075;
        if (growthRate >= 0) {
          growthRate *= momentumMultiplier;
        } else {
          growthRate *= 0.72;
        }

        const volatilityNoise = (0.002 + (inconsistency * 0.012)) * getSeededNoise(date);
        growthRate += volatilityNoise;
        growthRate = clamp(growthRate, maxDailyLoss, maxDailyGain);

        let nextPrice = oldPrice * (1 + growthRate);

        const crashFloor = Math.max(crashFloorAbsolute, peakPrice * peakProtection);
        if (nextPrice < crashFloor) {
          nextPrice = crashFloor + ((crashFloor - nextPrice) * 0.15);
        }

        const adjustedRate = clamp((nextPrice / oldPrice) - 1, maxDailyLoss, maxDailyGain);
        nextPrice = oldPrice * (1 + adjustedRate);
        nextPrice = Math.max(nextPrice, crashFloorAbsolute);
        peakPrice = Math.max(peakPrice, nextPrice);
        rollingExecutionScores = [...rollingExecutionScores, executionScore];

        history.push({
          date: formatDayMonth(date),
          isoDate: date,
          internalPrice: Number(nextPrice.toFixed(2)),
          visiblePrice: Number((nextPrice - basePrice).toFixed(2)),
          dailyChangePercent: Number((adjustedRate * 100).toFixed(2)),
          dailyChangeValue: Number((nextPrice - oldPrice).toFixed(2)),
          streak,
          goalCompletionPercent: Math.round(goalCompletion * 100),
          focusQuality: Math.round(focusQuality * 100),
          consistencyScore: Math.round(consistencyScore * 100)
        });

        previousPrice = nextPrice;
      });

      return history;
    };

    const getChartData = () => {
      const dates = Object.keys(studyData).sort();
      
      const studyHoursData = dates.length > 0
        ? dates.map((date) => ({
            date: formatDayMonth(date),
            fullDate: formatDisplayDate(date),
            studyHours: Math.max(0, Number(studyData[date].hoursStudied || 0))
          }))
        : [
            { date: '01-03', fullDate: '01-03-2026', studyHours: 3.5 },
            { date: '02-03', fullDate: '02-03-2026', studyHours: 6.2 },
            { date: '03-03', fullDate: '03-03-2026', studyHours: 8.4 },
            { date: '04-03', fullDate: '04-03-2026', studyHours: 13.5 }
          ];

      const targetCompletionData = dates.map(date => {
        const checklistStats = getChecklistStatsForDate(date);
        const totalTasks = checklistStats.total;
        const completedTasks = checklistStats.completed;
        const rate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
        return {
          date: formatDayMonth(date),
          rate: Math.round(rate),
          total: totalTasks,
          completed: completedTasks
        };
      });

      const newspaperData = dates.map(date => {
        const status = studyData[date].newspaper?.status || 'not-yet';
        const value = status === 'done' ? 100 : status === 'partial' ? 50 : 0;
        return {
          date: formatDayMonth(date),
          value,
          status
        };
      });

      const ratingData = [1, 2, 3, 4, 5].map(rating => {
        const count = dates.filter(date => studyData[date].studyRating === rating).length;
        return { rating: `${rating} Star`, count };
      });

      const subjectWiseData = SUBJECT_OPTIONS.map((subject) => ({
        subject,
        count: dates.filter((date) => {
          const day = studyData[date] || {};
          const subjectPlans = day.subjectPlans || {};
          const planSubjects = Object.keys(subjectPlans).length > 0
            ? Object.keys(subjectPlans)
            : (day.planSubjects || []);
          return planSubjects.includes(subject);
        }).length
      })).filter((item) => item.count > 0);

      const spacedRepetitionData = [
        { interval: '1 Day', count: 0 },
        { interval: '3 Days', count: 0 },
        { interval: '7 Days', count: 0 },
        { interval: '15 Days', count: 0 },
        { interval: '30 Days', count: 0 }
      ];

      const today = parseDateKey(selectedDate);
      [1, 3, 7, 15, 30].forEach((days, idx) => {
        const targetDate = new Date(today);
        targetDate.setDate(targetDate.getDate() - days);
        const dateStr = formatDateKey(targetDate);
        
        if (studyData[dateStr]) {
          const completed = (studyData[dateStr].completedTasks || []).length;
          const reviewed = Object.keys(studyData[dateStr].repetitionStatus || {}).filter(key => 
            key.endsWith(`_${days}`)
          ).length;
          spacedRepetitionData[idx].count = completed - reviewed;
        }
      });

      const productivityIndexData = buildProductivityIndexHistory();
      const latestProductivity = productivityIndexData[productivityIndexData.length - 1];
      const previousProductivity = productivityIndexData.length > 1
        ? productivityIndexData[productivityIndexData.length - 2]
        : productivityIndexData[0];

      return {
        studyHoursData,
        targetCompletionData,
        newspaperData,
        subjectWiseData,
        ratingData,
        spacedRepetitionData,
        productivityIndexData,
        latestProductivity,
        previousProductivity
      };
    };

    const chartData = getChartData();
    const COLORS = ['#10b981', '#3b82f6', '#14b8a6', '#0ea5e9', '#22c55e'];
    const SUBJECT_COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#8b5cf6', '#ef4444', '#14b8a6', '#f97316', '#3b82f6', '#84cc16', '#a855f7', '#64748b'];
    const isProductivityUp = (chartData.latestProductivity.dailyChangePercent || 0) >= 0;
    const productivityLineColor = isProductivityUp ? '#16a34a' : '#dc2626';
    const productivityValue = chartData.latestProductivity.visiblePrice || 0;
    const dayMove = chartData.latestProductivity.dailyChangePercent || 0;
    const getStudyHoursGradient = (hours) => {
      if (hours < 4) return 'url(#studyHoursRed)';
      if (hours < 8) return 'url(#studyHoursBlue)';
      if (hours < 12) return 'url(#studyHoursGreen)';
      return 'url(#studyHoursEmerald)';
    };
    const maxStudyHours = chartData.studyHoursData.reduce((max, item) => Math.max(max, item.studyHours || 0), 0);
    const yAxisMax = Math.max(2, Number((maxStudyHours + 1).toFixed(1)));
    const highestTick = Math.max(2, Math.floor(yAxisMax / 2) * 2);
    const yAxisTicks = Array.from({ length: (highestTick / 2) + 1 }, (_, index) => index * 2);

    const renderActiveStudyBar = (props) => {
      const { x, y, width, height, fill } = props;
      const scale = 1.06;
      const scaledWidth = width * scale;
      const widthOffset = (scaledWidth - width) / 2;
      const extraHeight = 4;
      return (
        <rect
          x={x - widthOffset}
          y={Math.max(0, y - extraHeight)}
          width={scaledWidth}
          height={height + extraHeight}
          fill={fill}
          rx={8}
          ry={8}
        />
      );
    };

    const StudyHoursTooltip = ({ active, payload }) => {
      if (!active || !payload || payload.length === 0) return null;
      const item = payload[0].payload;
      const hours = Number(item.studyHours || 0);
      return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-3">
          <p className="text-xs font-semibold text-slate-500 mb-1">{item.fullDate}</p>
          <p className="text-sm font-semibold text-slate-800">Study Time: {hours.toFixed(1)} hours</p>
          {hours >= 12 && (
            <span className="inline-flex mt-2 px-2 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
              🔥 Peak Performance
            </span>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col xl:flex-row gap-6">
            <div className="xl:w-80 flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-slate-700" />
                <h2 className="text-lg font-semibold text-slate-800" style={{ letterSpacing: '0.05em' }}>SOURCE</h2>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 mb-4">
                <p className="text-xs font-semibold text-slate-500 mb-1" style={{ letterSpacing: '0.06em' }}>VISIBLE PRICE</p>
                <p className={`text-4xl font-bold ${productivityValue >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {productivityValue >= 0 ? '+' : ''}{productivityValue.toFixed(2)}
                </p>
                <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  isProductivityUp ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {isProductivityUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{dayMove >= 0 ? '+' : ''}{dayMove.toFixed(2)}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <p className="text-xs text-slate-500 font-semibold mb-1">STREAK</p>
                  <p className="text-lg font-bold text-slate-800">{chartData.latestProductivity.streak}d</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <p className="text-xs text-slate-500 font-semibold mb-1">GOAL HIT</p>
                  <p className="text-lg font-bold text-slate-800">{chartData.latestProductivity.goalCompletionPercent}%</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <p className="text-xs text-slate-500 font-semibold mb-1">FOCUS</p>
                  <p className="text-lg font-bold text-slate-800">{chartData.latestProductivity.focusQuality}%</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <p className="text-xs text-slate-500 font-semibold mb-1">CONSISTENCY</p>
                  <p className="text-lg font-bold text-slate-800">{chartData.latestProductivity.consistencyScore}%</p>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <ResponsiveContainer width="100%" height={290}>
                <LineChart data={chartData.productivityIndexData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px', fontWeight: '500' }} />
                  <YAxis
                    stroke="#64748b"
                    style={{ fontSize: '12px', fontWeight: '500' }}
                    tickFormatter={(value) => `${value > 0 ? '+' : ''}${value}`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px' }}
                    formatter={(value, name) => {
                      if (name === 'visiblePrice') {
                        return [`${value >= 0 ? '+' : ''}${Number(value).toFixed(2)}`, 'Visible Price'];
                      }
                      return [value, name];
                    }}
                    labelFormatter={(label, payload) => {
                      const current = payload?.[0]?.payload;
                      if (current?.isoDate === 'start') return 'Start (Base 100)';
                      return current?.isoDate ? formatDayMonth(current.isoDate) : label;
                    }}
                  />
                  <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="4 4" />
                  <Line
                    type="monotone"
                    dataKey="visiblePrice"
                    stroke={productivityLineColor}
                    strokeWidth={3}
                    dot={({ cx, cy, payload }) => (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={payload.isoDate === 'start' ? 3 : 4}
                        fill={payload.isoDate === 'start' ? '#94a3b8' : payload.dailyChangePercent >= 0 ? '#16a34a' : '#dc2626'}
                        stroke="#ffffff"
                        strokeWidth={1.5}
                      />
                    )}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={chartData.productivityIndexData.filter(item => item.isoDate !== 'start')}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '11px', fontWeight: '500' }} />
                  <YAxis
                    stroke="#64748b"
                    style={{ fontSize: '11px', fontWeight: '500' }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px' }}
                    formatter={(value) => [`${value >= 0 ? '+' : ''}${Number(value).toFixed(2)}%`, 'Daily Move']}
                  />
                  <ReferenceLine y={0} stroke="#94a3b8" />
                  <Bar dataKey="dailyChangePercent" radius={[4, 4, 0, 0]}>
                    {chartData.productivityIndexData
                      .filter(item => item.isoDate !== 'start')
                      .map((entry, index) => (
                        <Cell key={`move-cell-${index}`} fill={entry.dailyChangePercent >= 0 ? '#16a34a' : '#dc2626'} />
                      ))
                    }
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800 mb-1" style={{ letterSpacing: '0.05em' }}>Daily Study Hours</h2>
          <p className="text-sm text-slate-500 mb-4">Your study consistency and peak performance over time.</p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData.studyHoursData}>
              <defs>
                <linearGradient id="studyHoursRed" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#fca5a5" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
                <linearGradient id="studyHoursBlue" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#93c5fd" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
                <linearGradient id="studyHoursGreen" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#86efac" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
                <linearGradient id="studyHoursEmerald" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="#6ee7b7" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="#eef2f7" />
              <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px', fontWeight: '500' }} />
              <YAxis
                stroke="#64748b"
                style={{ fontSize: '12px', fontWeight: '500' }}
                domain={[0, yAxisMax]}
                ticks={yAxisTicks}
              />
              <Tooltip content={<StudyHoursTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }} />
              <Bar
                dataKey="studyHours"
                radius={[8, 8, 0, 0]}
                animationDuration={900}
                animationEasing="ease-in-out"
                activeBar={renderActiveStudyBar}
              >
                {chartData.studyHoursData.map((entry, index) => (
                  <Cell key={`study-hours-cell-${index}`} fill={getStudyHoursGradient(entry.studyHours)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800 mb-4" style={{ letterSpacing: '0.05em' }}>TARGET VS COMPLETION RATE</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.targetCompletionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px', fontWeight: '500' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px', fontWeight: '500' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px' }}
                formatter={(value, name, props) => [`${value}% (${props.payload.completed}/${props.payload.total})`, 'Completion Rate']}
              />
              <Bar dataKey="rate" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800 mb-4" style={{ letterSpacing: '0.05em' }}>NEWSPAPER</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.newspaperData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px', fontWeight: '500' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px', fontWeight: '500' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px' }}
                formatter={(value, name, props) => [props.payload.status, 'Status']}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.newspaperData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.value === 100 ? '#10b981' : entry.value === 50 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800 mb-4" style={{ letterSpacing: '0.05em' }}>SUBJECT</h2>
          {chartData.subjectWiseData.length === 0 ? (
            <p className="text-sm text-slate-500">No subject selections yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={chartData.subjectWiseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ subject, count }) => `${subject}: ${count}`}
                  outerRadius={100}
                  dataKey="count"
                  nameKey="subject"
                >
                  {chartData.subjectWiseData.map((entry, index) => (
                    <Cell key={`subject-cell-${entry.subject}`} fill={SUBJECT_COLORS[index % SUBJECT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px' }}
                  formatter={(value) => [value, 'Selected Days']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800 mb-4" style={{ letterSpacing: '0.05em' }}>STUDY QUALITY RATING</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.ratingData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ rating, count }) => `${rating}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {chartData.ratingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800 mb-4" style={{ letterSpacing: '0.05em' }}>SPACED PROGRESS</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.spacedRepetitionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="interval" stroke="#64748b" style={{ fontSize: '12px', fontWeight: '500' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px', fontWeight: '500' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="#14b8a6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-emerald-600 mx-auto mb-4 animate-pulse" />
          <p className="text-slate-700 text-xl font-semibold">Loading Chaduvu...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { page: 'home', label: 'Home' },
    { page: 'data', label: 'Room' },
    { page: 'analysis', label: 'Board' }
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setShowMobileMenu(false);
  };

  return (
    <div className={`min-h-screen ${currentPage === 'home' ? 'bg-white' : 'bg-slate-50'}`}>
      <nav className="bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <h1
              className="text-3xl font-semibold text-slate-900"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', letterSpacing: '-0.02em' }}
            >
              {'\u0c38\u0c26\u0c41\u0c35\u0c41'}
            </h1>
            <button
              onClick={() => setShowMobileMenu((prev) => !prev)}
              className="md:hidden text-slate-700 hover:text-slate-900 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <div className="hidden md:flex items-center justify-center gap-5 mt-2">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => handlePageChange(item.page)}
                className={`text-sm font-medium transition-colors underline-offset-4 ${
                  currentPage === item.page
                    ? 'text-emerald-700 underline'
                    : 'text-slate-600 hover:text-emerald-700 hover:underline'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {showMobileMenu && (
            <div className="md:hidden mt-2 pt-2 border-t border-slate-200 flex flex-col items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => handlePageChange(item.page)}
                  className={`text-sm py-1 transition-colors underline-offset-4 ${
                    currentPage === item.page
                      ? 'text-emerald-700 underline'
                      : 'text-slate-600 hover:text-emerald-700 hover:underline'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'data' && <DataPage />}
        {currentPage === 'analysis' && <AnalysisPage />}
      </main>

      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 text-center" />
      </footer>
    </div>
  );
};

export default Chaduvu;
