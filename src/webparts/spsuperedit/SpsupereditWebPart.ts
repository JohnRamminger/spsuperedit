import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneButton,
  PropertyPaneButtonType
} from '@microsoft/sp-webpart-base';

import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';
import * as strings from 'SpsupereditWebPartStrings';
import { ISPSuperEditProps, SPSuperEdit, FieldConfigDialog } from '../../components';
import { SvcSuperFields } from '../../services/svcSuperField';
import { ISPSuperField } from '../../models';
import { FileFolderShared } from '@pnp/sp';
export interface ISpsupereditWebPartProps {
  listID: string;
  fields: ISPSuperField[];
  skipFields: string;
}

export default class SPSuperEditWebPart extends BaseClientSideWebPart<ISpsupereditWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISPSuperEditProps> = React.createElement(
      SPSuperEdit,
      {
        listID: this.properties.listID,
        fields: this.properties.fields,
        ctx: this.context
      }

    );
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }


  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'This web part allows for the advanced editing of a SharePoint list'
          },
          groups: [
            {
              groupName: 'General Settings',
              groupFields: [
                PropertyFieldListPicker('listid', {
                  label: 'Select a list',
                  selectedList: this.properties.listID,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onListChanged.bind(this),
                  multiSelect: false,
                  properties: this.properties,
                  context: this.context,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId'
                }),
                PropertyPaneTextField('skipFields', { label: 'Skip Fields' }),
                PropertyPaneButton('configureFields', {
                  text: 'Configure Fields',
                  buttonType: PropertyPaneButtonType.Hero,
                  icon: 'Edit',
                  onClick: this.configureButtons.bind(this)
                }),



              ]
            }
          ]
        }
      ]
    };
  }


  private configureButtons() {
    const dialog: FieldConfigDialog = new FieldConfigDialog();
    dialog.wpContext = this.context;

    dialog.fieldConfig = this.properties.fields;

    dialog.show().then(() => {
      try {
        this.properties.fields = dialog.fieldConfig;
      } catch (e) { }
    });
  }



  private onListChanged(propertyPath: string, oldValue: any, newValue: any) {
    let currentFields: ISPSuperField[] = [];
    if (currentFields == undefined) {
      currentFields = [];
    }
    SvcSuperFields.GetFields(this.context.pageContext.web.absoluteUrl, newValue).then(fields => {
      this.properties.listID = newValue;
      fields.forEach(fld => {
        if (!SvcSuperFields.HasField(fld.title, currentFields) && this.properties.skipFields.indexOf(fld.name) == -1) {
          currentFields.push(fld);
        }
      });

    });
    this.properties.fields = currentFields;
    this.render();
  }
}
