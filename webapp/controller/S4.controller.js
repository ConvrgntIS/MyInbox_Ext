sap.ui.define([
	"sap/ui/core/routing/History",
	'sap/ui/core/mvc/Controller'
	 //"sap/ca/scfld/md/controller/BaseDetailController"
], function(History, BaseDetailController) {
	"use strict";

	return BaseDetailController.extend("cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.controller.S4", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.view.S4
		 */
		onInit: function() {

			//BaseDetailController.prototype.onInit.call(this);

			// Get DataManager instance.
			this.oDataManager = sap.ca.scfld.md.app.Application.getImpl().getComponent().getDataManager();

			this.getOwnerComponent().getRouter().attachRouteMatched(function(oEvent) {
				if (oEvent.getParameter("name") === "itemDetail") {
					// Read parameters.
					var args = oEvent.getParameter("arguments"); // 3
					var sOrigin = args.SAP__Origin;
					var sInstanceID = args.InstanceID;
					var sItemNumber = args.ItemNumber;

					// Execute line item query.
					this.readItem(sOrigin, sInstanceID, sItemNumber, // 4
						jQuery.proxy(this.readItemSuccess, this),
						null);
				}
			}, this);
		},

		readItem: function(sOrigin, sInstanceID, sItemNumber, onSuccess, onError) { // 5
			var that = this;
			sap.ca.ui.utils.busydialog.requireBusyDialog();
			// Assemble GET request and execute it.
			debugger;
			this.oDataManager.oDataRead("/PRItems(SAP__Origin='" +
				jQuery.sap.encodeURL(sOrigin) +
				"',InstanceID='" + jQuery.sap.encodeURL(sInstanceID) +
				"',ItemNumber='" + jQuery.sap.encodeURL(sItemNumber) +
				"')",
				null,
				// null,
				// true,
				function(oData, oResponse) {
					sap.ca.ui.utils.busydialog.releaseBusyDialog();
					if (oData) {
						if (onSuccess)
							onSuccess(oData);
					}
				},
				function(oError) {
					sap.ca.ui.utils.busydialog.releaseBusyDialog();
					that.oDataManager.oDataRequestFailed(oError);
					if (onError)
						onError(oError);
				});
		},
		readItemSuccess: function(oData) {
			// Set model of the view.
			debugger;
			var oModel = new sap.ui.model.json.JSONModel(oData); // 6
			this.getView().setModel(oModel);
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.view.S4
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.view.S4
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.view.S4
		 */
		//	onExit: function() {
		//
		//	}

		onBack: function() {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("appHome", {}, true /*no history*/ );
			}
		}
	});

});