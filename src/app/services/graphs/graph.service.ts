import { Injectable } from '@angular/core';
import * as CanvasJS from '../../shared/canvasjs.min.js';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  constructor() {}

  Generate() {
    return CanvasJS;
  }
}
