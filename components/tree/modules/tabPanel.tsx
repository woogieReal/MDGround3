import { Box, Typography } from "@mui/material";

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
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default TabPanel;