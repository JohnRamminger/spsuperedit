import { ISPSuperField } from '../../models';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IFieldConfigProps {
  message: string;
  close: () => void;
  submit: (currentButtons: ISPSuperField[]) => void;
  refresh: (currentButtons: ISPSuperField[]) => void;

  fields: ISPSuperField[];
  debugMode: boolean;
  ctx: WebPartContext;
}
