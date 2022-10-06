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
    return !!(control && control.invalid && (control.dirty || isSubmitted));
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
  timeDifferenceJVM: number = 0;
  timeDifferenceNative: number = 0;

  payloadSizeFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  resultJVM: ResultPayload | undefined;
  resultNative: ResultPayload | undefined;

  matcher = new MyErrorStateMatcher();

  form: any = {
    payloadSize: null,
  };

  ngOnInit(): void {
    this.dataService.getNumbersPayloadData().subscribe((data) => {
      this.numberPayload = JSON.parse(data);
      this.form.payloadSize = this.numberPayload[0].payloadSize;
      console.log(this.numberPayload[0].timestamp);
    });

    this.dataService.getResultPayloadData().subscribe((data) => {
      this.resultPayload = JSON.parse(data);
      console.log(this.resultPayload);
      this.resultJVM = this.resultPayload[0];
      this.resultNative = this.resultPayload[1];
      this.timeDifferenceJVM = this.calculateTimeDifference(
        this.resultPayload[0].result.publishedTimestamp,
        this.resultPayload[0].timestamp
      );

      this.timeDifferenceNative = this.calculateTimeDifference(
        this.resultPayload[1].result.publishedTimestamp,
        this.resultPayload[1].timestamp
      );
    });
  }

  onSubmit(): void {
    console.log(this.form.payloadSize);
  }

  calculateTimeDifference(
    publishedTimestamp: string,
    createTimestamp: string
  ): number {
    let startTime = new Date(createTimestamp.split('[')[0]);
    let endTime = new Date(publishedTimestamp.split('[')[0]);
    let diff = endTime.getTime() - startTime.getTime();
    return diff;
  }

  sentPayload(): void {
    this.dataService.sentPayload(this.form.payloadSize).subscribe((data) => {
      console.log(data);
    }),
      (error: any) => {
        console.log(error);
      };
  }
}
