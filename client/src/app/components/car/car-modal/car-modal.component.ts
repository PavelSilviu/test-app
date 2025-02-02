import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { ToastrService } from 'ngx-toastr';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-car-modal',
  templateUrl: './car-modal.component.html'
})
export class CarModalComponent implements OnInit {
  @Input() id_car: number | undefined;

  modal = {} as any;

  showError : boolean = false;

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private toastr: ToastrService) {
  }

  ngOnInit(): void {
    if (this.id_car) {
      this._spinner.show();
      axios.get(`/api/car/${this.id_car}`).then(({ data }) => {
        this.modal = data;
        this._spinner.hide();
      }).catch(() => this.toastr.error('Eroare la preluarea informației!'));
    }
  }

  save(brand : NgModel, model : NgModel, year : NgModel, capacity : NgModel): void {
    // validation
    if(model.valid && brand.valid && year.valid && capacity.valid){
      this._spinner.show();

      if (!this.id_car) {
        axios.post('/api/car', this.modal).then(() => {
          this._spinner.hide();
          this.toastr.success('Informația a fost salvată cu succes!');
          this.activeModal.close();
        }).catch(() => this.toastr.error('Eroare la salvarea informației!'));
      } else {
        axios.put('/api/car', this.modal).then(() => {
          this._spinner.hide();
          this.toastr.success('Informația a fost modificată cu succes!');
          this.activeModal.close();
        }).catch(() => this.toastr.error('Eroare la modificarea informației!'));
      }
    } else{
      this.toastr.error('Vă rugăm să verificați câmpurile completate!');
      this.showError = true;
    }
  }

  selectSearch(term: string, item: any): boolean {
    const isWordThere = [] as any;
    const splitTerm = term.split(' ').filter(t => t);

    item = REPLACE_DIACRITICS(item.name);

    splitTerm.forEach(term => isWordThere.push(item.indexOf(REPLACE_DIACRITICS(term)) !== -1));
    const all_words = (this_word: any) => this_word;

    return isWordThere.every(all_words);
  }

  calculateTax(): number {
    const capacity = this.modal.capacity;
  
    if (capacity < 1500) {
      return 50;
    } else if (capacity >= 1500 && capacity < 2000) {
      return 100;
    } else {
      return 200;
    }
  }
  
  updateTax() : void {
    this.modal.tax = this.calculateTax();
  }
}
