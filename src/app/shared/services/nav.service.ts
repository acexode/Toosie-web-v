import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { InventoryService } from 'src/app/core/service/inventory/inventory.service';

// Menu
export interface Menu {
	path?: string;
	title?: string;
	type?: string;
	megaMenu?: boolean;
	image?: string;
	active?: boolean;
	badge?: boolean;
	badgeText?: string;
	children?: Menu[];
}

@Injectable({
	providedIn: 'root'
})

export class NavService {
	
	categories =  [
		{ path: '/shop/category/baby-child', title: 'Baby & Child', type: 'link' },
		{ path: '/shop/category/women-care', title: 'Women Care', type: 'link' },
		{ path: '/shop/category/men-care', title: 'Men Care', type: 'link' },
		{ path: '/shop/category/vitamins', title: 'Vitamins', type: 'link' },
		{ path: '/shop/category/hair-care', title: 'Hair Care', type: 'link' },
		{ path: '/shop/category/skin-care', title: 'Skin Care', type: 'link' },
		{ path: '/shop/category/oral-care', title: 'Oral Care', type: 'link' },
		{ path: '/shop/category/organic-products', title: 'Organic Products', type: 'link' },
		{ path: '/shop/category/medical-supplies', title: 'Medical Supplies', type: 'link' },
	]
	  constructor(private invS: InventoryService){
	}
	public screenWidth: any;
	public leftMenuToggle: boolean = false;
	public mainMenuToggle: boolean = false;

	// Windows width
	@HostListener('window:resize', ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
	}

	MENUITEMS: Menu[] = [
		{
			title: 'home', type: 'link',path: '/home/main', active: false
		},
		{
			title: 'Categories', type: 'sub', active: false,
			children: this.categories
		},
		{
			title: 'Prescription', type: 'sub', active: false, children: [
				{ path: '/shop/collection/left/sidebar', title: 'upload prescription', type: 'link' },
				{ path: '/shop/collection/right/sidebar', title: 'prescription history', type: 'link' },
				{ path: '/shop/collection/no/sidebar', title: 'auto refill', type: 'link' }
			]
		},
		{
			title: 'blog', type: 'link',path: '/home/blog', active: false
		},
		{
			title: 'contact', type: 'link',path: '/pages/contact', active: false
		},
	];

	LEFTMENUITEMS: Menu[] = [
		
		{
			title: 'home', type: 'link',path: '/home/main', active: false
		},
		{
			title: 'Categories', type: 'sub', active: false,
			children: [
				{ path: '/shop/category/baby-child', title: 'Baby & Child', type: 'link' },
				{ path: '/shop/category/women-care', title: 'Women Care', type: 'link' },
				{ path: '/shop/category/men-care', title: 'Men Care', type: 'link' },
				{ path: '/shop/category/vitamins', title: 'Vitamins', type: 'link' },
				{ path: '/shop/category/hair-care', title: 'Hair Care', type: 'link' },
				{ path: '/shop/category/skin-care', title: 'Skin Care', type: 'link' },
				{ path: '/shop/category/oral-care', title: 'Oral Care', type: 'link' },
				{ path: '/shop/category/organic-products', title: 'Organic Products', type: 'link' },
				{ path: '/shop/category/medical-supplies', title: 'Medical Supplies', type: 'link' },
			]
		},
		{
			title: 'Prescription', type: 'sub', active: false, children: [
				{ path: '/shop/collection/left/sidebar', title: 'upload prescription', type: 'link' },
				{ path: '/shop/collection/right/sidebar', title: 'prescription history', type: 'link' },
				{ path: '/shop/collection/no/sidebar', title: 'auto refill', type: 'link' }
			]
		},
		{
			title: 'blog', type: 'link',path: '/home/blog', active: false
		},
		{
			title: 'contact', type: 'link',path: '/home/contact', active: false
		}
	];

	// Array
	items = new BehaviorSubject<Menu[]>(this.MENUITEMS);
	leftMenuItems = new BehaviorSubject<Menu[]>(this.LEFTMENUITEMS);

}
