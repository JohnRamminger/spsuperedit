import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

import { Icon } from 'office-ui-fabric-react';
import * as React from 'react';
import { ISPSuperField, ISPSuperFieldLookupOptions } from '../../models';
import { IFieldConfigItemLookupProps, IFieldConfigItemLookupReactState } from '.';
import styles from './FieldConfigItemLookup.module.scss';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { SvcSuperFields } from '../../../lib/services';
export class FieldConfigItemLookup extends React.Component<
  IFieldConfigItemLookupProps,
  IFieldConfigItemLookupReactState
  > {
  constructor(props: IFieldConfigItemLookupProps) {
    super(props);
    const bEdit: boolean = false;
    const targetFields: string[] = [];
    for (let i: number = 0; i < this.props.fields.length; i++) {
      const fld: ISPSuperField = this.props.fields[i];
      targetFields.push(fld.name);
    }

    this.state = {
      editmode: bEdit,
      id: props.fieldItem.id,
      visible: true,
      title: props.fieldItem.title,
      name: props.fieldItem.name,
      type: props.fieldItem.type,
      required: props.fieldItem.required,
      loadOrder: props.fieldItem.loadOrder,
      currentListFields: targetFields,
      sourceListFields: [],

      lookupOptions: {
        field: this.props.fieldItem.fieldOptions.field,
        list: this.props.fieldItem.fieldOptions.list,
        allowmultiple: false,
        lookupMode: 'Nornal',
        sourceFilterField: this.props.fieldItem.fieldOptions.sourceFilterField,
        filterValueField: this.props.fieldItem.fieldOptions.filterValueField
      }
    };
  }
  // tslint:disable-next-line
  public async componentDidMount() {
    const sourceFields: string[] = [];

    await SvcSuperFields.GetFields(this.props.ctx.pageContext.web.absoluteUrl,
      this.props.fieldItem.fieldOptions.list).then(result => {
        for (let index: number = 0; index < result.length; index++) {
          const fld: ISPSuperField = result[index];
          sourceFields.push(fld.name);
        }
      });
    this.setState({ sourceListFields: sourceFields });
  }

  public render(): React.ReactElement<IFieldConfigItemLookupProps> {
    if (this.state.editmode) {
      // console.log('FilterField:' + this.state.lookupOptions.filterValueField);
      // console.log('SourceField:' + this.state.lookupOptions.sourceFilterField);
      return (
        <div className={styles.row}>
          <div className={styles.alignLeftMain}>{this.state.title}</div>
          <div className={styles.alignLeftMain}>{this.state.type}</div>
          <div className={styles.alignLeftMain}>{this.state.lookupOptions.list}</div>
          <div className={styles.alignLeftMain}>{this.state.lookupOptions.field}</div>
          <br />
          <hr />
          <Checkbox label='Visible' checked={this.state.visible} onChange={this.visibleChange} />
          <TextField
            className={styles.width75}
            defaultValue={this.state.loadOrder.toString()}
            label={'Load Order'}
            onChanged={this.orderChange}
          />
          <div className={styles.DropDownLabelStyle}>Target List Field</div>
          <Dropdown options={this.state.currentListFields}
            onChange={this.onTargetComboChange}
            value={this.state.lookupOptions.filterValueField} />
          <div className={styles.DropDownLabelStyle}>Source List Field</div>
          <Dropdown options={this.state.sourceListFields}
            onChange={this.onSourceComboChange}
            value={this.state.lookupOptions.sourceFilterField} />
          <hr />
          <Icon
            className={styles.alignLeftIcon}
            iconName='Save'
            onClick={() => {
              this.saveItem();
            }}
          />
          <Icon
            className={styles.alignLeftIcon}
            iconName='Cancel'
            onClick={() => {
              this.cancelItem();
            }}
          />
          <div className={styles.alignClear}></div>
        </div>
      );
    } else {
      return (
        <div className={styles.row}>
          <div className={styles.alignLeftMain}>{this.state.title}</div>
          <div className={styles.alignLeftMain}>{this.state.type}</div>
          <div className={styles.alignLeftMain}>{this.state.loadOrder}</div>
          <Icon
            className={styles.alignLeft}
            iconName='Edit'
            onClick={() => {
              this.editItem();
            }}
          />

          <Icon
            className={styles.alignLeft}
            iconName='Trash'
            onClick={() => {
              this.deleteItem();
            }}
          />

          <div className={styles.alignClear}></div>
        </div>
      );
    }
  }

  private saveItem(): void {

    const fldItem: ISPSuperField = {
      listID: this.props.fieldItem.listID,
      fieldOptions: this.state.lookupOptions,
      loadOrder: this.state.loadOrder,
      name: this.state.name,
      title: this.state.title,
      type: this.state.type,
      visible: this.state.visible,
      required: this.state.required,
      id: this.state.id,
      allowFillIn: false
    };

    this.props.submitItem(fldItem);
    this.setState({ editmode: false });
  }

  private cancelItem(): void {
    this.setState({ editmode: false });
  }

  private deleteItem(): void {
    this.props.remove(this.state.id);
  }

  private editItem(): void {
    this.setState({ editmode: true });
  }

  // @autobind
  // private _submit(id: number, selectedItem: ISPSuperField): void { }

  // tslint:disable-next-line
  private titleChange = e => {
    this.setState({ title: e });
  }

  private orderChange = (value: string) => {
    // tslint:disable-next-line
    const lo: number = parseInt(value);
    this.setState({ loadOrder: lo });
  }

  private visibleChange = (ev: React.FormEvent<HTMLElement>, isChecked: boolean) => {
    this.setState({ visible: isChecked });
  }
  // tslint:disable-next-line
  private onSourceComboChange = (e) => {

    const lo: ISPSuperFieldLookupOptions = this.state.lookupOptions;
    lo.sourceFilterField = e.value;
    this.setState({ lookupOptions: lo });
  }
  // tslint:disable-next-line
  private onTargetComboChange = (e) => {

    const lo: ISPSuperFieldLookupOptions = this.state.lookupOptions;
    lo.filterValueField = e.value;
    this.setState({ lookupOptions: lo });

  }
}
