import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPLogging } from '.';
import { ISPFieldChoiceValue, ISPFieldInfo, ISPSuperField } from '../models';
import { UrlQueryParameterCollection } from '@microsoft/sp-core-library';

export class MiscFunctions {

  public static Contains(inputString: string, searchValue: string): boolean {
    return inputString.indexOf(searchValue) !== -1;
  }
  public static GetSkipField(fldName: string, strSkipFields: string): boolean {
    const skipFields: string[] = strSkipFields.split(',');
    skipFields.forEach(sf => {
      if (fldName.toLowerCase() === sf.toLowerCase()) {
        return true;
      }
    });
    return false;
  }

  public static GetSearchUrl(debugMode: boolean, queryText: string, properties: string, rowLimit: number): string {
    const retVal: string = MiscFunctions.GetWebAppUrl()
      + 'search/_api/search/query?rowlimit='
      + rowLimit + '&querytext=%27'
      + queryText + '%27&selectproperties=%27' + properties + '%27';
    SPLogging.LogConsole(debugMode, 'GetSearcUrl', retVal);
    return retVal;

  }

  public static GetQueryParameter(parm: string): string {
    // tslint:disable-next-line
    const queryParms: UrlQueryParameterCollection = new UrlQueryParameterCollection(window.location.href);
    const myParm: string = queryParms.getValue(parm);
    return myParm;
  }

  public static GetItemID(): number {
    // tslint:disable-next-line
    const retVal: number = parseInt(this.GetQueryParameter('ItemID'), 10);
    if (isNaN(retVal)) {
      return 0;
    }
    return retVal;
  }

  public static SetFieldValue(vals: ISPFieldInfo[], fld: ISPSuperField, value: string): ISPFieldInfo[] {
    for (let index: number = 0; index < vals.length; index++) {
      const item: ISPFieldInfo = vals[index];
      if (item.name === fld.name) {
        item.value = value;
      }
    }
    return vals;
  }

  public static ClearDropDown(elementID: string): void {
    const dropDownValue: HTMLElement = document.getElementById(elementID + '-option');
    dropDownValue.innerText = '';
  }

  public static SetFieldChoices(vals: ISPFieldInfo[],
    fld: ISPSuperField,
    choices: ISPFieldChoiceValue[]): ISPFieldInfo[] {
    for (let index: number = 0; index < vals.length; index++) {
      const item: ISPFieldInfo = vals[index];
      if (item.name === fld.name) {
        item.choices = choices;

      }
    }
    return vals;
  }

  public static GetCurrentValue(currentValues: ISPFieldInfo[], fieldName: string): string {
    for (let index: number = 0; index < currentValues.length; index++) {
      const item: ISPFieldInfo = currentValues[index];
      if (item.name.toLowerCase() === fieldName.toLowerCase()) {
        return item.value;
      }

    }
    return '';
  }

  public static ReplaceIfPresent(
    cMainVal: string,
    cFindVal: string,
    cReplaceVal: string
  ): string {
    if (cMainVal.indexOf(cFindVal) > -1) {
      cMainVal = cMainVal.replace(cFindVal, cReplaceVal);
    }
    return cMainVal;
  }

  public static getIDFromPath(strPath: string): string {
    const retVal: string = strPath.substring(strPath.indexOf('ID=') + 3, 100);
    return retVal;
  }

  public static GetListNameFromPath(strPath: string): string {
    let retVal: string = strPath;
    const iStart: number = retVal.toLowerCase().indexOf('/lists/') + 7;
    retVal = retVal.substring(iStart, 100);
    retVal = retVal.substr(0, retVal.indexOf('/'));
    return retVal;
  }

  public static IsEmpty(strVal: string): boolean {
    switch (strVal) {
      case '':
      // tslint:disable-next-line
      case null:
      case undefined:
        return true;
    }
    return false;
  }

  public static getRandomColor(): string {
    const letters: string = '0123456789ABCDEF';
    let color: string = '#';
    for (let i: number = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  public static IsInternetExplorer(): boolean {
    try {
      const ua: string = window.navigator.userAgent;
      const msie: number = ua.indexOf('MSIE ');

      if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
        // If Internet Explorer, return version number
        SPLogging.LogConsole(
          true,
          'EventService.IsinternetExplorer',
          'IE Version: ' + ua.substring(msie + 5, ua.indexOf('.', msie))
        );
        return true;
      }
    } catch (e) {
      SPLogging.LogError('IsInternetExplorer', e.message);
    }
    return false;
  }

  public static GetWebAppUrl(): string {
    const workUrl: string = window.location.href;
    const iStart: number = workUrl.indexOf('//') + 2;
    let retVal: string = workUrl.substring(0, workUrl.indexOf('/', iStart) + 1);
    retVal = retVal.toLowerCase();
    if (retVal.indexOf('dominionenergyo365') > -1) {
      retVal = retVal.replace('.com', '.com.us3.cas.ms');
    }
    return retVal;
  }

  public static GetFileNameFromUrl(filePath: string): string {
    return filePath.substring(filePath.lastIndexOf('/') + 1);
  }

  public static GetServerRelativeUrl(itemUrl: string): string {
    const iPos: number = itemUrl.indexOf('.org') + 4;
    return itemUrl.substring(iPos);
  }
  public static TranslateTokens(
    inputText: string,
    ctx: WebPartContext
  ): string {
    if (inputText.toLowerCase().indexOf('{{username}}') > -1) {
      const username: string = ctx.pageContext.user.displayName;
      inputText = inputText.replace('{{username}}', username);
    }
    if (inputText.toLowerCase().indexOf('{{currentsite}}') > -1) {
      inputText = inputText.replace(
        '{{currentsite}}',
        'Path:' + ctx.pageContext.web.absoluteUrl + '*'
      );
    }

    if (inputText.toLowerCase().indexOf('{{currentwebapp}}') > -1) {
      inputText = inputText.replace(
        '{{currentwebapp}}',
        'Path:' + MiscFunctions.GetWebAppUrl() + '*'
      );
    }

    if (inputText.toLowerCase().indexOf('{{checkedout}}') > -1) {
      inputText = inputText.replace(
        '{{checkedout}}',
        // tslint:disable-next-line
        '(cou:a* OR cou:b* OR cou:c* OR cou:d* OR cou:e* OR cou:f* OR cou:g* OR cou:h* OR cou:i* OR cou:j* OR cou:k* OR cou:l* OR cou:m* OR cou:n* OR cou:o* OR cou:p* OR cou:q* OR cou:r* OR cou:s* OR cou:t* OR cou:u* OR cou:v* OR cou:w* OR cou:x* OR cou:y* OR cou:z*)'
      );
    }
    return inputText;
  }

  public static getUrlParameter(name: string): string {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex: RegExp = new RegExp('[\\?&]' + name + '=([^&#]*)');
    // tslint:disable-next-line
    const results = regex.exec(location.search);
    return results === null
      ? ''
      : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  public static ValidValue(value: string): boolean {
    // tslint:disable-next-line
    if (value == null || value === undefined || value === '') {
      return false;
    }

    return true;
  }
}
