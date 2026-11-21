import { AppBar, Box, Toolbar } from '@mui/material'
import { NavLink, Outlet, useNavigate } from 'react-router'
import { paths } from '@/app/routes/paths.ts'
import { Button } from '@/components/ui/Button/index.tsx'
import { Typography } from '@/components/ui/Typography/index.tsx'
import { useUser } from '@/hooks/index.ts'
import { useAuth } from '@/features/auth/hooks/index.ts'

const links = [
  { to: paths.home, label: 'Home', end: true },
  { to: paths.user, label: 'User', end: false },
]

export function AppLayout() {
  const navigate = useNavigate()
  const user = useUser()
  const { logout, isLoggingOut } = useAuth()

  async function handleLogout() {
    try {
      await logout()
    } finally {
      navigate(paths.login, { replace: true })
    }
  }

  return (
    <Box sx={{ minHeight: '100svh' }}>
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Haupcar
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'inherit',
                  fontWeight: isActive ? 700 : 500,
                  textDecoration: 'none',
                })}
              >
                {link.label}
              </NavLink>
            ))}
            {user ? (
              <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                {user.username}
              </Typography>
            ) : null}
            <Button
              variant="text"
              color="inherit"
              disabled={isLoggingOut}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  )
}
