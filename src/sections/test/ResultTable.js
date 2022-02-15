import { format } from 'date-fns';
import viLocale from 'date-fns/locale/vi';
// @mui
import { Avatar, Box, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

const columns = [
    {
        field: 'student',
        headerName: 'Học sinh',
        width: 300,
        renderCell: (params) => (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={params.row.user.photoURL} alt={params.row.user.displayName} sx={{ mr: 1 }} />
                <Typography variant="body2" >
                    {params.row.user.displayName}
                </Typography>
            </Box>
        ),
        valueGetter: (params) => params.row.user.displayName
    },
    {
        field: 'mark',
        headerName: 'Điểm',
        type: 'number',
        // width: 90,
    },
    {
        field: 'createdAt',
        headerName: 'Bắt đầu',
        width: 160,
        renderCell: (params) => params.value && format(new Date(params.value), 'dd/MM hh:mm:ss')
    },
    {
        field: 'finishedAt',
        headerName: 'Kết thúc',
        width: 160,
        renderCell: (params) => params.value && format(new Date(params.value), 'dd/MM hh:mm:ss')
    },
    {
        field: 'updatedAt',
        headerName: 'Lần cuối cập nhật',
        width: 160,
        renderCell: (params) => params.value && format(new Date(params.value), 'dd/MM hh:mm:ss')
    },
];

export default function ResultTable({ rows, handleRowClick }) {
    return (
        <div style={{ width: '100%', height: 800, }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 20, 30]}
                checkboxSelection
                onSelectionModelChange={handleRowClick}
                components={{
                    Toolbar: GridToolbar,
                }}
            />
        </div>
    );
}