import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Web } from '@pnp/sp';
import { ISPSuperField, ISPSuperFieldLookupOptions } from '../models';
import {
    SPHttpClient,
    SPHttpClientResponse
    // ISPHttpClientOptions
} from '@microsoft/sp-http';
import { SPLogging } from './SPLogging';
export class SvcSuperFields {
    public static compareLoadOrder(a: ISPSuperField, b: ISPSuperField): number {
        if (a.loadOrder < b.loadOrder) {
            return -1;
        }
        if (a.loadOrder > b.loadOrder) {
            return 1;
        }
    }
    // tslint:disable-next-line
    public static async GetSPItem(ctx: WebPartContext, requestUrl: string): Promise<any> {
        // tslint:disable-next-line
        let item: any;
        console.log('RequestUrl: ' + requestUrl);

        await ctx.spHttpClient
            .get(requestUrl, SPHttpClient.configurations.v1)
            .then(async (response: SPHttpClientResponse) => {
                // tslint:disable-next-line
                await response.json().then((responseJSON: any) => {
                    item = responseJSON.value[0];
                    console.log(JSON.stringify(item));
                });
            });
        return new Promise<ISPSuperField[]>(
            // tslint:disable-next-line
            (resolve: (item: any) => void, reject: (error: Error) => void) => {
                resolve(item);
            }
        );
    }

    public static GetItemRequestUrl(ctx: WebPartContext,
        fields: ISPSuperField[],
        listID: string,
        itemID: number): string {
        let strSelect: string = '';
        let strExpand: string = '';
        fields.forEach(fld => {
            if (fld.visible) {
                switch (fld.type) {
                    case 'LookupMulti':
                    case 'Lookup':
                        strSelect += fld.name + '/Title,' + fld.name + '/Id,';
                        strExpand += fld.name + ',';
                        break;
                    case 'UserMulti':
                    case 'User':
                        strSelect += fld.name + '/EMail,';
                        strExpand += fld.name + ',';
                        break;
                    default:
                        strSelect += fld.name + ',';
                        break;
                }
            }
        });
        strSelect = strSelect.substr(0, strSelect.length - 1);
        strExpand = strExpand.substr(0, strExpand.length - 1);
        let requestUrl: string = ctx.pageContext.web.absoluteUrl +
            '/_api/Web/Lists/GetById(%27' + listID + '%27)/Items';
        requestUrl += '?$filter=ID eq ' + itemID;
        requestUrl += '&$select=' + strSelect;
        requestUrl += '&$expand=' + strExpand;
        return requestUrl;
    }

    public static async GetLookupDetails(webUrl: string, listID: string, fld: ISPSuperField): Promise<ISPSuperField> {
        const newField: ISPSuperField = fld;
        const oWeb: Web = new Web(webUrl);
        await oWeb.lists.getById(listID).fields.getByInternalNameOrTitle(fld.name).get().then(fldDetails => {
            const lookupDetails: ISPSuperFieldLookupOptions = {
                allowmultiple: fldDetails.AllowMultipleValues,
                list: fldDetails.LookupList,
                field: fldDetails.LookupField,
                lookupMode: '',
                sourceFilterField: '',
                filterValueField: ''
            };
            newField.fieldOptions = lookupDetails;
        });
        return new Promise<ISPSuperField>(
            // tslint:disable-next-line
            (resolve: (newField: ISPSuperField) => void, reject: (error: Error) => void) => {
                resolve(newField);
            }
        );

    }

    public static async GetFields(webUrl: string, listID: string): Promise<ISPSuperField[]> {
        const fields: ISPSuperField[] = [];
        const oWeb: Web = new Web(webUrl);
        await oWeb.lists.getById(listID).fields.get().then(async flds => {
            for (let index: number = 0; index < flds.length; index++) {
                // tslint:disable-next-line
                const fld = flds[index];
                if (!fld.Hidden && !fld.ReadOnlyField) {
                    const newField: ISPSuperField = {
                        listID: listID,
                        name: fld.InternalName,
                        title: fld.Title,
                        loadOrder: 0,
                        type: fld.TypeAsString,
                        id: fld.Id,
                        visible: true,
                        required: fld.Required,
                        allowFillIn: false
                    };
                    try {
                        await oWeb.lists.getById(listID).fields.getByInternalNameOrTitle(fld.InternalName)
                            .get().then(fldDetails => {
                                if (fld.TypeAsString.indexOf('Lookup') !== -1) {
                                    const lookupDetails: ISPSuperFieldLookupOptions = {
                                        allowmultiple: fldDetails.AllowMultipleValues,
                                        list: fldDetails.LookupList,
                                        field: fldDetails.LookupField,
                                        lookupMode: '',
                                        sourceFilterField: '',
                                        filterValueField: ''
                                    };
                                    newField.fieldOptions = lookupDetails;
                                }
                            });
                    } catch (error) {
                        SPLogging.LogError('GetFields', 'Field: ' + fld.InternalName + ' - ' + error.message);
                    }

                    fields.push(newField);
                }
            }
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