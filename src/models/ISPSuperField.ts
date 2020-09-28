import { ISPSuperFieldLookupOptions } from './';

export interface ISPSuperField {
    listID: string;
    name: string;
    title: string;
    id: string;
    type: string;
    visible: boolean;
    required: boolean;
    allowFillIn: boolean;
    loadOrder: number;
    fieldOptions?: ISPSuperFieldLookupOptions | undefined;
}