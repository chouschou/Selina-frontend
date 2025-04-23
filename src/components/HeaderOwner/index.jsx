import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Tab, 
  Tabs, 
  Box,
  IconButton
} from '@mui/material'
import { Add as AddIcon, Menu as MenuIcon } from '@mui/icons-material'
import './HeaderOwner.scss'

function HeaderOwner() {
//   const [tabValue, setTabValue] = useState(0)
//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue)
//   }

  return (
    <AppBar position="static" color="default" elevation={0} className="header">
      <Toolbar className="toolbar">
        {/* <Box className="header-left">
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" className="brand-name" color="primary">
            Selina
            <span className="brand-icon">♾️</span>
          </Typography>
        </Box>

        <Box className="header-center">
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Công khai" />
            <Tab label="Kính mời" />
          </Tabs>
        </Box>

        <Box className="header-right">
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            className="add-button"
          >
            {isMobile ? '' : 'Thêm sản phẩm'}
          </Button>
        </Box> */}
      </Toolbar>
    </AppBar>
  )
}

export default HeaderOwner