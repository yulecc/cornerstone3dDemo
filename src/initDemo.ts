import initProviders from './initProviders';
import initVolumeLoader from './initVolumeLoader';
import {
  init as csRenderInit,

} from '@cornerstonejs/core';
import * as cornerstoneTools from '@cornerstonejs/tools';
import * as cornerstone from '@cornerstonejs/core';
import { init as csToolsInit } from '@cornerstonejs/tools';

import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';

export default async function initDemo() {
  initProviders();
  cornerstoneDICOMImageLoader.init({ maxWebWorkers: navigator.hardwareConcurrency || 1 });
  initVolumeLoader();
  await csRenderInit();
  await csToolsInit();

}


