import { Placeholder } from '@pnp/spfx-controls-react/lib/Placeholder';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react';
import * as React from 'react';
import { Web } from '@pnp/sp';
import styles from './Spsuperedit.module.scss';
import { ISPSuperEditProps, ISPSuperEditReactState } from './';
import { ISPFieldChoiceValue, ISPFieldInfo, ISPSuperFieldLookupOptions } from '../../models';
import {
  SPSuperFieldText,
  SPSuperFieldDateTime,
  // SPSuperFieldLookup,
  SPSuperFieldLookupFluent,
  SPSuperFieldUser,
  SPSuperFieldChoice,
  SPSuperFieldCheckbox
} from '../';
import { MiscFunctions, SvcSuperFields } from '../../services';
import { ISPSuperField } from '../../../lib/models';
import { SPLogging } from '../../../lib/services';
// import { Web } from '@pnp/sp';
// import { SPLogging } from '../../../lib/services';

export class SPSuperEdit extends React.Component<ISPSuperEditProps, ISPSuperEditReactState> {

  constructor(props: ISPSuperEditProps) {
    super(props);
    this.state = {
      mode: 'Edit',
      currentValues: []
    };
  }

  // tslint:disable-next-line
  public GetLookupValue(item: any, fieldName: string): string {
    // tslint:disable-next-line
    return item[fieldName]['Id'] + '|' + item[fieldName]['Title'];
  }

  // tslint:disable-next-line
  public async componentDidMount() {

    const fieldInfo: ISPFieldInfo[] = [];
    for (let y: number = 0; y < this.props.fields.length; y++) {
      const fld: ISPSuperField = this.props.fields[y];
      if (fld.visible) {
        fieldInfo.push({ name: fld.name, value: '', initialValue: '', type: fld.type, choices: [] });
      }
    }
    const itemID: number = MiscFunctions.GetItemID();

    if (itemID !== 0) {
      const requestUrl: string =
        SvcSuperFields.GetItemRequestUrl(this.props.ctx, this.props.fields, this.props.listID, itemID);
      // tslint:disable-next-line
      let item: any;
      await SvcSuperFields.GetSPItem(this.props.ctx, requestUrl).then(result => {
        item = result;
      });
      fieldInfo.forEach(fld => {
        fld = this.GetFieldValue(item, fld);
        if (fld.type === 'Lookup') {
          fld.value = this.GetLookupValue(item, fld.name);
        }
      });
      for (let i: number = 0; i < this.props.fields.length; i++) {
        const fld: ISPSuperField = this.props.fields[i];
        let choices: ISPFieldChoiceValue[] = [];
        if (fld.type.indexOf('Lookup') !== -1) {
          await this.GetLookupChoices(this.props.ctx.pageContext.web.absoluteUrl, fld, '').then(result => {
            choices = result;
          });

          for (let x: number = 0; x < fieldInfo.length; x++) {
            const fi: ISPFieldInfo = fieldInfo[x];
            if (fi.name === fld.name) {
              fi.choices = choices;

            }
          }
        }
      }
      this.setState({ currentValues: fieldInfo });
    } else {
      for (let y: number = 0; y < this.props.fields.length; y++) {
        const fld: ISPSuperField = this.props.fields[y];
        if (fld.type.indexOf('Lookup') > -1) {

          let lookupchoices: ISPFieldChoiceValue[] = [];
          await this.GetLookupChoices(this.props.ctx.pageContext.web.absoluteUrl, fld, '').then(result => {
            lookupchoices = result;
          });
          for (let x: number = 0; x < fieldInfo.length; x++) {
            const fi: ISPFieldInfo = fieldInfo[x];
            if (fi.name === fld.name) {
              fi.choices = lookupchoices;

            }
          }
        }
      }
      this.setState({ currentValues: fieldInfo });
    }
  }

