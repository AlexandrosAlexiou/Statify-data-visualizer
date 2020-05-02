import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

const material = [
  MatDialogModule,
  MatProgressBarModule,
  MatSnackBarModule,
  MatSelectModule,
  MatAutocompleteModule,
  MatInputModule,
  MatStepperModule,
  MatButtonModule,
  MatToolbarModule,
  MatIconModule
];
@NgModule({
  imports: [material],
  exports: [material]
})
export class MaterialModule { }
