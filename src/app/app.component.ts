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
  // femaleCheckbox: FormControl;
  filteredStates$: Observable<any[]>;
  nameFilterSub$: Observable<string>;
  femaleFilterSub$: Observable<string>;
  maleFilterSub$: Observable<string>;
  humanFilterSub$: Observable<string>;
  mythologyFilterSub$: Observable<string>;
  otherSpeciesFilterSub$: Observable<string>;
  originFilterSub$: Observable<string>;


  constructor(private apiService: ApiService, private sanitization: DomSanitizer) { }
  ngOnInit() {
    this.nameFilterSub$ = this.filter.valueChanges.pipe(startWith(''));
    this.maleFilterSub$ = this.maleCheckbox.valueChanges.pipe(startWith(''));
    this.femaleFilterSub$ = this.femaleCheckbox.valueChanges.pipe(startWith(''));
    this.humanFilterSub$ = this.humanCheckbox.valueChanges.pipe(startWith(''));
    this.mythologyFilterSub$ = this.mythologyCheckbox.valueChanges.pipe(startWith(''));
    this.otherSpeciesFilterSub$ = this.otherSpeciesCheckbox.valueChanges.pipe(startWith(''));
    this.originFilterSub$ = this.filter.valueChanges.pipe(startWith(''));
    this.filteredStates$ = combineLatest(this.apiService.getData('https://rickandmortyapi.com/api/character/'),
      this.nameFilterSub$, this.maleFilterSub$, this.femaleFilterSub$, this.humanFilterSub$, this.mythologyFilterSub$,
      this.otherSpeciesFilterSub$, this.originFilterSub$)
      .pipe(map(([apiData, filterString]) => {
        let uiData = apiData.results;
        let formEle: HTMLInputElement;
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
        // if (speciesFilter) {
        //   // uiData = uiData.filter((results) => results.species.trim().toLowerCase().localeCompare(speciesFilter) === 0);
        // }
        // if (originFilter) {
        //   // uiData = uiData.filter((results) => results.origin.name.trim().toLowerCase().localeCompare(originFilter) === 0);
        // }
        return uiData;
      }

      ))
  }
}
