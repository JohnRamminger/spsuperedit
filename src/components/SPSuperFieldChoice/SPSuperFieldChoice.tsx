import * as React from 'react';
import { ISPSuperFieldChoiceProps, ISPSuperFieldChoiceReactState } from './';
// import { escape } from '@microsoft/sp-lodash-subset';
import { Web } from '@pnp/sp';
import styles from './SPSuperFieldChoice.module.scss';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

export class SPSuperFieldChoice extends React.Component<ISPSuperFieldChoiceProps, ISPSuperFieldChoiceReactState> {
    constructor(props: ISPSuperFieldChoiceProps) {
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
                result.Choices.forEach(choice => {
                    tmpChoices.push(choice);
                });
                this.setState({ choices: tmpChoices, selectedItem: this.props.value });
            });
    }

    public render(): React.ReactElement<ISPSuperFieldChoiceProps> {
        const field: JSX.Element[] = [];
        const selected: string[] = [];
        selected.push(this.state.selectedItem);

        field.push(<div className={styles.DropDownLabelStyle}>{this.props.field.title}</div>);
        field.push(
            <Dropdown options={this.state.choices}
                value={this.state.selectedItem}
                onChange={this.onComboChange}
                placeholder='Select an option' />);
        return (<div>{field}</div>);
    }

    // tslint:disable-next-line
    private onComboChange = (e) => {
        this.props.changed(this.props.field, e.value);
        this.setState({ selectedItem: e.value });
    }
}
