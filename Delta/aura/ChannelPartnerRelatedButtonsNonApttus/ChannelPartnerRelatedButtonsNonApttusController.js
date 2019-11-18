({
    // Initiate
    initiate : function(component, event, helper)
    {
        helper.getUserInfo(component);
        helper.checkObjectType(component, helper);
        helper.getInitialRecordTypeId(component);
        helper.getLoARecordTypeId(component);
        helper.getPoARecordTypeId(component);
        helper.getLoAUserPermissions(component);
    },
    //Channel Partner Business Plan - Create New Sales Targets and Results

    addProducts : function(component)
    {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/add-product?addTo=" + component.get('v.recordId') + "&id=" + component.get('v.recordId') + "&retURL=" + component.get('v.recordId'),
            "isredirect" : true
        });
        urlEvent.fire();
    },

    addSalesTargets : function(component)
    {
     	var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/sales-target?id=" + component.get('v.recordId')+"&retURL="+ component.get('v.recordId'),
            "isredirect" : true
        });
        urlEvent.fire();
    },
    //Account Plan
    addAccountPlanMember : function(component)
    {
        console.log(component.get('v.recordId'));
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/add-account-plan-team-member?id=" + component.get("v.recordId"),
            "isredirect" : true
        });
        urlEvent.fire();
    },
    newSupportingOpportunity : function(component)
    {
        console.log("hello"+component.get('v.recordId'));
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/supporting-opportunity?id=" + component.get("v.recordId"),
            "isredirect" : true
        });
        urlEvent.fire();
    },
    // New End User Project
    newEndUserProject : function(component)
    {
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "End_User_Project__c",
            "defaultFieldValues": {
                'Account_End_User__c' : component.get('v.recordId')
            }
        });
        createRecordEvent.fire();
    }, 
    // New Visit Report from Account 
    newVisitReportfromAccount : function(component)
    {
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "Visit_Report__c",
            "defaultFieldValues": {
                'Account__c' : component.get('v.recordId')
            }
        });
        createRecordEvent.fire();
    }, 
    // New Visit Report from Account Plan
    newVisitReportfromAccountPlan : function(component)
    {
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "Visit_Report__c",
            "defaultFieldValues": {
                'Account_Plan__c' : component.get('v.recordId'),
                'Account__c' : component.get('v.accountPlanInfo').Account__c
            }
        });
        createRecordEvent.fire();
    }, 
    // New Visit Report from Opportunity
    newVisitReportfromOpportunity : function(component)
    {
        var accountVal = component.get('v.opportunityInfo').AccountId;
        if(component.get('v.userInfo.Profile.Name') == $A.get("$Label.c.SYS_ABBExtChannelPartnerCommunityUser")){
        accountVal = component.get('v.opportunityInfo').Account_End_User__c;	
        }        
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "Visit_Report__c",
            "defaultFieldValues": {
                'Opportunity__c' : component.get('v.recordId'),
                'Account__c' : accountVal,
            }
        });
        createRecordEvent.fire();
    },
    // New Visit Report from Lead
    newVisitReportfromLead : function(component)
    {
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "Visit_Report__c",
            "defaultFieldValues": {
                'Lead__c' : component.get('v.recordId')
            }
        });
        createRecordEvent.fire();
    },
    // New Visit Report from Business Plan
    newVisitReportfromBusinessPlan : function(component)
    {
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "Visit_Report__c",
            "defaultFieldValues": {
                'Joint_Business_Plan__c' : component.get('v.recordId'),
                'Account__c' : component.get('v.businessPlanInfo').Account__c
            }
        });
        createRecordEvent.fire();
    },
    // New Visit Report from Business Review
    newVisitReportfromBusinessReview : function(component)
    {
        var createRecordEvent = $A.get("e.force:createRecord");
        createRecordEvent.setParams({
            "entityApiName": "Visit_Report__c",
            "defaultFieldValues": {
                'Channel_Review__c' : component.get('v.recordId'),
                'Account__c' : component.get('v.businessReviewInfo').Account__c
            }
        });
        createRecordEvent.fire();
    },
    // Lead Convertion
    leadConvertion : function(component)
    {
       var action = component.get("c.leadConvertionValidation");
        action.setParams({
            "recordId" : component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                console.log('***'+response.getReturnValue());
                var retValue = response.getReturnValue();
                if(retValue === "No Error"){
                    var urlEvent = $A.get("e.force:navigateToURL");
                    urlEvent.setParams({
                        "url": "/lead-convertion?id=" + component.get('v.recordId') +"&retURL=" + component.get('v.recordId'),
                        "isredirect" : true
                    });
                    urlEvent.fire();
                }else{
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                            title: 'Error',
                            type: 'error',
                            message: retValue
                    });
                    toastEvent.fire();
                }
            }
        });
        $A.enqueueAction(action);
    },
    createNewAccountContact : function(component,event,helper)
    {
        helper.showSpinner(component);
        var action = component.get("c.createNewAccountAndContact");
        action.setParams({
            "recordId" : component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            
            var jsonResult = JSON.parse(response.getReturnValue());
            
            if(state === "SUCCESS"){
                helper.hideSpinner(component);
                var toast1Event = $A.get("e.force:showToast");
                var toast2Event = $A.get("e.force:showToast");
                var toast3Event = $A.get("e.force:showToast");
                if(jsonResult.status)
                {
                    component.set('v.isVisible',false);
                    toast1Event.setParams({
                        title: 'Success',
                        type: 'success',
                        message: jsonResult.message
                	});
                    toast1Event.fire();
                }
                else
                {
                    toast1Event.setParams({
                        title: 'Account problems',
                        type: 'warning',
                        message: jsonResult.account
                    });
                    toast2Event.setParams({
                        title: 'Contact problems',
                        type: 'warning',
                        message: jsonResult.contact
                    });
                    toast3Event.setParams({
                        title: 'Lead problems',
                        type: 'warning',
                        message: jsonResult.lead
                    });
                    toast1Event.fire();
                    toast2Event.fire();
                    toast3Event.fire();
                }
			}
        });
        $A.enqueueAction(action);
    },
    requestAccessToAccount : function(component,event,helper)
    {
        console.log("hello");
        helper.showSpinner(component);
        var action = component.get("c.requestAccountTeamAccess");
        action.setParams({
            "recordId" : component.get("v.recordId")
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if(state === "SUCCESS"){
                helper.hideSpinner(component);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                        title: 'Information',
                        type: 'info',
                        message: 'Access to Account is successful'
                });
                toastEvent.fire();
                component.set('v.isVisibleAccess',false);
				$A.get('e.force:refreshView').fire();
            }
        });
        $A.enqueueAction(action);
    },
    addContacts : function(component){
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/add-contact-from-account?id=" + component.get('v.recordId') ,
            "isredirect" : true
        });
        urlEvent.fire();
    },
    massEditSales : function(component){
    	var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/mass-edit-sales-target?id=" + component.get('v.recordId') ,
            "isredirect" : true
        });
        urlEvent.fire();    
    },
    createOpportunity : function(component, event, helper) {
        var createOpportunityEvent = $A.get("e.force:createRecord");
        createOpportunityEvent.setParams({
            "entityApiName" : "Opportunity",
            "recordTypeId" : component.get('v.InitialRecordTypeId'),
            "defaultFieldValues": {
                "AccountId" : component.get('v.prepopulateData.AccountCustomer'),
                "StageName" : "Prospecting",
                "Account_End_User__c" : component.get('v.prepopulateData.AccountEndUser'),
                "ABB_Industry_Usage_Level1__c" : component.get('v.prepopulateData.IndustryUsageLevel1'),
            	"ABB_Industry_Usage_Level2__c" : component.get('v.prepopulateData.IndustryUsageLevel2'),
                "Channel_Class_Level1__c" : component.get('v.prepopulateData.ChannelClassLevel1'),
                "Channel_Class_Level2__c" : component.get('v.prepopulateData.ChannelClassLevel2')
            }
        });
        createOpportunityEvent.fire();
    },
    createOppTeam : function(component, event, helper) {
        var createOppTeamEvent = $A.get("e.force:createRecord");
        createOppTeamEvent.setParams({
            "entityApiName" : "OpportunityTeamMember",
            "defaultFieldValues": {
                "OpportunityId" : component.get('v.opportunityInfo').Id
            }
        });
        createOppTeamEvent.fire();
    },
    createOppfromLead : function(component, event, helper) {
        //var existingOppId = component.get('v.prepopulateOppfromLead.RelatedProspectOppId');
        var createOppfromLeadEvent = $A.get("e.force:createRecord");
        createOppfromLeadEvent.setParams({
            "entityApiName" : "Opportunity",
            "recordTypeId" : component.get('v.InitialRecordTypeId'),
            "defaultFieldValues": {
                "AccountId" : component.get('v.prepopulateOppfromLead.AccountCustomer'),
                "Account_End_User__c" : component.get('v.prepopulateOppfromLead.AccountEndUser'),
                "Opportunity_Value__c" : component.get('v.prepopulateOppfromLead.OppValue'),
                "CloseDate" : component.get('v.prepopulateOppfromLead.EAD'),
                "Opportunity_Secondary_Name__c" : component.get('v.prepopulateOppfromLead.ProspectName'),
                "ABB_Industry_Usage_Level1__c" : component.get('v.prepopulateOppfromLead.IndustryUsageLevel1'),
            	"ABB_Industry_Usage_Level2__c" : component.get('v.prepopulateOppfromLead.IndustryUsageLevel2'),
                "ABB_Industry_Usage_Level3__c" : component.get('v.prepopulateOppfromLead.IndustryUsageLevel3'),
                "Channel_Class_Level1__c" : component.get('v.prepopulateOppfromLead.ChannelClassLevel1'),
                "Channel_Class_Level2__c" : component.get('v.prepopulateOppfromLead.ChannelClassLevel2'),
                "Alternative_Opportunity_To__c" : component.get('v.prepopulateOppfromLead.RelatedProspectOppId'),
                "StageName": "Prospecting"
            }
        });
        createOppfromLeadEvent.fire();
    },
    createLoA : function(component, event, helper) {
        var createProjectAuthorizationEvent = $A.get("e.force:createRecord");
        createProjectAuthorizationEvent.setParams({
            "entityApiName" : "Project_Authorization__c",
            "recordTypeId" : component.get('v.LoARecordTypeId'),
            "defaultFieldValues": {
                "Opportunity_Name_EN__c" : component.get('v.recordId'),
                "Name" : component.get('v.prepopulateDataLoAPoA.Name'),
                "Design_Institute__c" : component.get('v.prepopulateDataLoAPoA.DesignInstitute'),
                "Offering_Primary_Product_Group__c" : component.get('v.prepopulateDataLoAPoA.OfferingPrimaryPG'),
                "Account_End_User__c" : component.get('v.prepopulateDataLoAPoA.AccountEndUser'),
                "Opportunity_Name_CN__c" : component.get('v.prepopulateDataLoAPoA.OpportunityNameCN'),
                "Application__c" : component.get('v.prepopulateDataLoAPoA.Application')
            }
        });
        createProjectAuthorizationEvent.fire();
    },
    createPoA: function(component, event, helper) {
        var createProjectAuthorizationEvent = $A.get("e.force:createRecord");
        createProjectAuthorizationEvent.setParams({
            "entityApiName" : "Project_Authorization__c",
            "recordTypeId" : component.get('v.PoARecordTypeId'),
            "defaultFieldValues": {
                "Opportunity_Name_EN__c" : component.get('v.recordId'),
                "Name" : component.get('v.prepopulateDataLoAPoA.Name'),
                "Design_Institute__c" : component.get('v.prepopulateDataLoAPoA.DesignInstitute'),
                "Offering_Primary_Product_Group__c" : component.get('v.prepopulateDataLoAPoA.OfferingPrimaryPG'),
                "Account_End_User__c" : component.get('v.prepopulateDataLoAPoA.AccountEndUser'),
                "Opportunity_Name_CN__c" : component.get('v.prepopulateDataLoAPoA.OpportunityNameCN'),
                "Application__c" : component.get('v.prepopulateDataLoAPoA.Application')
            }
        });
        createProjectAuthorizationEvent.fire();
    },
    addFromFavorites : function (component, event, helper) {
    	var url = "/add-from-favorites?recID=" + component.get("v.recordId") ;
        var urlEvent = $A.get("e.force:navigateToURL");
    	urlEvent.setParams({
      	"url": url
    	});
    urlEvent.fire();
	},
    oppClone : function (component, event, helper) {
    	var url = "/sts-deep-clone?oppRecordID=" + component.get("v.recordId");
        var urlEvent = $A.get("e.force:navigateToURL");
    	urlEvent.setParams({
      	"url": url
    	});
    urlEvent.fire();
	},
    
    /***Replica of Transfet to Next year functionality in classic view
    Created by Dominic(16Feb2018)
    Work Id - 630***/
    transferToNextYear : function(component, event, helper){
        var btnClicked = event.getSource();
        btnClicked.set("v.disabled",true);        
        var action = component.get("c.transferToNextYearBP");
        
        action.setParams({
            "chPartnrBusPlanId": component.get("v.recordId"),
            "dupRecrdId" : component.get("v.businessPlanInfo.Business_Plan_Transferred_To__c"),
            "accountId" : component.get("v.businessPlanInfo.Account__c"),
            "status" : component.get("v.businessPlanInfo.Status__c") 
        });
         action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var result = response.getReturnValue();
                if (result.toString().includes("Success")) { 
                	var arr = result.toString().split(":"); 
					alert('Business Plan is cloned successfully. ' + arr[1]); 
					var arr = result.toString().split(":"); 
                	if(typeof(arr[2]) !== "undefined" && arr[2] !== null){
						var url = '/detail/'+ arr[2]; 
                		var urlEvent = $A.get("e.force:navigateToURL");
    					urlEvent.setParams({
      						"url": url,
                    		"isredirect" : true
                		});
    					urlEvent.fire();
                	}
                }else{
                    alert(result); 
                }
            }else{
                
                alert("Some Technical Problem... Kindly try after sometime");
            }
             btnClicked.set("v.disabled",false);
        });
        $A.enqueueAction(action);
        
    },
    /***Since in classic view Edit button has been overridden by VF page we have replicated it
    Created by Dominic(21Feb2018)
    Work Id - 737***/
    editBusinessReviewRecord : function(component, event, helper){        
        var editBusReview = $A.get("e.force:editRecord");	
        editBusReview.setParams({
           "recordId": component.get("v.recordId")
        });
        editBusReview.fire();    
    },
    /***In classic view New Channel Business Plan has a seperate button calls VF page
    Created by Dominic(27Feb2018)
    Work Id - 772***/
    newBPPlan : function(component, event, helper){
        var recType;
        var mapValues = component.get("v.businessPlanRecInfo");
        if(component.get('v.marketScopeInfo.Primary_Channel_Class__c') == $A.get("$Label.c.CMS_Primary_Channel_Class_Value")){
        	recType =  mapValues[$A.get("$Label.c.JBP_RecordType_Name1")];   
        }else{
            recType =  mapValues[$A.get("$Label.c.JBP_RecordType_Name4")];   
        }
        var createBPPlan = $A.get("e.force:createRecord");        
        createBPPlan.setParams({
            "entityApiName" : "Joint_Business_Plan__c",
            "recordTypeId" : recType,
            "defaultFieldValues": {
            	"Account__c" : component.get("v.marketScopeInfo.Account__c"),
                "Channel_Market_Coverage__c" : component.get("v.recordId")
            } 
        });
        createBPPlan.fire();    
    },
    newContactRoles : function(component, event, helper){
    	
        var action = component.get("c.createJBPMarketCoverageRec");
        
        action.setParams({
            "recordId": component.get("v.recordId")
        });

        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") 
            {
                var result = response.getReturnValue();
                var url = '/detail/'+ component.get("v.recordId"); 
                var urlEvent = $A.get("e.force:navigateToURL");
                urlEvent.setParams({
                    "url": url,
                    "isredirect" : true
                });
                urlEvent.fire();
                
            }else{
                
                alert("Some Technical Problem... Kindly try after sometime");
            }
        });
        $A.enqueueAction(action);

    },
    manageOpps : function(component,event,helper)
    {
        console.log("hello"+component.get('v.recordId'));
        var accountVal = component.get("v.visitReportInfo.Account__c");
        var baseUrl = component.get('v.sitePrefix');
        window.open(baseUrl+'/apex/GenericRecordAssociationPage?parentID='+component.get("v.recordId")+'&csObject=CommOpportunities&q1='+accountVal, '_blank','height=600,width=1100,resizable=yes,scrollbars=yes,toolbar=no,menubar=no');       
    	
        //var parentRecId = component.get("v.recordId");
        //console.log(baseUrl+'/apex/GenericRecordAssociationPage?parentID');
    	//var urlEvent = $A.get("e.force:navigateToURL");
    	//urlEvent.setParams({
      	//	"url": baseUrl+'/apex/GenericRecordAssociationPage?parentID='+parentRecId+'&csObject=Opportunities&q1='+accountVal
    	//});
    	//urlEvent.fire();

    },
    manageLeads : function(component,event,helper)
    {
        console.log("hello"+component.get('v.recordId'));
        var accountVal = component.get("v.visitReportInfo.Account__c");
        var baseUrl = component.get('v.sitePrefix');
        window.open(baseUrl+'/apex/GenericRecordAssociationPage?parentID='+component.get("v.recordId")+'&csObject=Lead&q1='+accountVal, '_blank','height=600,width=1100,resizable=yes,scrollbars=yes,toolbar=no,menubar=no');       
        //var parentRecId = component.get("v.recordId");
        //console.log(baseUrl+'/apex/GenericRecordAssociationPage?parentID');
    	//var urlEvent = $A.get("e.force:navigateToURL");
    	//urlEvent.setParams({
      	//	"url": baseUrl+'/apex/GenericRecordAssociationPage?parentID='+parentRecId+'&csObject=Lead&q1='+accountVal
    	//});
    	//urlEvent.fire();
    },
    manageAccPlans : function(component,event,helper)
    {
        console.log("hello"+component.get('v.recordId'));
        var accountVal = component.get("v.visitReportInfo.Account__c");
        var baseUrl = component.get('v.sitePrefix');
        window.open(baseUrl+'/apex/GenericRecordAssociationPage?parentID='+component.get("v.recordId")+'&csObject=Account_Plan&q1='+accountVal, '_blank','height=600,width=1100,resizable=yes,scrollbars=yes,toolbar=no,menubar=no');       
        //var parentRecId = component.get("v.recordId");
        //console.log(baseUrl+'/apex/GenericRecordAssociationPage?parentID');
    	//var urlEvent = $A.get("e.force:navigateToURL");
    	//urlEvent.setParams({
      	//	"url": baseUrl+'/apex/GenericRecordAssociationPage?parentID='+parentRecId+'&csObject=Account_Plan&q1='+accountVal
    	//});
    	//urlEvent.fire();
    },
    manageVRTeam : function(component,event,helper)
    {
        console.log("hello"+component.get('v.recordId'));
        var accountVal = component.get("v.visitReportInfo.Account__c");
        var baseUrl = component.get('v.sitePrefix');
        window.open(baseUrl+'/apex/GenericRecordAssociationPage?parentID='+component.get("v.recordId")+'&csObject=Visit_Report_Team_Member&q1='+accountVal, '_blank','height=600,width=1100,resizable=yes,scrollbars=yes,toolbar=no,menubar=no');       
        //var parentRecId = component.get("v.recordId");
        //console.log(baseUrl+'/apex/GenericRecordAssociationPage?parentID');
    	//var urlEvent = $A.get("e.force:navigateToURL");
    	//urlEvent.setParams({
      	//	"url": baseUrl+'/apex/GenericRecordAssociationPage?parentID='+parentRecId+'&csObject=Visit_Report_Team_Member&q1='+accountVal
    	//});
    	//urlEvent.fire();
    },
    manageAttendee : function(component,event,helper)
    {
        console.log("hello"+component.get('v.recordId'));
        var accountVal = component.get("v.visitReportInfo.Account__c");
        var baseUrl = component.get('v.sitePrefix');
        window.open(baseUrl+'/apex/GenericRecordAssociationPage?parentID='+component.get("v.recordId")+'&csObject=Visit_Attendee&q1='+accountVal, '_blank','height=600,width=1100,resizable=yes,scrollbars=yes,toolbar=no,menubar=no');       
        //var parentRecId = component.get("v.recordId");
        //console.log(baseUrl+'/apex/GenericRecordAssociationPage?parentID');
    	//var urlEvent = $A.get("e.force:navigateToURL");
    	//urlEvent.setParams({
      	//	"url": baseUrl+'/apex/GenericRecordAssociationPage?parentID='+parentRecId+'&csObject=Visit_Attendee&q1='+accountVal
    	//});
    	//urlEvent.fire();
    },
    addLeadProducts : function (component, event, helper) {
    	var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/leadproducts?id=" + component.get('v.recordId')+"&retURL="+ component.get('v.recordId'),
            "isredirect" : true
        });
        urlEvent.fire();
	}
    
})