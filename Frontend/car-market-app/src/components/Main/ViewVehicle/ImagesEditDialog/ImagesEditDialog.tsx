import { Dialog } from '@mui/material';
import { FC, useState } from 'react';
import "./ImagesEditDialog.scss";
export interface ImagesEditDialogProps {
  initialImages: string[],
  isOpen: boolean,
  onClose: Function,
}

const ImagesEditDialog: FC<ImagesEditDialogProps> = (props: ImagesEditDialogProps) => {

  const [images, setImages] = useState(new Array<string>());

  return (
    <Dialog open={props.isOpen} onClose={() => props.onClose()} PaperProps={{ sx: { width: "90%", height: "90%", maxWidth: "90%", backgroundColor:"transparent" } }}>
    </Dialog>
  );
}

export default ImagesEditDialog;
