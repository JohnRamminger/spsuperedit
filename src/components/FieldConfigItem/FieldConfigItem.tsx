import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import {
  // autobind,
  // TextField,
  Icon
  // IIconProps
} from 'office-ui-fabric-react';
import * as React from 'react';
import { ISPSuperField } from '../../models';
import { IFieldConfigItemProps, IFieldConfigItemReactState } from './';
import styles from './FieldConfigItem.module.scss';
// const editIcon: IIconProps = { iconName: 'Edit' };
// import { SPLogging } from '../../services';
export class FieldConfigItem extends React.Component<
  IFieldConfigItemProps,
  IFieldConfigItemReactState
  > {
  constructor(props: IFieldConfigItemProps) {
    super(props);
    this.state = {
      editmode: false,
      id: props.fieldItem.id,
      visible: true,
      loadOrder: props.fieldItem.loadOrder,
      title: props.fieldItem.title,
      name: props.fieldItem.name,
      type: props.fieldItem.type,
      required: props.fieldItem.required
    };
  }

  public render(): React.ReactElement<IFieldConfigItemProps> {
    if (this.state.editmode) {
      return (
        <div className={styles.row}>
          <div>{this.state.title}</div>
          <div>{this.state.type}</div>
          <br />
          <hr />
          <Checkbox label='Visible' checked={this.state.visible} onChange={this.visibleChange} />

          <TextField
            className={styles.width75}
            defaultValue={this.state.loadOrder.toString()}
            label={'Load Order'}
            onChanged={this.orderChange}
          />
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

  // private titleChange = e => {
  //   this.setState({ title: e });
  // };

  private visibleChange = (ev: React.FormEvent<HTMLElement>, isChecked: boolean) => {
    this.setState({ visible: isChecked });
  }

  private orderChange = (value: string) => {
    // tslint:disable-next-line
    const lo: number = parseInt(value);
    this.setState({ loadOrder: lo });
  }

  private saveItem(): void {
    const fldItem: ISPSuperField = {
      listID: this.props.fieldItem.listID,
      name: this.state.name,
      title: this.state.title,
      type: this.state.type,
      visible: this.state.visible,
      required: this.state.required,
      id: this.state.id,
      loadOrder: this.state.loadOrder,
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
}
