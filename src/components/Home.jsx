import {Container, Grid, Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import AppWidgetSummary from "../designComponents/AppWidgetSummary.jsx";
import {useEffect, useState, useCallback, useMemo} from "react";
import EventBus from "../common/EventBus.js";
import DashboardService from "../services/dashboard.service.js";
import {useSearchParams} from "react-router-dom";
import ArticleTable from "../designComponents/article/ArticleTable.jsx";
import MessagesTable from "../designComponents/contact/MessagesTable.jsx";

const Home = () => {
    const [data, setData] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(0);

    // DERIVED STATE: Calculate visibleTable directly from the URL on every render.
    const visibleTable = searchParams.get('view') || null;

    const fetchData = useCallback(() => {
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

                console.error(_content);

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // DERIVED DATA: Calculate table data and title using useMemo
    const { tableData, tableTitle } = useMemo(() => {
        if (!data || !visibleTable) {
            return { tableData: [], tableTitle: '' };
        }

        switch (visibleTable) {
            case 'messages':
                return { tableData: data.contactMessages || [], tableTitle: "New Messages" };
            case 'refreshByIas':
                return { tableData: data.refreshByIas || [], tableTitle: "Articles to Refresh by IA" };
            case 'refreshPictureByIas':
                return { tableData: data.refreshPictureByIas || [], tableTitle: "Pictures to Refresh by IA" };
            case 'mostViewedArticles':
                return { tableData: data.mostViewedArticles || [], tableTitle: "Top 50 Most Viewed Articles" };
            default:
                return { tableData: [], tableTitle: '' };
        }
    }, [visibleTable, data]);

    const handleTileClick = (tableKey) => {
        const currentView = searchParams.get('view');
        const newView = currentView === tableKey ? null : tableKey;

        // Reset page state directly in the event handler
        setPage(0);

        if (newView) {
            setSearchParams({ view: newView });
        } else {
            setSearchParams({});
        }
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const getGridStyle = (tableKey) => ({
        cursor: 'pointer',
        borderRadius: 2,
        transition: 'box-shadow 0.3s, border 0.3s',
        border: visibleTable === tableKey ? '2px solid' : '2px solid transparent',
        borderColor: visibleTable === tableKey ? 'primary.main' : 'transparent',
        boxShadow: visibleTable === tableKey ? 5 : 1,
    });

    const renderTable = () => {
        if (!visibleTable) return null;

        const commonTableProps = {
            page: page,
            onPageChange: handlePageChange,
            filterName: '', // No search filter on home page
            onFilterName: () => {}, // No search filter on home page
        };

        if (visibleTable === 'messages') {
            return <MessagesTable messages={tableData} onMessageUpdate={fetchData} {...commonTableProps} />;
        }

        return <ArticleTable articles={tableData} onArticleUpdate={fetchData} {...commonTableProps} />;
    }

    return (
        <Container maxWidth="xl">
            <Typography variant="h4" sx={{mb: 5}}>
                Hi, Welcome back
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3} onClick={() => handleTileClick('messages')} sx={getGridStyle('messages')}>
                    <AppWidgetSummary total={data?.contactMessagesCount} title="New Messages" color="info" icon={'ant-design:message-filled'}/>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <AppWidgetSummary total={data?.articleCount} title="Total Articles" icon={'ant-design:android-filled'}/>
                </Grid>

                <Grid item xs={12} sm={6} md={3} onClick={() => handleTileClick('mostViewedArticles')} sx={getGridStyle('mostViewedArticles')}>
                    <AppWidgetSummary total={data?.mostViewedArticles?.length} title="Top Articles" color="info" icon={'ant-design:fire-filled'}/>
                </Grid>

                <Grid item xs={12} sm={6} md={3} onClick={() => handleTileClick('refreshByIas')} sx={getGridStyle('refreshByIas')}>
                    <AppWidgetSummary total={data?.refreshByIaCount} title="Refresh By IA" color="warning" icon={'ant-design:robot-filled'}/>
                </Grid>

                <Grid item xs={12} sm={6} md={3} onClick={() => handleTileClick('refreshPictureByIas')} sx={getGridStyle('refreshPictureByIas')}>
                    <AppWidgetSummary total={data?.refreshPictureByIaCount} title="Refresh Picture" color="error" icon={'ant-design:picture-filled'}/>
                </Grid>
            </Grid>

            {visibleTable && (
                <Box sx={{mt: 5}}>
                    <Typography variant="h5" sx={{mb: 3}}>
                        {tableTitle}
                    </Typography>
                    {renderTable()}
                </Box>
            )}
        </Container>
    );
};

export default Home;