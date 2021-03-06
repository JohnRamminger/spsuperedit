import { ISPSuperField } from '../../../lib/models';

export interface ISPSuperFieldDateTimeProps {
    mode: string;
    field: ISPSuperField;
    value: string;
    changed: (fld: ISPSuperField, value: string) => void;
}