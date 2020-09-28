import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISPSuperField } from '../../../lib/models';

export interface ISPSuperFieldCheckboxProps {
    mode: string;
    field: ISPSuperField;
    ctx: WebPartContext;
    listID: string;
    value: string;
    changed: (fld: ISPSuperField, value: string) => void;
}