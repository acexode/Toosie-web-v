import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { roleEndpoints, inventoryEndpoints } from './../../config/endpoints';
import { RequestService } from './../../request/request.service';
import { Injectable } from '@angular/core';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  cartStore: BehaviorSubject<any> = new BehaviorSubject([]);
  categoryStore: BehaviorSubject<any> = new BehaviorSubject([]);
  popularStore: BehaviorSubject<any> = new BehaviorSubject([]);
  latestStore: BehaviorSubject<any> = new BehaviorSubject([]);
  similarStore: BehaviorSubject<any> = new BehaviorSubject([]);
  loading: BehaviorSubject<any> = new BehaviorSubject(false);
  constructor(private reqS: RequestService) {
    this.multipleRequest();
   }

  allBrands(){
    return this.reqS.get(inventoryEndpoints.brands).pipe(map((data: any) => data.inventoryBrands));
  }
  multipleRequest(){
    const popular = this.reqS.get(inventoryEndpoints.popular +'/1');
    const latest = this.reqS.get(inventoryEndpoints.latest +'/1');
    const categories = this.reqS.get(inventoryEndpoints.allCategories);
    forkJoin([popular, latest, categories]).subscribe((results: any) =>{
      this.popularStore.next(results[0].inventory);
      this.latestStore.next(results[1].inventory);
      this.categoryStore.next(results[2].inventoryCategory);
    });
  }
  allCategories(){
    return this.reqS.get(inventoryEndpoints.allCategories);
  }
  inventoryByCategory(id){
    return this.reqS.get(inventoryEndpoints.inventoryByCategory + id + '/1');
  }
  singleInventory(id){
    return this.reqS.get(inventoryEndpoints.single + id);
  }
  myOrders(){
    return this.reqS.get(inventoryEndpoints.myOrders + '1');
  }
  searchInventory(term){
    console.log(term.length);
    this.loading.next(true);
    return this.reqS.post(inventoryEndpoints.searchInventory, {searchText: term });
  }
  search(terms: Observable<string>){
    console.log(terms);
    return terms.pipe(debounceTime(1000),distinctUntilChanged(),
    switchMap(term => this.searchInventory(term)));
  }
  savePODCashOrder(obj){
    return this.reqS.post(inventoryEndpoints.savePODOrder, obj);
  }
  saveCardOrder(obj){
    return this.reqS.post(inventoryEndpoints.saveCardOrder, obj);
  }
  saveTokenOrder(obj){
    return this.reqS.post(inventoryEndpoints.saveTokenOrder, obj);
  }
  string_to_slug (str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}

}
