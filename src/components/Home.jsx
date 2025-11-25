import {Container, Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import AppWidgetSummary from "../designComponents/AppWidgetSummary.jsx";

const Home = () => {

  return (
      <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 5 }}>
              Hi, Welcome back
          </Typography>

          <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                  <AppWidgetSummary total="12" title="Departments" icon={'ant-design:android-filled'} />

              </Grid>


          </Grid>
      </Container>
  );
};

export default Home;
