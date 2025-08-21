import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../service/api';
import moment from 'moment';
import { map, Observable, Subject, takeUntil } from 'rxjs';



interface FormData {
  fechaInicio: string;
  fechaFin: string;
  servicio: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  formData: FormData = {
    fechaInicio: '',
    fechaFin: '',
    servicio: ''
  };
  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef, private ngZone: NgZone) { }
  public services: any[] = [];
  public shifts$ = new Observable<any[]>();
  private ngUnsubscribe = new Subject<void>();
  ngOnInit() {
    this.getService()
  }

  getService() {
    this.apiService.getDataService().subscribe((data) => {
      this.ngZone.run(() => {
        this.services = data;
        this.cdr.detectChanges();
        console.log(this.services);
      });
    });
  }

  generarTurnos() {

    if (!this.formData.fechaInicio || !this.formData.fechaFin || !this.formData.servicio) {
      alert('Por favor complete todos los campos');
      return;
    }

    const fechaInicio = moment(this.formData.fechaInicio).format("YYYY-MM-DD");
    const fechaFin = moment(this.formData.fechaFin).format("YYYY-MM-DD");
    const servicioData = this.formData.servicio;

    // Validación de fechas usando moment
    if (moment(fechaInicio).isAfter(fechaFin)) {
      alert('La fecha de inicio no puede ser mayor que la fecha de fin');
      return;
    }

    this.generateShifts(fechaInicio, fechaFin, servicioData);
  }

  private generateShifts(fechaInicio: string, fechaFin: string, servicioData: string) {

    const dataSend = {
      startDate: fechaInicio,
      endDate: fechaFin,
      serviceId: servicioData
    }
    this.shifts$ = this.apiService.generateShifts(dataSend).pipe(
      map((data: any) => data.map((sh: any) => ({
        ...sh,
        shiftDate: moment(sh.shiftDate).format("DD/MM/YYYY")
      }))),takeUntil(this.ngUnsubscribe)
    );

  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
