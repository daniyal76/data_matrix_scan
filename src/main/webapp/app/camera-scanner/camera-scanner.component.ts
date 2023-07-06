import {Component, OnDestroy, OnInit} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";
import {Html5Qrcode} from "html5-qrcode";

@Component({
  selector: 'scanner-modal',
  templateUrl: './camera-scanner.component.html'
})

export class CameraScannerComponent implements OnInit,OnDestroy {

  public result: any;
  html5QrCode:Html5Qrcode;

  constructor(
    public dialogRef: MatDialogRef<CameraScannerComponent>,
  ) {

  }

  ngOnDestroy(): void {
        this.html5QrCode.stop();
    }

  title = 'app';
  selectedFile = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {
    console.log(this.selectedFile); // You can use FormData upload to backend server
  }

  ngOnInit(): void {
    // @ts-ignore
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      /* handle success */
      console.log('111111111111111111111111111', decodedText);
      if (decodedText != undefined) {
        this.result = decodedText;
        if (this.result != undefined || this.result != '') {
          this.close();
        }
      }
    };
    // @ts-ignore
    const qrCodeErrorCallback = (decodedText, decodedResult) => {
      /* handle success */
      console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@', decodedResult);
    };
    const config = {fps: 2, qrbox: {width: 300, height: 300}};
    /*

    // If you want to prefer front camera
        html5QrCode.start({facingMode: "user"}, config, qrCodeSuccessCallback, qrCodeErrorCallback);

    // If you want to prefer back camera
        html5QrCode.start({facingMode: "environment"}, config, qrCodeSuccessCallback, qrCodeErrorCallback);

    // Select front camera or fail with `OverconstrainedError`.
        html5QrCode.start({facingMode: {exact: "user"}}, config, qrCodeSuccessCallback, qrCodeErrorCallback);
    */
    this.html5QrCode = new Html5Qrcode("reader");
// Select back camera or fail with `OverconstrainedError`.
    this.html5QrCode.start({
      facingMode: "environment"
    }, config, qrCodeSuccessCallback, qrCodeErrorCallback);
  }


  close(): void {
    this.html5QrCode.stop();
    this.dialogRef.close(this.result);
  }

}
