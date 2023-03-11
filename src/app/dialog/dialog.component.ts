import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validator, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { MatDialogRef , MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  freshnessList=["Brand New","Second Hand","Refurbished"]
  productform!:FormGroup;
  actionBtn:string="Save"

  constructor(private  formbBuilder:FormBuilder,private api:ApiService,private matDialogRef:MatDialogRef<DialogComponent> , @Inject(MAT_DIALOG_DATA) public editData:any){

  }
  ngOnInit(): void {
    this.productform=this.formbBuilder.group({
      productName:['',Validators.required],
      category:['',Validators.required],
      date:['',Validators.required],
      freshness:['',Validators.required],
      price:['',Validators.required],
      comment:[]
    })
    // console.log(this.editData)
    if(this.editData){
      this.actionBtn="Update";
      this.productform.controls['productName'].setValue(this.editData.productName);
      this.productform.controls['category'].setValue(this.editData.category);
      this.productform.controls['price'].setValue(this.editData.price);
      this.productform.controls['freshness'].setValue(this.editData.freshness);
      this.productform.controls['date'].setValue(this.editData.date);
      this.productform.controls['comment'].setValue(this.editData.comment);
    }
  }
  addProduct(){
    if(!this.editData){
    if(this.productform.valid){
    this.api.postProduct(this.productform.value).subscribe({
      next:(res)=>{
        alert("Product Added Succesfully");
        this.productform.reset();
        this.matDialogRef.close('save');
      },
      error:(res)=>{
        alert("something Went Wrong");
      }
    })
    }   
  }else{
    console.log("update call")
    this.updateData();
  }
}
updateData(){
  this.api.putProduct(this.productform.value,this.editData.id).subscribe({
    next:(res)=>{
      console.log(this.editData.id)
      alert("Update Product Succesfully");
      this.productform.reset();
      this.matDialogRef.close('update');
    },
    error:(res)=>{
      alert("something Went Wrong");
    }
  })
}
deleteProduct(){
this.api.deleteProduct(this.editData.id).subscribe({
  next:(res)=>{
    alert("Delete Product Succesfully");
    this.productform.reset();
    this.matDialogRef.close('delete');
  },
  error:(res)=>{
    alert("something Went Wrong");
  }
})
}
}
