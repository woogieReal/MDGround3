import { Box } from "@mui/material";

interface Props {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const TabPanel = ({ children, index, value }: Props) => {

  return (
      <Box 
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        sx={{ display: value !== index ? 'none' : 'block', width: '100%' }}
      >
        {children}
      </Box>
  );
}

export default TabPanel;