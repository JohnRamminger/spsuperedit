import { ISPSuperField } from '../../models';

export interface IFieldConfigItemProps {
  fieldItem: ISPSuperField;
  // id: number;
  // order: number;
  submitItem: (item: ISPSuperField) => void;
  remove: (id: string) => void;
}
