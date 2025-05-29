
export interface Status {
    message: string;
    progress: number;
}

export interface FileItem {
    filename: string;
    absoluteFile: string;
    children: FileItem[];
}
