import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { map, startWith } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';

import { ApiService } from './shared/services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  filter: FormControl = new FormControl();
  maleCheckbox: FormControl = new FormControl();
  femaleCheckbox: FormControl = new FormControl();
  humanCheckbox: FormControl = new FormControl();
  mythologyCheckbox: FormControl = new FormControl();
  otherSpeciesCheckbox: FormControl = new FormControl();
  earthCheckbox: FormControl = new FormControl();
  nuptiaCheckbox: FormControl = new FormControl();
  unknownCheckbox: FormControl = new FormControl();
  otherOriginsCheckbox: FormControl = new FormControl();
  order: FormControl = new FormControl('');
  filteredStates$: Observable<any[]>;
  infoData$: Observable<any[]>;
  nameFilterSub$: Observable<string>;
  femaleFilterSub$: Observable<string>;
  maleFilterSub$: Observable<string>;
  humanFilterSub$: Observable<string>;
  mythologyFilterSub$: Observable<string>;
  otherSpeciesFilterSub$: Observable<string>;
  earthFilterSub$: Observable<string>;
  nuptiaFilterSub$: Observable<string>;
  unknownFilterSub$: Observable<string>;
  otherOriginsFilterSub$: Observable<string>;
  updateDate = true;
  filterData$: Observable<any[]>;
  sorting = [{
    id: '1',
    name: 'ASC',
  },
  {
    id: '2',
    name: 'DESC'
  }]

  constructor(private apiService: ApiService, private sanitization: DomSanitizer) { }
  ngOnInit() {
    this.nameFilterSub$ = this.filter.valueChanges.pipe(startWith(''));
    this.maleFilterSub$ = this.maleCheckbox.valueChanges.pipe(startWith(''));
    this.femaleFilterSub$ = this.femaleCheckbox.valueChanges.pipe(startWith(''));
    this.humanFilterSub$ = this.humanCheckbox.valueChanges.pipe(startWith(''));
    this.mythologyFilterSub$ = this.mythologyCheckbox.valueChanges.pipe(startWith(''));
    this.otherSpeciesFilterSub$ = this.otherSpeciesCheckbox.valueChanges.pipe(startWith(''));
    this.earthFilterSub$ = this.earthCheckbox.valueChanges.pipe(startWith(''));
    this.nuptiaFilterSub$ = this.nuptiaCheckbox.valueChanges.pipe(startWith(''));
    this.unknownFilterSub$ = this.unknownCheckbox.valueChanges.pipe(startWith(''));
    this.otherOriginsFilterSub$ = this.otherOriginsCheckbox.valueChanges.pipe(startWith(''));
    this.filteredStates$ = combineLatest(
      this.apiService.getData('https://rickandmortyapi.com/api/character/'),
      this.nameFilterSub$,
      this.maleFilterSub$, this.femaleFilterSub$,
      this.humanFilterSub$, this.mythologyFilterSub$, this.otherSpeciesFilterSub$,
      this.earthFilterSub$, this.nuptiaFilterSub$, this.unknownFilterSub$, this.otherOriginsFilterSub$,
    )
      .pipe(map(([apiData, filterString]) => {
        let uiData = apiData.results;
        let formEle: HTMLInputElement;

        if (this.updateDate) {
          uiData = this.creationTime(uiData);
        }

        uiData = apiData.results.filter(results => results.name.toLowerCase().includes(filterString));

        formEle = document.getElementById('male') as HTMLInputElement;
        if (formEle.checked) {
          uiData = uiData.filter((results) => results.gender.trim().toLowerCase().localeCompare('male') === 0);
        }

        formEle = document.getElementById('female') as HTMLInputElement;
        if (formEle.checked) {
          uiData = uiData.filter((results) => results.gender.trim().toLowerCase().localeCompare('female') === 0);
        }

        formEle = document.getElementById('human') as HTMLInputElement;
        if (formEle.checked) {
          uiData = uiData.filter((results) => results.species.trim().toLowerCase().localeCompare('human') === 0);
        }

        formEle = document.getElementById('mythology') as HTMLInputElement;
        if (formEle.checked) {
          uiData = uiData.filter((results) => results.species.trim().toLowerCase().localeCompare('mythology') === 0);
        }

        formEle = document.getElementById('other') as HTMLInputElement;
        if (formEle.checked) {
          uiData = uiData.filter((results) => results.species.trim().toLowerCase().localeCompare('human') !== 0);
          uiData = uiData.filter((results) => results.species.trim().toLowerCase().localeCompare('mythology') !== 0);
        }
        formEle = document.getElementById('earth') as HTMLInputElement;
        if (formEle.checked) {
          uiData = uiData.filter((results) => results.origin.name.trim().toLowerCase().includes('earth'));
        }

        formEle = document.getElementById('nuptia') as HTMLInputElement;
        if (formEle.checked) {
          uiData = uiData.filter((results) => results.origin.name.trim().toLowerCase().localeCompare('nuptia') === 0);
        }

        formEle = document.getElementById('unknown') as HTMLInputElement;
        if (formEle.checked) {
          uiData = uiData.filter((results) => results.origin.name.trim().toLowerCase().localeCompare('unknown') === 0);
        }

        formEle = document.getElementById('otherOrigins') as HTMLInputElement;
        if (formEle.checked) {
          uiData = uiData.filter((results) => !results.origin.name.trim().toLowerCase().includes('earth'));
          uiData = uiData.filter((results) => results.origin.name.trim().toLowerCase().localeCompare('nuptia') !== 0);
          uiData = uiData.filter((results) => results.origin.name.trim().toLowerCase().localeCompare('unknown') !== 0);
        }
        this.filterData$ = uiData;
        return uiData;
      }

      ));
    this.order.valueChanges.subscribe((value) => {
      console.log(value);
      // this.filteredStates$ = this.filterData$.pipe(
      //   map((d)) => {
      //   d.sort((a, b) => {
      //     return a < b ? -1 : 1;
      //   });
      //   return d;
      // });
    });
      //     this.test$ = Observable.of(['one', 'two', 'three'])
      // .map((data) => {
      //     data.sort((a, b) => {
      //         return a < b ? -1 : 1;
      //      });
      //     return data;
      //  });
    
  }



creationTime(uiData) {
  for (let data of uiData) {
    let d = (new Date(new Date().toISOString()).valueOf() - new Date(data.created).valueOf()) / 3.17098e-11;
    data['year'] = Math.floor(parseInt(d.toString()));
  }
  this.updateDate = false;
  return uiData;
}
}
