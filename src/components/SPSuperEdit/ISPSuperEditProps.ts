import { ISPSuperField } from '../../models';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface ISPSuperEditProps {
  listID: string;
  fields: ISPSuperField[];
  ctx: WebPartContext;
}
