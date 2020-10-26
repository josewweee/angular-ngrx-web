import { MatDialogConfig } from '@angular/material/dialog';
import { Pokemon } from '../../models/shared/pokemon';

export function defaultDialogConfig() {
  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.width = '500px';
  dialogConfig.maxWidth = '90vw';
  dialogConfig.height = 'fit-content';
  dialogConfig.panelClass = 'custom-dialog-panel';

  return dialogConfig;
}

export interface onCloseResponse{
  pokemon: Pokemon,
  favoriteWhileQuery: boolean
}

