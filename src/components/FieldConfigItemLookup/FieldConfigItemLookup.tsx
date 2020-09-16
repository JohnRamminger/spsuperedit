import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { autobind, TextField, Icon, IIconProps } from 'office-ui-fabric-react';
import * as React from 'react';
import { ISPSuperField } from '../../models';
import { IFieldConfigItemLookupProps, IFieldConfigItemLookupReactState } from '.';
import styles from './FieldConfigItemLookup.module.scss';
const editIcon: IIconProps = { iconName: 'Edit' };
import { SPLogging } from '../../services';
export class FieldConfigItemLookup extends React.Component<
  IFieldConfigItemLookupProps,
  IFieldConfigItemLookupReactState
  > {
  constructor(props: IFieldConfigItemLookupProps) {
    super(props);

    let bEdit: boolean = false;

    this.state = {
      editmode: bEdit,
      id: props.fieldItem.id,
      visible: true,
      title: props.fieldItem.title,
      name: props.fieldItem.name,
      type: props.fieldItem.type,
      required: props.fieldItem.required,
      lookupOptions: {
        field: '',
        list: '',
        allowmultiple: false,
        lookupMode: '',
        filterField: '',
        filterValueField: ''
      }
    };
  }

  private titleChange = e => {
    this.setState({ title: e });
  };

  private visibleChange = (ev: React.FormEvent<HTMLElement>, isChecked: boolean) => {
    this.setState({ visible: isChecked });
  }
  public render(): React.ReactElement<IFieldConfigItemLookupProps> {
    if (this.state.editmode) {
      return (
        <div className={styles.row}>
          <div className={styles.alignLeftMain}>{this.state.title}</div>
          <div className={styles.alignLeftMain}>{this.state.type}</div>
          <div className={styles.alignLeftMain}>List</div>
          <div className={styles.alignLeftMain}>Field</div>
          <Checkbox label='Visible' checked={this.state.visible} onChange={this.visibleChange} />

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

          <div className={styles.alignLeftMain}>List</div>
          <div className={styles.alignLeftMain}>Field</div>
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

    let fldItem: ISPSuperField = {
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

  private cancelItem() {
    this.setState({ editmode: false });
  }

  private deleteItem() {
    this.props.remove(this.state.id);
  }

  private editItem() {
    this.setState({ editmode: true });
  }

  @autobind
  private _submit(id: number, selectedItem: ISPSuperField): void { }
}
