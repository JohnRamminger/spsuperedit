import { ISPFieldChoiceValue } from './ISPFieldChoiceValue';

export interface ISPFieldInfo {
    name: string;
    value: string;
    initialValue: string;
    type: string;
    choices: ISPFieldChoiceValue[];
}