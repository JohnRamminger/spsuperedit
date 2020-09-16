import { Web } from '@pnp/sp';
import { ISPSuperField, ISPSuperFieldLookupOptions } from '../models';

// import * as Handlebars from 'handlebars';

export class SvcSuperFields {

    public static async GetFields(webUrl: string, listID: string): Promise<ISPSuperField[]> {
        const fields: ISPSuperField[] = [];
        const oWeb: Web = new Web(webUrl);
        await oWeb.lists.getById(listID).fields.get().then(flds => {
            flds.forEach(async fld => {
                if (!fld.Hidden && !fld.ReadOnlyField) {
                    const newField: ISPSuperField = {
                        name: fld.InternalName,
                        title: fld.Title,
                        type: fld.TypeAsString,
                        id: fld.Id,
                        visible: true,
                        required: fld.Required,
                        allowFillIn: false
                    };
                    if (newField.type === 'Lookup' || newField.type === 'MultiLookup') {
                        await oWeb.lists.getById(listID).fields.getById(fld.Id).get().then(fldDetails => {
                            const lookupDetails: ISPSuperFieldLookupOptions = {
                                allowmultiple: fldDetails.AllowMultipleValues,
                                list: fldDetails.LookupList,
                                field: fldDetails.LookupField,
                                lookupMode: '',
                                filterField: '',
                                filterValueField: ''
                            };
                            newField.fieldOptions = lookupDetails;
                        });
                    }
                    fields.push(newField);
                }
            });
        });
        return new Promise<ISPSuperField[]>(
            // tslint:disable-next-line
            (resolve: (fields: ISPSuperField[]) => void, reject: (error: Error) => void) => {
                resolve(fields);
            }
        );
    }

    public static HasField(fieldID: string, fields: ISPSuperField[]): boolean {
        for (let x: number = 0; x < fields.length; x++) {
            const fld: ISPSuperField = fields[x];
            if (fld.id === fieldID) {
                return true;
            }
        }
        return false;
    }
}