import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Card,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from '@mui/material';
// hooks
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
import useAuth from 'src/hooks/useAuth';
// components
import Scrollbar from '../../components/Scrollbar';
import { TableEmptyRows, TableHeadCustom, TableNoData } from '../../components/table';
// sections
import ResultTableRow from './ResultTableRow';
// api
import { getAnswersheets } from '../../api/answersheet';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'testName', label: 'Đề', align: 'left' },
  { id: 'mark', label: 'Điểm', align: 'center' },
  { id: 'amountOfTime', label: 'Phút', align: 'center' },
  { id: 'createdAt', label: 'Bắt đầu', align: 'left' },
  { id: 'finishedAt', label: 'Kết thúc', align: 'left' },
  { id: 'updatedAt', label: 'Lần cuối cập nhật', align: 'left' },
];

// ----------------------------------------------------------------------

export default function ResultTable({ }) {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable();
  const { user, isInitialized } = useAuth();

  const [tableData, setTableData] = useState([]);

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
  });

  const denseHeight = dense ? 52 : 72;

  const isNotFound = !dataFiltered.length;

  useEffect(async () => {
    if (!isInitialized) return;
    try {
      const data = await getAnswersheets({ user: user.id, populate: 'testId', limit: 20 });
      setTableData(data.results.map(r => ({
        id: r.id,
        testId: r.testId.id,
        testName: r.testId?.name,
        mark: r.mark,
        createdAt: Date.parse(r.createdAt),
        updatedAt: Date.parse(r.updatedAt),
        finishedAt: r.finishedAt && Date.parse(r.finishedAt),
        amountOfTime: r.finishedAt ? Date.parse(r.finishedAt) - Date.parse(r.createdAt) : Date.parse(r.updatedAt) - Date.parse(r.createdAt)
      })));
    } catch (error) {
      //
    }

  }, [isInitialized])

  return (
    <Card>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
          <Table size='small' sx={{ mt: 1 }}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              onSort={onSort}
            />

            <TableBody>
              {dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                <ResultTableRow
                  key={row.id}
                  row={row}
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
      </Box>
    </Card>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  return tableData;
}
