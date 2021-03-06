import {
  // ISPSuperField,
  ISPSuperFieldLookupOptions
} from '../../models';

export interface IFieldConfigItemLookupReactState {
  editmode: boolean;
  id: string;
  visible: boolean;
  title: string;
  type: string;
  name: string;
  required: boolean;
  loadOrder: number;
  currentListFields: string[];
  sourceListFields: string[];
  lookupOptions: ISPSuperFieldLookupOptions;
}
