import React from 'react';
// @mui
import {Stack} from '@mui/material';
//
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// ----------------------------------------------------------------------

export const SitemapDate = ({ updateDate, onChangeUpdateDate }) => {
        return (
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                <Stack spacing={3}>
                    <DatePicker
                        label="Date d'ajout au sitemap"
                        format="DD/MM/YYYY"
                        value={dayjs(updateDate)}
                        onChange={onChangeUpdateDate}
                    />
                </Stack>
            </LocalizationProvider>

        );

}


