import { Injectable } from '@angular/core';
import * as CanvasJS from '../../shared/lib/canvasjs.min.js';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  constructor() {
  }

  Generate(): CanvasJS.Chart {
    return CanvasJS;
  }
}
