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
			//helper.getMSPAUserPermissions(component);
            helper.validateLoAPoA(component);
            helper.getIsUserHasOppAccess(component);
        }        
		else if(objectType == 'account')
        {
			//helper.getMSPAUserPermissions(component);
            helper.validate(component);
        }
        else if(objectType == 'lead')
        {
            helper.PrepopulateOppfromLead(component);
            helper.leadButtonVisibility(component);
            helper.getLeadOwnedByUser(component);
            helper.getLeadConvertedStatus(component);
            helper.getLeadRecInfo(component);
            helper.getLeadRecordType(component);
        }
		else if(objectType == 'joint_business_plan__c')                
        {
            helper.getBusinessPlanInfo(component);
        }
		else if(objectType == 'channel_business_review__c')
		{
            helper.getBusinessReviewInfo(component);
        }
		else if(objectType == 'channel_market_coverage__c')
		{
            helper.getMarketScopeInfo(component); 
            helper.getBPPlanRecordType(component);
        }
        else if(objectType == 'visit_report__c')
        {
            helper.getvisitReportInfo(component);
            helper.getSiteInfo(component);
        }   
        else if(objectType == 'account_plan__c')
        {
            helper.getAccountPlanInfo(component);
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
    getBusinessPlanInfo : function(component)
    {
        var action = component.get("c.getBPDetails");
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                component.set('v.businessPlanInfo', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    getBusinessReviewInfo : function(component){
    	 var action = component.get("c.getBRDetails");
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                component.set('v.businessReviewInfo', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);    
    },
    validate : function(component) 
    {
		var action = component.get("c.validate");
        action.setParams({AccId : component.get('v.recordId')});
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                component.set('v.prepopulateData', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
	},
    PrepopulateOppfromLead : function(component) 
    {
		var action = component.get("c.prepopulateOppFromLead");
        action.setParams({LeadId : component.get('v.recordId')});
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                component.set('v.prepopulateOppfromLead', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
	},
    getInitialRecordTypeId : function(component) 
    {
		var action = component.get("c.getInitialRecordTypeId");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                component.set('v.InitialRecordTypeId', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
	},
    getLoAUserPermissions : function(component) 
    {
		var action = component.get("c.getUserListedinLoAPermissionset");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                component.set('v.isUserAllowedforLoAPoA', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    getLeadConvertedStatus : function(component){
		var action = component.get("c.leadConvertionStatus");
        action.setParams({recordId : component.get('v.recordId')});
        action.setCallback(this, function(response){
            var state = response.getState();
            console.log(component.get('v.isLeadConverted'));
            if (state === "SUCCESS") 
            {              
                component.set('v.isLeadConverted', response.getReturnValue());
                console.log("isLeadConverted" + response.getReturnValue());
            }else{
                component.set('v.isLeadConverted', true);
                console.log("isLeadConverted: true");
            }
        });
        $A.enqueueAction(action);
	},
    validateLoAPoA : function(component) 
    {
		var action = component.get("c.validateLoAPoA");
        action.setParams({OppId : component.get('v.recordId')});
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                component.set('v.prepopulateDataLoAPoA', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
	},
    getLoARecordTypeId : function(component) 
    {
		var action = component.get("c.getLoARecordTypeId");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                component.set('v.LoARecordTypeId', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
	},
    getPoARecordTypeId : function(component) 
    {
		var action = component.get("c.getPoARecordTypeId");
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                component.set('v.PoARecordTypeId', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
	},
    getIsUserHasOppAccess : function(component) 
    {
		var action = component.get("c.getIsUserHasOppAccess");
        action.setParams({OppId : component.get('v.recordId')});
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                component.set('v.IsUserHasOppFullAccess', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
	},
    getMarketScopeInfo : function(component){
    	var action = component.get("c.getMSDetails");
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();            
            if (state === "SUCCESS") 
            {
                component.set('v.marketScopeInfo', response.getReturnValue());
            }
        });
        $A.enqueueAction(action); 	    
    },
    getBPPlanRecordType : function(component){
    	var action = component.get("c.getRecTypes");
         action.setParams({
            "objName": "Joint_Business_Plan__c"
        });
        action.setCallback(this, function(response){
            var state = response.getState();            
            if (state === "SUCCESS") 
            {
                component.set('v.businessPlanRecInfo', response.getReturnValue());
            }
        });
        $A.enqueueAction(action); 	      
    },
    getLeadRecordType : function(component){
        var action = component.get("c.getLeadRecType");
         action.setParams({
            "recordId": component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();            
            if (state === "SUCCESS") 
            {
                component.set('v.leadRecTypeCheck', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);         
    },
    leadButtonVisibility : function(component){
        var action = component.get("c.leadDetailButtonVisibility");
        action.setParams({
            "recordId" : component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                var retValue = response.getReturnValue();
                if(retValue === "CREATE ACCOUNT AND CONTACT"){
                    component.set('v.isVisible',true);
                }else if(retValue === "REQUEST ACCESS"){
                    component.set('v.isVisibleAccess',true);
                }else if(retValue === "NO BUTTON VISIBLE"){
                    component.set('v.isVisibleAccess',false);
                    component.set('v.isVisible',false);
                }else{
                    //do nothing;
                }
            }
        });
        $A.enqueueAction(action);
    },
    getLeadOwnedByUser : function(component)
    {
        var action = component.get("c.initiateLeadConvertProcess");
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                component.set('v.isLeadOwnedByUser', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    getLeadRecInfo : function(component)
    {
        var action = component.get("c.getLeadInfo");
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                component.set('v.leadRecTypeName', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    getvisitReportInfo : function(component)
    {
        var action = component.get("c.getvisitReportInfo");
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                component.set('v.visitReportInfo', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    getSiteInfo : function(component)
    {
        var action = component.get("c.getPathPrefix");
      
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                component.set('v.sitePrefix', response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    getAccountPlanInfo : function(component)
    {
        var action = component.get("c.getAccountPlanInfo");
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                component.set('v.accountPlanInfo', response.getReturnValue());
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