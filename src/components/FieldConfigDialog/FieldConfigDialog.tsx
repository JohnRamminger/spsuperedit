import { BaseDialog, IDialogConfiguration } from '@microsoft/sp-dialog';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ISPSuperField } from '../../models';

import {
  autobind,
  Button,
  DialogContent,
  DialogFooter,
  PrimaryButton
} from 'office-ui-fabric-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FieldConfigItem } from '../FieldConfigItem';
import styles from './FieldConfigDialog.module.scss';
import { IFieldConfigProps, IFieldConfigReactState } from './';
import { MiscFunctions } from '../../services';

class FieldConfigDialogContent extends React.Component<
  IFieldConfigProps,
  IFieldConfigReactState
  > {
  constructor(props: IFieldConfigProps) {
    super(props);
    // Default Color
    this.state = { currentFields: props.fields };
  }

  private showDialog() { }

  private saveSearchItem = (saveitem: ISPSuperField) => {
    let workItems = this.state.currentFields;

    for (let i = 0; i < workItems.length; i++) {
      let item = workItems[i];
      if (item.id === saveitem.id) {
        workItems[i] = saveitem;
      }
    }

    this.setState({ currentFields: workItems });
  };

  private removeItem = (id: string) => {
    let updateItems: ISPSuperField[] = [];
    for (let i: number = 0; i < this.state.currentFields.length; i++) {
      const item = this.state.currentFields[i];
      if (item.id !== id) {
        updateItems.push(item);
      }
    }
    //    this.setState({ currentButtons: updateItems });
    this.props.submit(updateItems);
  };

  public componentDidMount() { }



  public render(): JSX.Element {
    const flds: JSX.Element[] = [];

    this.state.currentFields.forEach(field => {
      // if (field.visible != false) 
      {
        flds.push(
          <FieldConfigItem
            fieldItem={field}
            submitItem={this.saveSearchItem}
            remove={this.removeItem}
          ></FieldConfigItem>
        );
      }
    });

    return (
      <DialogContent
        className={styles.container}
        title='Configure Search Buttons'
        subText=''
        onDismiss={this.props.close}
        showCloseButton={true}
      >
        {flds}

        <DialogFooter>
          {/* <Button
            text='Add Item'
            title='Add Item'
            onClick={e => this.showDialog()}
          /> */}

          <Button text='Cancel' title='Cancel' onClick={this.props.close} />
          <PrimaryButton
            text='OK'
            title='OK'
            onClick={() => {
              this.clicked();
            }}
          />
        </DialogFooter>
      </DialogContent>
    );
  }

  private clicked() {
    this.props.submit(this.state.currentFields);
  }

  @autobind
  private _onChange(e) { }
}

// tslint:disable-next-line: max-classes-per-file
export class FieldConfigDialog extends BaseDialog {
  public wpContext: WebPartContext;
  public fieldConfig: ISPSuperField[];
  public render(): void {
    ReactDOM.render(
      <FieldConfigDialogContent
        close={this.close}
        message={''}
        fields={this.fieldConfig}
        submit={this._submit}
        refresh={this._refresh}
        debugMode={true}
        ctx={this.wpContext}
      />,
      this.domElement
    );
  }

  public getConfig(): IDialogConfiguration {
    return {
      isBlocking: false
    };
  }

  protected onAfterClose(): void {
    super.onAfterClose();
    ReactDOM.unmountComponentAtNode(this.domElement);
  }

  @autobind
  private _itemSubmit() { }

  @autobind
  private _refresh(currentFields: ISPSuperField[]): void {
    this.fieldConfig = [];
    this.render();
    this.fieldConfig = currentFields;
    this.render();
  }

  @autobind
  private _submit(currentFields: ISPSuperField[]): void {
    this.fieldConfig = currentFields;
    this.close();
  }
}
