import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISPSuperField } from '../../models';

export interface IFieldConfigItemLookupProps {
  fieldItem: ISPSuperField;
  fields: ISPSuperField[];
  // id: number;
  // order: number;
  submitItem: (item: ISPSuperField) => void;
  remove: (id: string) => void;
  ctx: WebPartContext;
}
