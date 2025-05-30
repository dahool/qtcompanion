
export interface Message {
    type: string;
    message: string;
}

export interface FileItem {
    filename: string;
    absoluteFile: string;
    children: FileItem[];
}
