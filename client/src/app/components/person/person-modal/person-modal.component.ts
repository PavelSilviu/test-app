import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { ToastrService } from 'ngx-toastr';
import { NgModel } from '@angular/forms';
import { last } from 'rxjs';
import { type } from 'os';

@Component({
  selector: 'app-person-modal',
  templateUrl: './person-modal.component.html'
})
export class PersonModalComponent implements OnInit {
  @Input() id_person: number | undefined;

  modal = {} as any;

  showError : boolean = false;

  selected: any[] = [];

  cars : any = "";

  constructor(private _spinner: NgxSpinnerService, public activeModal: NgbActiveModal, private toastr: ToastrService) {
  }

  async ngOnInit() {
    if (this.id_person) {
      this._spinner.show();
      try{
        const personsData = await axios.get(`/api/person/${this.id_person}`);
        this.modal = personsData.data;
        
        const carsData = await axios.get('/api/car');
        this.cars = carsData.data.map((i : any) => { i.fullDetails = i.brand + ' ' + i.model + ' Capacity: ' + i.capacity + ' Tax: ' + i.tax; return i; });
        // daca are id ii iei masinile personale
        const ownedCarsData = await axios.get(`/api/junction/${this.id_person}/cars`);
        this.selected = ownedCarsData.data.map((i : any) => { i.fullDetails = i.brand + ' ' + i.model + ' Capacity: ' + i.capacity + ' Tax: ' + i.tax; return i; });
        console.log(this.cars,"masini");
        this._spinner.hide();
      } catch (error){
        this.toastr.error('Eroare la preluarea informației!')
      }
    } else{
      axios.get('/api/car').then(({ data }) => {
        this.cars = data.map((i : any) => { i.fullDetails = i.brand + ' ' + i.model + ' Capacity: ' + i.capacity + ' Tax: ' + i.tax; return i; });
        console.log(this.cars,"masini");
      }).catch(() => this.toastr.error('Eroare la preluarea mașinilor!'));
    }
  }

  async save(firstName: NgModel, lastName: NgModel, cnp: NgModel) {
    // validation
    if(firstName.valid && lastName.valid && cnp.valid){
      this._spinner.show();

      if (!this.id_person) {
        try{
          const response = await axios.post('/api/person', this.modal);
          //daca nu are id, creezi intrare noua in Junction
          await axios.post(`/api/junction/${response.data.createdPersonId}/cars/`, { carIds: this.selected });
          
          this._spinner.hide();
          this.toastr.success('Informația a fost salvată cu succes!');
          this.activeModal.close();
        } catch (error){
          console.log(error);
          this.toastr.error('Eroare la modificarea informației!');
        }
      } else {
        try{
          await axios.put('/api/person', this.modal);
          //daca are id, modifici o intrare din Junction
          await axios.put(`/api/junction/${this.id_person}/cars/`, { carIds: this.selected });
          this._spinner.hide();
          this.toastr.success('Informația a fost modificată cu succes!');
          this.activeModal.close();
        } catch (error){
          console.log(error);
          this.toastr.error('Eroare la modificarea informației!');
        }
      }
    } else {
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

  calculateAge(): any {
    let cnp = this.modal.cnp;
    cnp = cnp.toString();
    let age;

    if(cnp.length == 13){
      const year = cnp.substring(1,3);
      const month = cnp.substring (3,5);
      const day = cnp.substring (5,7);
      let birthDate;

      if(cnp[0] == 1 || cnp[0] == 2){
        birthDate = new Date(19 + year, month, day);
      } else{
        birthDate = new Date(20 + year, month, day);
      }
    
      let ageMilisec = new Date().getTime() - birthDate.getTime();
      let milisecInOneYear = 1000 * 60 * 60 * 24 * 365.25; //365.2 pt ani bisecti
      age = Math.floor(ageMilisec / milisecInOneYear);
      //console.log(age, "varsta")
    }
    return age;
  }
  
  updateAge() : void {
    this.modal.age = this.calculateAge();
  }

  compareCars(car1: any, car2: any): boolean {
    return car1 && car2 && car1.id === car2.id;
  }

  isAtLeastOneCarSelected(): boolean {
    return this.selected && this.selected.length > 0;
  }

}
