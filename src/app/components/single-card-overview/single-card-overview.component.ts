import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-single-card-overview',
  templateUrl: './single-card-overview.component.html',
  styleUrls: ['./single-card-overview.component.scss'],
})
export class SingleCardOverviewComponent implements OnInit {
  pokemon: any;
  title: string;

  constructor(
    private dialogRef: MatDialogRef<SingleCardOverviewComponent>,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.title = data.dialogTitle;
    this.pokemon = data.pokemon;
  }

  ngOnInit(): void {}
}
