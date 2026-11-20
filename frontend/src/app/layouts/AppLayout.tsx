import { NavLink, Outlet } from 'react-router'

const links = [
  { to: '/patients', label: 'Patients' },
  { to: '/appointments', label: 'Appointments' },
  { to: '/medications', label: 'Medications' },
]

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">Haupcar</div>
        <nav className="app-nav">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