  public render(): React.ReactElement<ISPSuperEditProps> {
    const fields: JSX.Element[] = [];
    if (this.props.fields) {
      this.props.fields.forEach(fld => {
        const currentField: ISPFieldInfo = this.GetCurrentField(fld.name);
        const currentValue: string = MiscFunctions.GetCurrentValue(this.state.currentValues, fld.name);
        if (fld.visible) {
          switch (fld.type) {
            case 'Currency':
            case 'Number':
            case 'Note':
            case 'Text':
              fields.push(<SPSuperFieldText
                value={currentValue}
                ctx={this.props.ctx}
                mode={this.state.mode}
                changed={this.textColumnChanged}
                field={fld} />);
              break;
            case 'Boolean':
              fields.push(<SPSuperFieldCheckbox
                changed={this.checkboxColumnChanged}
                value={currentValue}
                listID={this.props.listID}
                ctx={this.props.ctx}
                mode={this.state.mode}
                field={fld} />);
              break;
            case 'Choice':
            case 'OutcomeChoice':
              fields.push(<SPSuperFieldChoice
                changed={this.choiceColumnChanged}
                value={currentValue}
                listID={this.props.listID}
                ctx={this.props.ctx}
                mode={this.state.mode}
                field={fld} />);
              break;
            case 'Lookup':
            case 'LookupMulti':
              let choices: ISPFieldChoiceValue[] = [];
              if (currentField) {
                if (currentField.choices) {
                  choices = currentField.choices;
                }
              }
              fields.push(<SPSuperFieldLookupFluent
                changed={this.lookupColumnChanged}
                value={currentValue}
                choices={choices}
                listID={this.props.listID}
                ctx={this.props.ctx}
                mode={this.state.mode}
                field={fld} />);
              break;

            case 'DateTime':
              fields.push(<SPSuperFieldDateTime
                value={currentValue}
                mode={this.state.mode}
                changed={this.dateColumnChanged}
                field={fld} />);
              break;
            case 'User':
            case 'UserMulti':
              fields.push(<SPSuperFieldUser
                value={currentValue}
                ctx={this.props.ctx}
                changed={this.userColumnChanged}
                mode={this.state.mode}
                field={fld} />);
              break;
            default:
              fields.push(<h5>{fld.title + ' ' + fld.type}</h5>);
          }

        }
      });
      const toolbarMarkup: JSX.Element[] = [];
      toolbarMarkup.push(<div>
        <DefaultButton className={styles.alignRightButton} text='Cancel' />
        <PrimaryButton className={styles.alignRightButton} text='Save' />

        <div className={styles.clearFloat} />
      </div>);
      return (
        <div className={styles.spsuperedit} >
          {toolbarMarkup}
          {fields}
          {toolbarMarkup}
        </div >
      );
    } else {
      return (<Placeholder iconName='Edit'
        iconText='Configure your web part'
        description='Please configure the web part.'
        buttonLabel='Configure'
        onConfigure={this._onConfigure} />);
    }
  }
  private _onConfigure = () => {
    // Context of the web part
    this.props.ctx.propertyPane.open();
  }

  private dateColumnChanged = (fld: ISPSuperField, value: string) => {
    let vals: ISPFieldInfo[] = this.state.currentValues;
    vals = MiscFunctions.SetFieldValue(vals, fld, value);
    this.setState({ currentValues: vals });
  }

  private checkboxColumnChanged = (fld: ISPSuperField, value: string) => {
    let vals: ISPFieldInfo[] = this.state.currentValues;
    vals = MiscFunctions.SetFieldValue(vals, fld, value);
    this.setState({ currentValues: vals });
  }

  private choiceColumnChanged = (fld: ISPSuperField, value: string) => {
    let vals: ISPFieldInfo[] = this.state.currentValues;
    vals = MiscFunctions.SetFieldValue(vals, fld, value);
    this.setState({ currentValues: vals });
  }

  private GetSuperFieldByName(fldName: string): ISPSuperField {
    for (let i: number = 0; i < this.props.fields.length; i++) {
      const fld: ISPSuperField = this.props.fields[i];
      if (fld.name === fldName) {
        return fld;
      }
    }
    return undefined;
  }

  private lookupColumnChanged = (fld: ISPSuperField, value: string) => {
    let vals: ISPFieldInfo[] = this.state.currentValues;

    const strValue: string = value.substring(value.indexOf('|') + 1);
    vals = MiscFunctions.SetFieldValue(vals, fld, strValue);

    const filterFields: string[] = this.GetLookupFilter(fld.name);
    for (let i: number = 0; i < filterFields.length; i++) {
      // tslint:disable-next-line
      const filterField = filterFields[i];

      const workField: ISPSuperField = this.GetSuperFieldByName(filterField);
      this.GetLookupChoices(this.props.ctx.pageContext.web.absoluteUrl, workField, value).then(results => {
        vals = MiscFunctions.SetFieldChoices(vals, workField, results);
        vals = MiscFunctions.SetFieldValue(vals, workField, '');

        MiscFunctions.ClearDropDown('lu' + workField.name);
        this.setState({ currentValues: vals });
      });
    }
  }

