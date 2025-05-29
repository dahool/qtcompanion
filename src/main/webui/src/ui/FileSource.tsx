import { Fragment, useEffect, useState } from "react"
import { getSourceFileList } from "../services/services"

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Checkbox from '@mui/material/Checkbox';
import { Skeleton, Stack } from "@mui/material"
import type { FileItem } from "../services/model"

export default function FileSource() {

    const [list, setList] = useState<FileItem[] | null>(null)

    const retrieveFiles = async () => {
        setList(await getSourceFileList());
    }

    useEffect(() => {
        retrieveFiles();
    }, [])

    if (list === null) return Loading();

    if (list.length === 0) {
        return (
            <Box className="w-full h-[75vh] bg-white rounded p-2">
                <p className="text-center text-black">No files found</p>
            </Box>
        )
    }

    return (
        <TableContainer component={Paper} className="w-full h-[75vh] max-h-[75vh] overflow-auto">
            <Table>
                <TableBody>
                    {list.map((file: any, index: number) => (
                        <Row key={index} row={file} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

const Row = (props: { row: any }) => {
    const { row } = props;
    const [open, setOpen] = useState(false);

    return (
        <Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell padding="checkbox">
                    <Checkbox id={row.absoluteFile} />
                </TableCell>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>{row.filename}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <p className="truncate">{row.absoluteFile}</p>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    )
}


const Loading = () => {
  return (
    <Box className="w-full h-[75vh] bg-white rounded p-2">
        <Stack spacing={2}>
            {[...Array(10)].map((_, index) => (
                <Skeleton key={index} variant="rectangular" height={50} className="w-full" />
            ))}
        </Stack>
    </Box>
  );
};