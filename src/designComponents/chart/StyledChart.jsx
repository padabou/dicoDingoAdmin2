import { styled } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';

const StyledChart = styled('div')(({ theme }) => {
  const styles = {
    '.apexcharts-canvas': {
      // Tooltip
      '.apexcharts-tooltip': {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.customShadows.z24,
        borderRadius: theme.shape.borderRadius,
        '&.apexcharts-theme-light': {
          borderColor: 'transparent',
          backgroundColor: theme.palette.background.paper,
        },
      },
      '.apexcharts-tooltip-title': {
        textAlign: 'center',
        fontWeight: theme.typography.fontWeightBold,
        backgroundColor: theme.palette.grey[500_16],
        color: theme.palette.text[theme.palette.mode === 'light' ? 'secondary' : 'primary'],
      },

      // Legend
      '.apexcharts-legend': {
        padding: 0,
      },
      '.apexcharts-legend-series': {
        display: 'flex !important',
        alignItems: 'center',
      },
      '.apexcharts-legend-marker': {
        marginRight: 8,
      },
      '.apexcharts-legend-text': {
        lineHeight: '18px',
        textTransform: 'capitalize',
      },
    },
  };

  return <GlobalStyles styles={styles} />;
});

export default StyledChart;
