jQuery.sap.declare("cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.formatter");

cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.formatter = {
	formatterCreatedDate: function(sDate) {
		if (sDate) {
			var oDateFormatter = sap.ca.ui.model.format.DateFormat.getDateInstance();
			var sFormattedDate = oDateFormatter.innerFormat.format(sDate, false);
			return sFormattedDate;
		}
		return;
	},
	noLimitIcon: function(noLimit) {
		if (noLimit) {
			return "sap-icon://message-warning";
		}
	},
	limitCurrency: function(currency, noLimit) {
		if (!noLimit) {
			return currency;
		}
	},
	noLimit: function(noLimit) {
		if (noLimit) {
			return "At least one item has 'No Limits'";
		}
	},
	deliveryDate: function(date, alsoLater) {
		if (alsoLater) {
			return cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.formatter.formatterDate(date) + " " + "and later";
		} else {
			return cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.formatter.formatterDate(date);
		}
	},
	formatAmount: function(number) {
		var formatter = sap.ui.core.format.NumberFormat.getCurrencyInstance({
			showMeasure: false
		}, sap.ui.getCore().getConfiguration().getLocale());
		return formatter.format(number);
	},
	quantityUnit: function(quantity) {
		if (!quantity) {
			quantity = "0";
		}
		return quantity;
	},
	limitAmount: function(value, noLimit) {
		if (noLimit) {
			return "Unlimited";
		}
		if (!value) {
			value = "0";
		}
		return cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.formatter.formatAmount(parseFloat(value).toFixed(2));
	},
	amount: function(value, currency) {
		if (!value) {
			value = "0";
		}
		// return "$" + cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.formatter.formatAmount(parseFloat(value).toFixed(2)) + " " + currency;
		return cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.formatter.formatAmount(parseFloat(value).toFixed(2)) + " " + currency;
	},
	amountWithoutCurrency: function(value, currency) {
		if (!value) {
			value = "0";
		}
		return cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.formatter.formatAmount(parseFloat(value).toFixed(2));
	},
	expectedAmount: function(value, currency) {
		if (!value) {
			value = "0";
		}
		return "Total Expected: " + cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.formatter.amount(value, currency);
	},
	overallAmount: function(value, currency) {
		if (!value) {
			value = "0";
		}
		return "Total Overall Limit (w/contingency):" + cross.fnd.fiori.inbox.ZCA_FIORI_INBOX.util.formatter.amount(value, currency);
	},
	formatterDate: function(sDate) {
		if (sDate) {
			var oDateFormatter = sap.ca.ui.model.format.DateFormat.getDateInstance();
			var sFormattedDate = oDateFormatter.innerFormat.format(sDate, false);
			return sFormattedDate;
		}
	}
};