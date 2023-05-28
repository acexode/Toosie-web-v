import { Component, OnInit } from "@angular/core";
import { SwPush } from "@angular/service-worker";
@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.scss"],
})
export class AdminDashboardComponent implements OnInit {
  constructor(private swPush: SwPush) {}

  ngOnInit(): void {
    // this.requestSubscription()
  }

 
}
