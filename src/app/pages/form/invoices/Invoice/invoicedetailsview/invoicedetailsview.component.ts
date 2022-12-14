import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import Swal from 'sweetalert2';
import { Invoicedetails } from '../invoicedetailsnew/invoicedetailsnew.model';

@Component({
  selector: 'app-invoicedetailsview',
  templateUrl: './invoicedetailsview.component.html',
  styleUrls: ['./invoicedetailsview.component.scss']
})
export class InvoicedetailsviewComponent implements OnInit {

  invoiceid:any;
  data:any;
  companylistArr:any;
  clientlistArr : any;
  invoicedetails = new Invoicedetails;
  url: any;
  id: any;
  id1: any;
  public invoicecomments = {
        invoice_id :null,
        client_id : null,
        comments :null,
  }
  incommArr: any;
  userDisplayName: any;
  userdata: any;
  user: any;
  user2: any;
  user1: any;
  userid: any;
  clientsarr: any;
  users: any;

  constructor(
    private route:ActivatedRoute,
    private dataservice:DataService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.invoiceid=this.route.snapshot.params.id;
    this.id = Number(this.invoiceid) + Number(1);
    this.id1 = Number(this.invoiceid) - Number(1);
    this.getInvoicedetailsData();
    this.getCompanyData();
    this.getClientData();
    this.getInvcomments();
    this.profile();
  }

  getCompanyData(){
    this.dataservice.getCompany().subscribe(res=>{
      this.companylistArr=res;
    })
  }

  getClientData(){
    this.dataservice.getClientdetails().subscribe(res=>{
      //console.log(res);
      this.clientlistArr = res;        
    })
  }

  getOneClientdetails(){
    this.dataservice.getOneClientdetails(this.invoicedetails.client_id).subscribe(
      
    )

  }

  
  getInvoicedetailsData(){
    this.dataservice.getOneInvoicedetails(this.invoiceid).subscribe(
    data=>this.handleResponse(data),
    error=>this.handleError(error)
  );
  }

  handleResponse(data){
    console.log(data);
    this.invoicedetails=data[0];
    this.clientsarr =data;
    this.invoicedetails .client_id= data[0].client_id;
    console.log(this.invoicedetails.client_id);
   }
    
     
    handleError(error){
      console.log(this.invoiceid);
     if(this.invoiceid != '0'){
       this.url = '/form/invoices/invoice/invoicedetailsview/'+1;
      this.reloadComponent(this.url);
     }
     else{
      this.dataservice.getInvoicedetails().subscribe(res=>{
      this.data = res;
      console.log(res);
      var lastid = this.data[0].invoice_id;
      console.log(this.data[0].invoice_id);
      this.url = '/form/invoices/invoice/invoicedetailsview/'+lastid;
      this.reloadComponent(this.url);
      })
    }
    }

  reloadComponent(url) {
    let currentUrl = url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
    }

    doSomeLogic(){
      this.url = '/form/invoices/invoice/invoicedetailsview/'+this.id;
      this.reloadComponent(this.url);
    }
    doSomeLogics(){
      this.url = '/form/invoices/invoice/invoicedetailsview/'+this.id1;
      this.reloadComponent(this.url);
    }

    onSubmit(){
      this.dataservice.addinvoiceComments(this.invoicedetails).subscribe(res=>{
         // console.log(res);
          Swal.fire('Added!', 'comment has been added.', 'success'); 
          let currentUrl = this.router.url;
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate([currentUrl]);
        });
    }

    getInvcomments(){
      this.dataservice.getinvoiceComments(this.invoiceid).subscribe(res=>{
        this.incommArr = res;
          console.log(res);
        });
    }
    
    profile(){
      this.userDisplayName = sessionStorage.getItem('loggedUser');
       this.dataservice.getOneUser(this.userDisplayName).subscribe(res=>{
         console.log(res);
         this.userdata = res;
         this.invoicedetails.user_id = this.userdata[0].user_id;
         this.user = this.userdata[0].firstname;
         this.user1 = this.userdata[0].middlename;
         this.user2 = this.userdata[0].lastname;
         this.invoicedetails.nm =  this.user +" "+this.user2;
          //console.log(this.user);
           
       })
     }
}
