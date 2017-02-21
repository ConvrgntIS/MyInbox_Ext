jQuery.sap.require("sap.ca.scfld.md.controller.BaseDetailController");
jQuery.sap.require("sap.ca.ui.message.message");
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
jQuery.sap.require("cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions");

sap.ca.scfld.md.controller.BaseDetailController.extend("cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.controller.S4V1", {

	sOrigin: "",
	sWorkitemID: "",
	sPrNumber: "",
	sItemNumber: "",

	onInit: function() {

		//execute the onInit for the base class BaseDetailController
		sap.ca.scfld.md.controller.BaseDetailController.prototype.onInit.call(this);

		// Get connection manager/resource bundle
		if (!this.oApplication) {
			this.oApplication = sap.ca.scfld.md.app.Application.getImpl();
			this.oConfiguration = this.oApplication.oConfiguration;
			this.oConnectionManager = this.oApplication.getConnectionManager();
			this.resourceBundle = this.oApplication.getResourceBundle();
			this.oDataModel = this.oApplicationFacade.getODataModel();
			this.getView().setModel(this.oDataModel);
		}

		this.oRouter.attachRouteMatched(function(oEvent) {
			if (oEvent.getParameter("name") === "itemDetail") {
				this.sOrigin = oEvent.getParameter("arguments").SAP__Origin;
				this.sWorkitemID = oEvent.getParameter("arguments").WorkitemID;
				this.sPrNumber = oEvent.getParameter("arguments").PrNumber;
				this.sItemNumber = oEvent.getParameter("arguments").ItemNumber;

				var sItemDetailContextPath = "/HeaderItemDetails(SAP__Origin='" + this.sOrigin + "',WorkitemID='" + this.sWorkitemID +
					"',PrNumber='" + this.sPrNumber + "',ItemNumber='" + this.sItemNumber + "')";

				var sItemPath = "/HeaderItemDetailCollection(SAP__Origin='" + this.sOrigin + "',WorkitemID='" + this.sWorkitemID + "',PrNumber='" +
					this.sPrNumber + "',ItemNumber='" + this.sItemNumber + "')";
				var oItemData = this.oDataModel.getProperty(sItemPath);
				var sItemCategory = "";
				if (oItemData) {
					sItemCategory = oItemData.ItemCategory;
				}

				var oSubcontractingTable = this.byId("SubcontractingTable");

				if (sItemCategory === "3") {
					this.getView().bindElement(sItemDetailContextPath, {
						expand: "Accountings,Notes,Attachments,ServiceLines/Accountings,Limits/Accountings,Components"
					});

					var aCells = [
						new sap.m.ObjectIdentifier({
							title: "{parts:[{path : 'Description'}, {path : 'Material'}], formatter : 'cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.commonIDFormatter'}"
						}),
						new sap.m.ObjectNumber({
							number: "{parts: [{path : 'Quantity'}], formatter : 'cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.quantityFormatterWithoutUnit'}",
							numberUnit: "{BaseUnitDescription}"
						})
					];
					var oTemplate = new sap.m.ColumnListItem({
						cells: aCells
					});
					oSubcontractingTable.bindItems("Components", oTemplate, null, null);
				} else {
					oSubcontractingTable.unbindItems();
					this.getView().bindElement(sItemDetailContextPath, {
						expand: "Accountings,Notes,ServiceLines/Accountings,Limits/Accountings"
					});
				}
				this.setLocalHeaderFooterOptions();
			}
		}, this);

		/**
		 * @ControllerHook Item Details / onInit
		 * With this controller method the onInit method of the ItemDetails controller can be enhanced.
		 * @callback sap.ca.scfld.md.controller.BaseDetailController~extHookOnInit
		 */
		if (this.extHookOnInit) {
			this.extHookOnInit();
		}
	},

	setLocalHeaderFooterOptions: function() {
		var that = this;

		var sHDColl = this._headerDetailCollection(this.sOrigin, this.sWorkitemID);
		var sIDColl = this._itemDetailCollection(this.sOrigin, this.sWorkitemID, this.sPrNumber, this.sItemNumber);

		// var ItemsCollection = this.oDataModel.getProperty("/" + sHDColl + '/HeaderItemDetails');
		var ItemsCollection = this.oDataModel.getProperty("/" + sHDColl + '/PRItems');

		if (typeof ItemsCollection === "undefined") {
			//in case someone directly navigates to the details screen, we don't have oDataModel loaded and need to navigate back to the S3 screen
			this.navBack();
			return;
		}

		var len = ItemsCollection.length;
		var currentItemIndex = ItemsCollection.indexOf(sIDColl);

		var oLocalHeaderFooterOptions = {
			onBack: function() {
				that.navBack();
			},
			oUpDownOptions: {
				iPosition: currentItemIndex,
				iCount: len,
				fSetPosition: function(iNewItem) {
					var path = ItemsCollection[iNewItem];
					var sItemNumber = that.oDataModel.getProperty("/" + path).ItemNumber;

					that.oRouter.navTo("itemDetail", {
						SAP__Origin: that.sOrigin,
						WorkitemID: that.sWorkitemID,
						PrNumber: that.sPrNumber,
						ItemNumber: sItemNumber
					}, true);
				},
				sI18NDetailTitle: "view.ItemDetails.title"
			}
		};

		if (this.extHookSetHeaderFooterOptions) {
			oLocalHeaderFooterOptions = this.extHookSetHeaderFooterOptions(oLocalHeaderFooterOptions);
		}

		this.setHeaderFooterOptions(oLocalHeaderFooterOptions);
	},

	navBack: function() {
		// if (this.sOrigin !== "" && this.sWorkitemID !== "") {
		// 	var sMasterContextPath = "WorkflowTaskCollection(SAP__Origin='" + this.sOrigin +
		// 		"',WorkitemID='" + this.sWorkitemID + "')";
		// 	this.oRouter.navTo("headerDetail", {
		// 		contextPath: sMasterContextPath
		// 	}, true);
		// }
		window.history.go(-1);
	},

	_refresh: function(channelId, eventId, data) {
		//Override and do nothing
	},

	onServiceItemPress: function(oEvent) {
		var bc = oEvent.getSource().getBindingContext().getPath();
		var oModel = this.getView().getModel();

		this.oRouter.navTo("itemServiceLine", {
			SAP__Origin: this.getView().getBindingContext().getProperty("SAP__Origin"),
			WorkitemID: this.sWorkitemID,
			PrNumber: this.getView().getBindingContext().getProperty("PrNumber"),
			ItemNumber: this.getView().getBindingContext().getProperty("ItemNumber"),
			ServiceLineNumber: oModel.getProperty(bc).ServiceLineNumber
		}, true);
	},

	onServiceLimitPress: function(oEvent) {
		var bc = oEvent.getSource().getBindingContext().getPath();
		var oModel = this.getView().getModel();

		this.oRouter.navTo("itemServiceLimit", {
			SAP__Origin: this.getView().getBindingContext().getProperty("SAP__Origin"),
			WorkitemID: this.sWorkitemID,
			PrNumber: this.getView().getBindingContext().getProperty("PrNumber"),
			ItemNumber: this.getView().getBindingContext().getProperty("ItemNumber"),
			LimitDescription: oModel.getProperty(bc).LimitDescription
		}, true);
	},

	_headerDetailCollection: function(sOrigin, sWorkitemID) {
		// var sResult = "HeaderDetailCollection(SAP__Origin='" + sOrigin + "',WorkitemID='" + sWorkitemID + "')";
		var sResult = "TaskCollection(SAP__Origin='" + sOrigin + "',InstanceID='" + sWorkitemID + "')";
		return sResult;
	},

	_itemDetailCollection: function(sOrigin, sWorkitemID, sPrNumber, sItemNumber) {
		// var sResult = "HeaderItemDetailCollection(SAP__Origin='" + sOrigin + "',WorkitemID='" + sWorkitemID +
		// 	"',PrNumber='" + sPrNumber + "',ItemNumber='" + sItemNumber + "')";
		var sResult = "PRItems(SAP__Origin='" + sOrigin + "',InstanceID='" + sWorkitemID + "',ItemNumber='" + sItemNumber + "')";
		return sResult;
	},

	onAttachment: function(oEvent) {
		var oContext = oEvent.getSource().getBindingContext();
		var sMediaSrc = oContext.getProperty().__metadata.media_src;
		sap.m.URLHelper.redirect(sMediaSrc, false);
	},

	onSenderPress: function(oEvent) {
		this.openEmployeeLaunch(oEvent, "CreatedByID");
	},

	openEmployeeLaunch: function(oEvent, sRef) {
		var oControl = oEvent.getSource();
		var sTitle = this.resourceBundle.getText("BussinessCard.Employee");

		// Open employee type business card
		var onRequestSuccess = function(oData) {
			var data = oData.results[0],
				oEmpConfig = {
					title: sTitle,
					name: data.FullName,
					department: data.Department,
					contactmobile: data.MobilePhone,
					contactphone: data.WorkPhone,
					contactemail: data.EMail,
					companyname: data.CompanyName,
					companyaddress: data.AddressString
				},
				oEmployeeLaunch = new sap.ca.ui.quickoverview.EmployeeLaunch(oEmpConfig);
			oEmployeeLaunch.openBy(oControl);
		};

		var sOrigin = oEvent.getSource().getBindingContext().getProperty("SAP__Origin");
		var sUser = oEvent.getSource().getBindingContext().getProperty(sRef);

		// Open connection to read employee data
		this.oDataModel = this.oConnectionManager.modelList[this.oConfiguration.getServiceList()[0].name];
		var sFilter = "$filter=" + encodeURIComponent("$filter=UserID eq '" + sUser + "' and SAP__Origin eq '" + sOrigin + "'");
		this.oDataModel.read("UserDetailsCollection", null, [sFilter], true,
			jQuery.proxy(onRequestSuccess, this),
			jQuery.proxy(this._onRequestFailed, this));
	},

	onSupplierPress: function(oEvent) {
		this.onCompanyLaunch(oEvent, "SupplierID");
	},

	onCompanyLaunch: function(oEvent, sRef) {
		var sTitle = this.oApplicationFacade.getResourceBundle().getText("BusinessCard.supplier");
		var sSupplierId = this.oApplicationFacade.getODataModel().getProperty("SupplierID", this.getView().getBindingContext());
		var oControl = oEvent.getSource();
		var sOrigin = this.getView().getBindingContext().getProperty("SAP__Origin");
		var oApplicationFacade = this.oApplicationFacade;
		var sSupplierDetailsCollection = "SupplierDetailCollection(SupplierID='" + sSupplierId + "',SAP__Origin='" + sOrigin + "')";
		var aParam = ["$expand=SupplierContacts"];
		sap.ca.ui.utils.busydialog.requireBusyDialog();
		oApplicationFacade.getODataModel().read(sSupplierDetailsCollection, null, aParam, true, function(oData, response) {
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
			var hasContacts = (oData.SupplierContacts && (oData.SupplierContacts.length > 0));
			var oSBCData = {
				title: sTitle,
				imgurl: cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.businessCardImg(oData.Mime_Type, oData.__metadata.media_src),
				companyname: oData.SupplierName,
				companyphone: oData.WorkPhone,
				companyaddress: oData.AddressString,
				maincontactname: hasContacts ? oData.SupplierContacts[0].ContactName : oData.ContactName,
				maincontactmobile: hasContacts ? oData.SupplierContacts[0].MobilePhone : oData.MobilePhone,
				maincontactphone: hasContacts ? oData.SupplierContacts[0].WorkPhone : oData.WorkPhone,
				maincontactemail: hasContacts ? oData.SupplierContacts[0].oData.EMail : oData.EMail
			};
			var oSupplierBusinessCard = new sap.ca.ui.quickoverview.CompanyLaunch(oSBCData);
			oSupplierBusinessCard.openBy(oControl);
		}, function(oError) {
			sap.ca.ui.utils.busydialog.releaseBusyDialog();
		});
	},

	_onRequestFailed: function(oError) {
		var sMessage = "";
		var sDetails = null;

		if (oError.response && oError.response.body != "" &&
			(oError.response.statusCode == "400" || oError.response.statusCode == "500")) {
			var oMessage = JSON.parse(oError.response.body);
			sMessage = oMessage.error.message.value;
		}
		if (sMessage == "") {
			sMessage = oError.message;
			sDetails = oError.response.body;
		}

		sap.ca.ui.message.showMessageBox({
			type: sap.ca.ui.message.Type.ERROR,
			message: sMessage,
			details: sDetails
		});
	}
});