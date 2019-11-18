({
    checkObjectType : function(component, helper)
    {
        var action = component.get("c.getObjectType");
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS"){
                var retValue=response.getReturnValue();
                component.set('v.sObjectType', retValue);
                console.log(retValue);
                console.log(component.get("v.sObjectType"));
				helper.conditionalActions(component, helper, retValue);
            }
        });
        $A.enqueueAction(action);
    },
	conditionalActions  : function(component, helper, objectType)
	{
		
        if(objectType == 'opportunity')
        {
            helper.getOpportunityInfo(component);
			helper.getMSPAUserPermissions(component);
        }        
		else if(objectType == 'account')
        {
			helper.getMSPAUserPermissions(component);
        }
		else if(objectType == 'apttus_proposal__proposal__c')
        {
            helper.getQuotationInfo(component);
        }
	},
    getUserInfo : function(component)
    {
        var action = component.get("c.getUserInfo");

        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                component.set('v.userInfo', response.getReturnValue());
            }
            else
            {
                console.log(response.getState());
            }
        });
        $A.enqueueAction(action);
    },
    getOpportunityInfo : function(component)
    {
        var action = component.get("c.getOpportunityInfo");
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                component.set('v.opportunityInfo', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    getQuotationInfo : function(component)
    {
        var action = component.get("c.getQuotationInfo");
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                component.set('v.quotationInfo', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    getUserQuotePermissions : function(component) 
    {
		var action = component.get("c.getIsUserHasCQPQuoteAccess");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                component.set('v.isUserHasCQPQuoteAccess', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    
    getMSPAUserPermissions : function(component) 
    {
		var action = component.get("c.getIsUserHasMSPAAccess");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                component.set('v.isUserAllowedforEPMSPA', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
	},    
    
    showSpinner: function (component, event, helper) {
        var spinner = component.find("exSpinner");
        $A.util.removeClass(spinner, "slds-hide");
    },
    
    hideSpinner: function (component, event, helper) {
        var spinner = component.find("exSpinner");
        $A.util.addClass(spinner, "slds-hide");
    }
})