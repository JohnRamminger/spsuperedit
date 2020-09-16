import { Placeholder } from '@pnp/spfx-controls-react/lib/Placeholder';
import * as React from 'react';
import styles from './Spsuperedit.module.scss';
import { ISPSuperEditProps, ISPSuperEditReactState } from './';
import { ISPFieldInfo } from '../../models';
import { SPSuperFieldText, SPSuperFieldDateTime, SPSuperFieldUser, SPSuperFieldChoice } from '../';
import { MiscFunctions } from '../../services';
import { ISPSuperField } from '../../../lib/models';
import { Web } from '@pnp/sp';
import { SPLogging } from '../../../lib/services';

export class SPSuperEdit extends React.Component<ISPSuperEditProps, ISPSuperEditReactState> {

  constructor(props: ISPSuperEditProps) {
    super(props);
    this.state = {
      mode: 'Edit',
      currentValues: []
    };
  }

  // tslint:disable-next-line
  public async componentDidMount() {
    const fieldInfo: ISPFieldInfo[] = [];
    this.props.fields.forEach(fld => {
      if (fld.visible) {

        fieldInfo.push({ name: fld.name, value: '', initialValue: '' });
      }
    });
    const itemID: number = MiscFunctions.GetItemID();
    if (itemID !== 0) {

      const oWeb: Web = new Web(this.props.ctx.pageContext.web.absoluteUrl);
      await oWeb.lists.getById(this.props.listID).items.getById(itemID).get().then(result => {
        SPLogging.DebugCode(true);
      });
    }
    this.setState({ currentValues: fieldInfo });
  }

  public render(): React.ReactElement<ISPSuperEditProps> {
    const fields: JSX.Element[] = [];
    if (this.props.fields) {
      this.props.fields.forEach(fld => {
        const currentValue: string = MiscFunctions.GetCurrentValue(this.state.currentValues, fld.name);
        if (fld.visible) {
          switch (fld.type) {
            case 'Note':
            case 'Text':
              fields.push(<SPSuperFieldText
                value={currentValue}
                ctx={this.props.ctx}
                mode={this.state.mode}
                field={fld} />);
              break;
            case 'Choice':
              fields.push(<SPSuperFieldChoice
                changed={this.choiceColumnChanged}
                value={currentValue}
                listID={this.props.listID}
                ctx={this.props.ctx}
                mode={this.state.mode}
                field={fld} />);
              break;
            case 'DateTime':
              fields.push(<SPSuperFieldDateTime
                value={currentValue}
                mode={this.state.mode}
                field={fld} />);
              break;
            case 'User':
            case 'UserMulti':
              fields.push(<SPSuperFieldUser
                value={currentValue}
                ctx={this.props.ctx}
                mode={this.state.mode}
                field={fld} />);
              break;
            default:
              fields.push(<h5>{fld.title + ' ' + fld.type}</h5>);
          }

        }
      });
      return (
        <div className={styles.spsuperedit} >
          {fields}

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

  private choiceColumnChanged = (fld: ISPSuperField, value: string) => {
    let vals: ISPFieldInfo[] = this.state.currentValues;
    vals = MiscFunctions.SetFieldValue(vals, fld, value);
    this.setState({ currentValues: vals });
  }

}
