jQuery.sap.declare("cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.Component");
// use the load function for getting the optimized preload file if present
sap.ui.component.load({
	name: "cross.fnd.fiori.inbox",
	// Use the below URL to run the extended application when SAP-delivered application is deployed on SAPUI5 ABAP Repository
	url: "/sap/bc/ui5_ui5/sap/CA_FIORI_INBOX" // we use a URL relative to our own component
		// url: "/sap/bc/ui5_ui5/sap/ZFIORI_INBX_SP5" // we use a URL relative to our own component
		// extension application is deployed with customer namespace
});
this.cross.fnd.fiori.inbox.Component.extend("cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.Component", {
	metadata: {
		version: "1.0",
		includes: ["util/custom.css"],
		routing: {
			routes: {
				masterDetail: {
					subroutes: {
						master: {
							subroutes: {
								"itemDetail": {
									pattern: "itemDetail/{SAP__Origin}/{WorkitemID}/{PrNumber}/{ItemNumber}",
									viewPath: "cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.view",
									view: "S4V1",
									subroutes: {
										"itemServiceLine": {
											"pattern": "ItemServiceLine/{SAP__Origin}/{WorkitemID}/{PrNumber}/{ItemNumber}/{ServiceLineNumber}",
											"viewPath": "cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.view",
											"view": "ItemServiceLine",
											"viewLevel": "3"
										},
										"itemServiceLimit": {
											"pattern": "ItemServiceLimit/{SAP__Origin}/{WorkitemID}/{PrNumber}/{ItemNumber}/{LimitDescription}",
											"viewPath": "cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.view",
											"view": "Limit",
											"viewLevel": "3"
										}
									}
								}
							}
						}
					}
				}
			}
		},
		config: {
			"sap.ca.serviceConfigs": [{
				"name": "TASKPROCESSING",
				"serviceUrl": "/sap/opu/odata/sap/ZPR_APPROVAL_SRV;mo/",
				"isDefault": true,
				"mockedDataSource": "./localService/metadata.xml"
			}, {
				"name": "POSTACTION",
				"serviceUrl": "/sap/opu/odata/sap/ZPR_APPROVAL_SRV;mo/",
				isDefault: false,
				"mockedDataSource": "./localService/metadata.xml"
			}],
			"sap.ca.i18Nconfigs": {
				"bundleName": "cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.i18n.i18n"
			}
		},
		customizing: {
			"sap.ui.viewExtensions": {
				"cross.fnd.fiori.inbox.view.S3": {
					"CustomerExtensionForAdditionalDetails": {
						"className": "sap.ui.core.Fragment",
						"fragmentName": "cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.view.S3_CustomerExtensionForAdditionalDetailsCustom",
						"type": "XML"
					},
					"CustomerExtensionForInfoTabContent": {
						"className": "sap.ui.core.Fragment",
						"fragmentName": "cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.view.S3_CustomerExtensionForInfoTabContentCustom",
						"type": "XML"
					},
					"CustomerExtensionForObjectHeader": {
						"className": "sap.ui.core.Fragment",
						"fragmentName": "cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.view.S3_CustomerExtensionForObjectHeaderCustom",
						"type": "XML"
					}
					,
					"CustomerExtensionForAttachmentTabContent": {
						"className": "sap.ui.core.Fragment",
						"fragmentName": "cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.view.S3_CustomerExtensionForAttachmentTabContentCustom",
						"type": "XML"
					}
				},
				"cross.fnd.fiori.inbox.view.S2": {
					"CustomerExtensionForObjectListItem": {
						"className": "sap.ui.core.Fragment",
						"fragmentName": "cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.view.S2_CustomerExtensionForObjectListItemCustom",
						"type": "XML"
					}
				}
			},
			"sap.ui.controllerExtensions": {
				"cross.fnd.fiori.inbox.view.S3": {
					"controllerName": "cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.view.S3Custom"
				}
			}
		}
	},
	init: function() {
		jQuery.sap.require("cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.formatter");
		jQuery.sap.includeStyleSheet("/sap/bc/ui5_ui5/sap/zca_fiori_inbox/util/custom.css"); //Including in metadata (includes: ["util/custom.css"]) did not work for 1.28.1
	}
});