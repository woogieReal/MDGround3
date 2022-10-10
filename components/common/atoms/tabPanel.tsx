import { Box } from "@mui/material";

interface Props {
  children?: React.ReactNode;
  index: number;
  value: number;
}
const TabPanel = ({ children, index, value }: Props) => {

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
    >
      <Box sx={{ display: value !== index ? 'none' : 'block' }}>
        {children}
      </Box>
    </div>
  );
}

export default TabPanel;