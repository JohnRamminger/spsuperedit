import { ISPSuperFieldLookupOptions } from './';

export interface ISPSuperField {
    name: string;
    title: string;
    id: string;
    type: string;
    visible: boolean;
    required: boolean;
    allowFillIn: boolean;
    fieldOptions?: ISPSuperFieldLookupOptions | undefined;
}