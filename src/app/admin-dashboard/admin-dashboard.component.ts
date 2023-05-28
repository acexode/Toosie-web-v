import { Component, OnInit } from "@angular/core";
import { SwPush } from "@angular/service-worker";
import { RequestService } from "../core/request/request.service";
import { ToastrService } from "ngx-toastr";
import { baseEndpoints } from "../core/config/endpoints";
@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.scss"],
})
export class AdminDashboardComponent implements OnInit {
  constructor(private swPush: SwPush, private reqS: RequestService, private toast: ToastrService) {}

  ngOnInit(): void {
    this.requestSubscription()
  }

  requestSubscription = () => {
    console.log('INIT PERMISSION');
    if (!this.swPush.isEnabled) {
      console.log("Notification is not enabled.");
      return;
    }
    console.log('SHOW PERMISSION');
    this.swPush.requestSubscription({
      serverPublicKey: 'BEvFjH8RiqlzCGg3KQOv-xxktBqiiVHPCMMlDxRTTrhgA1nRPvV7yBQ79Aa8bT6ZeYT6b06ViQ2sp2AoOSJ0R_8'
    }).then((res) => {
      this.reqS.post(baseEndpoints.notify, res)
      this.toast.success("You will receive notification when a new order is created");
      console.log(JSON.stringify(res));
    }).catch((_) => this.toast.error("Unable to save user permission"));
  };
}
