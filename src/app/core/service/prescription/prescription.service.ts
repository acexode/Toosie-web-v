import { prescriptionEndpoints, miscEndpoint } from './../../config/endpoints';
import { RequestService } from './../../request/request.service';
import { Injectable } from '@angular/core';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable, from } from 'rxjs';
const REMINDER_KEY = 'pill-reminder';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {

  constructor(private reqS: RequestService) {

  }
  async getReminderList() {
    const list = await localStorage.getItem(REMINDER_KEY);
    return list  ? list : '[]';
  }

  uploadMedia(formData): Observable<any> {
    return this.reqS.post(miscEndpoint.mediaUpload,formData);
  }
  allPrescriptions(): Observable<any> {
    return this.reqS.get(prescriptionEndpoints.usersPrescription + '/1').pipe(
                map((data: any) =>  data.prescription
                )
               );
  }
}
