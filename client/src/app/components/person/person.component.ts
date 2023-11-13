import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { faPlus, faEdit, faTrashAlt, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { PersonModalComponent } from './person-modal/person-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

  faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
  limit: number = 70; showBackTop: string = '';
  persons: any = [];
  filteredPersons: any = [];
  // variables for filters
  firstNameFilter: string = '';
  lastNameFilter: string = '';
  cnpFilter: string = '';
  ageFilter: string = '';

  constructor(private _modal: NgbModal, private _spinner: NgxSpinnerService, private toastr: ToastrService) { SET_HEIGHT('view', 20, 'height'); }

  ngOnInit(): void {
    this.loadData();
  }

  loadData = (): void => {
    this._spinner.show();
    axios.get('/api/person').then(({ data }) => {
      this.persons = data;
      this.filteredPersons = this.persons;
      this._spinner.hide();
    }).catch(() => this.toastr.error('Eroare la preluarea informațiilor!'));
  }

  addEdit = (id_person?: number): void => {
    const modalRef = this._modal.open(PersonModalComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.id_person = id_person;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
  }

  delete = (person: any): void => {
    const modalRef = this._modal.open(ConfirmDialogComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.title = `Ștergere informație`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți persoana cu numele <b>${person.firstName}</b>, prenumele: <b>${person.lastName}</b>, CNP-ul: <b>${person.cnp}</b>, vârsta : <b>${person.age}</b>?`;
    modalRef.closed.subscribe(() => {
      axios.delete(`/api/person/${person.id}`).then(() => {
        this.toastr.success('Informația a fost ștearsă cu succes!');
        this.loadData();
      }).catch(() => this.toastr.error('Eroare la ștergerea informației!'));

      //stergere si din Junction 
    });
  }

  onResize(): void {
    SET_HEIGHT('view', 20, 'height');
  }

  showTopButton(): void {
    if (document.getElementsByClassName('view-scroll-persons')[0].scrollTop > 500) {
      this.showBackTop = 'show';
    } else {
      this.showBackTop = '';
    }
  }

  onScrollDown(): void {
    this.limit += 20;
  }

  onScrollTop(): void {
    SCROLL_TOP('view-scroll-persons', 0);
    this.limit = 70;
  }

  applyFilters(): void {
    this.filteredPersons = this.persons.filter((person: any) =>
      person.firstName.includes(this.firstNameFilter) &&
      person.lastName.includes(this.lastNameFilter) &&
      person.cnp.includes(this.cnpFilter) &&
      person.age.includes(this.ageFilter)
    );
  }
}
