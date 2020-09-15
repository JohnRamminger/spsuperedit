import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { autobind, TextField, Icon, IIconProps } from "office-ui-fabric-react";
import * as React from "react";
import { ISPSuperField } from "../../models";
import { IFieldConfigItemProps, IFieldConfigItemReactState } from "./";
import styles from './FieldConfigItem.module.scss';
const editIcon: IIconProps = { iconName: "Edit" };
import { SPLogging } from "../../services";
export class FieldConfigItem extends React.Component<
  IFieldConfigItemProps,
  IFieldConfigItemReactState
  > {
  constructor(props: IFieldConfigItemProps) {
    super(props);

    let bEdit: boolean = false;

    this.state = {
      editmode: bEdit,
      id: props.fieldItem.id,
      visible: true,
      title: props.fieldItem.title,
      name: props.fieldItem.name,
      type: props.fieldItem.type,
      required: props.fieldItem.required
    };
  }

  private titleChange = e => {
    this.setState({ title: e });
  };

  private visibleChange = (ev: React.FormEvent<HTMLElement>, isChecked: boolean) => {
    debugger;
    this.setState({ visible: isChecked });
  }
  public render(): React.ReactElement<IFieldConfigItemProps> {
    if (this.state.editmode) {
      return (
        <div className={styles.row}>
          <div>{this.state.title}</div>
          <div>{this.state.type}</div>
          <Checkbox label="Visible" checked={this.state.visible} onChange={this.visibleChange} />

          <Icon
            className={styles.alignLeftIcon}
            iconName="Save"
            onClick={() => {
              this.saveItem();
            }}
          />
          <Icon
            className={styles.alignLeftIcon}
            iconName="Cancel"
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

          <Icon
            className={styles.alignLeft}
            iconName="Edit"
            onClick={() => {
              this.editItem();
            }}
          />

          <Icon
            className={styles.alignLeft}
            iconName="Trash"
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
    debugger;
    let srchItem: ISPSuperField = {
      name: this.state.name,
      title: this.state.title,
      type: this.state.type,
      visible: this.state.visible,
      required: this.state.required,
      id: this.state.id
    };

    this.props.submitItem(srchItem);

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
