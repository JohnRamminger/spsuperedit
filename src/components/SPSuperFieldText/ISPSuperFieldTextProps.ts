import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISPSuperField } from '../../models';

export interface ISPSuperFieldTextProps {
    mode: string;
    field: ISPSuperField;
    ctx: WebPartContext;
    value: string;
    changed: (fld: ISPSuperField, value: string) => void;
}