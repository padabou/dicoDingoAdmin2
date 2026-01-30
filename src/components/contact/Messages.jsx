import React, {useEffect, useState, useCallback} from "react";
import EventBus from "../../common/EventBus";
import {
    Container,
    Stack,
    Typography
} from '@mui/material';
import {useSearchParams} from "react-router-dom";
import ContactService from "../../services/contact.service.js";
import MessagesTable from "../../designComponents/contact/MessagesTable.jsx";

const Messages = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [list, setList] = useState([]);
    
    // State is now managed in the parent component
    const [filterName, setFilterName] = useState(searchParams.get('query') || '');
    const [page, setPage] = useState(parseInt(searchParams.get('page') || '0', 10));

    const fetchMessages = useCallback(() => {
        ContactService.getAll().then(
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
    }, []);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    const handleFilterChange = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        setSearchParams(params);
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

    return (
        <>
            <title> Messages </title>

            <Container>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Messages
                    </Typography>
                </Stack>

                <MessagesTable
                    messages={list}
                    onMessageUpdate={fetchMessages}
                    filterName={filterName}
                    onFilterName={onFilterNameChange}
                    page={page}
                    onPageChange={onPageChange}
                />
            </Container>
        </>
    );
};

export default Messages;
