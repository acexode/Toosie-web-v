import { Injectable, HostListener, Inject } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { WINDOW } from "./windows.service";
// Menu
export interface Menu {
	path?: string;
	title?: string;
	icon?: string;
	type?: string;
	badgeType?: string;
	badgeValue?: string;
	active?: boolean;
	bookmark?: boolean;
	children?: Menu[];
}

@Injectable({
	providedIn: 'root'
})

export class NavService {

	public screenWidth: any
	public collapseSidebar: boolean = false

	constructor(@Inject(WINDOW) private window) {
		this.onResize();
		if (this.screenWidth < 991) {
			this.collapseSidebar = true
		}
	}

	// Windows width
	@HostListener("window:resize", ['$event'])
	onResize(event?) {
		this.screenWidth = window.innerWidth;
	}

	MENUITEMS: Menu[] = [
		// {
		// 	path: '/dashboard/default', title: 'Dashboard', icon: 'home', type: 'link', badgeType: 'primary', active: false
		// },
		{
			title: 'Products', icon: 'box', type: 'sub', active: false, children: [
				{ path: 'products/product-list', title: 'Product List', type: 'link' },
				{ path: 'products/add-product', title: 'Add Product', type: 'link' },

			]
		},
		{title: 'Category',  icon: 'archive', type: 'sub',active: false, children: [
			{ path: 'category/list', title: 'Category', type: 'link' },
		]
		},
		{
			title: 'Sales', icon: 'dollar-sign', type: 'sub', active: false, children: [
				{ path: 'sales/orders', title: 'Orders', type: 'link' },
			]
		},
		{
			title: 'Banners', icon: 'tag', type: 'sub', active: false, children: [
				{ path: 'banners/list', title: 'Banners', type: 'link' },
				{ path: 'banners/create-banners', title: 'Parallax', type: 'link' },
			]
		},
		{
			title: 'Blogs', icon: 'clipboard', type: 'sub', active: false, children: [
				{ path: 'blog/blog-list', title: 'List Blog', type: 'link' },
				{ path: 'blog/add-blog', title: 'Create Blog', type: 'link' },
			]
		},
		{
			title: 'Users', icon: 'user-plus', type: 'sub', active: false, children: [
				{ path: 'users/list-user', title: 'User List', type: 'link' },
			]
		},
		{
			title: 'Prescription', icon: 'user-plus', type: 'sub', active: false, children: [
				{ path: 'prescriptions/list', title: 'Prescription List', type: 'link' },
			]
		},
	]
	// Array
	items = new BehaviorSubject<Menu[]>(this.MENUITEMS);


}
