import { AppBar, Box, Toolbar } from '@mui/material'
import { NavLink, Outlet, useNavigate } from 'react-router'
import { paths } from '@/app/routes/paths.ts'
import { Button } from '@/components/ui/Button/index.tsx'
import { Typography } from '@/components/ui/Typography/index.tsx'
import { useUser } from '@/hooks/index.ts'
import { useAuth } from '@/features/auth/hooks/index.ts'

const links = [
  { to: paths.car, label: 'Cars', end: true },
  { to: paths.settings, label: 'Settings', end: false },
  { to: paths.profile, label: 'Profile', end: false },
]

export function AppLayout() {
  const navigate = useNavigate()
  const user = useUser()
  const { logout } = useAuth()

  async function handleLogout() {
    try {
      await logout()
    } finally {
      navigate(paths.login, { replace: true })
    }
  }

  return (
    <Box sx={{ minHeight: '100svh', bgcolor: 'background.default' }}>
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Toolbar
          sx={{
            gap: 2,
            minHeight: { xs: 64, sm: 68 },
            px: { xs: 2, sm: 3 },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'primary.main',
              }}
            >
              Haupcar
            </Typography>
            {user?.name ? (
              <Box
                sx={{
                  display: { xs: 'none', sm: 'inline-flex' },
                  alignItems: 'center',
                  px: 1.25,
                  py: 0.35,
                  borderRadius: 999,
                  bgcolor: 'action.hover',
                  border: 1,
                  borderColor: 'divider',
                  maxWidth: 180,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ fontWeight: 600 }}
                >
                  {user.name}
                </Typography>
              </Box>
            ) : null}
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              p: 0.5,
              borderRadius: 2,
              bgcolor: 'background.default',
              border: 1,
              borderColor: 'divider',
            }}
          >
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                style={{ textDecoration: 'none' }}
              >
                {({ isActive }) => (
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      px: 1.75,
                      py: 0.75,
                      borderRadius: 1.5,
                      fontSize: '0.875rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? 'primary.contrastText' : 'text.secondary',
                      bgcolor: isActive ? 'primary.main' : 'transparent',
                      boxShadow: isActive
                        ? '0 1px 3px rgba(21, 101, 192, 0.35)'
                        : 'none',
                      transition: 'background-color 0.15s ease, color 0.15s ease',
                      '&:hover': {
                        color: isActive ? 'primary.contrastText' : 'text.primary',
                        bgcolor: isActive ? 'primary.dark' : 'action.hover',
                      },
                    }}
                  >
                    {link.label}
                  </Box>
                )}
              </NavLink>
            ))}
          </Box>

          <Button
            size="small"
            color="inherit"
            onClick={() => void handleLogout()}
            sx={{
              ml: 0.5,
              px: 1.5,
              fontWeight: 600,
              color: 'text.secondary',
              '&:hover': {
                color: 'error.main',
                bgcolor: 'rgba(211, 47, 47, 0.08)',
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: { xs: 2, sm: 3 } }}>
        <Outlet />
      </Box>
    </Box>
  )
}
