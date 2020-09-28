import * as React from 'react';
import { ISPSuperFieldDateTimeProps } from '.';
// import { escape } from '@microsoft/sp-lodash-subset';
import {
    DatePicker
    // DayOfWeek, IDatePickerStrings, mergeStyleSets
} from 'office-ui-fabric-react';
import styles from '../SPSuperEdit/Spsuperedit.module.scss';
export class SPSuperFieldDateTime extends React.Component<ISPSuperFieldDateTimeProps, {}> {
    public render(): React.ReactElement<ISPSuperFieldDateTimeProps> {
        const bDisabled: boolean = this.props.mode === 'Display';
        return (
            <DatePicker className={styles.fieldstyle}
                isRequired={this.props.field.required}
                label={this.props.field.title}
                value={new Date(this.props.value)}
                disabled={bDisabled} />
        );
    }
}
