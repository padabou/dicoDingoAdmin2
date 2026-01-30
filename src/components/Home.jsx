import {Container, Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import AppWidgetSummary from "../designComponents/AppWidgetSummary.jsx";
import {useEffect, useState} from "react";
import EventBus from "../common/EventBus.js";
import DashboardService from "../services/dashboard.service.js";

const Home = () => {
    const [ data, setData] = useState();
    useEffect(() => {
        DashboardService.get().then(
            (response) => {
                setData(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setData(_content);

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );
    }, []);
  return (
      <Container maxWidth="xl">
          <Typography variant="h4" sx={{ mb: 5 }}>
              Hi, Welcome back
          </Typography>

          <Grid container spacing={3}>

              <Grid item xs={12} sm={6} md={3}>
                  <AppWidgetSummary total={data?.articleCount} title="Total Articles" icon={'ant-design:check-circle-filled'} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                  <AppWidgetSummary total={data?.notEnabledCount} title="Articles not Enabled" color="success" icon={'ic:round-disabled-by-default'} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                  <AppWidgetSummary total={data?.refreshByIaCount} title="Refresh By IA" color="warning" icon={'arcticons:openai-chatgpt'} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                  <AppWidgetSummary total={data?.refreshPictureByIaCount} title="Refresh Picture" color="error" icon={'qlementine-icons:picture-16'} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                  <AppWidgetSummary total={data?.contactMessagesCount} title="New Messages" color="info" icon={'ant-design:message-filled'} />
              </Grid>
          </Grid>
      </Container>
  );
};

export default Home;
