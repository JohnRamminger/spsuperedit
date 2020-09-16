import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISPSuperField } from '../../../lib/models';

export interface ISPSuperFieldChoiceProps {
    mode: string;
    field: ISPSuperField;
    ctx: WebPartContext;
    listID: string;
    value: string;
}