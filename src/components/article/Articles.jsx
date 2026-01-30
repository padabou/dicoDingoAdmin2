import React, {useEffect, useState, useCallback} from "react";
import EventBus from "../../common/EventBus";
import ArticleService from "../../services/article.service";
import {
    Stack,
    Button,
    Container,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import Iconify from "../../designComponents/iconify";
import {useNavigate, useSearchParams} from "react-router-dom";
import typeService from "../../services/type.service";
import ArticleTable from "../../designComponents/article/ArticleTable.jsx";

const Articles = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [list, setList] = useState([]);
    const [types, setTypes] = useState([]);
    
    // State is now managed in the parent component
    const [type, setType] = useState(searchParams.get('type') || '');
    const [filterName, setFilterName] = useState(searchParams.get('query') || '');
    const [page, setPage] = useState(parseInt(searchParams.get('page') || '0', 10));

    const navigate = useNavigate();

    const fetchArticles = useCallback(() => {
        const currentType = searchParams.get('type') || '';
        const currentSitemap = searchParams.get('sitemapAdded') || '';
        const currentEnabled = searchParams.get('enabled') || '';
        const currentQuery = searchParams.get('query') || '';
        const currentPage = searchParams.get('page') || '0';

        ArticleService.getAll(currentType, "FR", currentSitemap, currentEnabled, currentQuery, currentPage).then(
            (response) => {
                setList(response.data);
            },
            (error) => {
                const _content =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setList([]); // Set to empty array on error
                console.error(_content);

                if (error.response && error.response.status === 401) {
                    EventBus.dispatch("logout");
                }
            }
        );
    }, [searchParams]);

    useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    useEffect(() => {
        typeService.getAll().then(
            (response) => {
                setTypes(response.data);
            },
            (error) => {
                console.error("Failed to fetch types", error);
            }
        );
    }, []);

    const handleFilterChange = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        setSearchParams(params);
    };

    const onChangeType = (e) => {
        const newType = e.target.value;
        setType(newType);
        setPage(0); // Reset page on type change
        handleFilterChange('type', newType);
        handleFilterChange('page', '0');
    };

    const onFilterNameChange = (value) => {
        setFilterName(value);
        setPage(0); // Reset page on filter change
        handleFilterChange('query', value);
        handleFilterChange('page', '0');
    };

    const onPageChange = (event, newPage) => {
        setPage(newPage);
        handleFilterChange('page', newPage.toString());
    };

    const createArticle = () => {
        navigate("/article/create");
    };

    const createArticles = () => {
        navigate("/article/createByList");
    };

    return (
        <>
            <title> Articles </title>

            <Container maxWidth="xl">
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Articles
                    </Typography>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" width={400}>
                        <Button variant="contained" onClick={createArticle} sx={{mr: 2}} startIcon={<Iconify icon="eva:plus-fill"/>}>
                            New Article
                        </Button>
                        <Button variant="contained" onClick={createArticles} startIcon={<Iconify icon="eva:plus-fill"/>}>
                            New Articles
                        </Button>
                    </Stack>
                </Stack>

                <Box sx={{minWidth: 120, mb: 3}}>
                    <FormControl sx={{m: 1, minWidth: 480}}>
                        <InputLabel id="type-select-label">Type</InputLabel>
                        <Select
                            labelId="type-select-label"
                            value={type}
                            onChange={onChangeType}
                            label="Type"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {types?.map(typeOption => (
                                <MenuItem key={typeOption.id} value={typeOption.name}>{typeOption.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <ArticleTable
                    articles={list}
                    onArticleUpdate={fetchArticles}
                    filterName={filterName}
                    onFilterName={onFilterNameChange}
                    page={page}
                    onPageChange={onPageChange}
                />

            </Container>
        </>
    );
};

export default Articles;
