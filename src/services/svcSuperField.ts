import { Web, CamlQuery, FileFolderShared } from '@pnp/sp';
import { ISPSuperField } from '../models';

// import * as Handlebars from 'handlebars';

export class SvcSuperFields {

    public static async GetFields(webUrl: string, listID: string): Promise<ISPSuperField[]> {
        let fields: ISPSuperField[] = [];
        let oWeb = new Web(webUrl);
        await oWeb.lists.getById(listID).fields.select('Title,Internalname,Hidden,TypeAsString,Id,ReadOnlyField,Sealed,Required').get().then(flds => {
            flds.forEach(async fld => {
                if (!fld.Hidden && !fld.ReadOnlyField) {

                    const newField: ISPSuperField = { name: fld.InternalName, title: fld.Title, type: fld.TypeAsString, id: fld.Id, visible: true, required: fld.Required, allowFillIn: false };
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
            const fld = fields[x];
            if (fld.id === fieldID) {
                return true;
            }
        }
        return false;

    }

}

