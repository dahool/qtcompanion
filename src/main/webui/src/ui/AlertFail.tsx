import { IconCircleExclamation } from "@intentui/icons"

export default function AlertFail({show, children}: {show: boolean, children: React.ReactNode}) {

    if (!show) return null;

    return (
        <div className="absolute top-0 left-0 w-full z-999">
            <div className="w-full">
                <div className="flex items-center p-4 mb-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800" role="alert">
                    <div className="ms-3 text-sm font-medium flex justify-center items-center w-full">
                        <IconCircleExclamation className="mr-4"></IconCircleExclamation>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )

}