import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private logger: LoggerService) { }

  private heroesUrl = 'api/heroes';  // URL to web api

  // getHerosTap(message: string) {
  //   this.log(`from the tap ${message}`);
  //   this.logToBrowser(`from the tap ${message}`);
  // }

  // getHeroes(): Hero[] {
  //   return HEROES;
  // }
  // getHeroes(): Observable<Hero[]> {
  //   // TODO: send the message _after_ fetching the heros
  //   this.messageService.add('HeroService: fetched heroes');
  //   return of(HEROES);
  // }
  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    // return this.http.get<Hero[]>(this.heroesUrl);

    // error handling
    // return this.http.get<Hero[]>(this.heroesUrl)
    //   .pipe(
    //     catchError(this.handleError<Hero[]>('getHeroes', []))
    //   );

    // tap example, seems to be just an intermediary call that can be added
    // without affecting the process. In this case, logging is done, but
    // the next step (catch error) uses the initial request data and
    // is not affected by the tap call
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('fetched heroes')),
        tap(_ => this.logToBrowser('fetched heroes')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  // getHeroTap(message: string) {
  //   this.log(`from the tap ${message}`);
  //   this.logToBrowser(`from the tap ${message}`);
  // }



  getHero(id: number): Observable<Hero> {
    // TODO: send the message _after_ fetching the hero
    // this.messageService.add(`HeroService: fetched hero id=${id}`);
    // return of(HEROES.find(hero => hero.id === id));

    const url = `${this.heroesUrl}/${id}`;
    // var result = this.http.get<Hero>(url);

    // //.do(val => console.log('before map to string', val))
    // // .do(val => console.log('after map to string', val))
    // var alternateResult = result;
    // alternateResult.pipe(
    //       tap(val => console.log('before map to string', val)),
    //       map(title => title.name.toUpperCase()),
    //       tap(val => console.log('after map to string', val))
    // };

    // result.pipe(
    //   tap(_ => this.log(`fetched hero id=${id}`)),
    //   tap(_ => this.logToBrowser(`fetched hero id=${id}`)),
    //   catchError(this.handleError<Hero>(`getHero id=${id}`))
    // );

    return this.http.get<Hero>(url).pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        tap(_ => this.logToBrowser(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );

    // return result;
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  private logToBrowser(message: string) {
    this.logger.log(message);
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
}
