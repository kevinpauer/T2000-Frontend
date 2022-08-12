import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/Services/data.service';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export interface NumbersPayload {
  numbers: number[];
  timestamp: string;
  id: number;
  payloadSize: number;
}

export interface Result {
  consumer: string;
  publishedTimestamp: string;
  isCorrect: boolean;
}

export interface ResultPayload {
  id: number;
  numbers: number[];
  timestamp: string;
  result: Result;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-configuration-page',
  templateUrl: './configuration-page.component.html',
  styleUrls: ['./configuration-page.component.scss'],
})
export class ConfigurationPageComponent implements OnInit {
  constructor(private dataService: DataService) {}

  numberPayload: NumbersPayload[] = [];
  resultPayload: ResultPayload[] = [];

  payloadSizeFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();

  form: any = {
    payloadSize: null,
  };

  ngOnInit(): void {
    this.dataService.getNumbersPayloadData().subscribe((data) => {
      this.numberPayload = JSON.parse(data);
      this.form.payloadSize = this.numberPayload[0].payloadSize;
    });

    this.dataService.getResultPayloadData().subscribe((data) => {
      this.resultPayload = data;
    });
  }

  onSubmit(): void {
    console.log(this.form.payloadSize);
  }
}
