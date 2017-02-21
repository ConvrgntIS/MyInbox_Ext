/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
jQuery.sap.require("sap.ca.ui.model.format.FileSizeFormat");
jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
jQuery.sap.require("sap.ca.ui.model.format.QuantityFormat");
jQuery.sap.require("sap.ca.ui.model.format.FormatHelper");
jQuery.sap.require("sap.ca.ui.model.format.FormattingLibrary");

cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions = {

	// Approval Date Formatting
	ApprovalDateFormatter: function(sDate) {
		return cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.formatDaysAgo(sDate);
	},

	// ID and Description Formatting
	commonIDFormatter: function(sDescription, sID) {
		if (sID){
			if (sDescription){
				var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
				return oBundle.getText("Formatting.DescriptionAndId", [sDescription, sID]);
			}
			return sID;
		}
		if (sDescription){
		  return sDescription;
		}
		return "";
	},

	accountAssignmentPercentageFormatter: function (percentage) {
	//  "%" shall be shown, only if there is a percentage given.	
		if (percentage == null || percentage == "") {
			return "";
		} else {
			return "%";
		}
	},

	serviceInformationVisibilityTrigger: function( sServiceID, sLongDescription ) {
		var f = cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.commonFieldVisibilityTrigger;
		return f(sServiceID) || f(sLongDescription);
	},

	lazyRoundNumber: function(sNum) {
		var result = 0;
		var formatter;
		if (sNum) {
			if (!isNaN(parseFloat(sNum)) && isFinite(sNum)) {
				if (Math.abs(sNum) < 1e6) {
					formatter = sap.ca.ui.model.format.NumberFormat.getInstance({style:'standard'}, sap.ui.getCore().getConfiguration().getLocale());
				} else {
					formatter = sap.ca.ui.model.format.NumberFormat.getInstance({style:'short'}, sap.ui.getCore().getConfiguration().getLocale());
				}
				result = formatter.format(sNum);
			}
		}
		return result;
	},

	formatAttachmentIcon: function(sMimeType) {
		return sap.ca.ui.model.format.FormattingLibrary.formatAttachmentIcon(sMimeType);
	},

	headerAccountingFormatter: function(sCumulatedAccountingTypeCode,
			sAcctCatDesc, sAcctNumber, sAcctDescription, sGlAccount, sGlAccDescription) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
		var sResult1 =cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.commonIDFormatter(sAcctDescription, sAcctNumber);
		var sResult2 =cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.commonIDFormatter(sGlAccDescription, sGlAccount);
		var sMultiAccounting = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.multiAccounting") : "";
		var sNoAccounting = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.placeholder") : "";
		var sGlAccountLabel = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.account") : "";
		var sUnknown = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.unknown") : "";
		if (sCumulatedAccountingTypeCode == '2') {
			return sMultiAccounting;
		} else if (sCumulatedAccountingTypeCode == '0') {
			return sNoAccounting;
		} else if (sCumulatedAccountingTypeCode == '3') {
			return sUnknown;
		} else if (sAcctCatDesc != null && sAcctCatDesc != "") {
			return sAcctCatDesc + ' ' + sResult1 + '\n' + sGlAccountLabel + ' ' + sResult2;	
		};
	},

	headerAccountingVisibilityTrigger: function(sCumulatedAccountingTypeCode) {
		if (sCumulatedAccountingTypeCode == '0') {
			return false;
		} else {
			return true;
		}
	},

	noteDateFormatter: function(bNoteIsApproverNote, sDate) {
		if (bNoteIsApproverNote) {
			return cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.formatDaysAgo(sDate);
		} else {
			return '';
		};
	},

	attachmentDateFormatter: function(sDate) {
		return cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.formatLongDate(sDate);
	},

	approverNoteValueFormatter: function(bNoteIsApproverNote, sValue) {
		if (bNoteIsApproverNote) {
			return sValue;
		} else {
			return '';
		};
	},

	priceFieldVisibilityTrigger: function(sValue, sItemType) {
		if (sItemType =='2') {
			return false;
		} else {
			return cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.commonFieldVisibilityTrigger(sValue);
		}
	},

	commonFieldVisibilityTrigger: function(sValue) {
		if (sValue == '' || sValue == null) {
			return false;
		} else {
			return true;
		};
	},

	customerNameFormatter : function(sCustomerName, sCustomerID){
		if (sCustomerID !== '' && sCustomerID !== undefined && sCustomerID !== null) {
			return sCustomerName + ' (' + sCustomerID + ')';
		} else {
			return sCustomerName;
		};
	},	

	plantVisibilityTrigger : function(plantName, customerName, customerID, sItemType){
		if ((plantName !== '' || plantName !== null) && 
				(customerName === '' || customerName === null || customerName === undefined) &&
				(customerID === '' || customerID === null || customerID === undefined) && sItemType !== "5"	) {
			return true;
		} else {
			return false;
		};
	},

	customerNameVisibilityTrigger : function (sCustomerName, sCustomerID){
		//visibility trigger for showing label "Customer"
		//visibility is true, if  sCustomerName and sCustomerID is set
		if (sCustomerName !== '' && sCustomerName !== undefined && sCustomerName !== null &&
				sCustomerID !== '' && sCustomerID !== undefined && sCustomerID !== null){
			return true;
		}else{
			return false;
		}
	},

	freestyleNameVisibilityTrigger : function (sCustomerName, sCustomerID){
		//visibility trigger for showing label "Name"
		//visibility is true, if  sCustomerName is set and sCustomerID is empty
		if (sCustomerName !== '' && sCustomerName !== undefined && sCustomerName !== null &&
				(sCustomerID === '' || sCustomerID === undefined || sCustomerID === null)){
			return true;
		}else{
			return false;
		}
	},

	//TODO check whether this method is used otherwise remove it
	commonDescriptionAndIDVisibilityTrigger: function(sDescription, sID) {
		if (sDescription == '' || sDescription == null || sID == '' || sID == null) {
			return false;
		} else {
			return true;
		};
	},

	deliveryHeaderFormatter: function(sDeliveryDate, sAlsoLater) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();	
		var prefix = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.deliveryOn") : "";
		return prefix + ' ' + cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.deliveryDateFormatter(sDeliveryDate, sAlsoLater);
	},

	valueLimitFormatter: function(sValue, sUnlimited, sCurrency) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
		var sResult = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.limitValue") : "";
		sResult += ': '
				+ cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.valueLimitWithoutLabelFormatter(sValue, sUnlimited,
						sCurrency);
		return sResult;
	},

	valueLimitWithoutLabelFormatter: function(sValue, sUnlimited, sCurrency) {
		var sResult = "";
		if (sUnlimited === '' || sUnlimited === null || sUnlimited === undefined) {
			sResult += cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.formatAmount(sValue) + ' ' + sCurrency;
		} else {
			var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
			sResult += ((oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.unlimitedLimit") : "");
		}
		return sResult;
	},

	expectedValueFormatter: function(sValue, sCurrency) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
		var sResult = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.expValue") : "";
		sResult += ': ' + cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.formatAmount(sValue) + ' ' + sCurrency;
		return sResult;
	},

	itemQuantityFormatter: function(sQuantity, sUnit, sType) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
		if (sType == 'S') {
			return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.service") : "";
		} else {
			return cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.quantityFormatter(sQuantity, sUnit);
		};
	},

	
	quantityFormatterWithoutUnit: function(sQuantity, sUnit) {
		
		var numberFormatter = sap.ui.core.format.NumberFormat.getFloatInstance({}, sap.ui.getCore().getConfiguration().getLocale());
		
		//var oFormatter = sap.ca.ui.model.format.QuantityFormat.getInstance({sValue: sQuantity, unitCode: sUnit}, sap.ui.getCore().getConfiguration().getLocale());
		return numberFormatter.format(sQuantity);
	},
	
	quantityFormatter: function(sQuantity, sUnit) {
		return cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.quantityFormatterWithoutUnit(sQuantity, sUnit) + ' ' + sUnit;
	},

	quantityPerUnitItemCategory: function(sQuantity, sUnit, sPrice, sCurrency,sItemCategory){
		if (sItemCategory === "2"){
			cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.quantityPerUnitFormatter("", "", "", "");
		}
		else{
			cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.quantityPerUnitFormatter(sQuantity, sUnit, sPrice, sCurrency);
		}
	},
	
	quantityPerUnitFormatter: function(sQuantity, sUnit, sPrice, sCurrency) {
		var sPrice = cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.formatAmount(sPrice);
		var sQuantity = cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.quantityFormatterWithoutUnit(sQuantity, sUnit);
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
		
		return oBundle.getText("view.PurchaseRequisition.priceQty", [sPrice, sCurrency, sQuantity, sUnit]);
	},

	serviceLinesNumFormatter: function(sItemsCount) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
		
		return oBundle.getText("view.DetailItemServiceView.serviceLinesNum", [sItemsCount]);
	},

	totalPriceFormatter: function(sPrice, sCurrency) {
		var sPrice = cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.formatAmount(sPrice);
		return sPrice + ' ' + sCurrency;
	},

	componentVisibilityTrigger: function(iItemCategory) {
		if (iItemCategory === "3") {
			return true;
		} else {
			return false;
		}
	},

	itemCategoryFormatter: function(sItemCategoryDescription, sItemType) {
		if (sItemCategoryDescription && sItemCategoryDescription !== "") {
			return sItemCategoryDescription;
		} else {
			var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
			if (sItemType == 'S') {
				return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.service") : "";
			} else if (sItemType == 'L') {
				return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.limit") : "";
			} else if (sItemType == 'M') {
				return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.standard") : "";
			} else if (sItemType == '2') {
				return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.consignment") : "";
			} else if (sItemType == '3') {
				return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.subcontracting") : "";
			} else if (sItemType == '5') {
				return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.thirdParty") : "";
			};
		}
	},

	notesVisibilityTrigger: function(oNumberOfNotes) {
		if (oNumberOfNotes == '' || oNumberOfNotes == null || oNumberOfNotes == "0" || oNumberOfNotes == 0) {
			return false;
		} else {
			return true;
		};
	},

	attachmentsVisibilityTrigger: function(oNumberOfAttachments) {
		if (oNumberOfAttachments == '' || oNumberOfAttachments == null || 
				oNumberOfAttachments == "0" || oNumberOfAttachments == 0) {
			return false;
		} else {
			return true;
		};
	},

	// create a function that converts Strings into Dates
	fConvert: function(sDate) {
		var oDate = sDate;
		if (typeof sDate === "string") {
			// Handle the format /Date(miliseconds)/
			if (sDate.indexOf("Date") != -1) {
				sDate = sDate.substring(sDate.indexOf("(") + 1, sDate
						.indexOf(")"));
				sDate = new Number(sDate);
			}
			oDate = new Date(sDate);
		} else if (typeof sDate !== "object" || sDate === null) {
			oDate = "";
		}
		return oDate;
	},

	formatLongDate: function(oDate, bUTC) {
		var formatter = sap.ca.ui.model.format.DateFormat.getDateInstance({style : "long"}, sap.ui.getCore().getConfiguration().getLocale());

		oDate = cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.fConvert(oDate);
		if (oDate === "") {
			return "";
		}
		return formatter.format(oDate, bUTC);
	},

	deliveryDateFormatter: function(sDeliveryDate, sAlsoLater) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();	
		var oLater = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.DeliveryAlsoLater") : "";

		var oDate = cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.formatLongDate(sDeliveryDate, true);

		if (sAlsoLater == null || sAlsoLater == "") {
			return oDate;
		} else {
			return oDate + ' ' + oLater;
		}
	},

	itemsTableHeader: function(sItemsCount) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
		if (sItemsCount === undefined || sItemsCount === null || parseInt(sItemsCount) == 0) {
			return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.noItem") : "";
		} else {
			return (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.multipleItems", [parseInt(sItemsCount)]) : "";
		};
	},

	serviceLinesTableHeader: function(sItemsCount) {
		if (sItemsCount === undefined || sItemsCount === null || parseInt(sItemsCount) == 0) {
			return '';
		} else {
			var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
			return (oBundle !== undefined) ? oBundle.getText("view.DetailItemServiceView.serviceLinesNum", [parseInt(sItemsCount)]) : "";
		};
	},

	commonCountVisibilityTrigger: function(sCount) {
		if (sCount !== null && sCount !== undefined && sCount != '0') {
			return true;
		} else {
			return false;
		};
	},

	materialVisibilityTrigger: function(sProductLineType) {
		if (sProductLineType !== "L" && sProductLineType !== "S") {
			return true;
		}
		return false;
	},

	serviceVisibilityTrigger: function(sProductLineType) {
		if (sProductLineType == "S") {
			return true;
		}
		return false;
	},

	ItemServiceLineVisibilityTrigger: function(sNumberSLine) {
		if (sNumberSLine == '' || sNumberSLine == null || sNumberSLine == "0") {
			return false;
		} else {
			return true;
		};
	},

	ItemLimitVisibilityTrigger: function(sNumberSLine) {
		if (sNumberSLine == '' || sNumberSLine == null || sNumberSLine == "0") {
			return false;
		} else {
			return true;
		};
	},

	ItemAccountAssignmentVisibilityTrigger: function(oAccounting) {
		if (oAccounting !== null && oAccounting !== undefined && oAccounting.length !== 0) {
			return true;
		} else {
			return false;
		};
	},

	serviceLinesFormatter: function(sNumberSLine) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
		var sSLine = (oBundle !== undefined) ? oBundle.getText("view.DetailItemServiceView.serviceLines") : "";
		if (sNumberSLine == '' || sNumberSLine == null || sNumberSLine == "0") {
			return '0' + ' ' + sSLine;
		} else {
			return sNumberSLine + ' ' + sSLine;
		};
	},

	ItemNoteVisibilityTrigger: function(oNumberOfNotes) {
		if (oNumberOfNotes == '' || oNumberOfNotes == null || oNumberOfNotes == "0" || oNumberOfNotes == 0) {
			return false;
		} else {
			return true;
		};
	},

	formatAttachmentSize: function(sFileSize) {
		var formatter = sap.ca.ui.model.format.FileSizeFormat.getInstance();
		return formatter.format(sFileSize);
	},

	formatAttachmentDesc: function(sDescription, sMimeType) {
		if (sDescription) {
			return sDescription;
		}
		return sMimeType;
	},

	ItemAttachmentVisibilityTrigger: function(oNumberOfAttachments) {
		if (oNumberOfAttachments == '' || oNumberOfAttachments == null || oNumberOfAttachments == "0"
				|| oNumberOfAttachments == 0) {
			return false;
		} else {
			return true;
		};
	},

	forwardedBy: function(sReassignByName) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
		var sResult = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.Forwarded") : "";

		if (sReassignByName === null || sReassignByName == ""){
			return '';
		} else {
		return sResult + ' ' + sReassignByName;
		};
	},

	substitutedBy: function(sSubstitutingForName) {
		var oBundle = sap.ca.scfld.md.app.Application.getImpl().getResourceBundle();
		var sResult = (oBundle !== undefined) ? oBundle.getText("view.PurchaseRequisition.Substitute") : "";
		if (sSubstitutingForName === null || sSubstitutingForName == ""){
			return '';
		} else {
			return sResult + ' ' + sSubstitutingForName;
		};
	},

	materialGroupFormatter: function(sMaterialGroup, sMaterialGroupDescription) {
		if (sMaterialGroup !== '' && sMaterialGroup !== undefined && sMaterialGroup !== null) {
			return sMaterialGroupDescription + ' (' + sMaterialGroup + ')';
		} else {
			return sMaterialGroupDescription;
		};
	},

	materialIDVisibilityTrigger: function(sMaterialID) {
			if (sMaterialID !== '' && sMaterialID !== undefined && sMaterialID !== null) {
			return true;
		} else {
			return false;
		};
	},

	// Expects a date in the browsers current timezone
	formatDaysAgo: function(oDate) {
		if (oDate == null || oDate == "" || oDate === undefined) {
			return "";
		} else {
			var formatter = sap.ca.ui.model.format.DateFormat.getDateInstance({style : "daysAgo"}, sap.ui.getCore().getConfiguration().getLocale());
			var oFormatDate = formatter.format(oDate, true);
			return oFormatDate;
		}
	},

	getFormatOptions: function(options, lazy) {
		var formatOptions = {};
		var t = typeof options;
		switch (t) {
		case "number":
			if (lazy) {
				formatOptions.lazyDecimals = options;
			} else {
				formatOptions.decimals = options;
			}
			break;
		case "object":
			if (typeof options.locale === "string") {
				formatOptions.locale = new sap.ui.core.Locale(options.locale);
			} else {
				formatOptions.locale = options.locale;
			}
			formatOptions.decimals = options.decimals;
			formatOptions.rounding = options.rounding;
			formatOptions.lazy = options.lazy;
			formatOptions.lazyDecimals = options.lazyDecimals;
			formatOptions.lazyRounding = options.lazyRounding;
			break;
		}
		if (lazy !== undefined) {
			formatOptions.lazy = lazy;
		}
		if (!formatOptions.locale) {
			if (sap.ui.getCore().getConfiguration().getLanguage() == "ZH") {
				formatOptions.locale = new sap.ui.core.Locale("zh_CN");
			} else {
				formatOptions.locale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
			}
		}
		return formatOptions;
	},

	roundNumber: function(number, options) {
		return sap.ca.ui.model.format.FormatHelper.roundNumber(number, options);
	},

	hasRounding: function(options) {
		var rounding;
		if (options !== undefined) {
			if (typeof options === "number") {
				rounding = true;
			} else {
				if (options.lazy) {
					rounding = (options.lazyDecimals !== undefined) || (options.lazyRounding !== undefined);
				} else {
					rounding = (options.decimals !== undefined) || (options.rounding !== undefined);
				}
			}
		} else {
			rounding = false;
		}
		return rounding;
	},

	
	
	formatNumberItemType: function(nNum, sItemType) {
		if (sItemType ==='2') {
			return "";
		} else {
			return cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.formatAmount(nNum);	
		}
	},

	formatNumberUnitItemType:function(sItemType, sCurrency) {
		if (sItemType === '2') {
			return "";
		} else {
			return sCurrency;	
		}
	},
	
	formatAmount: function(number){
		var formatter = sap.ui.core.format.NumberFormat.getCurrencyInstance({showMeasure: false}, sap.ui.getCore().getConfiguration().getLocale());
		//return "$" + formatter.format(number);
		return formatter.format(number);
	},

	formatNumber: function (number, options) {
		var numValue  = cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.toNumeric(number);
		if (!isFinite(numValue)) {
			return "";
		}
		var formatOptions = cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.getFormatOptions(options);
		var numberFormatter = sap.ui.core.format.NumberFormat.getFloatInstance({}, formatOptions.locale);
		if (cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.hasRounding(options)) {
			numValue = cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.roundNumber(numValue, formatOptions);
			return numberFormatter.format(numValue);
		} else {
			return numberFormatter.format(number);
		}
	},

	formatAccountingPercentage: function(nNum) {
		var nNum1 = cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.toNumeric(nNum);
		var result = cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.Conversions.formatNumber(nNum1);
		return result;
	},

	toNumeric: function(obj) {
		return sap.ca.ui.model.format.FormatHelper.toNumeric(obj);
	},

	getNumberFormatOptions: function(options, lazy) {
		var formatOptions = {};
		var t = typeof options;
		switch (t) {
		case "number":
			if (lazy) {
				formatOptions.lazyDecimals = options;
			} else {
				formatOptions.decimals = options;
			}
			break;
		case "object":
			if (typeof options.locale == "string") {
				formatOptions.locale = new sap.ui.core.Locale(options.locale);
			} else {
				formatOptions.locale = options.locale;
			}
			formatOptions.decimals = options.decimals;
			formatOptions.rounding = options.rounding;
			formatOptions.lazy = options.lazy;
			formatOptions.lazyDecimals = options.lazyDecimals;
			formatOptions.lazyRounding = options.lazyRounding;
			break;
		}
		if (lazy != undefined) {
			formatOptions.lazy = lazy;
		}
		if (!formatOptions.locale) {
			if (sap.ui.getCore().getConfiguration().getLanguage() == "ZH") {
				formatOptions.locale = new sap.ui.core.Locale("zh_CN");
			} else {
				formatOptions.locale = sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();
			}
		}
		return formatOptions;
	},

	getMagnitude: function(number) {
		var getmag = sap.ca.ui.model.format.FormatHelper.getMagnitude(number);
		return getmag;
	},

	businessCardImg: function(sMimeType, sImgUrl) {
		if (sMimeType) {
			return sImgUrl;
		} else {
			return null;
		}
	}
};