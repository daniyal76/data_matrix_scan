import {Component, OnDestroy, OnInit} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";
import {CameraDevice, Html5Qrcode} from "html5-qrcode";
import {environment} from "../../environments/environment";

@Component({
  selector: 'scanner-modal',
  templateUrl: './camera-scanner.component.html'
})

export class CameraScannerComponent implements OnInit, OnDestroy {

  public result: any;
  html5QrCode: Html5Qrcode;
  public cameraId: string;
  config = {fps: 30, qrbox: {width: 300, height: 300}};

  constructor(
    public dialogRef: MatDialogRef<CameraScannerComponent>,
  ) {

  }

  ngOnDestroy(): void {
    this.html5QrCode.stop();
  }

  public cameraList: CameraDevice[];

  ngOnInit(): void {
    // @ts-ignore
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      /* handle success */
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
    };
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
    // @ts-ignore
    this.html5QrCode.start({facingMode: "environment"}, this.config, qrCodeSuccessCallback, qrCodeErrorCallback);
  }


  close(): void {
    this.dialogRef.close(this.result);
  }

}
