import React, { useState, useEffect } from 'react';
import logo from './assets/logo.png';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Calendar, CheckCircle2, Circle, Plus, X, ChevronLeft, ChevronRight, BookOpen, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

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
  const [showTabMenu, setShowTabMenu] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 768;
  });
  
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
    const getTomorrowDateKey = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return getLocalDateKey(tomorrow);
    };
    const tomorrowKey = getTomorrowDateKey();

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
            const isTomorrow = dateStr === tomorrowKey;
            return (
              <button
                key={idx}
                onClick={() => onSelectDate(dateStr)}
                className={`p-2 text-sm rounded-lg transition-all relative ${
                  isSelected
                    ? 'bg-[#10B981] text-white font-semibold shadow-sm'
                    : 'hover:bg-emerald-50 text-slate-700'
                }`}
              >
                {day.getDate()}
                {isTomorrow && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Home Page Component
  const HomePage = () => {
    const BookPencilIllustration = () => (
      <svg viewBox="0 0 120 120" className="w-32 h-auto mx-auto" role="img" aria-label="Book and pencil illustration">
        {/* Book */}
        <rect x="20" y="30" width="60" height="50" rx="3" fill="#4F46E5" />
        <rect x="25" y="35" width="50" height="40" rx="2" fill="#FFFFFF" />
        <line x1="35" y1="45" x2="65" y2="45" stroke="#E5E7EB" strokeWidth="2" />
        <line x1="35" y1="55" x2="65" y2="55" stroke="#E5E7EB" strokeWidth="2" />
        <line x1="35" y1="65" x2="55" y2="65" stroke="#E5E7EB" strokeWidth="2" />
        {/* Pencil */}
        <rect x="75" y="25" width="8" height="50" rx="2" fill="#FBBF24" transform="rotate(15 79 50)" />
        <polygon points="78,18 74,10 82,10" fill="#FBBF24" transform="rotate(15 78 14)" />
        <rect x="77" y="70" width="4" height="8" rx="1" fill="#374151" transform="rotate(15 79 74)" />
      </svg>
    );

    const greetings = [
      'Hii Umesh, Keep Going Ummi',
      'Great you are here Ummi',
      'Perfect going Great',
      'Welcome Umesh',
      'Happy Man Umesh'
    ];

    const getRandomGreeting = () => {
      const seed = selectedDate.split('-').reduce((acc, val) => acc + parseInt(val), 0);
      return greetings[seed % greetings.length];
    };

    const getHomeTodayTasks = () => {
      const todayData = studyData[selectedDate] || {};
      const todayTasks = todayData.tomorrowTasks || [];
      const completedTasks = todayData.completedTasks || [];
      const subjectTasks = todayData.subjectTasks || {};

      const yesterday = parseDateKey(selectedDate);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = formatDateKey(yesterday);
      const yesterdayData = studyData[yesterdayStr] || {};
      const yesterdayTasks = yesterdayData.tomorrowTasks || [];
      const yesterdayCompleted = yesterdayData.completedTasks || [];
      const carriedForwardTasks = yesterdayTasks.filter(task => !yesterdayCompleted.includes(task));

      // Group tasks by subject
      const tasksBySubject = {};
      
      // Add carried forward tasks
      carriedForwardTasks.forEach(task => {
        const subject = 'Carried Forward';
        if (!tasksBySubject[subject]) tasksBySubject[subject] = [];
        tasksBySubject[subject].push(task);
      });

      // Add today's tasks grouped by subject from subjectTasks
      const savedSubjects = todayData.planSubjects || [];
      savedSubjects.forEach(subject => {
        const tasks = subjectTasks[subject] || [];
        if (tasks.length > 0) {
          if (!tasksBySubject[subject]) tasksBySubject[subject] = [];
          tasksBySubject[subject].push(...tasks);
        }
      });

      return {
        tasksBySubject,
        carriedForwardCount: carriedForwardTasks.length,
        completedTasks,
        allTasks: [...carriedForwardTasks, ...todayTasks]
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
        {/* Greeting Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800">{getRandomGreeting()}</h2>
        </div>

        <div className="space-y-8">
          {/* New Section - Today's Tasks */}
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-3" style={{ letterSpacing: '0.05em' }}>New</h3>
            
            {Object.keys(homeToday.tasksBySubject).length === 0 ? (
              <div className="py-10 text-center">
                <BookPencilIllustration />
              </div>
            ) : (
              <div className="space-y-4">
                {homeToday.carriedForwardCount > 0 && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm text-amber-800 font-semibold">
                      {homeToday.carriedForwardCount} carried forward from yesterday
                    </p>
                  </div>
                )}
                
                {Object.entries(homeToday.tasksBySubject).map(([subject, subjectTasks]) => (
                  <div key={subject} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-3 bg-white border-b border-slate-200">
                      <span className="text-sm font-semibold text-[#2563EB]">{subject}</span>
                      <span className="ml-2 text-xs text-slate-500">({subjectTasks.length} {subjectTasks.length === 1 ? 'task' : 'tasks'})</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {subjectTasks.map((task, idx) => (
                        <div
                          key={`${subject}-${idx}`}
                          className={`flex items-center gap-3 p-4 transition-colors ${
                            homeToday.completedTasks.includes(task)
                              ? 'bg-[#ECFDF5] border-l-4 border-l-[#10B981]'
                              : 'bg-white hover:bg-slate-50'
                          }`}
                        >
                          <button onClick={() => toggleHomeTaskCompletion(task)} className="flex-shrink-0">
                            {homeToday.completedTasks.includes(task) ? (
                              <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                            ) : (
                              <Circle className="w-5 h-5 text-slate-400" />
                            )}
                          </button>
                          <span className={`flex-1 font-medium ${homeToday.completedTasks.includes(task) ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                            {task}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-3" style={{ letterSpacing: '0.05em' }}>Spaced</h3>
            {Object.keys(spacedTasks).length === 0 ? (
              <div className="py-10 text-center">
                <BookPencilIllustration />
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
                            <Circle className="w-5 h-5 text-[#10B981] hover:text-emerald-700" />
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
      subjectTasks: {}
    });

    const currentData = studyData[postDate] || getDefaultDayData(postDate);
    const [formData, setFormData] = useState(currentData);

    // Initialize planDate - try to get from localStorage first, otherwise default to tomorrow
    const getInitialPlanDate = () => {
      const saved = localStorage.getItem('saduvu_planDate');
      if (saved) return saved;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return getLocalDateKey(tomorrow);
    };
    const [planDate, setPlanDate] = useState(getInitialPlanDate);
    const [showPlanCalendar, setShowPlanCalendar] = useState(false);
    const [newPlan, setNewPlan] = useState('');
    const [showPostSaved, setShowPostSaved] = useState(false);
    const [selectedPlanSubject, setSelectedPlanSubject] = useState('');

    // Persist planDate to localStorage whenever it changes
    useEffect(() => {
      localStorage.setItem('saduvu_planDate', planDate);
    }, [planDate]);
    const planSubjects = (studyData[planDate]?.planSubjects) || [];

    useEffect(() => {
      const data = studyData[postDate] || getDefaultDayData(postDate);
      setFormData(data);
    }, [postDate, studyData]);

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
      // Show success indicator
      setShowPostSaved(true);
      setTimeout(() => setShowPostSaved(false), 2000);
    };

    const planItems = (studyData[planDate]?.tomorrowTasks) || [];
    const plannedDatesSummary = [planDate].filter((date) => ((studyData[date]?.tomorrowTasks || []).length > 0) || ((studyData[date]?.planSubjects || []).length > 0)).map((date) => ({
      date,
      tasks: studyData[date].tomorrowTasks || [],
      subjects: studyData[date].planSubjects || []
    }));

    // Group plans by subject for current selected date
    const currentDateData = studyData[planDate] || { tomorrowTasks: [], planSubjects: [] };
    const currentTasks = currentDateData.tomorrowTasks || [];
    const currentSubjects = currentDateData.planSubjects || [];

    // Group tasks by subject for display - show only subjects with tasks, in order by planSubjects array
    const currentSubjectTasks = currentDateData.subjectTasks || {};
    const tasksBySubject = currentSubjects
      .filter(subject => currentSubjectTasks[subject] && currentSubjectTasks[subject].length > 0)
      .map(subject => ({
        subject,
        tasks: currentSubjectTasks[subject] || []
      }));

    const addPlanItem = async () => {
      if (!newPlan.trim()) return;
      if (!selectedPlanSubject) return;
      const existing = studyData[planDate] || getDefaultDayData(planDate);
      const subjectTasks = existing.subjectTasks || {};
      const subjectTaskList = subjectTasks[selectedPlanSubject] || [];
      const savedSubjects = existing.planSubjects || [];
      const updatedSubjects = savedSubjects.includes(selectedPlanSubject)
        ? savedSubjects
        : [...savedSubjects, selectedPlanSubject];
      const newStudyData = {
        ...studyData,
        [planDate]: {
          ...existing,
          planSubjects: updatedSubjects,
          subjectTasks: {
            ...subjectTasks,
            [selectedPlanSubject]: [...subjectTaskList, newPlan.trim()]
          }
        }
      };
      setStudyData(newStudyData);
      setNewPlan('');
      await saveData(newStudyData, tasks);
    };

    const removePlanItem = async (subject, index, date = planDate) => {
      const existing = studyData[date] || getDefaultDayData(date);
      const subjectTasks = existing.subjectTasks || {};
      const subjectTaskList = subjectTasks[subject] ? [...subjectTasks[subject]] : [];
      subjectTaskList.splice(index, 1);
      const newStudyData = {
        ...studyData,
        [date]: {
          ...existing,
          subjectTasks: {
            ...subjectTasks,
            [subject]: subjectTaskList
          }
        }
      };
      setStudyData(newStudyData);
      await saveData(newStudyData, tasks);
    };

    const togglePlanSubject = (subject) => {
      // Keep subject selection temporary; persist only when a plan is added
      setSelectedPlanSubject((prev) => (prev === subject ? '' : subject));
    };

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h2 className="text-3xl font-medium text-gray-600 mb-6" style={{ letterSpacing: '0.06em' }}>Post</h2>

          <div className="mb-6">
            <div className="w-full flex items-center gap-3 px-5 py-4 border border-[#10B981] rounded-xl bg-[#ECFDF5]">
              <Calendar className="w-5 h-5 text-[#10B981]" />
              <span className="font-semibold text-slate-800">{formatDisplayDate(postDate)}</span>
              <span className="ml-auto text-base font-semibold text-[#10B981]">Today Only</span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-600 mb-2" style={{ letterSpacing: '0.05em' }}>Hours Studied</label>
            <input
              type="number"
              min="0"
              max="24"
              step="0.5"
              value={formData.hoursStudied}
              onChange={(e) => setFormData({ ...formData, hoursStudied: parseFloat(e.target.value) || 0 })}
              className="w-full px-5 py-4 border border-[#E5E7EB] rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none text-slate-800 font-semibold bg-[#F9FAFB] transition-colors"
            />
          </div>

          <div className="mb-6">
            <h3 className="block text-lg font-semibold text-gray-600 mb-2" style={{ letterSpacing: '0.05em' }}>Quality Study</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFormData({ ...formData, studyRating: star })}
                  className={`text-2xl hover:scale-110 transition-transform ${star <= formData.studyRating ? 'text-amber-400' : 'text-gray-300'}`}
                >
                  {star <= formData.studyRating ? '★' : '☆'}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="block text-lg font-semibold text-gray-600 mb-2" style={{ letterSpacing: '0.05em' }}>Newspaper</h3>
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
                          ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-[#2563EB]'
                      }`}
                    >
                      {status === 'not-yet' ? 'Not Yet' : status === 'partial' ? 'Partial' : 'Completed'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={saveFormData}
              className="px-5 py-2 bg-[#10B981] text-white text-sm font-semibold rounded-lg hover:bg-[#0d9668] transition-colors shadow-sm"
            >
              {showPostSaved ? 'Saved ✓' : 'Save'}
            </button>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h2 className="text-3xl font-medium text-gray-600 mb-6" style={{ letterSpacing: '0.06em' }}>Plan</h2>

          <div className="mb-6 relative">
            <button
              onClick={() => setShowPlanCalendar(!showPlanCalendar)}
              className="w-full flex items-center gap-3 px-5 py-4 border border-slate-300 rounded-xl hover:border-[#2563EB] transition-colors bg-white"
            >
              <Calendar className="w-5 h-5 text-[#2563EB]" />
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
            <h3 className="block text-lg font-semibold text-gray-600 mb-2" style={{ letterSpacing: '0.05em' }}>Subjects</h3>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_OPTIONS.map((subject) => (
                <button
                  key={subject}
                  onClick={() => togglePlanSubject(subject)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                    selectedPlanSubject === subject
                      ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-sm'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-[#2563EB]'
                  }`}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newPlan}
              onChange={(e) => setNewPlan(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPlanItem()}
              placeholder={selectedPlanSubject ? "Add a list item..." : "Select a subject first"}
              disabled={!selectedPlanSubject}
              className={`flex-1 px-5 py-3 border border-[#E5E7EB] rounded-xl focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 focus:outline-none bg-[#F9FAFB] text-slate-800 font-medium placeholder-slate-400 ${!selectedPlanSubject ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
            <button
              onClick={addPlanItem}
              disabled={!selectedPlanSubject}
              className={`px-5 py-3 rounded-xl transition-colors shadow-sm ${selectedPlanSubject ? 'bg-[#2563EB] text-white hover:bg-[#1d4ed8]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-700 mb-3" style={{ letterSpacing: '0.04em' }}>List</h3>
            <div className="space-y-4">
              {tasksBySubject.map((subjectGroup) => (
                <div key={subjectGroup.subject} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                    <span className="text-sm font-semibold text-[#2563EB]">{subjectGroup.subject}</span>
                    <span className="ml-2 text-xs text-slate-500">({subjectGroup.tasks.length} plans)</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {subjectGroup.tasks.map((task, idx) => (
                      <div key={`${planDate}-${idx}`} className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm text-slate-700">{idx + 1}. {task}</span>
                        <button
                          onClick={() => removePlanItem(subjectGroup.subject, idx, planDate)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {tasksBySubject.length === 0 && (
                <p className="text-base text-slate-500">No Plans</p>
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
        const totalTasks = (day.tomorrowTasks || []).length;
        const completedTasks = (day.completedTasks || []).length;
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
        const data = studyData[date];
        const totalTasks = (data.tomorrowTasks || []).length;
        const completedTasks = (data.completedTasks || []).length;
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
        count: dates.filter((date) => (studyData[date].planSubjects || []).includes(subject)).length
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
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <p className="text-xs font-semibold text-slate-500 mb-1">{item.fullDate}</p>
          <p className="text-sm font-semibold text-slate-800">Study Time: {hours.toFixed(1)} hours</p>
          {hours >= 12 && (
            <span className="inline-flex mt-2 px-2 py-1 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#10B981]">
              🔥 Peak Performance
            </span>
          )}
        </div>
      );
    };

    return (
      <div className="space-y-8">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col xl:flex-row gap-6">
            <div className="xl:w-80 flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-5 h-5 text-slate-700" />
                <h2 className="text-xl font-semibold text-slate-800" style={{ letterSpacing: '0.05em' }}>Source</h2>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 mb-4">
                <p className="text-base font-semibold text-slate-500 mb-1" style={{ letterSpacing: '0.06em' }}>Visible Price</p>
                <p className={`text-4xl font-bold ${productivityValue >= 0 ? 'text-[#10B981]' : 'text-rose-600'}`}>
                  {productivityValue >= 0 ? '+' : ''}{productivityValue.toFixed(2)}
                </p>
                <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  isProductivityUp ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-rose-100 text-rose-700'
                }`}>
                  {isProductivityUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{dayMove >= 0 ? '+' : ''}{dayMove.toFixed(2)}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <p className="text-base text-slate-500 font-semibold mb-1">Streak</p>
                  <p className="text-lg font-bold text-slate-800">{chartData.latestProductivity.streak}d</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <p className="text-base text-slate-500 font-semibold mb-1">Goal Hit</p>
                  <p className="text-lg font-bold text-slate-800">{chartData.latestProductivity.goalCompletionPercent}%</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <p className="text-base text-slate-500 font-semibold mb-1">Focus</p>
                  <p className="text-lg font-bold text-slate-800">{chartData.latestProductivity.focusQuality}%</p>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 bg-white">
                  <p className="text-base text-slate-500 font-semibold mb-1">Consistency</p>
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
          <h2 className="text-2xl font-medium text-gray-600 mb-4" style={{ letterSpacing: '0.05em' }}>Daily Study Hours</h2>
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
          <h2 className="text-2xl font-medium text-gray-600 mb-4" style={{ letterSpacing: '0.05em' }}>Target Vs Completion Rate</h2>
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
          <h2 className="text-2xl font-medium text-gray-600 mb-4" style={{ letterSpacing: '0.05em' }}>Newspaper</h2>
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
          <h2 className="text-2xl font-medium text-gray-600 mb-4" style={{ letterSpacing: '0.05em' }}>Subject-Wise Plan</h2>
          {chartData.subjectWiseData.length === 0 ? (
            <p className="text-base text-slate-500">No subject selections yet.</p>
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
            <h2 className="text-2xl font-medium text-gray-600 mb-4" style={{ letterSpacing: '0.05em' }}>Study Quality Rating</h2>
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
            <h2 className="text-2xl font-medium text-gray-600 mb-4" style={{ letterSpacing: '0.05em' }}>Spaced Progress</h2>
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

  const CalendarPage = () => {
    const [currentMonth, setCurrentMonth] = useState(() => {
      const today = new Date();
      return new Date(today.getFullYear(), today.getMonth(), 1);
    });
    const [selectedCalendarDate, setSelectedCalendarDate] = useState(() => getLocalDateKey(new Date()));

    // Keep currentMonth in sync with selectedCalendarDate
    useEffect(() => {
      const selectedDate = parseDateKey(selectedCalendarDate);
      const monthToShow = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      setCurrentMonth(monthToShow);
    }, [selectedCalendarDate]);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getCalendarDays = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startingDay = firstDay.getDay();

      const days = [];
      for (let i = 0; i < startingDay; i++) {
        days.push(null);
      }
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
      }
      return days;
    };

    const calendarDays = getCalendarDays(currentMonth);
    const todayKey = getLocalDateKey(new Date());
    const selectedDayData = studyData[selectedCalendarDate] || {};
    const selectedTasks = selectedDayData.tomorrowTasks || [];
    const selectedSubjects = selectedDayData.planSubjects || [];
    const selectedPlans = [...selectedTasks, ...selectedSubjects];

    const plannedDates = Object.keys(studyData)
      .filter((date) => ((studyData[date]?.tomorrowTasks || []).length > 0) || ((studyData[date]?.planSubjects || []).length > 0))
      .sort();

    const nextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    return (
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-slate-50">
            <button
              onClick={prevMonth}
              className="p-2 rounded-lg hover:bg-slate-200 transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-800" style={{ letterSpacing: '0.03em' }}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 rounded-lg hover:bg-slate-200 transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>
          </div>

          <div className="grid grid-cols-7 border-b border-slate-200">
            {weekDays.map((day) => (
              <div key={day} className="py-3 text-center text-xs sm:text-sm font-semibold text-slate-500 bg-white">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((day, idx) => {
              if (!day) {
                return <div key={`empty-${idx}`} className="h-24 sm:h-28 border-r border-b border-slate-100 bg-slate-50/50" />;
              }

              const dateKey = getLocalDateKey(day);
              const dayData = studyData[dateKey] || {};
              const taskCount = (dayData.tomorrowTasks || []).length;
              const subjectCount = (dayData.planSubjects || []).length;
              const totalActivities = taskCount + subjectCount;
              const isToday = dateKey === todayKey;
              const isSelected = dateKey === selectedCalendarDate;

              return (
                <button
                  key={dateKey}
                  onClick={() => setSelectedCalendarDate(dateKey)}
                  className={`h-24 sm:h-28 p-2 border-r border-b border-slate-100 text-left transition-colors ${
                    isSelected ? 'bg-[#ECFDF5]' : 'bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`text-sm font-semibold rounded-full w-7 h-7 flex items-center justify-center ${
                        isToday ? 'bg-[#2563EB] text-white' : 'text-slate-700'
                      }`}
                    >
                      {day.getDate()}
                    </span>
                    {totalActivities > 0 && (
                      <span className="text-[10px] sm:text-xs font-semibold text-[#2563EB] bg-blue-100 px-2 py-0.5 rounded-full">
                        {totalActivities}
                      </span>
                    )}
                  </div>

                  {taskCount > 0 && (
                    <p className="mt-2 text-[10px] sm:text-xs text-slate-600 truncate">{taskCount} plan item{taskCount > 1 ? 's' : ''}</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <h3 className="text-lg font-semibold text-slate-800" style={{ letterSpacing: '0.03em' }}>
            {formatDisplayDate(selectedCalendarDate)}
          </h3>

          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-2">Plans</p>
              {selectedPlans.length > 0 ? (
                <div className="space-y-2">
                  {selectedPlans.map((item, idx) => (
                    <div key={`${selectedCalendarDate}-plan-${idx}`} className="px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-700 bg-slate-50">
                      {item}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No plans</p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200">
              <p className="text-xs text-slate-500">
                Planned days: <span className="font-semibold text-slate-700">{plannedDates.length}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-[#2563EB] mx-auto mb-4 animate-pulse" />
          <p className="text-slate-700 text-xl font-semibold">Loading Chaduvu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentPage === 'home' ? 'bg-white' : 'bg-white'}`}>
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 h-16">
          <div
            className="h-full flex items-center"
            style={{ fontFamily: '"Google Sans", "Product Sans", Inter, Arial, sans-serif', letterSpacing: '0.01em' }}
          >
            <div className="flex-1 flex items-center justify-start min-w-0">
              <img src={logo} alt="Saduvu" className="h-12 w-auto" />
            </div>

            <nav className="flex-1 flex items-center justify-center gap-8 text-sm sm:text-base font-normal text-[#3c4043]">
              <button
                onClick={() => setCurrentPage('home')}
                className={`border-b-2 transition-colors duration-150 ${
                  currentPage === 'home'
                    ? 'border-[#2563EB] text-[#2563EB]'
                    : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentPage('data')}
                className={`border-b-2 transition-colors duration-150 ${
                  currentPage === 'data'
                    ? 'border-[#2563EB] text-[#2563EB]'
                    : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                Room
              </button>
              <button
                onClick={() => setCurrentPage('analysis')}
                className={`border-b-2 transition-colors duration-150 ${
                  currentPage === 'analysis'
                    ? 'border-[#2563EB] text-[#2563EB]'
                    : 'border-transparent hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                Board
              </button>
            </nav>

            <div className="flex-1 flex items-center justify-end">
              <button
                onClick={() => setCurrentPage('calendar')}
                className={`text-white text-sm sm:text-base font-medium rounded-lg px-5 py-2 transition-colors duration-150 shadow-sm ${
                  currentPage === 'calendar' ? 'bg-[#1d4ed8]' : 'bg-[#2563EB] hover:bg-[#1d4ed8]'
                }`}
              >
                Calendar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="page-content max-w-7xl mx-auto px-6 sm:px-8 py-10">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'data' && <DataPage />}
        {currentPage === 'analysis' && <AnalysisPage />}
        {currentPage === 'calendar' && <CalendarPage />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-300 mt-20">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 text-center" />
      </footer>
    </div>
  );
};

export default Chaduvu;


