import * as React from 'react';
import { ISPSuperFieldTextProps } from './';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import styles from '../SPSuperEdit/Spsuperedit.module.scss';

export class SPSuperFieldText extends React.Component<ISPSuperFieldTextProps, {}> {
    public render(): React.ReactElement<ISPSuperFieldTextProps> {
        const bDisabled: boolean = this.props.mode === 'Display';

        const field: JSX.Element[] = [];
        switch (this.props.field.type) {
            case 'Note':
                field.push(<TextField label={this.props.field.title}
                    required={this.props.field.required}
                    multiline={true}
                    rows={3}
                    disabled={bDisabled}
                    onChanged={this.onTextChange}
                    value={this.props.value}
                    autoAdjustHeight={true} />);
                break;

            case 'Currency':
            case 'Number':
            case 'Text':
                field.push(<TextField
                    disabled={bDisabled}
                    onChanged={this.onTextChange}
                    value={this.props.value}
                    label={this.props.field.title}
                    required={this.props.field.required} />);
                break;
        }
        return (<div className={styles.fieldstyle}>{field}</div>);
    }

    // tslint:disable-next-line
    private onTextChange = (e) => {
        this.props.changed(this.props.field, e.value);
        this.setState({ selectedItem: e.value });
    }

}
