/*************************************************************
@Name: APTS_ConfiguratorSectionSelection
@Author: Jay Parikh
@CreateDate: 03-03-2016
@Description: Class to display section selection from Object "Configurator Sections" during document generation.
@UsedBy: Page - APTS_ConfiguratorSectionSelection
*************************************************************
@ Last Modified By: Milan chovatiya
@Modified Date:  13/07/2016
@Description: changing sharing to without. as approver who has only read only permission should be able to execute class.
******************************************************************/
public without sharing class APTS_ConfiguratorSectionSelection {
    
     public Boolean selectAll {get; set;}
     public Apttus_Proposal__Proposal__c quoteProposalSO {get; set;}
     public ApexPages.StandardController standardController = null;
     // Parameters for value selection on page
     public List<wrapConfigSection> lstwrapConfig {get; set;}
     //variable for defect 6103
     public Boolean allTotalNetPricesUpdated {get; set;}
     //variable for CR-8127
     public String previewBtn = null;
     private static final String MISC_SECTION = 'Misc. Section';
     
     public APTS_ConfiguratorSectionSelection(ApexPages.StandardController controller) {
         
         standardController = controller;
         quoteProposalSO = (Apttus_Proposal__Proposal__c)standardController.getRecord();
         previewBtn = apexpages.currentpage().getparameters().get('previewBtn');
         doCheckTemplateTotals();
         showOkButton = true;
         
        
     }
     public void doCheckTemplateTotals() {
        System.debug('\n entry doCheckTemplateTotals lstwrapConfig ='+ lstwrapConfig);

         if(lstwrapConfig == null && quoteProposalSO.Id != null) {
             lstwrapConfig = new List<wrapConfigSection>();
             allTotalNetPricesUpdated = true;
             //added field APTS_Updating_Total_Net_Price__c in query + some logic with variable allTotalNetPricesUpdated to solve defect 6103
             //Added the filter "APTS_Section_Name__c != 'GTV SECTION" in Query to filter out the gtv section from template for the ALM defect 14664 by Ajithkumar on 21DEC17
             for(APTS_Configurator_Section__c configSel : [select Id, Name, APTS_Is_Selected__c, APTS_Quote__c, APTS_Reference_Number__c, APTS_Section_Name__c, APTS_Total_Net_Price__c, APTS_Updating_Total_Net_Price__c, APTS_Section_Total__c,APTS_Net_Section_Total__c  
                                                           from APTS_Configurator_Section__c where APTS_Quote__c =: quoteProposalSO.Id AND APTS_Section_Name__c != 'GTV SECTION' ORDER BY APTS_Section_Name__c ASC]) {
              // As each APTS_Configurator_Section__c is processed we create a new wrapConfigSection object and add it to the wrapConfigSection.
                if(configSel.APTS_Total_Net_Price__c == null) {
                    configSel.APTS_Total_Net_Price__c = 0;
                }
                if(configSel.APTS_Updating_Total_Net_Price__c) {
                    allTotalNetPricesUpdated = false;
                }
                 lstwrapConfig.add(new wrapConfigSection(configSel));
             }
             //allTotalNetPricesUpdated set to false if any of the checkbox is checked
             for(wrapConfigSection wrapConfig: lstwrapConfig){
                if(wrapConfig.bSelected && !allTotalNetPricesUpdated){
                    break;                   
                }
                allTotalNetPricesUpdated = true;
                showOkButton = true;
             }
             System.debug('\n all-Total-NetPrices-Updated'+allTotalNetPricesUpdated);
             if (!allTotalNetPricesUpdated){
                ApexPages.Message warningMessage = new ApexPages.Message(ApexPages.Severity.Warning, Label.Sections_Total_Net_Prices_not_updated_yet);
                ApexPages.addMessage(warningMessage);
             }
         }
     }
     //created method for CR-8127 starts here
     public PageReference dofamiliaCheck() {
         PageReference pageRef = null;
         familiasectionUpdated = true;

             List<APTS_Cart_Line_Group__c> cartlinegrplst = new List<APTS_Cart_Line_Group__c>([Select APTS_Group_Name__c,APTS_Sub_Total_EUR__c from APTS_Cart_Line_Group__c where APTS_Quote__c =: quoteProposalSO.Id ORDER BY APTS_Group_Name__c ASC]);
             If(!cartlinegrplst.IsEmpty()){
                 for(wrapConfigSection wrapConfig: lstwrapConfig){
                 if(wrapConfig.bSelected){
                     familiasectionUpdated = true;                   
                     break;
                 }
                 familiasectionUpdated = false;
                 }
             }
             
             if (!familiasectionUpdated){
         
                ApexPages.Message warningMessage = new ApexPages.Message(ApexPages.Severity.Warning, Label.Familia_Template_values_are_not_updated_yet);
                ApexPages.addMessage(warningMessage);
             }else{
                pageRef = doSectionSave();
             }
             return pageRef;
     }
     //created method for CR-8127 starts here
     public void dofamiliaTemplateCheck() {
        Boolean processFamiliaTemplateLogic = false;
        showOkButton = true;
        System.debug('\n entry dofamiliaTemplateCheck');
        for(APTS_Configurator_Section__c configSel : [select Id, APTS_Updating_Total_Net_Price__c  
                                                           from APTS_Configurator_Section__c where APTS_Quote__c =: quoteProposalSO.Id]){
            if(!lstwrapConfig.isEmpty()) {
                for(wrapConfigSection wc: lstwrapConfig){
                    //if selected and total is not calculated then show the message
                    if(wc.configSec.id == configSel.Id && wc.bSelected && configSel.APTS_Updating_Total_Net_Price__c) {
                       ApexPages.Message warningMessage = new ApexPages.Message(ApexPages.Severity.Warning, Label.Sections_Total_Net_Prices_not_updated_yet);
                        ApexPages.addMessage(warningMessage); 
                        allTotalNetPricesUpdated = false;
                        processFamiliaTemplateLogic = false;
                        showOkButton = false;
                    }
                    else {
                    processFamiliaTemplateLogic = true;
                    allTotalNetPricesUpdated = true;
                    }
                }
            }
        }

        //if all the checkboxes are not selected, check for familia template data
        if (!processFamiliaTemplateLogic){
            List<APTS_Cart_Line_Group__c> cartlinegrplst = new List<APTS_Cart_Line_Group__c>([Select APTS_Group_Name__c,APTS_Sub_Total_EUR__c from APTS_Cart_Line_Group__c where APTS_Quote__c =: quoteProposalSO.Id ORDER BY APTS_Group_Name__c ASC]);
            System.debug('\n cartlinegrplst='+cartlinegrplst);
            If(!cartlinegrplst.IsEmpty()){
                showOkButton = true;
            }        
            else{
                showOkButton = false;
                ApexPages.Message warningMessage = new ApexPages.Message(ApexPages.Severity.Warning, Label.Familia_Template_values_are_not_updated_yet);
                ApexPages.addMessage(warningMessage);
            }
        }
     }
         //CR-8127 changes ends here
     public PageReference doSectionCheck() {         
         PageReference pageRef = null;
         //(lstwrapConfig.size() == 1 && lstwrapConfig[0].configSec.APTS_Section_Name__c == MISC_SECTION) = added this line to skip section page
         //if only Misc. Section is there for spain
        if(quoteProposalSO.Id != null && (lstwrapConfig.size() == 0 || (lstwrapConfig.size() == 1 && lstwrapConfig[0].configSec.APTS_Section_Name__c == MISC_SECTION)) && quoteProposalSO.APTS_Country__c != APTS_Constants.COUNTRY_ITALY ) { // Defect 15132
            //if(pageRef == null && quoteProposalSO.Id != null && lstwrapConfig.size() == 0) {
             quoteProposalSO.APTS_Section_Total_Amount__c = 0;
             quoteProposalSO.APTS_Is_Section_Included__c = false;
             
             pageRef = new PageReference('/apex/Apttus_Proposal__ProposalGenerate');
             pageRef.getParameters().put('id',quoteProposalSO.Id);
             if(previewBtn == 'YES') {
             pageRef.getParameters().put('action',PREVIEW);
             }
             pageRef.setRedirect(true);
             
             update quoteProposalSO;
             
         }
         return pageRef;
     }
     
     public void doSave() {
         boolean bCheckStatus = false;
         double dSectionTotal = 0.0;
         double dNetSectionTotal = 0.0;
         
         if(!lstwrapConfig.isEmpty()) {
             
             lstupdateConfigSec = new List<APTS_Configurator_Section__c>();
             
             for(wrapConfigSection wc :  lstwrapConfig) {
                 wc.configSec.APTS_Is_Selected__c = wc.bSelected;
                 lstupdateConfigSec.add(wc.configSec);
                 if(wc.bSelected == true) {
                     bCheckStatus = true;
                     if(wc.configSec.APTS_Total_Net_Price__c != Null) {
                        dSectionTotal += wc.configSec.APTS_Total_Net_Price__c;
                    }
                    if(wc.configSec.APTS_Net_Section_Total__c != Null) {
                        dNetSectionTotal += wc.configSec.APTS_Net_Section_Total__c;
                   }
                 }
             }             
             try {                 
                 update lstupdateConfigSec;
                 quoteProposalSO.APTS_Is_Section_Included__c = bCheckStatus;
                 quoteProposalSO.APTS_Section_Total_Amount__c = dSectionTotal;
                 quoteProposalSO.APTS_Net_Section_Total__c = dNetSectionTotal;
                 
                 system.debug('\n\n<<quoteProposalSO.APTS_Is_Section_Included__c>>'+quoteProposalSO.APTS_Is_Section_Included__c);
                 system.debug('\n\n<<quoteProposalSO.APTS_Section_Total_Amount__c>>'+quoteProposalSO.APTS_Section_Total_Amount__c);
                 system.debug('\n\n<<quoteProposalSO.APTS_Net_Section_Total__c>>'+quoteProposalSO.APTS_Net_Section_Total__c);
                 update new List<Apttus_Proposal__Proposal__c>{quoteProposalSO};
             }
             catch(Exception ex) {
                 ApexPages.addmessage(new ApexPages.message(ApexPages.severity.ERROR, ex.getMessage()));
             }
         }
     }
     
     public PageReference doSectionSave() {
         doSave();
         PageReference pageRef = null;
         if(pageRef == null) {
             pageRef = new PageReference('/apex/Apttus_Proposal__ProposalGenerate');
             pageRef.getParameters().put('id',quoteProposalSO.Id);
             if(previewBtn == 'YES') {
                 pageRef.getParameters().put('action','PREVIEW');
             }
             pageRef.setRedirect(true);             
         }
         return pageRef;
     }
     
     /***********************Start****************************/
     /**
     *This method is used to update the 'Attachment_List__c' fields on 'Note__c' object and
     *'Notes__c,Explanations__c,Clarifications__c,Exclusions__c,Product_ID__c & Net_Price__c' 
     *fields on Quotation object for EP 4.1 CPQ.
     *To be used for generating Quotation Templates.
     *Works only for 'Italy'.
     @author  Nakul Singh
     @created 2017-01-27
     @version 1.0
     **/ 
     public PageReference saveRecord(){
        List<APTS_Configurator_Section__c> sectionList = new List<APTS_Configurator_Section__c>([SELECT id,APTS_Total_Net_Price__c FROM APTS_Configurator_Section__c WHERE APTS_Quote__c =: quoteProposalSO.id]);
        System.debug('sectionList+++'+sectionList.size());
        Decimal sum = 0;
        for(APTS_Configurator_Section__c section : sectionList){
            if(section.APTS_Total_Net_Price__c!=null) {
                sum = sum+section.APTS_Total_Net_Price__c;
            }
        }
        
        quoteProposalSO.Section_Total_Net_Price_IT__c = sum;
        
        database.update(quoteProposalSO, false);
        if(quoteProposalSO.Id != null){
            updateTitleNote(quoteProposalSO.id);
        }
        PageReference pageRef = null;
         if(pageRef == null) {
             pageRef = new PageReference('/apex/Apttus_Proposal__ProposalGenerate');
             pageRef.getParameters().put('id',quoteProposalSO.Id);
             if(previewBtn == 'YES') {
                 pageRef.getParameters().put('action','PREVIEW');
             }
             pageRef.setRedirect(true);             
         }
         return pageRef;
     }
     
     public void updateTitleNote(String quoteID){
        List<Attachment> attachlist = new List<Attachment>([SELECT id,ParentId,Name FROM Attachment WHERE ParentId =: quoteID]);
        String quoteName;
        for(Apttus_Proposal__Proposal__c quote : [SELECT id, Apttus_Proposal__Proposal_Name__c FROM Apttus_Proposal__Proposal__c WHERE
                                                    id =: quoteID]){
            quoteName = quote.Apttus_Proposal__Proposal_Name__c;
        }
        List<Note__c> noteList = new List<Note__c>([SELECT Id,Quote_Proposal__c FROM Note__c WHERE Quote_Proposal__c =: quoteID]);

        Map<Id, Note__c> noteMap = new Map<Id, Note__c>();
        for(Note__c note : noteList){
            notemap.put(note.Quote_Proposal__c, note);
        }
        
        String attachmentsName = '';
        for(Attachment attach : attachlist){
            String [] splitName = attach.Name.split('_');
            system.debug('splitName::'+splitName);
            if(!splitName[0].equalsignorecase(quoteName)){
                attachmentsName +=  attach.Name + ', ';
            }
        }
        attachmentsName = attachmentsName.replaceAll(', $', '');
        system.debug('attachmentsName::'+attachmentsName);
        
        Set<Note__c> noteUpdateSet = new Set<Note__c>();
        for(Note__c note : noteList){
            Note__c tempNote = new Note__c();
            Id existingNote;
            if(!noteMap.isEmpty()){
                existingNote = noteMap.get(note.Quote_Proposal__c).Id;
            }
            if(existingNote != null){
                tempNote.Id = existingNote;
            }
            tempNote.Attachment_List__c = attachmentsName;
            noteUpdateSet.add(tempNote);
        }
        system.debug('noteUpdateSet::'+noteUpdateSet);
        if(!noteUpdateSet.isEmpty()){
            List<Note__c> noteUpdateList = new List<note__c>();
            noteUpdateList.addAll(noteUpdateSet);
            Database.upsert(noteUpdateList, false);
        }
     }
     /************************End*****************************/
     
     // Wrapper Class for Selection Selection
     public class wrapConfigSection {
         public APTS_Configurator_Section__c configSec {get; set;}
         public Boolean bSelected {get; set;}
         
         /* This is a constructor method. When we create a new wrapConfigSection object we pass a APTS_Configurator_Section__c 
         that is set to the configSec property. We also set the selected value to False.*/
         public wrapConfigSection(APTS_Configurator_Section__c configSec) {
             configSec.APTS_Total_Net_Price__c = configSec.APTS_Total_Net_Price__c.setScale(2);
             this.configSec = configSec;
             bSelected = true;
         }
     }
}