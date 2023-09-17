import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import {DataService} from '../data.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {error} from 'protractor';

@Component({
  selector: 'app-startp',
  templateUrl: './startp.component.html',
  styleUrls: ['./startp.component.css']
})
export class StartpComponent implements OnInit {
  startForm!: FormGroup;
  resultFromBackend: any[] = [];
  resultFromBackendEthBalance: any;
  showAvailableEth = false;

  showTable = false;
  submitted = false;
  public page = 1;
  public pageSize = 10;
  showError: boolean | undefined;
  errorMessage: any;
  ngObject = undefined;
  pickedDate: any;
  constructor(private formBuilder: FormBuilder, private dataService: DataService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.createForm();
  }
  createForm(): void {
    this.startForm = this.formBuilder.group({
      address: ['', [Validators.required]],
      sblock: ['', [Validators.required]],
      pastdate: ['']
    });
  }
  onSend(): void{
  }

  sendData(): void {
    this.submitted = true;
    if (this.startForm.invalid) {
      this.showError = true;
    } else if (this.startForm.valid){
      this.showError = false;
      this.submitted = true;
      this.spinner.show().then();
      // get values from form
      const f = this.startForm.value;
      // if select date to see eth, than get into if and send data to that endpoint
      if (f.pastdate != undefined){
        this.showAvailableEth = true;
        const dataForEthValue = {requiredAddress: f.address, requiredDate: f.pastdate['year'] + '-' + f.pastdate['month'] + '-' + f.pastdate['day']};
        // variable to show date in result, above table
        this.pickedDate = f.pastdate['year'] + '-' + f.pastdate['month'] + '-' + f.pastdate['day'];
        // get result from backend, show eth on specific date
        this.dataService.getEthValueOfSpecificDate(dataForEthValue).subscribe( (res: any) => {
            this.resultFromBackendEthBalance = res.result;
            this.showAvailableEth = true;
          },
          () => {
            this.errorMessage = 'Error';
          });
      }
      // part for all necessary tranasction date, second endpoint
      const data = {requiredAddress: f.address, startBlock: f.sblock, endBlock: '', page: '', offset: '', sort: 'desc'};
      this.dataService.sendDataToBackend(data).subscribe( (res: any) => {
          this.resultFromBackend = res.result;
          this.showTable = true;
          this.spinner.hide().then();
          this.resetStartForm();
        },
        () => {
          this.errorMessage = 'Error';
          this.spinner.hide().then();
        });

    }
    }
  resetStartForm(): void {
    // @ts-ignore
    this.startForm.get('address').reset('');
    // @ts-ignore
    this.startForm.get('sblock').reset('');
    // @ts-ignore
    this.startForm.get('pastdate').reset('');
    this.showError = false;
    this.submitted = false;
  }

  get r() {
    return this.startForm.controls;
  }

}
