({
    // Initiate
    initiate : function(component, event, helper)
    {
        helper.getUserInfo(component);
        helper.checkObjectType(component, helper);
        helper.getUserQuotePermissions(component);
    },
    // Account
    newQuoteAccount : function(component)
    {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/new-quote?id=" + component.get('v.recordId') + '&recordType=Account',
            "isredirect" : true
        });
        urlEvent.fire();
    },    
	// Quotation Edit
    editQuote : function(component)
    {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/new-quote?quotationNumber=" + component.get('v.quotationInfo').APTS_Quotation_Number_Internal__c + '&recordType=Quotation',
            "isredirect" : true
        });
        urlEvent.fire();
    },
    // Opportunity
    addProducts : function(component)
    {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/add-product?addTo=" + component.get('v.recordId') + "&id=" + component.get('v.recordId') + "&retURL=" + component.get('v.recordId'),
            "isredirect" : true
        });
        urlEvent.fire();
    },
    addSalesProducts : function(component)
    {    
        if(component.get('v.budgetInfo.Segment_Level__c') == $A.get("$Label.c.STS_Budget_Segment_ProductLine")){
            var urlEvent = $A.get("e.force:navigateToURL");
             urlEvent.setParams({
                "url": "/add-sales-product?id=" + component.get('v.recordId'),
                "isredirect" : true
            });
            urlEvent.fire();
        }else{
            alert('Before adding product, Please change the Segment Level as "Product Line"'); 
        }
        
    },
    createMSPA : function(component)
    {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/create-mspa?id=" + component.get('v.recordId')+"&retURL="+ component.get('v.recordId'),
            "isredirect" : true
        });
        urlEvent.fire();
    },
    // Channel Partner Market Scope
    addChannelPartnerProducts : function(component)
    {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/add-cmc-product?addTo=" + component.get('v.recordId') + "&id=" + component.get('v.recordId') + "&retURL=" + component.get('v.recordId'),
            "isredirect" : true
        });
        urlEvent.fire();
    },
	// New Quotation from Opportunity
    newQuoteOpportunity : function(component)
    {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url": "/new-quote?id=" + component.get('v.opportunityInfo').AccountId + '&recordType=Opportunity&opportunityNumber=' + component.get('v.opportunityInfo').Opportunity_Number__c,
            "isredirect" : true
        });
        urlEvent.fire();
	}
})