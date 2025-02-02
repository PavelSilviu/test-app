import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faPlus, faEdit, faTrashAlt, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { CarModalComponent } from './car-modal/car-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.scss']
})
export class CarComponent implements OnInit {
  faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
  limit: number = 70; showBackTop: string = '';
  cars: any = [];
  filteredCars: any = [];
  // variables for filters
  brandFilter: string = '';
  modelFilter: string = '';
  yearFilter: string = '';
  capacityFilter: string = '';
  taxFilter: string = '';

  constructor(private _modal: NgbModal, private _spinner: NgxSpinnerService, private toastr: ToastrService) { SET_HEIGHT('view', 20, 'height'); }

  ngOnInit(): void {
    this.loadData();
  }

  loadData = (): void => {
    this._spinner.show();
    axios.get('/api/car').then(({ data }) => {
      this.cars = data;
      this.filteredCars = this.cars;
      this._spinner.hide();
    }).catch(() => this.toastr.error('Eroare la preluarea informațiilor!'));
  }

  addEdit = (id_car?: number): void => {
    const modalRef = this._modal.open(CarModalComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.id_car = id_car;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
  }

  delete = (car: any): void => {
    const modalRef = this._modal.open(ConfirmDialogComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.title = `Ștergere informație`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți mașina cu brandul <b>${car.brand}</b>, modelul: <b>${car.model}</b>, anul: <b>${car.year}</b>, capacitatea cilindrică: <b>${car.capacity}</b>, taxa: <b>${car.tax}</b>?`;
    modalRef.closed.subscribe(() => {
      try{
        axios.delete(`/api/car/${car.id}`);
        //stergere si din Junction 
        axios.delete(`/api/junction/cars/${car.id}/`);

        this.toastr.success('Informația a fost ștearsă cu succes!');
        this.loadData();
      } catch (error) {
        this.toastr.error('Eroare la ștergerea informației!')
      }
    });
  }

  onResize(): void {
    SET_HEIGHT('view', 20, 'height');
  }

  showTopButton(): void {
    if (document.getElementsByClassName('view-scroll-cars')[0].scrollTop > 500) {
      this.showBackTop = 'show';
    } else {
      this.showBackTop = '';
    }
  }

  onScrollDown(): void {
    this.limit += 20;
  }

  onScrollTop(): void {
    SCROLL_TOP('view-scroll-cars', 0);
    this.limit = 70;
  }

  applyFilters(): void {
    this.filteredCars = this.cars.filter((car: any) =>
      car.brand.includes(this.brandFilter) &&
      car.model.includes(this.modelFilter) &&
      car.year.includes(this.yearFilter) &&
      car.capacity.includes(this.capacityFilter) &&
      car.tax.includes(this.taxFilter)
    );
  }
}