  // tslint:disable-next-line
  private GetLookupFilter = (fldName: string): string[] => {
    const filterFields: string[] = [];
    for (let index: number = 0; index < this.props.fields.length; index++) {
      const fld: ISPSuperField = this.props.fields[index];
      if (fld.type === 'Lookup') {
        const fo: ISPSuperFieldLookupOptions = fld.fieldOptions;
        const strField: string = fo.filterValueField.toString();
        if (strField === fldName) {
          filterFields.push(fld.name);
        }
      }
    }
    return filterFields;
  }

  private textColumnChanged = (fld: ISPSuperField, value: string) => {
    let vals: ISPFieldInfo[] = this.state.currentValues;
    vals = MiscFunctions.SetFieldValue(vals, fld, value);
    this.setState({ currentValues: vals });
  }

  private userColumnChanged = (fld: ISPSuperField, value: string) => {
    let vals: ISPFieldInfo[] = this.state.currentValues;
    vals = MiscFunctions.SetFieldValue(vals, fld, value);
    this.setState({ currentValues: vals });
  }

  // tslint:disable-next-line
  private GetFieldValue(result: any, fld: ISPFieldInfo): ISPFieldInfo {
    try {
      if (result !== undefined) {
        switch (fld.type) {
          case 'Lookup':

            break;
          case 'LookupMulti':

            break;
          case 'UserMulti':

            break;
          case 'User':

            break;

          default:
            fld.initialValue = result[fld.name];
            fld.value = result[fld.name];
            break;
        }
      }
    } catch (error) {
      SPLogging.LogError('GetFieldValue', error.messsage);
    }

    return fld;
  }

  private async GetLookupChoices(webUrl: string,
    fldChoices: ISPSuperField,
    filterValue: string): Promise<ISPFieldChoiceValue[]> {
    const choices: ISPFieldChoiceValue[] = [];
    choices.push({ key: '', text: '' });
    if (fldChoices.fieldOptions) {
      const lookupOptions: ISPSuperFieldLookupOptions = fldChoices.fieldOptions;
      const oWeb: Web = new Web(webUrl);
      if (!MiscFunctions.IsEmpty(filterValue)) {

        const fields: string = lookupOptions.field + ',' + lookupOptions.filterValueField + '/Title' + ', Id';
        const cFilterValue: string = filterValue.substring(filterValue.indexOf('|') + 1);
        await oWeb.lists.getById(lookupOptions.list).items.select(fields).
          expand(lookupOptions.filterValueField).top(5000).get().then(items => {

            for (let i: number = 0; i < items.length; i++) {
              // tslint:disable-next-line
              const item = items[i];
              // tslint:disable-next-line
              const value: string = item[lookupOptions.filterValueField]['Title'];

              if (value === cFilterValue) {
                const choice: ISPFieldChoiceValue = { key: item.Id, text: item[lookupOptions.field] };
                choices.push(choice);

              }
            }
          });
      } else {
        const fields: string = lookupOptions.field + ', Id';
        await oWeb.lists.getById(lookupOptions.list).items.select(fields).top(5000).get().then(items => {
          for (let i: number = 0; i < items.length; i++) {
            // tslint:disable-next-line
            const item = items[i];
            const choice: ISPFieldChoiceValue = { key: item.Id, text: item[lookupOptions.field] };
            choices.push(choice);
          }
        });
      }
    }
    return new Promise<ISPFieldChoiceValue[]>(
      // tslint:disable-next-line
      (resolve: (choices: ISPFieldChoiceValue[]) => void, reject: (error: Error) => void) => {
        resolve(choices);
      }
    );

  }
  private GetCurrentField(fldName: string): ISPFieldInfo {

    for (let x: number = 0; x < this.state.currentValues.length; x++) {
      const fi: ISPFieldInfo = this.state.currentValues[x];
      if (fi.name === fldName) {
        return fi;
      }
    }
    return undefined;
  }
}
