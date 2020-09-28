import * as React from 'react';
import { ISPSuperFieldCheckboxProps, ISPSuperFieldCheckboxReactState } from '.';
// import { escape } from '@microsoft/sp-lodash-subset';
import { Web } from '@pnp/sp';
import styles from '../SPSuperEdit/Spsuperedit.module.scss';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import 'react-dropdown/style.css';

export class SPSuperFieldCheckbox extends React.Component<ISPSuperFieldCheckboxProps, ISPSuperFieldCheckboxReactState> {
    constructor(props: ISPSuperFieldCheckboxProps) {
        super(props);
        // Default Color
        this.state = { choices: [], selectedItem: '' };
    }

    public componentDidMount(): void {
        const tmpChoices: string[] = [];
        const oWeb: Web = new Web(this.props.ctx.pageContext.web.absoluteUrl);
        oWeb.lists.getById(this.props.listID).fields.
            getByInternalNameOrTitle(this.props.field.name).
            get().then(result => {
                if (result.Choices) {
                    result.Choices.forEach(choice => {
                        tmpChoices.push(choice);
                    });
                    this.setState({ choices: tmpChoices, selectedItem: this.props.value });
                }
            });
    }

    public render(): React.ReactElement<ISPSuperFieldCheckboxProps> {
        const field: JSX.Element[] = [];
        const selected: string[] = [];
        const bDisabled: boolean = this.props.mode === 'Display';
        selected.push(this.state.selectedItem);

        // field.push(<div className={styles.DropDownLabelStyle}>{this.props.field.title}</div>);
        field.push(
            <Checkbox label={this.props.field.title} onChange={this.onCheckboxChange} disabled={bDisabled} />);
        return (<div className={styles.fieldstyle}>{field}</div>);
    }

    // tslint:disable-next-line
    private onCheckboxChange = (e) => {
        // this.props.changed(this.props.field, e.value);
        // this.setState({ selectedItem: e.value });
    }
}
