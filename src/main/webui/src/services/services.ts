import { Observable } from "rxjs"
import type { FileItem, Message } from "./model"
import axios, { type AxiosInstance } from "axios";

const BASE_URL = '/'; //'http://localhost:9080/'

const axiosClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {'Content-Type': 'application/json'},
    responseType: 'json'
})

export async function getSourceFileList(): Promise<FileItem[]> {
    return (await axiosClient.get('files/source')).data;
}

export async function getTargetFolderList(): Promise<FileItem> {
    return (await axiosClient.get('files/target')).data;
}

export async function addFolder(name: string, parent: string): Promise<boolean> {
    return (await axiosClient.put('files/mkdir',
        {
            name: name,
            parent: parent
        }
    )).data
}

export async function moveFiles(source: string[], target: string): Promise<void> {
    await axiosClient.post('files', {
        files: source,
        target: target
    })
}

export function getMessages(): Observable<Message> {
    return new Observable<string>(subscriber => {
        const eventSource = new EventSource(BASE_URL + 'files/messages');
        eventSource.onmessage = (event: MessageEvent) => {
            subscriber.next(event.data);
        };
        eventSource.onerror = (_event: Event) => {
            subscriber.error(new Error('Error'));
            eventSource.close();
        }

        return () => {
            console.log('unsubscribed');
            eventSource.close();
        }
    });
}
