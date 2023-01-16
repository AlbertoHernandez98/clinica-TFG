import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { LogoDataService } from 'src/app/providers/mocked-services/logo-data.service';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent {
  edit: boolean;
  files: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<DragAndDropComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private logoDataService: LogoDataService
  ) {
    this.edit = data.edit;
  }

  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    // FIXME: Mock: Save file to logo data service
    this.logoDataService.saveLogos(this.files);
    this.close();
  }

  deleteFile() {
    this.files.splice(0, 1);
  }

  fileBrowseHandler(files: any) {
    this.prepareFilesList(files);
  }

  close() {
    this.dialogRef.close();
  }

  continue() {
    console.log('Button clicked!');
  }
}

export interface DragDropOutput {
  fileList?: FileList | undefined;
  btnDelete?: boolean;
}
