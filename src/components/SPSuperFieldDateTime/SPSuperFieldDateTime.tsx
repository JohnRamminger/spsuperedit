import * as React from 'react';
import { ISPSuperFieldDateTimeProps } from '.';
// import { escape } from '@microsoft/sp-lodash-subset';
import {
    DatePicker
    // DayOfWeek, IDatePickerStrings, mergeStyleSets
} from 'office-ui-fabric-react';

export class SPSuperFieldDateTime extends React.Component<ISPSuperFieldDateTimeProps, {}> {
    public render(): React.ReactElement<ISPSuperFieldDateTimeProps> {
        return (
            <DatePicker isRequired={this.props.field.required} label={this.props.field.title} />
        );
    }
}
