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
  image: any;
  filter: FormControl;
  filteredStates$: Observable<any[]>;
  filter$: Observable<string>;
  genderFilter$: Observable<string>;

  constructor(private apiService: ApiService, private sanitization: DomSanitizer) { }
  ngOnInit() {
    this.filter = new FormControl('');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));
    this.genderFilter$ = this.filter.valueChanges.pipe(startWith('male'));
    this.filteredStates$ =
      combineLatest(this.apiService.getData('https://rickandmortyapi.com/api/character/'), this.filter$, this.genderFilter$)
        .pipe(map(([apiData, filterString, genderFilter]) => {
          let uiData = apiData.results;
          if (filterString) {
            uiData = apiData.results.filter(results => results.name.toLowerCase().includes(filterString)); // whatever your filter logic is
          }
          if (genderFilter) {
            uiData = uiData.filter(results => results.gender.toLowerCase().includes(genderFilter)); // whatever your filter logic is
          }
          return uiData;
        }

        ))
  }

}
