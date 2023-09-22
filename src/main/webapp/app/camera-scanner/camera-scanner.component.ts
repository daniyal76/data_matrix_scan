import {Component, OnDestroy, OnInit} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";
import {CameraDevice, Html5Qrcode, Html5QrcodeSupportedFormats} from "html5-qrcode";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'scanner-modal',
  templateUrl: './camera-scanner.component.html'
})

export class CameraScannerComponent implements OnInit, OnDestroy {

  public result: any;
  public decodedText: any;
  html5QrCode: Html5Qrcode;
  public cameraId: string;
  config = {fps: 30, qrbox: {width: 300, height: 300}, disableFlip: false};
  zoomLists: number[] = [];

  // @ts-ignore
  qrCodeSuccessCallback = (decodedText, decodedResult) => {
    /* handle success */
    if (decodedText != undefined) {
      this.result = decodedText;
      if (this.result != undefined || this.result != '') {
        this.close();
      }
    }
  };
  // @ts-ignore
  qrCodeErrorCallback = (decodedText, decodedResult) => {
    /* handle success */
  };

  constructor(
    public dialogRef: MatDialogRef<CameraScannerComponent>,
    private _snackBar: MatSnackBar,
  ) {

  }

  ngOnDestroy(): void {
    if (this.html5QrCode.isScanning) {
      this.html5QrCode.stop();
    }
  }

  public cameraList: CameraDevice[];

  ngOnInit(): void {

    Html5Qrcode.getCameras().then(devices => {
      /**
       * devices would be an array of objects of type:
       * { id: "id", label: "label" }
       */
      if (devices && devices.length) {
        this.cameraList = devices;
        let cameraDevices = this.cameraList.filter(camera => camera.label.includes("back"));
        if (cameraDevices != null && cameraDevices.length > 0) {
          this.cameraId = cameraDevices[cameraDevices.length - 1].id;
        } else {
          this.cameraId = this.cameraList[0].id;
        }
        this.html5QrCode.start(this.cameraId, this.config, this.qrCodeSuccessCallback, this.qrCodeErrorCallback);
        // .. use this to start scanning.
      }
    }).catch(err => {
      // handle err
    });

    /*

    // If you want to prefer front camera
        html5QrCode.start({facingMode: "user"}, config, qrCodeSuccessCallback, qrCodeErrorCallback);

    // If you want to prefer back camera
        html5QrCode.start({facingMode: "environment"}, config, qrCodeSuccessCallback, qrCodeErrorCallback);

    // Select front camera or fail with `OverconstrainedError`.
        html5QrCode.start({facingMode: {exact: "user"}}, config, qrCodeSuccessCallback, qrCodeErrorCallback);
    */

    this.html5QrCode = new Html5Qrcode("reader", {
      experimentalFeatures: undefined,
      useBarCodeDetectorIfSupported: true,
      verbose: undefined,
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE, Html5QrcodeSupportedFormats.DATA_MATRIX]
    });
    // This method will trigger user permissions

    const fileinput = document.getElementById('qr-input-file');
    // @ts-ignore
    fileinput.addEventListener('change', e => {
      // @ts-ignore
      if (e.target.files.length == 0) {
        // No file selected, ignore
        return;
      }
      // @ts-ignore
      const imageFile = e.target.files[0];
      // Scan QR Code
      this.html5QrCode.scanFileV2(imageFile, true)
        .then(decodedText => {
          // success, use decodedText
          this.decodedText = JSON.stringify(decodedText);
          this.result = decodedText.result.text;
          this.close();
        })
        .catch(err => {
          // failure, handle it.
          this._snackBar.open('مجددا تلاش کنید', "بستن", {duration: 1000});
          console.log(`Error scanning file. Reason: ${err}`);
        });
    });
  }


  close(): void {
    this.dialogRef.close(this.result);
  }

  selectDevice($event: any) {
    this.html5QrCode.stop().then(r => {
      this.html5QrCode.start($event.value, this.config, this.qrCodeSuccessCallback, this.qrCodeErrorCallback).then(r => {
        this.html5QrCode.getRunningTrackCameraCapabilities().zoomFeature().apply(1);
        const max = this.html5QrCode.getRunningTrackCameraCapabilities().zoomFeature().max();
        const min = this.html5QrCode.getRunningTrackCameraCapabilities().zoomFeature().min();
        if (max > min) {
          this.zoomLists = [];
          for (let i = min; i <= max; i++) {
            this.zoomLists.push(i);
          }
        }
      });
    });
  }

  zoom($event: any) {
    this.html5QrCode.getRunningTrackCameraCapabilities().zoomFeature().apply($event.value);
  }
}
