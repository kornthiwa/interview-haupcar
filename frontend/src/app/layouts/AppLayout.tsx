import { AppBar, Box, Toolbar } from '@mui/material'
import { NavLink, Outlet } from 'react-router'
import { paths } from '@/app/routes/paths.ts'
import { Typography } from '@/components/ui/Typography/index.tsx'

const links = [
  { to: paths.home, label: 'Home', end: true },
  { to: paths.user, label: 'User', end: false },
]

export function AppLayout() {
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
          <Box sx={{ display: 'flex', gap: 2 }}>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                style={({ isActive }) => ({
                  color: 'inherit',
                  fontWeight: isActive ? 700 : 500,
                  textDecoration: 'none',
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  )
}
