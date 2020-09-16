import * as React from 'react';
import { ISPSuperFieldTextProps } from './';
import { TextField } from 'office-ui-fabric-react/lib/TextField';

export class SPSuperFieldText extends React.Component<ISPSuperFieldTextProps, {}> {
    public render(): React.ReactElement<ISPSuperFieldTextProps> {
        const field: JSX.Element[] = [];
        switch (this.props.field.type) {
            case 'Note':
                field.push(<TextField label={this.props.field.title}
                    required={this.props.field.required}
                    multiline={true}
                    rows={3}
                    autoAdjustHeight={true} />);

                break;

            case 'Text':
                field.push(<TextField label={this.props.field.title} required={this.props.field.required} />);
                break;
        }
        return (<div>{field}</div>);
    }
}
