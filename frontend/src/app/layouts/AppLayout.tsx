import { NavLink, Outlet } from 'react-router'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/user', label: 'User', end: false },
]

export function AppLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">Haupcar</div>
        <nav className="app-nav">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
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
