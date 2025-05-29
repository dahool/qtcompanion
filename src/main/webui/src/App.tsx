import FileSource from './ui/FileSource'
import FileTarget from './ui/FileTarget'
import { IconArrowPathRightFill } from '@intentui/icons'
import { useState } from 'react'
import AlertFail from './ui/AlertFail'
import { moveFiles } from './services/services'
import { Alert, Button, Snackbar } from '@mui/material'
import Messages from './ui/Messages'

export default function App() {

  const [showAlert, setShowAlert] = useState(false);
  const [showMoveDialog, setShowMoveDialog] = useState(false);

  const startMoveFiles = () => {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
      const checkedItems = Array.from(checkboxes).map((checkbox) => checkbox.id );

      const target = document.querySelectorAll<HTMLInputElement>('input[type="radio"]:checked');
      const targetItems = Array.from(target).map((item) => item.value );

      if (checkedItems.length === 0 || targetItems.length === 0) {
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        return;
      }

      moveFiles(checkedItems, targetItems[0]).then(() => {
        setShowMoveDialog(true);
      })

  }

  return (
    <>
      <Messages/>
      <AlertFail show={showAlert}>
        <span>Select source and target</span>
      </AlertFail>
      <Snackbar open={showMoveDialog} autoHideDuration={2000} onClose={() => setShowMoveDialog(false)}>
        <Alert
          severity="info"
          variant="filled"
          sx={{ width: '100%' }}
        >
          File copy in progress
        </Alert>
      </Snackbar>
      <div className="w-[90vw] h-[90vh] mx-auto absolute inset-0 my-auto bg-gray-800 rounded-lg px-6 py-8 ring shadow-xl ring-gray-900/5">
        <div className="flex items-start justify-center flex-col md:flex-row">
          <div className="w-full h-1/2 md:w-1/2 md:h-full"><FileSource/></div>
          <div className="w-2 mt-2"></div>
          <div className="w-full h-1/2 md:w-1/2 md:h-full"><FileTarget/></div>
        </div>
        <div className="flex justify-center mt-4"><Button variant="contained" onClick={startMoveFiles} className='cursor-pointer'>Copy<IconArrowPathRightFill className="ml-2"/></Button></div>
      </div>
    </>
  )
}