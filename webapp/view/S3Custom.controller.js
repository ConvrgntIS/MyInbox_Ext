sap.ui.controller("cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.view.S3Custom", {
	extHookGetEntitySetsToExpand: function() {
		// Place your hook implementation code here 
		return ["PRItems"];
	},
	onShowItemDetails: function(oEvent) {
		var viewBindingContext = this.getView().getBindingContext();
		var itemBindingContext = oEvent.getSource().getBindingContext("detail");
		var sOrigin = viewBindingContext.getProperty("SAP__Origin");
		var sInstanceID = viewBindingContext.getProperty("InstanceID");
		var itemNumber;
		itemNumber = itemBindingContext.getProperty("ItemNumber");

		this.oRouter.navTo("itemDetail", {
			SAP__Origin: sOrigin,
			WorkitemID: sInstanceID,
			ItemNumber: itemNumber,
			PrNumber: itemBindingContext.getObject().PRNumber
		});
	},
    _getDescriptionForShare: function(sDescriptionText) {
       	var oData = this.oModel2.getData();
    	var sBody = "\n\n" + this.i18nBundle.getText("share.email.body.detailsOfTheItem") + "\n\n";
    	var oDateFormatter = sap.ui.core.format.DateFormat.getDateInstance();
    	if (oData.TaskTitle != "") {
    		sBody += this.i18nBundle.getText("item.taskTitle", oData.TaskTitle) + "\n";
    	}
    	if (oData.Description.TotalExpected != "") {
    		sBody += this.i18nBundle.getText("item.TotalExpected", '$' + oData.Description.TotalExpected + ' ' + oData.Description.Currency)  + "\n";
    	}   
    	if (oData.Description.TotalOverallLimit != "") {
    		sBody += this.i18nBundle.getText("item.TotalOverall", '$' + oData.Description.TotalOverallLimit + ' ' + oData.Description.Currency)  + "\n";
    	}     	
    	if ((oData.Priority !== "") && (oData.Priority !== "MEDIUM")){
    		sBody += this.i18nBundle.getText("item.priority", cross.fnd.fiori.inbox.Conversions.formatterPriority.call(this.getView(), oData.SAP__Origin, oData.Priority)) + "\n";
    	}
    	if (oData.CompletionDeadLine) {
    		sBody += this.i18nBundle.getText("item.dueDate", oDateFormatter.format(oData.CompletionDeadLine, true)) + "\n";
    	}
    	if (oData.Description.PRNumber !== "") {
    		sBody += this.i18nBundle.getText("item.PRNumber", oData.Description.PRNumber)  + "\n";
    	}     
    	if (oData.Description.AccountAssignment !== "") {
    		sBody += this.i18nBundle.getText("item.AccountAssignment", oData.Description.AccountAssignment)  + "\n";
    	} 
    	if (oData.Description.Plant !== "") {
    		sBody += this.i18nBundle.getText("item.Plant", oData.Description.Plant)  + "\n";
    	}     	
    	if (oData.Description.ContingencyAmount !== "") {
    		sBody += this.i18nBundle.getText("item.ContingencyAmount", '$' + oData.Description.ContingencyAmount + ' ' + oData.Description.Currency)  + "\n";
    	}       	
    	if (oData.Description.TotalServiceLimit !== "") {
    		sBody += this.i18nBundle.getText("item.TotalServiceLimit", '$' + oData.Description.TotalServiceLimit + ' ' + oData.Description.Currency)  + "\n";
    	}  
    	if ((oData.Description.DocumentCategory !== "") && (oData.Description.TotalServiceLimit !== 'Purchase requisition (B)')){
    		sBody += this.i18nBundle.getText("item.DocumentCategory", oData.Description.DocumentCategory)  + "\n";
    	}      	
    	if (sDescriptionText) {
    		// use override text if given
    		sBody += this.i18nBundle.getText("item.description", sDescriptionText) + "\n";
    	} else if ((oData.Description) && (oData.Description.Description) && (oData.Description.Description != "")) {
    		sBody += this.i18nBundle.getText("item.description", oData.Description.Description.trim()) + "\n";
    	}
    	// var sCreator = oData.CreatedByName;
    	var sCreator = oData.Description.PRCreatedBy;    	
    	if (sCreator == "") {
    		sCreator = oData.CreatedBy;
    	}
    	if (sCreator != "") {
    		sBody += this.i18nBundle.getText("item.createdBy", sCreator) + "\n";
    	}
    	if (oData.CreatedOn) {
    		sBody += this.i18nBundle.getText("item.createdOn", oDateFormatter.format(oData.CreatedOn, true)) + "\n";
    	}
  		
    	return sBody;    	
    }	
});