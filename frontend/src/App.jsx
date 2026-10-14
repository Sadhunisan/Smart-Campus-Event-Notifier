import { Link, NavLink, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import api from './api/axios';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const formatDate = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  return isNaN(date) ? value : date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const classNames = (...classes) => classes.filter(Boolean).join(' ');

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/admin/register"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminShell>
              <AdminRegisterPage />
            </AdminShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentShell>
              <DashboardPage />
            </StudentShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <StudentShell>
            <EventsPage />
          </StudentShell>
        }
      />
      <Route
        path="/events/:id"
        element={
          <StudentShell>
            <EventDetailsPage />
          </StudentShell>
        }
      />
      <Route
        path="/my-events"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentShell>
              <MyEventsPage />
            </StudentShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentShell>
              <NotificationsPage />
            </StudentShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/announcements"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentShell>
              <AnnouncementsPage />
            </StudentShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRole="student">
            <StudentShell>
              <ProfilePage />
            </StudentShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminShell>
              <AdminDashboardPage />
            </AdminShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/events"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminShell>
              <ManageEventsPage />
            </AdminShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/events/add"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminShell>
              <ManageEventsPage />
            </AdminShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/events/edit/:id"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminShell>
              <ManageEventsPage />
            </AdminShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminShell>
              <ManageStudentsPage />
            </AdminShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/registrations"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminShell>
              <ManageRegistrationsPage />
            </AdminShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/announcements"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminShell>
              <ManageAnnouncementsPage />
            </AdminShell>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function StudentShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;
    api
      .get('/notifications')
      .then((res) => setNotifications(res.data))
      .catch(() => setNotifications([]));
  }, [user]);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <div className="student-shell min-h-screen text-slate-800">
      <header className="student-header sticky top-0 z-20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-500 font-bold text-white shadow-lg shadow-cyan-500/30">
              SC
            </div>
            <div>
              <div className="text-lg font-bold text-white">Smart Campus</div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-sky-200/80">Notifier</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <NavLink className={({ isActive }) => classNames('text-sm font-medium transition', isActive ? 'text-cyan-300' : 'text-slate-200 hover:text-white')} to="/dashboard">Dashboard</NavLink>
            <NavLink className={({ isActive }) => classNames('text-sm font-medium transition', isActive ? 'text-cyan-300' : 'text-slate-200 hover:text-white')} to="/events">Events</NavLink>
            <NavLink className={({ isActive }) => classNames('text-sm font-medium transition', isActive ? 'text-cyan-300' : 'text-slate-200 hover:text-white')} to="/my-events">My Events</NavLink>
            <NavLink className={({ isActive }) => classNames('text-sm font-medium transition', isActive ? 'text-cyan-300' : 'text-slate-200 hover:text-white')} to="/announcements">Announcements</NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/notifications" className="relative rounded-full border border-sky-300/20 bg-white/5 p-2 text-slate-100 transition hover:border-cyan-300/60 hover:text-cyan-200">
              🔔
              {unreadCount > 0 && <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">{unreadCount}</span>}
            </Link>
            <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 sm:flex">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-cyan-400 text-sm font-bold text-white">{user?.name?.charAt(0) || 'S'}</span>
              <div className="text-left">
                <div className="text-sm font-semibold text-white">{user?.name}</div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-sky-200/75">Student</div>
              </div>
            </div>
            <button
              className="soft-button rounded-lg px-3 py-2 text-sm font-medium text-white"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}

function AdminShell({ children }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: '/admin/dashboard', label: 'Overview' },
    { to: '/admin/events', label: 'Manage Events' },
    { to: '/admin/events/add', label: 'Add Event' },
    { to: '/admin/students', label: 'Students' },
    { to: '/admin/registrations', label: 'Registrations' },
    { to: '/admin/announcements', label: 'Announcements' },
    { to: '/admin/register', label: 'Create Admin' },
  ];

  return (
    <div className="admin-shell min-h-screen text-slate-800">
      <div className="flex min-h-screen">
        <aside className="admin-sidebar hidden w-72 p-6 text-slate-100 lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-400 font-bold text-white shadow-lg shadow-cyan-500/20">SC</div>
            <div>
              <div className="text-lg font-bold">Smart Campus</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-violet-200">Admin Panel</div>
            </div>
          </div>

          <nav className="space-y-2">
            {links.map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) => classNames('block rounded-xl px-4 py-3 text-sm font-medium transition', isActive ? 'bg-white/12 text-white shadow-lg shadow-violet-500/10' : 'text-slate-300 hover:bg-white/5 hover:text-white')}>
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Signed in</div>
            <div className="mt-2 text-lg font-semibold text-white">{user?.name}</div>
            <button
              className="soft-button mt-4 w-full rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white"
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium uppercase tracking-[0.2em] text-sky-600">Admin workspace</div>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">Campus operations</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm font-medium text-slate-700 sm:inline">{user?.name} · Admin</span>
              <Link to="/dashboard" className="hidden rounded-xl border border-violet-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm md:inline-flex">Student site</Link>
              <button className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white" onClick={() => { logout(); navigate('/admin/login'); }}>Logout</button>
            </div>
          </div>
          <nav className="mb-5 flex gap-2 overflow-x-auto pb-2 lg:hidden">
            {links.map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) => classNames('shrink-0 rounded-lg border px-3 py-2 text-sm font-medium', isActive ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700')}>
                {label}
              </NavLink>
            ))}
          </nav>
          {children}
        </main>
      </div>
    </div>
  );
}

function LandingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    api.get('/announcements').then(({ data }) => setAnnouncements(data.slice(0, 3))).catch(() => setAnnouncements([]));
  }, []);

  const goToEvents = () => {
    navigate('/events');
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="landing-shell min-h-screen text-white">
      <div className="floating-orb orb-one" />
      <div className="floating-orb orb-two" />
      <div className="floating-orb orb-three" />

      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 font-bold text-white shadow-lg shadow-cyan-500/40">SC</div>
          <div>
            <div className="text-lg font-bold">Smart Campus</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-slate-300">Event Notifier</div>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-slate-200 md:flex">
          <a href="#home" className="nav-link">Home</a>
          <a href="#events" className="nav-link">Events</a>
          <a href="#announcements" className="nav-link">Announcements</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/login" className="rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:border-cyan-300/60 hover:bg-cyan-400/10">Login</Link>
          <Link to="/register" className="pulse-button rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30">Register</Link>
        </div>
      </header>

      <main>
        <section id="home" className="reveal mx-auto grid max-w-7xl gap-10 px-4 pb-16 pt-8 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pt-16">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center rounded-full border border-blue-400/40 bg-blue-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-blue-200">Campus Updates</div>
            <h1 className="max-w-xl text-4xl font-black leading-tight text-white sm:text-5xl xl:text-6xl">Never Miss a Campus Event Again.</h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">Stay updated with workshops, seminars, placement drives, hackathons, cultural events and important college announcements.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button onClick={goToEvents} className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-400 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-500/20">Explore Events</button>
              <button onClick={goToRegister} className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white">Get Started</button>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-300">
              <div><span className="text-2xl font-bold text-white">30+</span><div>Campus Events</div></div>
              <div><span className="text-2xl font-bold text-white">12k+</span><div>Students Engaged</div></div>
              <div><span className="text-2xl font-bold text-white">98%</span><div>Reminder Reach</div></div>
            </div>
          </div>

          <div className="relative hero-visual">
            <div className="absolute -left-8 top-10 h-40 w-40 rounded-full bg-blue-500/30 blur-3xl" />
            <div className="absolute right-6 top-14 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="glass-panel hero-card relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-slate-950/20 backdrop-blur-md">
              <div className="rounded-[24px] bg-gradient-to-br from-slate-800 to-slate-900 p-5">
                <div className="mb-5 flex items-center justify-between text-sm text-slate-300">
                  <span>Upcoming Highlights</span>
                  <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-emerald-300">Live</span>
                </div>
                <div className="space-y-4">
                  {[
                    { title: 'TCS Placement Drive', time: '10:00 AM', color: 'from-blue-500 to-cyan-400' },
                    { title: 'Python Workshop', time: '11:00 AM', color: 'from-violet-500 to-indigo-400' },
                    { title: 'Cultural Fest', time: '5:00 PM', color: 'from-orange-500 to-pink-400' },
                  ].map((item) => (
                    <div key={item.title} className="feature-card flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3">
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${item.color}`} />
                      <div className="flex-1">
                        <div className="font-semibold text-white">{item.title}</div>
                        <div className="text-sm text-slate-300">{item.time}</div>
                      </div>
                      <button className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white">View</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="events" className="reveal mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-blue-300">Explore</div>
              <h2 className="mt-2 text-3xl font-bold text-white">Student-favorite event categories</h2>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {['Workshops', 'Hackathons', 'Placement', 'Cultural'].map((category, index) => (
              <div key={category} className="feature-card rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-xl">{['🔧', '💡', '💼', '🎉'][index]}</div>
                <h3 className="text-xl font-bold text-white">{category}</h3>
                <p className="mt-2 text-sm text-slate-300">Verified campus experiences designed for skill-building and networking.</p>
              </div>
            ))}
          </div>
        </section>

        <section id="announcements" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="text-sm uppercase tracking-[0.18em] text-cyan-300">Announcements</div>
                <h2 className="mt-2 text-3xl font-bold text-white">Important updates at a glance</h2>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {announcements.map((announcement) => (
                <div key={announcement._id} className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-amber-300">{announcement.priority || 'Alert'} · {formatDate(announcement.createdAt)}</div>
                  <div className="text-lg font-semibold text-white">{announcement.title}</div>
                  <p className="mt-2 text-sm text-slate-300">{announcement.description}</p>
                </div>
              ))}
              {!announcements.length && <p className="text-sm text-slate-300">No current announcements.</p>}
            </div>
          </div>
        </section>

        <footer id="contact" className="border-t border-white/10 bg-slate-950 px-4 py-8 text-center text-sm text-slate-400 sm:px-6 lg:px-8">
          <div>Smart Campus Event Notifier • College notifications that reach students faster</div>
          <div className="mt-3 text-xs text-slate-500">Admin Portal · <Link to="/admin/login" className="text-cyan-300 hover:text-cyan-200">Admin Login</Link></div>
        </footer>
      </main>
    </div>
  );
}

function LoginPage() {
  const { login, adminLogin, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminFlow = location.pathname.startsWith('/admin');
  const registrationComplete = Boolean(location.state?.registered);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const isAdmin = String(user.role).toLowerCase() === 'admin';
    if (isAdmin) navigate('/admin/dashboard');
    else if (!isAdminFlow) navigate('/dashboard');
  }, [user, navigate, isAdminFlow]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = isAdminFlow ? await adminLogin(form) : await login(form);
      navigate(String(data.role).toLowerCase() === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell flex min-h-screen items-center justify-center p-4">
      <div className="auth-panel w-full max-w-md rounded-[30px] border border-slate-200 bg-white/80 p-7 shadow-card backdrop-blur-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-xl font-bold text-white">SC</div>
          <h1 className="text-3xl font-bold text-slate-900">{isAdminFlow ? 'Admin portal' : 'Welcome back'}</h1>
          <p className="mt-2 text-sm text-slate-500">{isAdminFlow ? 'Admin login portal' : 'Student login portal'}</p>
        </div>

        {registrationComplete && <div role="status" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">Registration successful. Please log in.</div>}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none ring-0 transition focus:border-blue-400" type="email" placeholder="college@email.com" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 outline-none ring-0 transition focus:border-blue-400" type="password" placeholder="••••••••" required />
          </div>

          <div className="flex items-center justify-between text-sm text-slate-600">
            <label className="inline-flex items-center gap-2"><input type="checkbox" /> Remember me</label>
            <Link to="/forgot-password" className="text-blue-600 hover:text-blue-500">Forgot password?</Link>
          </div>

          {error && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

          <button type="submit" disabled={loading} className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60">{loading ? 'Signing in...' : 'Login'}</button>
        </form>

        {!isAdminFlow && (
          <div className="mt-6 text-center text-sm text-slate-600">
            New here? <Link to="/register" className="font-semibold text-blue-600">Create account</Link>
          </div>
        )}
      </div>
    </div>
  );
}

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('request');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [destination, setDestination] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    if (resendCountdown <= 0) return undefined;
    const timer = setTimeout(() => setResendCountdown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const requestOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const payload = contact.includes('@') ? { email: contact } : { phone: contact };
      const { data } = await api.post('/auth/forgot-password', payload);
      setMessage(data.message);
      setDestination(data.destination || contact);
      setResendCountdown(30);
      setStep('verify');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const payload = contact.includes('@') ? { email: contact } : { phone: contact };
      const { data } = await api.post('/auth/forgot-password', payload);
      setMessage(data.message);
      setDestination(data.destination || contact);
      setOtp('');
      setResendCountdown(30);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const verifyAndReset = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const payload = contact.includes('@') ? { email: contact } : { phone: contact };
      await api.post('/auth/verify-otp', { ...payload, otp });
      const { data } = await api.post('/auth/reset-password', {
        ...payload,
        otp,
        newPassword,
        confirmPassword,
      });
      setMessage(data.message);
      setNewPassword('');
      setConfirmPassword('');
      setOtp('');
      setStep('done');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell flex min-h-screen items-center justify-center p-4">
      <div className="auth-panel w-full max-w-xl rounded-[30px] border border-slate-200 bg-white/80 p-7 shadow-card backdrop-blur-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 text-xl font-bold text-white">SC</div>
          <h1 className="text-3xl font-bold text-slate-900">Forgot password</h1>
          <p className="mt-2 text-sm text-slate-500">Receive an OTP by SMS at the phone number registered to your account.</p>
        </div>

        {step === 'request' && (
          <form onSubmit={requestOtp} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Email or phone number</label>
              <input value={contact} onChange={(e) => setContact(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" type="text" placeholder="name@college.edu or +91 9876543210" required />
            </div>
            {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</div>}
            {error && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? 'Sending...' : 'Send OTP'}</button>
            <div className="text-center text-sm text-slate-600">
              <Link to="/login" className="font-semibold text-blue-600">Back to login</Link>
            </div>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={verifyAndReset} className="space-y-4">
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800">
              OTP sent by SMS to: <strong>{destination}</strong>
            </div>
            {message && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</div>}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">OTP</label>
              <input value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" type="text" placeholder="Enter 6-digit OTP" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">New password</label>
              <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" type="password" placeholder="Enter new password" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Confirm new password</label>
              <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" type="password" placeholder="Confirm new password" required />
            </div>
            {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</div>}
            {error && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? 'Verifying...' : 'Verify OTP and reset password'}</button>
            <button type="button" disabled={loading || resendCountdown > 0} onClick={resendOtp} className="w-full text-sm font-semibold text-blue-600 disabled:text-slate-400">
              {resendCountdown > 0 ? `Resend OTP in ${resendCountdown}s` : 'Resend OTP'}
            </button>
          </form>
        )}

        {step === 'done' && (
          <div className="space-y-4 text-center">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message || 'Password reset complete.'}</div>
            <div className="text-sm text-slate-600">Redirecting to login page...</div>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminRegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const { data } = await api.post('/admin/register', form);
      setMessage(data.message);
      setForm({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create admin account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Create admin account</h2>
      <p className="mt-1 text-sm text-slate-500">Only an authenticated administrator can create another admin.</p>
      <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">Admin name
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} autoComplete="name" required className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" />
        </label>
        <label className="text-sm font-medium text-slate-700 sm:col-span-2">Admin email
          <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} type="email" autoComplete="email" required className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" />
        </label>
        <label className="text-sm font-medium text-slate-700">Password
          <input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" autoComplete="new-password" minLength="8" required className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" />
        </label>
        <label className="text-sm font-medium text-slate-700">Confirm password
          <input value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} type="password" autoComplete="new-password" minLength="8" required className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" />
        </label>
        {message && <p role="status" className="sm:col-span-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>}
        {error && <p role="alert" className="sm:col-span-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={loading} className="sm:col-span-2 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? 'Creating admin...' : 'Create admin account'}</button>
      </form>
    </section>
  );
}

function RegisterPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    year: '3rd Year',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [destination, setDestination] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    if (resendCountdown <= 0) return undefined;
    const timer = setTimeout(() => setResendCountdown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    if (!phoneVerified) {
      setError('Verify your phone number before registering.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const requestPhoneOtp = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { data } = await api.post('/auth/send-otp', { phone: form.phone });
      setCodeSent(true);
      setPhoneVerified(false);
      setDestination(data.destination);
      setOtp('');
      setMessage(data.message);
      setResendCountdown(30);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneOtp = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { data } = await api.post('/auth/verify-otp', { phone: form.phone, otp, purpose: 'registration' });
      setPhoneVerified(true);
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell flex min-h-screen items-center justify-center p-4">
      <div className="auth-panel w-full max-w-2xl rounded-[30px] border border-slate-200 bg-white/80 p-7 shadow-card backdrop-blur-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 text-xl font-bold text-white">SC</div>
          <h1 className="text-3xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500">Join your campus community</p>
        </div>

        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" type="text" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">College Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" type="email" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Phone Number</label>
            <input value={form.phone} onChange={(e) => {
              setForm({ ...form, phone: e.target.value });
              setCodeSent(false);
              setPhoneVerified(false);
              setOtp('');
              setMessage('');
            }} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" type="tel" autoComplete="tel" required />
            <button type="button" onClick={requestPhoneOtp} disabled={loading || !form.phone || phoneVerified || (codeSent && resendCountdown > 0)} className="mt-2 text-sm font-semibold text-blue-600 disabled:text-slate-400">
              {phoneVerified ? 'Phone verified' : codeSent && resendCountdown > 0 ? `Resend OTP in ${resendCountdown}s` : codeSent ? 'Resend OTP' : 'Send OTP'}
            </button>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Department</label>
            <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              {['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'MBA'].map((dept) => <option key={dept}>{dept}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Year</label>
            <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((year) => <option key={year}>{year}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" type="password" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</label>
            <input value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" type="password" required />
          </div>

          {codeSent && !phoneVerified && <div className="md:col-span-2">
            <p className="mb-2 text-sm text-slate-600">Enter the OTP sent by SMS to {destination}.</p>
            <div className="flex gap-2">
              <input value={otp} onChange={(event) => setOtp(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="6-digit OTP" required />
              <button type="button" onClick={verifyPhoneOtp} disabled={loading || otp.length !== 6} className="rounded-xl bg-slate-700 px-4 py-3 font-semibold text-white disabled:opacity-60">Verify</button>
            </div>
          </div>}

          {message && <div role="status" className="md:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</div>}
          {error && <div className="md:col-span-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div>}

          <button type="submit" disabled={loading || !phoneVerified} className="md:col-span-2 w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-700 disabled:opacity-60">{loading ? 'Creating account...' : 'Register Now'}</button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Already registered? <Link to="/login" className="font-semibold text-blue-600">Login</Link>
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, myRes, announcementRes, notificationsRes] = await Promise.all([
          api.get('/events'),
          api.get('/registrations/my-events'),
          api.get('/announcements'),
          api.get('/notifications'),
        ]);
        setEvents(eventsRes.data);
        setMyEvents(myRes.data);
        setAnnouncements(announcementRes.data.slice(0, 3));
        setNotifications(notificationsRes.data.slice(0, 3));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const upcomingCount = events.filter((event) => new Date(event.date) > new Date()).length;
  const registeredCount = myEvents.filter((reg) => reg.status === 'registered').length;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Student dashboard</div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome back</h1>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total registered events" value={registeredCount} icon="📌" color="bg-blue-500" />
        <StatsCard label="Upcoming events" value={upcomingCount} icon="📅" color="bg-indigo-500" />
        <StatsCard label="New notifications" value={notifications.filter((item) => !item.isRead).length} icon="🔔" color="bg-orange-500" />
        <StatsCard label="Latest announcements" value={announcements.length} icon="📣" color="bg-emerald-500" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recommended events</h2>
            <Link to="/events" className="text-sm font-medium text-blue-600">View all</Link>
          </div>
          {loading ? <div className="text-slate-500">Loading...</div> : (
            <div className="space-y-4">
              {events.slice(0, 3).map((event) => (
                <div key={event._id} className="flex gap-4 rounded-2xl border border-slate-200 p-3">
                  <img src={event.image || 'https://images.unsplash.com/...'} alt={event.title} className="h-20 w-24 rounded-xl object-cover" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-semibold text-slate-900">{event.title}</h3>
                      <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-700">{event.category}</span>
                    </div>
                    <div className="mt-2 text-sm text-slate-600">{formatDate(event.date)} • {event.time}</div>
                    <div className="mt-2 text-sm text-slate-600">{event.venue}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-slate-900">Latest announcements</h2>
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-slate-900">{announcement.title}</div>
                    <span className={classNames('rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]', announcement.priority === 'Urgent' ? 'bg-red-100 text-red-700' : announcement.priority === 'Important' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700')}>{announcement.priority}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{announcement.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-slate-900">Notifications</h2>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="font-medium text-slate-900">{notification.title}</div>
                  <div className="mt-1 text-sm text-slate-600">{notification.message}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventsPage() {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: 'All', date: '', department: 'All' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const query = new URLSearchParams({
          search: filters.search,
          category: filters.category,
          date: filters.date,
          department: filters.department,
        }).toString();
        const { data } = await api.get(`/events?${query}`);
        setEvents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, [filters]);

  const register = async (eventId) => {
    try {
      await api.post('/registrations', { eventId });
      navigate('/my-events');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to register for this event.');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Discover</div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Campus events</h1>
        </div>
      </div>

      <div className="mb-6 grid gap-4 rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
        <input value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} placeholder="Search event" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" />
        <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
          {['All', 'Workshop', 'Seminar', 'Placement', 'Hackathon', 'Technical', 'Cultural', 'Sports', 'Other'].map((item) => <option key={item}>{item}</option>)}
        </select>
        <input type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" />
        <select value={filters.department} onChange={(e) => setFilters({ ...filters, department: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
          {['All', 'Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil', 'MBA'].map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>

      {loading ? <div className="text-slate-500">Loading events...</div> : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <div key={event._id} className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">
              <img src={event.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80'} alt={event.title} className="h-52 w-full object-cover" />
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-700">{event.category}</span>
                  <span className="text-xs font-medium text-slate-500">Seats: {event.availableSeats}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{event.title}</h3>
                <p className="mt-3 text-sm text-slate-600">{event.description.slice(0, 110)}...</p>
                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <div>📅 {formatDate(event.date)}</div>
                  <div>🕒 {event.time}</div>
                  <div>📍 {event.venue}</div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <button onClick={() => navigate(`/events/${event._id}`)} className="rounded-xl border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-800">View Details</button>
                  <button onClick={() => register(event._id)} disabled={event.availableSeats <= 0} className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300">Register</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const register = async () => {
    try {
      await api.post('/registrations', { eventId: id });
      alert('Registered successfully.');
      navigate('/my-events');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to register.');
    }
  };

  if (loading) return <div className="text-slate-500">Loading event details...</div>;
  if (!event) return <div className="text-red-600">Event not found.</div>;

  return (
    <div className="space-y-6">
      <img src={event.image || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'} alt={event.title} className="h-72 w-full rounded-[30px] object-cover" />
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">{event.category}</div>
            <h1 className="text-3xl font-bold text-slate-900">{event.title}</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={register} className="rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white">Register Now</button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InfoTile label="Date" value={formatDate(event.date)} />
          <InfoTile label="Time" value={event.time} />
          <InfoTile label="Venue" value={event.venue} />
          <InfoTile label="Available seats" value={event.availableSeats} />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Description</h2>
            <p className="mt-3 text-slate-600">{event.description}</p>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div><strong>Organizer:</strong> {event.organizer}</div>
              <div><strong>Eligibility:</strong> {event.eligibility}</div>
              <div><strong>Contact:</strong> {event.contactEmail} / {event.contactPhone}</div>
              <div><strong>Registration deadline:</strong> {formatDate(event.registrationDeadline)}</div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="text-lg font-bold text-slate-900">Quick info</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex justify-between"><span>Category</span><strong>{event.category}</strong></div>
              <div className="flex justify-between"><span>Seats</span><strong>{event.maxParticipants}</strong></div>
              <div className="flex justify-between"><span>Deadline</span><strong>{formatDate(event.registrationDeadline)}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MyEventsPage() {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    api.get('/registrations/my-events').then((res) => setRegistrations(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-slate-900">My events</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {registrations.length ? registrations.map((item) => (
          <div key={item._id} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-500">{item.status}</div>
            <div className="text-xl font-bold text-slate-900">{item.event?.title}</div>
            <div className="mt-2 text-sm text-slate-600">{item.event?.venue}</div>
            <div className="mt-3 text-sm text-slate-600">{formatDate(item.event?.date)} • {item.event?.time}</div>
          </div>
        )) : <div className="md:col-span-3 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">No registered events yet.</div>}
      </div>
    </div>
  );
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    api.get('/notifications').then((res) => setNotifications(res.data)).catch(console.error);
  }, []);

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications((prev) => prev.map((item) => item._id === id ? { ...item, isRead: true } : item));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
        <button onClick={() => api.put('/notifications/read-all').then(() => setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true }))))} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium">Mark all as read</button>
      </div>
      <div className="space-y-4">
        {notifications.map((item) => (
          <div key={item._id} className={classNames('rounded-[24px] border p-5 shadow-sm', item.isRead ? 'border-slate-200 bg-white' : 'border-blue-200 bg-blue-50')}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-bold text-slate-900">{item.title}</div>
                <p className="mt-2 text-slate-600">{item.message}</p>
              </div>
              {!item.isRead && <button onClick={() => markRead(item._id)} className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white">Mark read</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    api.get('/announcements').then((res) => setAnnouncements(res.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-slate-900">Announcements</h1>
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement._id} className="rounded-[26px] border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="text-xl font-bold text-slate-900">{announcement.title}</div>
              <span className={classNames('rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]', announcement.priority === 'Urgent' ? 'bg-red-100 text-red-700' : announcement.priority === 'Important' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700')}>{announcement.priority}</span>
            </div>
            <p className="mt-3 text-slate-600">{announcement.description}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
              <span>📅 {formatDate(announcement.createdAt)}</span>
              <span>🏢 {announcement.department}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: '', studentId: '', email: '', phone: '', department: '', year: '', profileImage: '' });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        studentId: user.studentId || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
        year: user.year || '',
        profileImage: user.profileImage || '',
      });
    }
  }, [user]);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/users/${user._id}`, form);
      setUser({ ...user, ...data });
      alert('Profile updated successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to update profile.');
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-slate-900">Student profile</h1>
      <form onSubmit={saveProfile} className="grid gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Student ID</label>
          <input value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
          <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Department</label>
          <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Year</label>
          <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Profile image URL</label>
          <input value={form.profileImage} onChange={(e) => setForm({ ...form, profileImage: e.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" />
        </div>
        <button type="submit" className="md:col-span-2 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white">Save changes</button>
      </form>
    </div>
  );
}

function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(({ data }) => setStats(data))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load dashboard data.'));
  }, []);

  if (error) return <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>;
  if (!stats) return <div className="text-slate-500">Loading dashboard...</div>;

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <StatsCard label="Total students" value={stats.students} icon="👩‍🎓" color="bg-blue-500" />
        <StatsCard label="Total events" value={stats.events} icon="🎯" color="bg-indigo-500" />
        <StatsCard label="Upcoming events" value={stats.upcomingEvents} icon="📅" color="bg-orange-500" />
        <StatsCard label="Total registrations" value={stats.registrations} icon="🎟️" color="bg-cyan-600" />
        <StatsCard label="Total announcements" value={stats.announcements} icon="📣" color="bg-emerald-500" />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Recent events</h2>
          <div className="space-y-4">
            {stats.recentEvents.map((event) => (
              <div key={event._id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                <div>
                  <div className="font-semibold text-slate-900">{event.title}</div>
                  <div className="text-sm text-slate-500">{event.category} · {formatDate(event.date)}</div>
                </div>
                <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold">{event.status}</span>
              </div>
            ))}
            {!stats.recentEvents.length && <p className="text-sm text-slate-500">No events yet.</p>}
          </div>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Recent registrations</h2>
          <div className="space-y-4">
            {stats.recentRegistrations.map((registration) => {
              const student = registration.student || registration.userId;
              const event = registration.event || registration.eventId;
              return <div key={registration._id} className="rounded-2xl bg-slate-50 p-4">
                <div className="font-semibold text-slate-900">{student?.name || 'Student'}</div>
                <div className="text-sm text-slate-600">{event?.title || 'Event'} · {formatDate(registration.registeredAt || registration.registrationDate)}</div>
              </div>;
            })}
            {!stats.recentRegistrations.length && <p className="text-sm text-slate-500">No registrations yet.</p>}
          </div>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">Recent announcements</h2>
          <div className="space-y-4">
            {stats.recentAnnouncements.map((announcement) => (
              <div key={announcement._id} className="rounded-2xl bg-slate-50 p-4">
                <div className="font-semibold text-slate-900">{announcement.title}</div>
                <div className="text-sm text-slate-600">{announcement.department} · {announcement.status}</div>
              </div>
            ))}
            {!stats.recentAnnouncements.length && <p className="text-sm text-slate-500">No announcements yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function ManageEventsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [viewingId, setViewingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', category: 'Workshop', date: '', time: '', venue: '', organizer: '', eligibility: '', maxSeats: 50, registrationDeadline: '', image: '', contactEmail: '', contactPhone: '', status: 'PUBLISHED',
  });

  const runDailyReminderSync = async () => {
    try {
      const { data } = await api.post('/events/daily-reminders');
      alert(data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Could not sync daily reminders.');
    }
  };

  const load = async () => {
    const { data } = await api.get('/admin/events');
    setEvents(data);
    if (id) {
      const event = data.find((item) => item._id === id);
      if (event) {
        setEditingId(event._id);
        setForm({
          title: event.title || '', description: event.description || '', category: event.category || 'Workshop',
          date: event.date?.slice(0, 10) || '', time: event.time || '', venue: event.venue || '',
          organizer: event.organizer || '', eligibility: event.eligibility || '', maxSeats: event.maxSeats || event.maxParticipants || 50,
          registrationDeadline: event.registrationDeadline?.slice(0, 10) || '', image: event.image || '',
          contactEmail: event.contactEmail || '', contactPhone: event.contactPhone || '', status: String(event.status || 'PUBLISHED').toUpperCase(),
        });
      }
    }
  };

  useEffect(() => { load().catch((err) => setNotice(err.response?.data?.message || 'Unable to load events.')); }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, maxParticipants: Number(form.maxSeats), maxSeats: Number(form.maxSeats) };
      if (editingId) await api.put(`/admin/events/${editingId}`, payload);
      else await api.post('/admin/events', payload);
      setNotice(editingId ? 'Event updated.' : 'Event created.');
      navigate('/admin/events');
      setEditingId(null);
      setForm({ title: '', description: '', category: 'Workshop', date: '', time: '', venue: '', organizer: '', eligibility: '', maxSeats: 50, registrationDeadline: '', image: '', contactEmail: '', contactPhone: '', status: 'PUBLISHED' });
      await load();
    } catch (err) {
      setNotice(err.response?.data?.message || 'Unable to save event.');
    }
  };

  const edit = (event) => {
    navigate(`/admin/events/edit/${event._id}`);
  };

  const remove = async (eventId) => {
    if (!window.confirm('Delete this event and its registrations?')) return;
    try {
      await api.delete(`/admin/events/${eventId}`);
      setNotice('Event deleted.');
      await load();
    } catch (err) {
      setNotice(err.response?.data?.message || 'Unable to delete event.');
    }
  };

  const onAddNew = () => {
    navigate('/admin/events/add');
    setEditingId(null);
    setForm({
      title: '', description: '', category: 'Workshop', date: '', time: '', venue: '', organizer: '', eligibility: '', maxSeats: 50, registrationDeadline: '', image: '', contactEmail: '', contactPhone: '', status: 'PUBLISHED',
    });
  };

  const updateStatus = async (event) => {
    const nextStatus = String(event.status).toUpperCase() === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      await api.put(`/admin/events/${event._id}`, { status: nextStatus });
      setNotice(`Event ${nextStatus === 'PUBLISHED' ? 'published' : 'unpublished'}.`);
      await load();
    } catch (err) {
      setNotice(err.response?.data?.message || 'Unable to update event status.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-slate-900">{editingId || id ? 'Edit event' : 'Add new event'}</h2>
          <div className="flex gap-2">
            <button type="button" onClick={onAddNew} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700">New</button>
            <button type="button" onClick={runDailyReminderSync} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white">Daily reminder sync</button>
          </div>
        </div>
        <AdminToast message={notice} onDismiss={() => setNotice('')} />
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" required />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            {['Workshop', 'Seminar', 'Placement', 'Hackathon', 'Technical', 'Cultural', 'Sports', 'Other'].map((item) => <option key={item}>{item}</option>)}
          </select>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" required />
          <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="Time" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" required />
          <input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="Venue" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" required />
          <input value={form.organizer} onChange={(e) => setForm({ ...form, organizer: e.target.value })} placeholder="Organizer" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" required />
          <input value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} placeholder="Eligibility" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 md:col-span-2" required />
          <input type="number" min="1" value={form.maxSeats} onChange={(e) => setForm({ ...form, maxSeats: Number(e.target.value) })} placeholder="Maximum seats" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" required />
          <input type="date" value={form.registrationDeadline} onChange={(e) => setForm({ ...form, registrationDeadline: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" required />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            {['PUBLISHED', 'DRAFT', 'CANCELLED'].map((status) => <option key={status}>{status}</option>)}
          </select>
          <input value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} placeholder="Contact email (optional)" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" />
          <input value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} placeholder="Contact phone (optional)" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="md:col-span-2 min-h-28 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" required />
          <label className="md:col-span-2 block text-sm font-medium text-slate-700">Event image
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              if (file.size > 4 * 1024 * 1024) {
                setNotice('Choose an image smaller than 4 MB.');
                return;
              }
              const reader = new FileReader();
              reader.onload = () => setForm((current) => ({ ...current, image: String(reader.result) }));
              reader.readAsDataURL(file);
            }} className="mt-2 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" />
          </label>
          <input value={form.image.startsWith('data:') ? '' : form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Or paste image URL" className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" />
          <button type="submit" className="md:col-span-2 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white">{editingId ? 'Update event' : 'Create event'}</button>
        </form>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-bold text-slate-900">Event list</h2>
        <div className="space-y-3">
          {events.map((event) => (
            <div key={event._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-semibold text-slate-900">{event.title}</div>
                  <div className="text-sm text-slate-500">{event.category} · {formatDate(event.date)} · {event.status}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setViewingId(viewingId === event._id ? null : event._id)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800">{viewingId === event._id ? 'Hide details' : 'View details'}</button>
                  <button onClick={() => updateStatus(event)} className="rounded-xl bg-emerald-700 px-3 py-2 text-sm font-medium text-white">{String(event.status).toUpperCase() === 'PUBLISHED' ? 'Unpublish' : 'Publish'}</button>
                  <button onClick={() => edit(event)} className="rounded-xl bg-blue-700 px-3 py-2 text-sm font-medium text-white">Edit</button>
                  <button onClick={() => remove(event._id)} className="rounded-xl bg-red-700 px-3 py-2 text-sm font-medium text-white">Delete</button>
                </div>
              </div>
              {viewingId === event._id && <div className="mt-4 grid gap-4 border-t border-slate-200 pt-4 sm:grid-cols-2">
                {event.image && <img src={event.image} alt={event.title} className="max-h-56 w-full rounded-lg object-cover sm:col-span-2" />}
                <p className="text-sm text-slate-700 sm:col-span-2">{event.description}</p>
                <div className="text-sm text-slate-600">Venue: {event.venue}<br />Time: {event.time}<br />Organizer: {event.organizer}</div>
                <div className="text-sm text-slate-600">Eligibility: {event.eligibility}<br />Maximum seats: {event.maxSeats || event.maxParticipants}<br />Deadline: {formatDate(event.registrationDeadline)}</div>
              </div>}
            </div>
          ))}
          {!events.length && <div className="py-8 text-center text-sm text-slate-500">No events have been created.</div>}
        </div>
      </div>
    </div>
  );
}

function ManageStudentsPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [notice, setNotice] = useState('');

  const load = async () => {
    const { data } = await api.get('/admin/students');
    setStudents(data);
  };

  useEffect(() => { load().catch((err) => setNotice(err.response?.data?.message || 'Unable to load students.')); }, []);

  const filtered = students.filter((student) => {
    const matchesSearch = [student.name, student.email, student.phone].some((value) => String(value || '').toLowerCase().includes(search.toLowerCase()));
    return matchesSearch && (department === 'All' || student.department === department);
  });

  const toggleStatus = async (student) => {
    try {
      await api.put(`/admin/students/${student._id}/toggle-status`);
      setNotice(`Account ${student.isActive ? 'disabled' : 'enabled'}.`);
      await load();
    } catch (err) {
      setNotice(err.response?.data?.message || 'Unable to update student account.');
    }
  };

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold text-slate-900">Manage students</h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, phone" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 md:w-72" />
          <select value={department} onChange={(e) => setDepartment(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <option>All</option>
            {[...new Set(students.map((student) => student.department).filter(Boolean))].sort().map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </div>
      <AdminToast message={notice} onDismiss={() => setNotice('')} />
      <div className="space-y-3">
        {filtered.map((student) => (
          <div key={student._id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-semibold text-slate-900">{student.name}</div>
              <div className="text-sm text-slate-600">{student.email} · {student.phone || 'No phone'}</div>
              <div className="text-sm text-slate-500">{student.department} · {student.year || 'Year not set'} · Joined {formatDate(student.createdAt)}</div>
            </div>
            <div className="flex gap-2">
              <span className={classNames('self-center rounded-full px-2 py-1 text-xs font-semibold', student.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800')}>{student.isActive ? 'Active' : 'Disabled'}</span>
              <button onClick={() => toggleStatus(student)} className={classNames('rounded-xl px-3 py-2 text-sm font-medium text-white', student.isActive ? 'bg-amber-600' : 'bg-emerald-700')}>{student.isActive ? 'Disable' : 'Enable'}</button>
            </div>
          </div>
        ))}
        {!filtered.length && <div className="py-8 text-center text-sm text-slate-500">No students match these filters.</div>}
      </div>
    </div>
  );
}

function ManageRegistrationsPage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [search, setSearch] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    Promise.all([api.get('/admin/events'), api.get('/admin/registrations')]).then(([eventsRes, registrationsRes]) => {
      setEvents(eventsRes.data);
      setRegistrations(registrationsRes.data);
    }).catch((err) => setNotice(err.response?.data?.message || 'Unable to load registrations.'));
  }, []);

  const filtered = registrations.filter((registration) => {
    const student = registration.student || registration.userId;
    const event = registration.event || registration.eventId;
    const matchesEvent = !selectedEvent || event?._id === selectedEvent;
    const matchesStatus = selectedStatus === 'All' || registration.status === selectedStatus;
    const matchesSearch = [student?.name, student?.email, event?.title].some((value) => String(value || '').toLowerCase().includes(search.toLowerCase()));
    return matchesEvent && matchesStatus && matchesSearch;
  });

  const downloadCsv = () => {
    const rows = [['Name', 'Email', 'Event', 'Event Date', 'Registration Date', 'Status']]
      .concat(filtered.map((reg) => {
        const student = reg.student || reg.userId;
        const event = reg.event || reg.eventId;
        return [student?.name, student?.email, event?.title, formatDate(event?.date), formatDate(reg.registeredAt || reg.registrationDate), reg.status];
      }));

    const csv = rows.map((row) => row.map((value) => '"' + String(value).replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'event-registrations.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Event registrations</h2>
        <button onClick={downloadCsv} disabled={!filtered.length} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Export CSV</button>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-3">
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search student or event" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" />
      <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
        <option value="">All events</option>
        {events.map((event) => <option key={event._id} value={event._id}>{event.title}</option>)}
      </select>
      <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
        {['All', 'registered', 'pending', 'attended', 'cancelled'].map((status) => <option key={status}>{status}</option>)}
      </select>
      </div>
      <AdminToast message={notice} onDismiss={() => setNotice('')} />

      <div className="space-y-3">
        {filtered.map((reg) => {
          const student = reg.student || reg.userId;
          const event = reg.event || reg.eventId;
          return <div key={reg._id} className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-semibold text-slate-900">{student?.name || 'Student'}</div>
              <div className="text-sm text-slate-500">{student?.email} · {event?.title || 'Event'} · {formatDate(event?.date)}</div>
            </div>
            <div className="text-sm text-slate-500">{formatDate(reg.registeredAt || reg.registrationDate)} · {reg.status}</div>
          </div>;
        })}
        {!filtered.length && <div className="py-8 text-center text-sm text-slate-500">No registrations match these filters.</div>}
      </div>
    </div>
  );
}

function ManageAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState('');
  const [form, setForm] = useState({ title: '', description: '', priority: 'Normal', department: 'All Departments', status: 'PUBLISHED' });

  const load = async () => {
    const { data } = await api.get('/admin/announcements');
    setAnnouncements(data);
  };

  useEffect(() => { load().catch((err) => setNotice(err.response?.data?.message || 'Unable to load announcements.')); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/admin/announcements/${editingId}`, form);
      else await api.post('/admin/announcements', form);
      setNotice(editingId ? 'Announcement updated.' : 'Announcement created.');
      setEditingId(null);
      setForm({ title: '', description: '', priority: 'Normal', department: 'All Departments', status: 'PUBLISHED' });
      await load();
    } catch (err) {
      setNotice(err.response?.data?.message || 'Unable to save announcement.');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/admin/announcements/${id}`);
      setNotice('Announcement deleted.');
      await load();
    } catch (err) {
      setNotice(err.response?.data?.message || 'Unable to delete announcement.');
    }
  };

  const edit = (item) => {
    setEditingId(item._id);
    setForm({ title: item.title, description: item.description, priority: item.priority, department: item.department, status: String(item.status || 'PUBLISHED').toUpperCase() });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Edit announcement' : 'Create announcement'}</h2>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', description: '', priority: 'Normal', department: 'All Departments', status: 'PUBLISHED' }); }} className="text-sm text-blue-700">Cancel edit</button>}
        </div>
        <AdminToast message={notice} onDismiss={() => setNotice('')} />
        <form onSubmit={submit} className="space-y-4">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" required />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="min-h-28 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" required />
          <div className="grid gap-4 md:grid-cols-2">
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
              {['Normal', 'Important', 'Urgent'].map((item) => <option key={item}>{item}</option>)}
            </select>
            <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="Department" className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3" required />
          </div>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            {['PUBLISHED', 'DRAFT', 'CANCELLED'].map((status) => <option key={status}>{status}</option>)}
          </select>
          <button type="submit" className="rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white">{editingId ? 'Update announcement' : 'Save announcement'}</button>
        </form>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-bold text-slate-900">Announcements list</h2>
        <div className="space-y-3">
          {announcements.map((item) => (
            <div key={item._id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-semibold text-slate-900">{item.title}</div>
                <div className="text-sm text-slate-500">{item.department} · {item.priority} · {item.status} · {formatDate(item.createdAt)}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => api.put(`/admin/announcements/${item._id}`, { status: String(item.status).toUpperCase() === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' }).then(load).catch((err) => setNotice(err.response?.data?.message || 'Unable to update status.'))} className="rounded-xl bg-emerald-700 px-3 py-2 text-sm font-medium text-white">{String(item.status).toUpperCase() === 'PUBLISHED' ? 'Unpublish' : 'Publish'}</button>
                <button onClick={() => edit(item)} className="rounded-xl bg-blue-700 px-3 py-2 text-sm font-medium text-white">Edit</button>
                <button onClick={() => remove(item._id)} className="rounded-xl bg-red-700 px-3 py-2 text-sm font-medium text-white">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatsCard({ label, value, icon, color }) {
  return (
    <div className="glass-card stat-card rounded-[24px] p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">{label}</div>
          <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
        </div>
        <div className={classNames('flex h-12 w-12 items-center justify-center rounded-2xl text-xl text-white shadow-lg', color)}>{icon}</div>
      </div>
    </div>
  );
}

function AdminToast({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(onDismiss, 3500);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  return (
    <div role="status" aria-live="polite" className="fixed right-4 top-4 z-50 flex max-w-sm items-center gap-4 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-white shadow-xl">
      <span>{message}</span>
      <button type="button" aria-label="Dismiss notification" onClick={onDismiss} className="font-bold text-slate-300 hover:text-white">x</button>
    </div>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-2 text-base font-semibold text-slate-900">{value}</div>
    </div>
  );
}

export default App;
