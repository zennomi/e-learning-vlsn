import { useState } from 'react';
// @mui
import {
  Box,
  Card,
  Table,
  Switch,
  Tooltip,
  TableBody,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
} from '@mui/material';
// hooks
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// components
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import ResultTableToolbar from './ResultTableToolbar';
import ResultTableRow from './ResultTableRow';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Tên', align: 'left' },
  { id: 'mark', label: 'Điểm', align: 'center' },
  { id: 'amountOfTime', label: 'Phút', align: 'center' },
  { id: 'blurCount', label: 'Gian lận', align: 'center' },
  { id: 'createdAt', label: 'Bắt đầu', align: 'left' },
  { id: 'finishedAt', label: 'Kết thúc', align: 'left' },
  { id: 'updatedAt', label: 'Lần cuối cập nhật', align: 'left' },
];

// ----------------------------------------------------------------------

export default function ResultTable({ rows, deleteResults, handlePreviewClick }) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();

  const [tableData, setTableData] = useState(
    rows.map((r) => ({
      ...r,
      name: r.user.displayName,
      amountOfTime: Date.parse(r.finishedAt || r.updatedAt) - Date.parse(r.createdAt),
    }))
  );

  const [filterName, setFilterName] = useState('');

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleDeleteRow = (id) => {
    if (!window.confirm(`Xoá bài làm của học sinh?`)) return;
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    deleteResults([id]);
    setTableData(deleteRow);
    setPage(0);
  };

  const handleDeleteRows = (selected) => {
    if (!window.confirm(`Xoá ${selected.length} bài làm của học sinh?`)) return;
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    deleteResults(selected);
    setSelected([]);
    setTableData(deleteRows);
    setPage(0);
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length && !!filterName;

  return (
    <Card>
      <ResultTableToolbar filterName={filterName} onFilterName={handleFilterName} />

      <Scrollbar>
        <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
          {selected.length > 0 && (
            <TableSelectedActions
              dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              actions={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                    <Iconify icon={'eva:trash-2-outline'} />
                  </IconButton>
                </Tooltip>
              }
            />
          )}

          <Table size={dense ? 'small' : 'medium'}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={selected.length}
              onSort={onSort}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
            />

            <TableBody>
              {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <ResultTableRow
                  key={row.id}
                  row={row}
                  selected={selected.includes(row.id)}
                  onSelectRow={() => onSelectRow(row.id)}
                  onDeleteRow={() => handleDeleteRow(row.id)}
                  onPreview={() => handlePreviewClick(row.id)}
                />
              ))}

              <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

              <TableNoData isNotFound={isNotFound} />
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Box sx={{ position: 'relative' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dataFiltered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />

        <FormControlLabel
          control={<Switch checked={dense} onChange={onChangeDense} />}
          label="Thu gọn"
          sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
        />
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter(
      (item) => item.user.displayName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return tableData;
}
