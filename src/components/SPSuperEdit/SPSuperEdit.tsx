import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import * as React from 'react';
import styles from '../../webparts/spsuperedit/components/Spsuperedit.module.scss';
import { ISPSuperEditProps, ISPSuperEditReactState } from './';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPSuperFieldText, SPSuperFieldDateTime, SPSuperFieldUser } from '../';

export class SPSuperEdit extends React.Component<ISPSuperEditProps, ISPSuperEditReactState> {

  constructor(props: ISPSuperEditProps) {
    super(props);
    this.state = {
      mode: 'Edit'
    };
  }



  public render(): React.ReactElement<ISPSuperEditProps> {
    let fields = [];
    if (this.props.fields) {
      this.props.fields.forEach(fld => {
        if (fld.visible) {
          switch (fld.type) {
            case 'Note':
            case 'Text':
              fields.push(<SPSuperFieldText mode={this.state.mode} field={fld} />);
              break;
            case 'DateTime':
              fields.push(<SPSuperFieldDateTime mode={this.state.mode} field={fld} />);
              break;
            case 'User':
            case 'UserMulti':
              fields.push(<SPSuperFieldUser ctx={this.props.ctx} mode={this.state.mode} field={fld} />);
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
}
