import { Box, Typography } from "@mui/material";


/**
 * Creates a TabPanel to be used with the material Tabs component
 */
export function TabPanel(props: any) {
    const { children, value, index, ...other } = props;
  
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-auto-tabpanel-${index}`}
        aria-labelledby={`scrollable-auto-tab-${index}`}
        {...other}
      >
        <Box p={3}>{children}</Box>
      </Typography>
    );
  }

  /**
   * Used to notify the user of errors inside forms 
   */
  export const generateErrorMessage = (errorMessage: string, size: number = 18) => (
    <div className="errorMessage">
      <Typography sx={{fontWeight:"bold"}} fontSize={size}>
        {errorMessage}
      </Typography>
    </div>
  );
  
  /**
   * Used to notify the user of a successful operation inside forms 
   */
  export const generateSuccessMessage = (successMessage: string, size: number = 18) => (
    <div className="successMessage">
      <Typography sx={{fontWeight:"bold"}} fontSize={size}>
      {successMessage}
      </Typography>
    </div>
  );
