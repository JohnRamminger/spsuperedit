import { ISPSuperField } from '../../models';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface ISPSuperFieldUserProps {
    mode: string;
    field: ISPSuperField;
    ctx: WebPartContext
}