import { useEffect, useState } from "react"
import { addFolder, getTargetFolderList } from "../services/services"
import { Toolbar, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Radio, RadioGroup, IconButton, Skeleton, Box, Stack } from "@mui/material"
import { IconFolder, IconFolderOpen, IconFolders, IconPlus } from "@intentui/icons"
import { NewFolderDialog } from "./NewFolderDialog"
import type { FileItem } from "../services/model"

export default function FileTarget() {

    const [files, setFiles] = useState<FileItem | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newFolderLoading, setNewFolderLoading] = useState(false);
    const [selectedTarget, setSelectedTarget] = useState<string>("");
    const [enableAdd, setEnableAdd] = useState(false);

    const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedTarget(e.target.value);
        setEnableAdd(e.target.value !== "");
    }

    const handleNewFolder = (folderName: string | null) => {
        setDialogOpen(false);
        if (folderName) {
            setNewFolderLoading(true);
            console.log(`Creating new folder: ${folderName} in target: ${selectedTarget}`);
            addFolder(folderName, selectedTarget).then(() => {
                retrieveFiles(); // Refresh the file list after adding a new folder
            }).catch((error) => {
                console.error("Error creating folder:", error);
            }).finally(() => {
                setNewFolderLoading(false);
            })
        }
    }

    const retrieveFiles = async () => {
        setFiles(await getTargetFolderList());
    }

    useEffect(() => {
        retrieveFiles();
    }, [])

    if (!files) return Loading();

    if (selectedTarget === "") {
        setSelectedTarget(files.absoluteFile);
        setEnableAdd(true);
    }

    return (
        <>
        <NewFolderDialog open={dialogOpen} onClose={handleNewFolder} parent={selectedTarget} />
        <Paper className="w-full h-[75vh]">
            <Toolbar className="justify-end">
                <IconButton color="primary" title="New Folder" disabled={!enableAdd} loading={newFolderLoading} onClick={() => setDialogOpen(true)}>
                    <IconPlus/>
                </IconButton>
            </Toolbar>
            <RadioGroup name="target"
                value={selectedTarget}
                onChange={handleRadioChange}>
                <FolderTree files={files} />
            </RadioGroup>
        </Paper>
        </>
    )

}

const FolderTree = ({ files, level = 0 }: { files: FileItem, level?: number }) => {
    return (
        <TableContainer className="h-full w-full max-h-[75vh] overflow-auto">
            <Table>
                <TableBody>
                    <FolderRow key={0} file={files} level={level} openFirst={true} collapsible={false} />
                    {/*files.children.map((file: any, index: number) => (
                        <FolderRow key={index} file={file} level={level + 1} />
                    ))*/}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

const FolderRow = ({ file, level, openFirst = false, collapsible = true }: { file: any, level: number, openFirst?: boolean, defaultSelected?: boolean, collapsible?: boolean }) => {

    const [expanded, setExpanded] = useState(openFirst);

    return (
        <>
            <TableRow className="bg-white hover:bg-gray-50" onClick={() => collapsible ? setExpanded(!expanded) : undefined}>
                <TableCell className="w-4">
                    <div style={{ paddingLeft: `${level * 20}px` }}> {/* Indentation */}
                        {file.children && file.children.length > 0 ? (
                            expanded ? <IconFolderOpen className="text-yellow-500" /> : <IconFolders className="text-green-500" />
                        ) : (
                            <IconFolder className="text-yellow-500" />
                        )}
                    </div>
                </TableCell>
                <TableCell>{file.filename}</TableCell>
                <TableCell className="w-4">
                    <Radio value={file.absoluteFile}/>
                </TableCell>
            </TableRow>
            {expanded && file.children && file.children.length > 0 && (
                file.children.map((child: any, index: number) => (
                    <FolderRow key={index} file={child} level={level + 1} />
                ))
            )}
        </>
    );
};

/*
        <div className="overflow-x-auto">
            <Table hoverable striped className="h-full w-full max-h-[75vh] overflow-auto">
                <TableHead className="h-14">
                    <TableRow>
                        <TableHeadCell className="w-4"></TableHeadCell>
                        <TableHeadCell>Folder</TableHeadCell>
                        <TableHeadCell className="w-4">
                            <Button size="xs" color="blue" title="New Folder">
                                <IconPlus />
                            </Button>
                        </TableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {files.map((file, index) => (
                        <FolderRow key={index} file={file} level={level} />
                    ))}
                </TableBody>
            </Table>
        </div>
    );
*/
/*
const FolderRow = ({ file, level }: { file: any, level: number }) => {

    const [expanded, setExpanded] = useState(false);

    return (
        <>
            <TableRow className="bg-white hover:bg-gray-50" onClick={() => setExpanded(!expanded)}>
                <TableCell className="w-4">
                    <div style={{ paddingLeft: `${level * 20}px` }}>
                        {file.children && file.children.length > 0 ? (
                            expanded ? <IconFolderOpen className="text-yellow-500" /> : <IconFolders className="text-yellow-500" />
                        ) : (
                            <IconFolder className="text-yellow-500" />
                        )}
                    </div>
                </TableCell>
                <TableCell>{file.filename}</TableCell>
                <TableCell className="w-4">
                    <Radio name="target" id={file.absoluteFile} />
                </TableCell>
            </TableRow>
            {expanded && file.children && file.children.length > 0 && (
                file.children.map((child: any, index: number) => (
                    <FolderRow key={index} file={child} level={level + 1} />
                ))
            )}
        </>
    );
};
*/

const Loading = () => {
  return (
    <Box className="w-full h-[75vh] bg-white rounded p-2">
        <Stack spacing={1}>
            <Skeleton variant="rectangular" height={60} className="w-full" />
            {[...Array(10)].map((_, index) => (
                <Skeleton key={index} variant="rectangular" height={20} className="w-full" />
            ))}
        </Stack>
    </Box>
  );
};
