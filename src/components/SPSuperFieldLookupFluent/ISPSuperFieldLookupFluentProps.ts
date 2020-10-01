import { WebPartContext } from '@microsoft/sp-webpart-base';

import { ISPSuperField, ISPFieldChoiceValue } from '../../models';

export interface ISPSuperFieldLookupFluentProps {
    mode: string;
    field: ISPSuperField;
    ctx: WebPartContext;
    listID: string;
    value: string;
    choices: ISPFieldChoiceValue[];
    changed: (fld: ISPSuperField, value: string) => void;
}